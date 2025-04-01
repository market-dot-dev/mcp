import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";

// Create a new FastMCP server instance
const server = new FastMCP({
  name: "Market.dev MCP",
  version: "1.0.0",
  description: "MCP server for interfacing with market.dev APIs"
});

// Tool for searching experts
server.addTool({
  name: "searchExperts",
  description: "Search for experts on market.dev platform",
  parameters: z.object({
    query: z.string().describe("Search term to find experts (e.g., 'developer', 'designer', 'andrew')"),
  }),
  execute: async (args, { log }) => {
    try {
      log.info("Searching for experts", { query: args.query });
      
      const response = await fetch(
        `https://explore.market.dev/api/v1/experts/search?q=${encodeURIComponent(args.query)}`
      );
      
      if (!response.ok) {
        throw new UserError(`Failed to search experts: ${response.statusText} (${response.status})`);
      }
      
      const data = await response.json();
      log.info("Expert search completed", { 
        query: args.query,
        resultsCount: Array.isArray(data) ? data.length : 'unknown' 
      });
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError(`Error searching experts: ${error.message}`);
    }
  },
});

// Tool for searching projects
server.addTool({
  name: "searchProjects",
  description: "Search for projects on market.dev platform",
  parameters: z.object({
    query: z.string().describe("Search term to find projects (e.g., 'blockchain', 'AI', 'ipfs')"),
  }),
  execute: async (args, { log }) => {
    try {
      log.info("Searching for projects", { query: args.query });
      
      const response = await fetch(
        `https://explore.market.dev/api/v1/projects/search?q=${encodeURIComponent(args.query)}`
      );
      
      if (!response.ok) {
        throw new UserError(`Failed to search projects: ${response.statusText} (${response.status})`);
      }
      
      const data = await response.json();
      log.info("Project search completed", { 
        query: args.query,
        resultsCount: Array.isArray(data) ? data.length : 'unknown' 
      });
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError(`Error searching projects: ${error.message}`);
    }
  },
});

// Start the server with stdio transport (compatible with MCP CLI and Claude Desktop)
server.start({
  transportType: "stdio",
});

// console.log("Market.dev MCP server started");