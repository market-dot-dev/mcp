import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";

// Create a new FastMCP server instance
const server = new FastMCP({
  name: "Market.dev MCP",
  version: "0.1.0",
});

// Tool for searching experts
server.addTool({
  name: "search_experts",
  description:
    "Searches for open source experts and contributors on market.dev. " +
    "Use this tool when looking for people with specific technical skills, project contributions, or open source experience. " +
    "Returns information about developers and their involvement in open source projects. " +
    "Supports pagination and filtering by location.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "Search term to find experts (e.g., 'react', 'kubernetes', 'andrew')"
      ),
    count: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Number of results (1-20, default 10)")
      .optional(),
    offset: z
      .number()
      .min(0)
      .max(9)
      .default(0)
      .describe("Pagination offset (max 9, default 0)")
      .optional(),
    location: z
      .string()
      .describe("Filter by location (e.g., 'New York', 'Remote')")
      .optional(),
  }),
  execute: async (args, { log }) => {
    try {
      log.info("Searching for experts", {
        query: args.query,
        count: args.count,
        offset: args.offset,
        location: args.location,
      });

      const params = new URLSearchParams({
        q: args.query,
      });

      if (args.count !== undefined) {
        params.append("count", args.count.toString());
      }

      if (args.offset !== undefined) {
        params.append("offset", args.offset.toString());
      }

      if (args.location) {
        params.append("location", args.location);
      }

      const response = await fetch(
        `https://explore.market.dev/api/v1/experts/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new UserError(
          `Failed to search experts: ${response.statusText} (${response.status})`
        );
      }

      const data = await response.json();

      log.info("Expert search completed", {
        query: args.query,
        resultsCount: Array.isArray(data) ? data.length : "unknown",
      });

      return JSON.stringify(data);
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
  name: "search_projects",
  description:
    "Searches for open source projects on market.dev. " +
    "Use this tool when looking for specific libraries, frameworks, tools, or other open source repositories. " +
    "Returns information about projects including repositories, contributors, and related metadata. " +
    "Supports pagination for browsing through multiple results.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "Search term to find projects (e.g., 'blockchain', 'AI', 'ipfs')"
      ),
    count: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Number of results (1-20, default 10)")
      .optional(),
    offset: z
      .number()
      .min(0)
      .max(9)
      .default(0)
      .describe("Pagination offset (max 9, default 0)")
      .optional(),
  }),
  execute: async (args, { log }) => {
    try {
      log.info("Searching for projects", {
        query: args.query,
        count: args.count,
        offset: args.offset,
      });

      const params = new URLSearchParams({
        q: args.query,
      });

      if (args.count !== undefined) {
        params.append("count", args.count.toString());
      }

      if (args.offset !== undefined) {
        params.append("offset", args.offset.toString());
      }

      const response = await fetch(
        `https://explore.market.dev/api/v1/projects/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new UserError(
          `Failed to search projects: ${response.statusText} (${response.status})`
        );
      }

      const data = await response.json();

      log.info("Project search completed", {
        query: args.query,
        resultsCount: Array.isArray(data) ? data.length : "unknown",
      });

      return JSON.stringify(data);
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
