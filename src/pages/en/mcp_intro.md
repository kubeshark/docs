---
title: Getting Started
description: Connect your AI assistant to Kubeshark and start querying network traffic in minutes.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Connect any MCP-compatible AI assistant to Kubeshark and query your Kubernetes network traffic using natural language.

---

## Quick Setup

### Claude Code (Terminal)

```bash
claude mcp add kubeshark -- kubeshark mcp
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp"]
    }
  }
}
```

### Cursor / VS Code

Configure in your editor's MCP settings with the same command and arguments.

---

## Connection Modes

By default, the MCP server uses your local `kubectl` context to connect to Kubeshark running in your cluster. If you don't have `kubectl` access (e.g. a developer using a shared Kubeshark instance installed by an SRE), use the `--url` option to connect directly.

| Mode | Use When |
|------|----------|
| **Default** | You have `kubectl` access to the cluster |
| **URL Mode** | Kubeshark is accessible via a known URL (no `kubectl` needed) |

```bash
# Default - uses kubectl context
kubeshark mcp

# URL mode - connect directly (no kubectl required)
kubeshark mcp --url https://kubeshark.example.com
```

---

## Your First Query

Once connected, try:

> "What services are running in my cluster?"

> "Show me any HTTP 500 errors in the last hour."

> "Which services communicate with the payment service?"

The AI will use Kubeshark's MCP tools to query your traffic and return insights.

---

## What's Next

- [Network Intelligence](/en/v2/ai_powered_analysis) — What AI can do with network data
- [Conversational Debugging](/en/mcp/troubleshooting) — Investigation workflows
- [MCP CLI Reference](/en/mcp/cli) — All connection options
- [How MCP Works](/en/mcp) — Technical details
