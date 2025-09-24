#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WardenOfSystemsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "warden-of-systems-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_chapter",
            description: "Get the full content of a specific chapter by number",
            inputSchema: {
              type: "object",
              properties: {
                chapterNumber: {
                  type: "number",
                  description: "The chapter number (1-36)",
                  minimum: 1,
                  maximum: 36,
                },
              },
              required: ["chapterNumber"],
            },
          },
          {
            name: "list_chapters",
            description: "Get a list of all chapters with titles, summaries, and publish dates",
            inputSchema: {
              type: "object",
              properties: {
                includeContent: {
                  type: "boolean",
                  description: "Whether to include chapter content in the response",
                  default: false,
                },
              },
            },
          },
          {
            name: "get_characters",
            description: "Get information about all characters in the story",
            inputSchema: {
              type: "object",
              properties: {
                characterName: {
                  type: "string",
                  description: "Optional: Get specific character by name",
                },
              },
            },
          },
          {
            name: "search_content",
            description: "Search through chapters and character information for specific terms",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search term or phrase",
                },
                searchType: {
                  type: "string",
                  enum: ["chapters", "characters", "all"],
                  description: "What to search through",
                  default: "all",
                },
              },
              required: ["query"],
            },
          },
          {
            name: "get_website_info",
            description: "Get general information about the Warden of Systems website and story",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "get_latest_chapter",
            description: "Get information about the most recent chapter",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_chapter":
            return await this.getChapter(args.chapterNumber);
          case "list_chapters":
            return await this.listChapters(args.includeContent || false);
          case "get_characters":
            return await this.getCharacters(args.characterName);
          case "search_content":
            return await this.searchContent(args.query, args.searchType || "all");
          case "get_website_info":
            return await this.getWebsiteInfo();
          case "get_latest_chapter":
            return await this.getLatestChapter();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async getChapter(chapterNumber) {
    const chapterFile = path.join(__dirname, "chapters", `chapter${chapterNumber}.html`);
    
    if (!fs.existsSync(chapterFile)) {
      throw new Error(`Chapter ${chapterNumber} not found`);
    }

    const content = fs.readFileSync(chapterFile, "utf-8");
    
    // Extract chapter content from HTML
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : `Chapter ${chapterNumber}`;
    
    // Extract the main content (between chapter-content divs)
    const contentMatch = content.match(/<div class="wardrobe-chapter-content"[^>]*>(.*?)<\/div>/s);
    const chapterContent = contentMatch ? contentMatch[1] : "Content not found";
    
    // Clean up HTML tags for plain text
    const cleanContent = chapterContent
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      content: [
        {
          type: "text",
          text: `# ${title}\n\n${cleanContent}`,
        },
      ],
    };
  }

  async listChapters(includeContent = false) {
    const chapters = [];
    
    for (let i = 1; i <= 36; i++) {
      const chapterFile = path.join(__dirname, "chapters", `chapter${i}.html`);
      
      if (fs.existsSync(chapterFile)) {
        const content = fs.readFileSync(chapterFile, "utf-8");
        
        // Extract title
        const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const title = titleMatch ? titleMatch[1].trim() : `Chapter ${i}`;
        
        // Extract summary from meta description or first paragraph
        const summaryMatch = content.match(/<meta name="description" content="([^"]+)"/);
        const summary = summaryMatch ? summaryMatch[1] : "No summary available";
        
        // Extract publish date
        const dateMatch = content.match(/Published: ([^<]+)/);
        const publishDate = dateMatch ? dateMatch[1].trim() : "Unknown";
        
        const chapterInfo = {
          number: i,
          title,
          summary,
          publishDate,
        };
        
        if (includeContent) {
          const contentMatch = content.match(/<div class="wardrobe-chapter-content"[^>]*>(.*?)<\/div>/s);
          const chapterContent = contentMatch ? contentMatch[1] : "";
          const cleanContent = chapterContent
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          chapterInfo.content = cleanContent;
        }
        
        chapters.push(chapterInfo);
      }
    }
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(chapters, null, 2),
        },
      ],
    };
  }

  async getCharacters(characterName = null) {
    const charactersFile = path.join(__dirname, "characters.html");
    
    if (!fs.existsSync(charactersFile)) {
      throw new Error("Characters file not found");
    }

    const content = fs.readFileSync(charactersFile, "utf-8");
    
    // Extract character information from HTML
    const characterMatches = content.match(/<div class="wardrobe-character-card"[^>]*>(.*?)<\/div>/gs);
    
    if (!characterMatches) {
      throw new Error("No characters found");
    }

    const characters = characterMatches.map(match => {
      // Extract character name
      const nameMatch = match.match(/<h3[^>]*>([^<]+)<\/h3>/);
      const name = nameMatch ? nameMatch[1].trim() : "Unknown";
      
      // Extract description
      const descMatch = match.match(/<p[^>]*>([^<]+)<\/p>/);
      const description = descMatch ? descMatch[1].trim() : "No description available";
      
      return { name, description };
    });

    if (characterName) {
      const character = characters.find(c => 
        c.name.toLowerCase().includes(characterName.toLowerCase())
      );
      if (!character) {
        throw new Error(`Character "${characterName}" not found`);
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(character, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(characters, null, 2),
        },
      ],
    };
  }

  async searchContent(query, searchType = "all") {
    const results = [];
    const searchTerm = query.toLowerCase();

    if (searchType === "chapters" || searchType === "all") {
      for (let i = 1; i <= 36; i++) {
        const chapterFile = path.join(__dirname, "chapters", `chapter${i}.html`);
        
        if (fs.existsSync(chapterFile)) {
          const content = fs.readFileSync(chapterFile, "utf-8");
          const cleanContent = content
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .toLowerCase();
          
          if (cleanContent.includes(searchTerm)) {
            const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
            const title = titleMatch ? titleMatch[1].trim() : `Chapter ${i}`;
            
            results.push({
              type: "chapter",
              number: i,
              title,
              relevance: this.calculateRelevance(cleanContent, searchTerm),
            });
          }
        }
      }
    }

    if (searchType === "characters" || searchType === "all") {
      const charactersFile = path.join(__dirname, "characters.html");
      
      if (fs.existsSync(charactersFile)) {
        const content = fs.readFileSync(charactersFile, "utf-8");
        const characterMatches = content.match(/<div class="wardrobe-character-card"[^>]*>(.*?)<\/div>/gs);
        
        if (characterMatches) {
          characterMatches.forEach(match => {
            const cleanMatch = match
              .replace(/<[^>]*>/g, '')
              .replace(/\s+/g, ' ')
              .toLowerCase();
            
            if (cleanMatch.includes(searchTerm)) {
              const nameMatch = match.match(/<h3[^>]*>([^<]+)<\/h3>/);
              const name = nameMatch ? nameMatch[1].trim() : "Unknown";
              
              results.push({
                type: "character",
                name,
                relevance: this.calculateRelevance(cleanMatch, searchTerm),
              });
            }
          });
        }
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  async getWebsiteInfo() {
    const info = {
      title: "Warden of Systems",
      description: "An epic fantasy serial following a protagonist's journey through mystical realms",
      totalChapters: 36,
      status: "Ongoing",
      genre: "Epic Fantasy",
      author: "Sebastian Shaw",
      website: "Static website with chapters, characters, and interactive features",
      features: [
        "36 complete chapters",
        "Character profiles and descriptions",
        "Responsive design for all devices",
        "Interactive navigation",
        "Search functionality",
        "Modern CSS styling with animations"
      ]
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(info, null, 2),
        },
      ],
    };
  }

  async getLatestChapter() {
    const latestChapter = await this.getChapter(36);
    const chapterInfo = await this.listChapters(false);
    
    return {
      content: [
        {
          type: "text",
          text: `Latest Chapter: Chapter 36 - The Line\n\n${latestChapter.content[0].text}`,
        },
      ],
    };
  }

  calculateRelevance(content, searchTerm) {
    const termCount = (content.match(new RegExp(searchTerm, 'g')) || []).length;
    const contentLength = content.length;
    return termCount / contentLength * 100;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Warden of Systems MCP server running on stdio");
  }
}

const server = new WardenOfSystemsMCPServer();
server.run().catch(console.error);
