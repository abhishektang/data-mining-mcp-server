# Quick Start Guide - Data Mining MCP Server

Get up and running in 5 minutes!

## Step 1: Install Dependencies (2 min)

```bash
# Navigate to project directory
cd "Data Mining MCP Server"

# Install Node.js packages
npm install

# Create Python environment
python3 -m venv .venv
source .venv/bin/activate

# Install Python packages
pip install PyMuPDF python-docx

# Build the server
npm run build
```

## Step 2: Add Your Materials (1 min)

Drop your course files into these folders:

- `course-materials/lectures/week-X/` - Lecture slides
- `course-materials/tutorials/week-X/` - Tutorial questions  
- `course-materials/tutorial-answers/week-X/` - Tutorial answers
- `course-materials/past-papers/YYYY/` - Exam papers
- `course-materials/additional-resources/` - Extra materials

## Step 3: Configure AI Assistant (2 min)

### For VS Code + GitHub Copilot

Edit: `~/Library/Application Support/Code/User/mcp.json`

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

### For Claude Desktop

Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

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

**Replace `/absolute/path/to/` with your actual path!**

## Step 4: Restart & Test

1. Restart VS Code or Claude Desktop completely
2. Ask: "What Data Mining materials are available?"
3. Try: "Show me week 3 lecture content"

## ✅ Done!

You're all set! The AI can now access and search your Data Mining course materials.

## Need Help?

- Check the full [README.md](README.md) for details
- Test server: `npx @modelcontextprotocol/inspector node build/index.js`
- Verify build: `ls -la build/index.js`

---

**Pro Tip**: Keep your virtual environment activated when rebuilding:
```bash
source .venv/bin/activate
npm run build
```
