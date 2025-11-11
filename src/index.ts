#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to course materials
const COURSE_MATERIALS_PATH = path.join(__dirname, "..", "course-materials");

interface WeekMaterials {
  lectures: string[];
  tutorials: string[];
  tutorialAnswers: string[];
}

interface PastPaper {
  year: string;
  files: string[];
}

interface CourseOverview {
  lectures: string[];
  tutorials: string[];
  tutorialAnswers: string[];
  pastPapers: string[];
  additionalResources: string[];
}

// Helper function to read directory contents
async function readDir(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() || entry.isFile())
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    return [];
  }
}

// Helper function to extract text using PyMuPDF (fast!)
async function extractTextWithOCR(filePath: string, maxPages?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, "..", ".venv", "bin", "python");
    const scriptPath = path.join(__dirname, "..", "scripts", "extract_text.py");
    
    const args = [scriptPath, filePath];
    if (maxPages) {
      args.push(maxPages.toString());
    }
    
    const pythonProcess = spawn(pythonPath, args);
    
    let stdout = "";
    let stderr = "";
    
    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          if (result.success) {
            resolve(result.content);
          } else {
            reject(new Error(result.error || "Text extraction failed"));
          }
        } catch (error) {
          reject(new Error(`Failed to parse extraction output: ${error}`));
        }
      } else {
        reject(new Error(`Extraction process exited with code ${code}: ${stderr}`));
      }
    });
    
    pythonProcess.on("error", (error) => {
      reject(new Error(`Failed to start extraction process: ${error.message}`));
    });
  });
}

// Helper function to read file content (with OCR support for PDFs)
async function readFileContent(filePath: string): Promise<string> {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // Use OCR for PDF and DOCX files
    if (ext === ".pdf" || ext === ".docx") {
      try {
        const ocrContent = await extractTextWithOCR(filePath);
        return ocrContent;
      } catch (ocrError) {
        // Fall back to raw reading if OCR fails
        console.error(`OCR failed for ${filePath}, falling back to raw read:`, ocrError);
        return await fs.readFile(filePath, "utf-8");
      }
    }
    
    // For text files, read directly
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

// Helper function to get all files in a directory recursively
async function getAllFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist yet
  }
  return files;
}

// Get course overview
async function getCourseOverview(): Promise<CourseOverview> {
  const lecturesPath = path.join(COURSE_MATERIALS_PATH, "lectures");
  const tutorialsPath = path.join(COURSE_MATERIALS_PATH, "tutorials");
  const tutorialAnswersPath = path.join(COURSE_MATERIALS_PATH, "tutorial-answers");
  const pastPapersPath = path.join(COURSE_MATERIALS_PATH, "past-papers");
  const additionalResourcesPath = path.join(COURSE_MATERIALS_PATH, "additional-resources");

  const [lectures, tutorials, tutorialAnswers, pastPapers, additionalResources] = await Promise.all([
    readDir(lecturesPath),
    readDir(tutorialsPath),
    readDir(tutorialAnswersPath),
    readDir(pastPapersPath),
    readDir(additionalResourcesPath),
  ]);

  return {
    lectures,
    tutorials,
    tutorialAnswers,
    pastPapers,
    additionalResources,
  };
}

// Get materials for a specific week
async function getWeekMaterials(week: string): Promise<WeekMaterials> {
  const lecturesPath = path.join(COURSE_MATERIALS_PATH, "lectures", week);
  const tutorialsPath = path.join(COURSE_MATERIALS_PATH, "tutorials", week);
  const tutorialAnswersPath = path.join(COURSE_MATERIALS_PATH, "tutorial-answers", week);

  const [lectures, tutorials, tutorialAnswers] = await Promise.all([
    readDir(lecturesPath),
    readDir(tutorialsPath),
    readDir(tutorialAnswersPath),
  ]);

  return {
    lectures,
    tutorials,
    tutorialAnswers,
  };
}

// Get past papers for a specific year
async function getYearPapers(year: string): Promise<string[]> {
  const yearPath = path.join(COURSE_MATERIALS_PATH, "past-papers", year);
  return await readDir(yearPath);
}

