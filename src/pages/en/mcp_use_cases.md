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

| Mode | Use When |
|------|----------|
| **URL Mode** | Kubeshark is already running and accessible |
| **Proxy Mode** | Let the CLI proxy into your cluster via kubectl |

```bash
# Default - uses current kubeconfig
kubeshark mcp

# URL mode - connect to a running instance
kubeshark mcp --url https://kubeshark.example.com

# Explicit kubeconfig
kubeshark mcp --kubeconfig ~/.kube/config
```

---

## Your First Query

Once connected, try:

> "What services are running in my cluster?"

> "Show me any HTTP 500 errors in the last hour."

> "Which services communicate with the payment service?"

The AI will use Kubeshark's MCP tools to query your traffic and return insights.

---

## Conversational Debugging

Ask debugging questions naturally instead of writing queries:

> *"Is my user-service receiving requests from the API gateway? Show me the last 10 requests."*

> *"What exactly is the notification-service sending to the email-provider? Show me the request body."*

> *"The frontend says it's sending the right headers, but the backend disagrees. Show me what's actually in the HTTP request."*

> *"Find all 4xx errors returned by my service in the last 30 minutes. What requests caused them?"*

The AI can show actual request/response payloads, verify headers, find errors and their corresponding requests, compare what's sent vs. what's received, and show connection-level issues like TCP resets and timeouts.

---

## Autonomous Development

AI coding assistants can write and deploy code, but they lack visibility into how that code actually behaves in Kubernetes. Kubeshark closes this gap by providing real-time network feedback, enabling AI tools to identify issues and fix them — deploy, verify, and fix in one autonomous loop.

> *"Deploy my changes and verify the new /api/orders endpoint works correctly."*

> *"Run the integration tests and use Kubeshark to verify the API calls are correct — check payloads, headers, and downstream calls."*

> *"I changed the retry logic. Deploy and verify that failed requests are retried exactly 3 times with exponential backoff."*

Kubeshark provides feedback that logs, metrics, and test assertions miss — malformed payloads, unexpected retries, missing headers, N+1 queries, serialization bugs, and connection pooling issues.

---

## What's Next

- [AI-Driven Workflows](/en/v2/ai_powered_analysis) — What AI can do with network data
- [MCP in Action](/en/mcp_in_action) — Full walkthrough of an AI-driven investigation
- [Installation](/en/mcp/cli) — All connection options and CLI reference
- [How MCP Works](/en/mcp) — Technical details
