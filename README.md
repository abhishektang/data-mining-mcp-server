# Data Mining MCP Server

A Model Context Protocol (MCP) server for managing and querying Data Mining course materials. This server provides intelligent access to your lecture notes, tutorials, tutorial answers, and past papers through AI-powered tools.

## 📚 Features

- **Search Across All Materials**: Full-text search across lectures, tutorials, answers, and past papers with PDF/DOCX support
- **Week-Based Organization**: Retrieve all materials for any specific week (1-13)
- **Past Paper Access**: Quick access to exam papers from 2015-2024
- **Course Overview**: Get a complete overview of available materials
- **PDF & DOCX Support**: Instant text extraction using PyMuPDF and python-docx
- **Resource Access**: Direct access to any document by path

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher
- npm

### Installation

1. Clone or navigate to this directory
2. Install Node.js dependencies:
```bash
npm install
```

3. Set up Python environment:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install PyMuPDF python-docx
```

4. Build the project:
```bash
npm run build
```

### Adding Your Course Materials

Place your materials in the `course-materials/` directory following this structure:

```
course-materials/
├── lectures/week-1/          # Week 1 lecture notes
├── lectures/week-2/          # Week 2 lecture notes
├── ...
├── lectures/week-13/         # Week 13 lecture notes
├── tutorials/week-1/         # Week 1 tutorial questions
├── tutorial-answers/week-1/  # Week 1 tutorial answers
├── additional-resources/     # Supplementary materials
└── past-papers/              # Past year papers by year (2015-2024)
    ├── 2015/
    ├── 2016/
    ├── ...
    ├── 2023/
    └── 2024/
```

Supported file formats:
- PDF (.pdf) - with instant text extraction
- Word Documents (.docx)
- Markdown (.md)
- Text (.txt)
- Any text-based format

### Example: Adding Week 1 Materials

```bash
# Add lecture notes
cp ~/Downloads/week1-classification.pdf course-materials/lectures/week-1/

# Add tutorial
cp ~/Downloads/week1-tutorial.pdf course-materials/tutorials/week-1/

# Add tutorial answers
cp ~/Downloads/week1-answers.docx course-materials/tutorial-answers/week-1/

