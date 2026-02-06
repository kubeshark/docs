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
claude mcp add kubeshark -- kubeshark mcp --url https://your-kubeshark.example.com
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--url", "https://your-kubeshark.example.com"]
    }
  }
}
```

### Cursor / VS Code

Configure in your editor's MCP settings with the same command and arguments.

---

## Connection Modes

| Mode | Use When |
|------|----------|
| **URL Mode** | Kubeshark is already running and accessible |
| **Proxy Mode** | Let the CLI proxy into your cluster via kubectl |

```bash
# URL mode - connect to running instance
kubeshark mcp --url https://kubeshark.example.com

# Proxy mode - CLI handles the connection
kubeshark mcp --proxy
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
