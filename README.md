# Market.dev MCP Server

An MCP server implementation that integrates with the Market.dev API, providing tools to search for open source experts and projects.

## Features

- **Expert Search**: Find open source developers and contributors based on skills, project involvement, or names
- **Project Search**: Discover open source libraries, frameworks, tools, and repositories
- **Location Filtering**: Find experts in specific geographic locations or remote workers

## Tools

### search_experts

Searches for open source experts and contributors on market.dev.

**Inputs:**
- `query` (string): Search term to find experts (e.g., 'react', 'kubernetes', 'andrew')
- `count` (number, optional): Number of results (1-20, default 10)
- `offset` (number, optional): Pagination offset (max 9, default 0)
- `location` (string, optional): Filter by location (e.g., 'New York', 'Remote')

### search_projects

Searches for open source projects on market.dev.

**Inputs:**
- `query` (string): Search term to find projects (e.g., 'blockchain', 'AI', 'ipfs')
- `count` (number, optional): Number of results (1-20, default 10)
- `offset` (number, optional): Pagination offset (max 9, default 0)

## Configuration

By default, the server connects to the Market.dev API at `https://explore.market.dev`. You can customize this by setting the `MARKET_DEV_API_URL` environment variable.

## Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "market-dev": {
      "command": "npx",
      "args": ["-y", "git+https://github.com/market-dot-dev/mcp-beta.git"]
    }
  }
}
```



## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.