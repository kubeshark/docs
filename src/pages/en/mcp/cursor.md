---
title: Cursor Integration
description: Connect Kubeshark's MCP server to Cursor for AI-powered Kubernetes network analysis in your IDE.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

[Cursor](https://cursor.com) is an AI-powered code editor with native MCP support. Connect Kubeshark to query and analyze Kubernetes network traffic directly from your IDE using natural language.

---

## Quick Setup

### Option 1: UI Configuration

1. Open **Cursor Settings** (File → Preferences → Cursor Settings)
2. Select **MCP** from the sidebar
3. Click **Add new global MCP server**
4. Enter the configuration

### Option 2: Configuration File

Cursor supports two configuration locations:

| Location | File | Scope |
|----------|------|-------|
| **Global** | `~/.cursor/mcp.json` | All projects |
| **Project** | `.cursor/mcp.json` | Current project only |

---

## Configuration

### URL Mode

Connect to an existing Kubeshark deployment:

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
    }
  }
}
```

### Proxy Mode

Let the CLI proxy into your cluster via kubectl:

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--kubeconfig", "/path/to/.kube/config"]
    }
  }
}
```

To enable cluster management operations (start/stop Kubeshark):

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--allow-destructive", "--kubeconfig", "/path/to/.kube/config"]
    }
  }
}
```

---

## Project-Specific Configuration

For team sharing, create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
    }
  }
}
```

<div class="callout callout-tip">

**Team sharing**: Commit `.cursor/mcp.json` to version control so your team automatically gets Kubeshark integration.

</div>

---

## Managing MCP Servers

Cursor provides CLI commands for MCP management:

```bash
# List configured MCP servers
/mcp list

# Enable a server
/mcp enable kubeshark

# Disable a server
/mcp disable kubeshark
```

---

## Example Prompts

Once connected, ask Cursor's AI:

> "What services are running in my Kubernetes cluster?"

> "Show me any HTTP 500 errors in the last hour."

> "Which pods are communicating with the payment service?"

> "Find the API calls that took longer than 500ms."

> "What's causing the latency between order-service and inventory-db?"

---

## Combining Network Data with Code

Since Cursor has access to both your codebase and Kubeshark's network data, you can ask questions that span both:

> "The payment-service is returning 503 errors. Find where the timeout is configured in the code."

> "Show me the API calls to stripe-gateway and find the retry logic in the codebase."

> "There's a slow query to postgres. Find the code that makes this query and suggest optimizations."

---

## Troubleshooting

### MCP server not appearing

- Verify the Kubeshark binary is in your PATH or use an absolute path
- Restart Cursor after adding the configuration
- Check the MCP panel in Cursor Settings for error messages

### Connection errors

```bash
# Test the binary directly
kubeshark mcp --list-tools --url https://kubeshark.example.com

# If using proxy mode, verify kubectl access
kubectl get pods -l app=kubeshark-hub
```

### Server not responding

- Ensure Kubeshark Hub is running and accessible
- If using `--url` mode, verify the URL is reachable
- Check that L7 dissection is enabled if you need API-level data

---

## What's Next

- [MCP CLI Reference](/en/mcp/cli) — All CLI options and modes
- [Conversational Debugging](/en/mcp/troubleshooting) — Investigation workflows
- [Autonomous Development](/en/mcp/autonomous_development) — Closed-loop coding with network feedback
- [How MCP Works](/en/mcp) — Technical details of the protocol
