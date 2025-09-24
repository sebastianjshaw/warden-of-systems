# Warden of Systems MCP Server Setup

## 🚀 What is MCP?

MCP (Model Context Protocol) allows you to connect your Warden of Systems website to AI assistants like Cursor or ChatGPT, enabling them to read and interact with your story content directly.

## 📋 Prerequisites

- Node.js 18+ installed
- Cursor IDE or ChatGPT with MCP support

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Make Server Executable
```bash
chmod +x mcp-server.js
```

## 🔧 Configuration

### For Cursor IDE:

1. **Add to Cursor Settings:**
   - Open Cursor Settings (Cmd/Ctrl + ,)
   - Search for "MCP"
   - Add the following configuration:

```json
{
  "mcpServers": {
    "warden-of-systems": {
      "command": "node",
      "args": ["mcp-server.js"],
      "cwd": "/Users/Sebastian.Shaw/Documents/Code/warden-of-systems"
    }
  }
}
```

2. **Alternative: Use the provided config file:**
   - Copy `mcp-config.json` to your Cursor MCP configuration
   - Update the `cwd` path to match your project location

### For ChatGPT:

1. **Install MCP Client:**
   ```bash
   npm install -g @modelcontextprotocol/cli
   ```

2. **Run the server:**
   ```bash
   mcp serve warden-of-systems mcp-server.js
   ```

## 🎯 Available Tools

Once connected, you can use these commands with your AI assistant:

### 📖 **get_chapter**
Get the full content of a specific chapter
```
Get chapter 15
Show me chapter 22
Read chapter 36
```

### 📚 **list_chapters**
Get a list of all chapters with titles and summaries
```
List all chapters
Show me all chapter titles
What chapters are available?
```

### 👥 **get_characters**
Get information about characters
```
Show me all characters
Tell me about the protagonist
What characters are in the story?
```

### 🔍 **search_content**
Search through chapters and characters
```
Search for "magic" in chapters
Find mentions of "sword" in the story
Look for "forest" in all content
```

### ℹ️ **get_website_info**
Get general information about the website
```
Tell me about this website
What is Warden of Systems?
Show me website information
```

### 🆕 **get_latest_chapter**
Get the most recent chapter
```
What's the latest chapter?
Show me the newest chapter
Get the most recent content
```

## 🧪 Testing

### Test the Server:
```bash
npm start
```

### Test with Cursor:
1. Open Cursor
2. Start a new chat
3. Try: "Get chapter 1 from Warden of Systems"
4. The AI should be able to access your story content!

## 🔧 Troubleshooting

### Common Issues:

1. **"Command not found"**
   - Make sure Node.js is installed
   - Check that `mcp-server.js` is executable

2. **"Server not responding"**
   - Verify the `cwd` path in your MCP config
   - Check that all chapter files exist in the `chapters/` directory

3. **"Permission denied"**
   - Run: `chmod +x mcp-server.js`

4. **"Module not found"**
   - Run: `npm install` to install dependencies

### Debug Mode:
```bash
npm run dev
```

## 📁 File Structure

```
warden-of-systems/
├── mcp-server.js          # Main MCP server
├── package.json           # Dependencies
├── mcp-config.json        # Cursor configuration
├── chapters/              # Chapter HTML files
│   ├── chapter1.html
│   ├── chapter2.html
│   └── ...
├── characters.html        # Character information
├── index.html            # Homepage
└── styles.css            # Website styling
```

## 🎉 Usage Examples

Once set up, you can ask your AI assistant:

- **"What happens in chapter 15?"**
- **"Who are the main characters in Warden of Systems?"**
- **"Search for mentions of magic in the story"**
- **"What's the latest chapter about?"**
- **"Tell me about the protagonist's journey"**

## 🔄 Updates

When you add new chapters or update content:

1. The MCP server automatically reads from your HTML files
2. No need to restart the server
3. New content is immediately available to AI assistants

## 🚀 Advanced Features

### Custom Search:
- Search by character names
- Search by chapter themes
- Search by specific terms or phrases

### Content Analysis:
- Get chapter summaries
- Find character relationships
- Analyze story progression

### Integration Benefits:
- AI can help with story analysis
- Generate character backstories
- Suggest plot developments
- Help with world-building

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all files are in the correct locations
3. Ensure Node.js and dependencies are properly installed
4. Test the server manually with `npm start`

---

**Enjoy having your fantasy world accessible to AI assistants!** 🧙‍♂️✨📚