# Add past papers by year
cp ~/Downloads/2023-midterm.pdf course-materials/past-papers/2023/
cp ~/Downloads/2023-final.pdf course-materials/past-papers/2023/
cp ~/Downloads/2024-exam.pdf course-materials/past-papers/2024/
```

## 🔧 Using the Server

### With VS Code GitHub Copilot (Recommended)

1. Open VS Code Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Type and select: **"MCP: Open User Configuration"**
3. Add this configuration to your `mcp.json`:

```json
{
  "servers": {
    "data-mining": {
      "type": "stdio",
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/Data Mining MCP Server/build/index.js"]
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/` with the actual path to this directory.

4. Save the file and restart VS Code or GitHub Copilot

**Note**: The MCP configuration file is located at:
- **macOS/Linux**: `~/Library/Application Support/Code/User/mcp.json`
- **Windows**: `%USERPROFILE%\AppData\Roaming\Code\User\mcp.json`

### With Claude Desktop (Alternative)

If you prefer Claude Desktop, add to `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS:

```json
{
  "mcpServers": {
    "data-mining": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/Data Mining MCP Server/build/index.js"]
    }
  }
}
```

### With MCP Inspector (for testing)

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## 🛠️ Available Tools

### 1. `search-materials`
Search across all course materials by content or filename.

**Parameters:**
- `query` (string): Search term

**Example:**
```
Search for "decision trees" in all materials
Search for "clustering" in materials
```

### 2. `get-week-materials`
Retrieve all materials for a specific week.

**Parameters:**
- `week` (string): Week identifier (e.g., "week-1", "week-2", ..., "week-13")

**Example:**
```
Get lecture notes for week 5
Get tutorial answers for week 3
```

### 3. `list-past-papers`
List all available past year exam papers organized by year (2015-2024).

**Parameters:** None

**Example:**
```
Show me all past papers
List available exam years
```

### 4. `get-year-papers`
Get all past papers for a specific year.

**Parameters:**
- `year` (string): Year to retrieve papers from (e.g., "2015", "2024")

**Example:**
```
Get all papers from 2024
Show me 2023 exam papers
```

### 5. `get-course-overview`
Get an overview of all available course materials.

**Parameters:** None

**Example:**
```
Give me an overview of the course
What materials are available?
```

### 6. `read-file`
Read and extract text from PDF or DOCX files.

**Parameters:**
- `filePath` (string): Relative path from course-materials folder
- `maxPages` (optional number): Limit pages to extract from PDFs

**Example:**
```
Read the week 3 lecture PDF
Extract text from lectures/week-5/decision-trees.pdf
```

## 📖 Resources

The server also exposes documents as resources that can be directly referenced:

- `datamining://materials/week-{X}` - Access materials for week X (1-13)
- `datamining://past-papers/{YEAR}` - Access past papers for specific year

## �� Example Workflows

### Studying for Week 3
1. Ask your AI assistant: "Help me study Week 3"
2. The AI will use `get-week-materials` to retrieve lectures, tutorials, and answers
3. Ask follow-up questions about specific concepts like "decision trees"

### Searching for a Topic
1. Ask: "Find all materials about classification algorithms"
2. The AI will use `search-materials` to find relevant content across all weeks
3. Get direct access to the relevant documents

### Exam Preparation
1. Ask: "Help me prepare for my Data Mining exam"
2. The AI will:
   - List all past papers using `list-past-papers`
   - Search for key concepts
   - Help you practice questions
   - Create a study plan based on available materials

## 🏗️ Development

### Project Structure

```
.
├── src/
│   └── index.ts          # Main MCP server implementation
├── scripts/
│   └── extract_text.py   # PDF/DOCX text extraction utility
├── course-materials/     # Your course materials
│   ├── lectures/
│   ├── tutorials/
│   ├── tutorial-answers/
│   ├── additional-resources/
│   └── past-papers/
├── build/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Making Changes

1. Edit `src/index.ts`
2. Rebuild: `npm run build`
3. Restart your MCP client to pick up changes

### Watch Mode (for development)

```bash
npm run watch
```

This will automatically rebuild when you make changes to the source code.

## �� Tips for Exam Preparation

1. **Organize Your Materials**: Keep materials organized by week for easy retrieval
2. **Use Descriptive Filenames**: Name files clearly (e.g., `week3-decision-trees.pdf`)
3. **Combine with AI**: Ask the AI to quiz you, explain concepts, or create study guides
4. **Search Effectively**: Use specific terms to find relevant materials across all weeks
5. **Practice with Past Papers**: Use the `list-past-papers` tool to access previous exams

## 🔒 Privacy

All materials are stored locally on your machine. The MCP server only provides access to your AI assistant through the Model Context Protocol. Your course materials never leave your computer.

## 📝 License

MIT

## 🆘 Troubleshooting

### Server won't start
- Make sure you've run `npm install` and `npm run build`
- Check that Node.js version is 18 or higher: `node --version`
- Verify Python dependencies are installed in `.venv/`

### Materials not showing up
- Verify files are in the correct directory structure under `course-materials/`
- Check file permissions (files must be readable)
- Try using the `get-course-overview` tool to see what's detected

### Search not finding content
- Ensure PDFs have text layers (not scanned images without OCR)
- Check file encoding (should be UTF-8)
- Try searching for exact words from the document

### PDF/DOCX extraction failing
- Verify Python virtual environment is activated
- Ensure PyMuPDF and python-docx are installed: `pip list | grep -E "PyMuPDF|python-docx"`
- Check Python path in your environment

## 📚 Example Materials Template

Create well-organized materials with clear naming:

```
course-materials/
├── lectures/week-1/
│   ├── w1-introduction-to-data-mining.pdf
│   └── w1-lecture-notes.md
├── tutorials/week-1/
│   └── w1-tutorial-questions.pdf
└── tutorial-answers/week-1/
    └── w1-tutorial-solutions.docx
```

## 🤝 Contributing

This is a study tool for Data Mining students. Feel free to customize it for your own needs or contribute improvements!

## 📖 Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [PyMuPDF Documentation](https://pymupdf.readthedocs.io/)

---

**Happy Studying! 🎓** Use this tool to ace your Data Mining exam!