// Search across all materials
async function searchMaterials(query: string): Promise<Array<{ path: string; excerpt: string }>> {
  const results: Array<{ path: string; excerpt: string }> = [];
  const allFiles = await getAllFiles(COURSE_MATERIALS_PATH);
  const lowerQuery = query.toLowerCase();

  for (const filePath of allFiles) {
    try {
      const content = await readFileContent(filePath);
      const lowerContent = content.toLowerCase();

      if (lowerContent.includes(lowerQuery)) {
        // Extract excerpt around the match
        const index = lowerContent.indexOf(lowerQuery);
        const start = Math.max(0, index - 100);
        const end = Math.min(content.length, index + query.length + 100);
        const excerpt = content.substring(start, end);

        results.push({
          path: path.relative(COURSE_MATERIALS_PATH, filePath),
          excerpt: `...${excerpt}...`,
        });
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }

  return results;
}

// Create and configure the server
const server = new Server(
  {
    name: "data-mining-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get-course-overview",
        description: "Get an overview of all available Data Mining course materials including lectures, tutorials, and past papers",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get-week-materials",
        description: "Retrieve all materials (lectures, tutorials, and answers) for a specific week (week-1 through week-13)",
        inputSchema: {
          type: "object",
          properties: {
            week: {
              type: "string",
              description: "Week identifier (e.g., 'week-1', 'week-2', ... 'week-13')",
              pattern: "^week-(1[0-3]|[1-9])$",
            },
          },
          required: ["week"],
        },
      },
      {
        name: "list-past-papers",
        description: "List all available past papers organized by year (2015-2024)",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get-year-papers",
        description: "Get all past papers for a specific year",
        inputSchema: {
          type: "object",
          properties: {
            year: {
              type: "string",
              description: "Year (2015-2024)",
              pattern: "^20(1[5-9]|2[0-4])$",
            },
          },
          required: ["year"],
        },
      },
      {
        name: "search-materials",
        description: "Search across all Data Mining course materials (lectures, tutorials, past papers) for specific content",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query to find in course materials",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "read-file",
        description: "Read and extract text content from a specific course material file (supports PDF, DOCX with OCR). Provide the relative path from course-materials folder.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Relative path to the file from course-materials folder (e.g., 'lectures/week-1/lecture.pdf' or 'past-papers/2024/exam.pdf')",
            },
          },
          required: ["filePath"],
        },
      },
    ],
  };
});

// Define available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const overview = await getCourseOverview();
  const resources = [];

  // Add week resources
  for (const week of overview.lectures) {
    resources.push({
      uri: `datamining://materials/${week}`,
      mimeType: "application/json",
      name: `Week ${week.split('-')[1]} Materials`,
      description: `All materials for ${week}`,
    });
  }

  // Add past paper resources
  for (const year of overview.pastPapers) {
    resources.push({
      uri: `datamining://past-papers/${year}`,
      mimeType: "application/json",
      name: `${year} Past Papers`,
      description: `Past examination papers from ${year}`,
    });
  }

  return { resources };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri.startsWith("datamining://materials/week-")) {
    const week = uri.split("/").pop();
    if (week) {
      const materials = await getWeekMaterials(week);
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(materials, null, 2),
          },
        ],
      };
    }
  } else if (uri.startsWith("datamining://past-papers/")) {
    const year = uri.split("/").pop();
    if (year) {
      const papers = await getYearPapers(year);
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(papers, null, 2),
          },
        ],
      };
    }
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get-course-overview") {
      const overview = await getCourseOverview();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(overview, null, 2),
          },
        ],
      };
    } else if (name === "get-week-materials") {
      const week = (args as { week: string }).week;
      const materials = await getWeekMaterials(week);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(materials, null, 2),
          },
        ],
      };
    } else if (name === "list-past-papers") {
      const overview = await getCourseOverview();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ years: overview.pastPapers }, null, 2),
          },
        ],
      };
    } else if (name === "get-year-papers") {
      const year = (args as { year: string }).year;
      const papers = await getYearPapers(year);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ year, papers }, null, 2),
          },
        ],
      };
    } else if (name === "search-materials") {
      const query = (args as { query: string }).query;
      const results = await searchMaterials(query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ query, results, count: results.length }, null, 2),
          },
        ],
      };
    } else if (name === "read-file") {
      const relPath = (args as { filePath: string }).filePath;
      const fullPath = path.join(COURSE_MATERIALS_PATH, relPath);
      
      // Check if file exists
      try {
        await fs.access(fullPath);
      } catch {
        throw new Error(`File not found: ${relPath}`);
      }
      
      const content = await readFileContent(fullPath);
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Data Mining MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
