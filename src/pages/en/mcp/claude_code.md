---
title: Claude Code Integration
description: Connect Kubeshark's MCP server to Claude Code for AI-powered Kubernetes network analysis in your terminal.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's agentic coding tool that runs in your terminal. By connecting Kubeshark's MCP server, you can query and analyze Kubernetes network traffic directly from your command line using natural language.

---

## Quick Start

The fastest way to add Kubeshark as an MCP server in Claude Code:

```bash
claude mcp add kubeshark -- kubeshark mcp
```

Then start Claude Code:

```bash
claude
```

Ask a question:

```
> What services are running in my cluster? Are there any errors?
```

---

## Configuration

Claude Code supports three scopes for MCP server configuration:

| Scope | Config File | Shared with Team | Available Across Projects |
|-------|-------------|------------------|---------------------------|
| **Local** (default) | `~/.claude.json` | No | No |
| **Project** | `.mcp.json` in project root | Yes (via git) | No |
| **User** | `~/.claude.json` | No | Yes |

### Option 1: CLI (Recommended)

```bash
claude mcp add kubeshark -- kubeshark mcp
```

#### Other Connection Options

```bash
# Connect to a specific URL
claude mcp add kubeshark -- kubeshark mcp --url https://kubeshark.example.com

# Explicit kubeconfig
claude mcp add kubeshark -- kubeshark mcp --kubeconfig ~/.kube/config

# Enable cluster management operations (start/stop Kubeshark)
claude mcp add kubeshark -- kubeshark mcp --allow-destructive
```

#### Scoping

Add `--scope` to control where the config is stored:

```bash
# Available across all your projects
claude mcp add --scope user kubeshark -- kubeshark mcp

# Shared with your team via git
claude mcp add --scope project kubeshark -- kubeshark mcp
```

### Option 2: Config File

You can also edit the config files directly.

#### Local / User Scope (`~/.claude.json`)

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/path/to/kubeshark",
      "args": ["mcp"]
    }
  }
}
```

#### Project Scope (`.mcp.json` in project root)

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

<div class="callout callout-tip">

**Team sharing**: The `.mcp.json` file is intended to be committed to version control, so your entire team gets Kubeshark integration automatically.

</div>

---

## Verifying the Connection

Once configured, verify that Claude Code can reach Kubeshark:

```bash
# Inside Claude Code, run the /mcp command to check server status
claude
> /mcp
```

This shows all configured MCP servers and their connection status. The Kubeshark server should appear as connected.

You can also list your configured servers from the terminal:

```bash
claude mcp list
```

---

## Managing the Server

```bash
# View Kubeshark MCP config details
claude mcp get kubeshark

# Remove the server
claude mcp remove kubeshark
```

---

## Example Session

```
+---------------------------------------------------------------------------------+
| Terminal - claude                                                                |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  $ claude                                                                       |
|                                                                                 |
|  > Are there any HTTP 500 errors in my cluster right now?                       |
|                                                                                 |
|  * Checking Kubeshark status...                                                 |
|  * Querying L7 API calls for 500 errors...                                      |
|                                                                                 |
|  I found 23 HTTP 500 errors in the last 5 minutes:                              |
|                                                                                 |
|  - 18 from payment-service -> stripe-gateway (timeout)                          |
|  - 3 from orders-service -> inventory-db (connection refused)                   |
|  - 2 from frontend -> auth-service (internal error)                             |
|                                                                                 |
|  The payment-service errors started at 14:22 UTC and correlate with             |
|  elevated TCP handshake RTT (P99: 450ms) to the stripe-gateway,                |
|  suggesting network-level issues.                                               |
|                                                                                 |
|  Want me to dig deeper into any of these?                                       |
|                                                                                 |
|  > Show me the L4 flows for payment-service                                     |
|                                                                                 |
|  * Querying L4 flows for payment-service...                                     |
|                                                                                 |
|  Active L4 flows for payment-service:                                           |
|                                                                                 |
|  1. payment-service -> stripe-gateway:443 (TCP)                                 |
|     Bytes: 2.1MB | Packets: 12,847 | RTT P50: 180ms | RTT P99: 450ms           |
|                                                                                 |
|  2. payment-service -> orders-db:5432 (TCP)                                     |
|     Bytes: 890KB | Packets: 5,231 | RTT P50: 0.9ms | RTT P99: 2.1ms            |
|                                                                                 |
|  The RTT to stripe-gateway is significantly elevated. Normal cross-AZ           |
|  RTT should be under 10ms. 450ms at P99 indicates a network path issue          |
|  or upstream congestion.                                                        |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

---

## Tips

- **Install AI skills** — Add [AI skills](/en/mcp/skills) for guided workflows like root cause analysis and traffic filtering: `/plugin marketplace add kubeshark/kubeshark`
- **Use natural language** — Ask questions like you would to a colleague: *"Why is the checkout service slow?"*
- **Follow up** — Claude Code maintains conversation context. Ask follow-up questions to drill into specific issues.
- **Combine with code** — Since Claude Code also has access to your codebase, you can ask it to correlate network issues with source code: *"The payment service is timing out. Can you find where the timeout is configured in the code?"*

---

## Troubleshooting

### Server not appearing in `/mcp`

- Verify the binary path is correct: run the command manually in your terminal
- Check config syntax: `claude mcp get kubeshark`
- Ensure the Kubeshark deployment is accessible from your machine

### Connection errors

```bash
# Test the binary directly
kubeshark mcp --list-tools

# If using proxy mode, verify kubectl access
kubectl get pods -l app=kubeshark-hub
```

### Tools not loading

- Confirm Kubeshark Hub is running and MCP is enabled
- If using `--url` mode, verify the URL is reachable: `curl https://kubeshark.example.com/api/mcp`
- Check that L7 dissection is enabled if you need API-level data

---

## What's Next

- [MCP Installation](/en/mcp/cli) — All CLI options and modes
- [MCP in Action](/en/mcp_in_action) — Full walkthrough of an AI-driven investigation
- [Use Cases](/en/mcp_use_cases) — Scenarios and example prompts
- [How MCP Works](/en/mcp) — Technical details of the protocol
