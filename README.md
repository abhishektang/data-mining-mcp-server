# Data Mining MCP Server

A Model Context Protocol (MCP) server for organizing and accessing Data Mining course materials through AI assistants like Claude and GitHub Copilot.

## 🎯 Overview

This MCP server provides structured access to comprehensive Data Mining course materials:

- **Lectures** (Week 1-13)
- **Tutorials** (Week 1-13)
- **Tutorial Answers** (Week 1-13)
- **Past Papers** (2015-2024)
- **Additional Resources**

## ✨ Features

### Fast Text Extraction

- ✅ **PDF Support** - Instant text extraction using PyMuPDF
- ✅ **DOCX Support** - Native Word document parsing
- ✅ **Blazing Fast** - No AI/OCR overhead, direct text extraction
- ✅ **Lightweight** - Minimal dependencies

### Available Tools

1. **get-course-overview** - Complete overview of all materials
2. **get-week-materials** - Materials for a specific week (week-1 to week-13)
3. **list-past-papers** - List all past papers by year
4. **get-year-papers** - Papers for a specific year (2015-2024)
5. **search-materials** - Search across all course content
6. **read-file** - Extract text from PDF/DOCX files

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm

### Installation

```bash
# Install Node.js dependencies
npm install

# Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install PyMuPDF python-docx

# Build the server
npm run build
```

## 📁 Adding Course Materials

Place your materials in the `course-materials/` directory:

```
course-materials/
├── lectures/week-1/
├── lectures/week-2/
├── ...
├── tutorials/week-1/
├── tutorial-answers/week-1/
├── past-papers/2024/
└── additional-resources/
```

Supported formats: PDF, DOCX, Markdown, Text files

## ⚙️ Configuration

### VS Code with GitHub Copilot

Add to your MCP configuration (`~/Library/Application Support/Code/User/mcp.json`):

```json
{
  "servers": {
    "data-mining": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/Data Mining MCP Server/build/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "data-mining": {
      "command": "node",
      "args": ["/absolute/path/to/Data Mining MCP Server/build/index.js"]
    }
  }
}
```

**Important**: Use absolute paths and restart your AI assistant after configuration.

## 💡 Usage Examples

Once connected, ask questions like:

- "What materials are available for week 5?"
- "Show me the 2023 past papers"
- "Search for 'decision trees' in all materials"
- "Read the week 3 lecture file"

## 🛠️ Development

```bash
# Watch mode for development
npm run watch

# Test the server
npx @modelcontextprotocol/inspector node build/index.js
```

## 📂 Project Structure

```
.
├── src/
│   └── index.ts              # Main MCP server
├── scripts/
│   └── extract_text.py       # PDF/DOCX text extraction
├── course-materials/         # Your course content
├── build/                    # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Troubleshooting

**Server not appearing?**
- Verify absolute paths in config
- Run `npm run build`
- Restart your AI assistant completely

**No materials showing?**
- Check files are in `course-materials/` folders
- Verify file permissions

**Text extraction failing?**
- Ensure PyMuPDF and python-docx are installed
- Check Python virtual environment is activated

## 📚 API Reference

### Tools

| Tool | Input | Description |
|------|-------|-------------|
| `get-course-overview` | None | Get all available materials |
| `get-week-materials` | `week: "week-1"` | Get specific week materials |
| `list-past-papers` | None | List available years |
| `get-year-papers` | `year: "2024"` | Get year's papers |
| `search-materials` | `query: string` | Search all content |
| `read-file` | `filePath: string` | Extract file text |

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to customize for your course structure.

## 📖 Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

---

Built with ❤️ for Data Mining students
````

### Available Resources

- Week-specific materials (week-1 through week-13)
- Year-specific past papers (2015-2024)

## Installation

### Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher
- npm or npx
- **GPU recommended** (but not required) for faster OCR processing

### Setup

1. Clone or download this repository:
```bash
cd "/Users/abhishektanguturi/Data Mining MCP Server"
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Set up Python virtual environment and install Chandra OCR:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install chandra-ocr
```

**Note**: The first time you use OCR, Chandra will download the model (~4GB). This happens automatically and only needs to be done once.

4. Build the TypeScript server:
```bash
npm run build
```

### Optional: GPU Acceleration

For faster OCR processing, you can install PyTorch with GPU support:

```bash
# For NVIDIA GPUs (CUDA)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# For Apple Silicon (MPS)
pip install torch torchvision
```

The server will automatically use GPU if available, otherwise it falls back to CPU.

## Adding Your Course Materials

### Directory Structure

```
course-materials/
├── lectures/
│   ├── week-1/
│   ├── week-2/
│   ├── ...
│   └── week-13/
├── tutorials/
│   ├── week-1/
│   ├── week-2/
│   ├── ...
│   └── week-13/
├── tutorial-answers/
│   ├── week-1/
│   ├── week-2/
│   ├── ...
│   └── week-13/
├── past-papers/
│   ├── 2015/
│   ├── 2016/
│   ├── ...
│   └── 2024/
└── additional-resources/
```

### How to Add Materials

1. **Lectures**: Place your lecture slides, notes, or documents in the appropriate `week-X` folder under `course-materials/lectures/`

2. **Tutorials**: Add tutorial question sheets to `course-materials/tutorials/week-X/`

3. **Tutorial Answers**: Add answer sheets to `course-materials/tutorial-answers/week-X/`

4. **Past Papers**: Add examination papers to the appropriate year folder under `course-materials/past-papers/YYYY/`

5. **Additional Resources**: Place any extra materials in `course-materials/additional-resources/`

**Supported file formats**: PDF, Markdown (.md), Text files (.txt), Images (for diagrams), etc.

## Using with Claude Desktop

### Configuration

Add this server to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "data-mining": {
      "command": "node",
      "args": [
        "/Users/abhishektanguturi/Data Mining MCP Server/build/index.js"
      ]
    }
  }
}
```

**Note**: Replace the path with the absolute path to your build/index.js file.

### Alternative: Using npx

You can also run it via npx:

```json
{
  "mcpServers": {
    "data-mining": {
      "command": "npx",
      "args": [
        "-y",
        "/Users/abhishektanguturi/Data Mining MCP Server"
      ]
    }
  }
}
```

### Restart Claude Desktop

After adding the configuration, completely quit and restart Claude Desktop for the changes to take effect.

## Using with Other MCP Clients

### VS Code with GitHub Copilot

Press `Cmd+Shift+P` and select "MCP: Add server...". Choose STDIO and provide:
- Command: `node`
- Args: `["/path/to/Data Mining MCP Server/build/index.js"]`

### MCP Inspector (for testing)

Test your server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Example Usage

Once connected to Claude Desktop, you can ask questions like:

- "What materials are available for week 5 of Data Mining?"
- "Show me the past papers from 2023"
- "Search for 'decision trees' in all course materials"
- "Give me an overview of all available Data Mining course content"
- "What topics are covered in week 10 lectures?"

## Development

### Watch Mode

For development, you can run TypeScript in watch mode:

```bash
npm run watch
```

### Project Structure

```
.
├── src/
│   └── index.ts          # Main MCP server implementation
├── course-materials/     # Your course content goes here
├── build/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Server not appearing in Claude Desktop

1. Check the config file path is correct
2. Ensure the path to build/index.js is absolute, not relative
3. Make sure you've run `npm run build`
4. Completely quit and restart Claude Desktop (not just close the window)
5. Check Claude Desktop logs: `~/Library/Logs/Claude/` (macOS)

### "Cannot find module" errors

Run `npm install` to ensure all dependencies are installed.

### No materials showing up

1. Make sure you've added files to the `course-materials/` folders
2. Check file permissions - ensure the server can read the files
3. Verify the folder structure matches the expected layout

### Search not finding content

- Ensure files are text-based (PDFs need to be searchable, not scanned images)
- Check file encodings are UTF-8
- Verify files aren't corrupted

## Tools Reference

### get-course-overview

Returns an overview of all available materials organized by category.

**Input**: None

**Output**: JSON object with arrays of available weeks and years

### get-week-materials

Retrieves all materials for a specific week.

**Input**:
- `week` (string): Week identifier (e.g., "week-1", "week-2", ..., "week-13")

**Output**: JSON object with lectures, tutorials, and tutorial answers for that week

### list-past-papers

Lists all available past paper years.

**Input**: None

**Output**: Array of available years

### get-year-papers

Gets all papers for a specific year.

**Input**:
- `year` (string): Year (e.g., "2015", "2016", ..., "2024")

**Output**: Array of paper files for that year

### search-materials

Searches across all course materials. Automatically uses OCR for PDF/DOCX files.

**Input**:
- `query` (string): Search term or phrase

**Output**: Array of matches with file paths and excerpts

### read-file

Reads and extracts text content from a specific file using OCR (for PDFs/DOCX).

**Input**:
- `filePath` (string): Relative path from course-materials folder (e.g., "lectures/week-1/slides.pdf")

**Output**: Full text content extracted from the file

## Resources Reference

Resources provide direct access to materials through URIs:

- `datamining://materials/week-X` - Access materials for week X
- `datamining://past-papers/YYYY` - Access past papers for year YYYY

## License

MIT

## Support

For issues or questions about setting up the MCP server, please refer to:
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Contributing

Feel free to customize this server for your specific Data Mining course structure and needs!
