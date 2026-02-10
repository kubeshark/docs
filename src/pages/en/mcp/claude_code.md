---
title: Claude Code Integration
description: Connect Kubeshark's MCP server to Claude Code for AI-powered Kubernetes network analysis in your terminal.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

> **Coming Soon — V2.00:** MCP integration is coming as part of Kubeshark V2.00. [Read the announcement](https://kubeshark.com/post/kubeshark-v2-00-coming-soon).

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's agentic coding tool that runs in your terminal. By connecting Kubeshark's MCP server, you can query and analyze Kubernetes network traffic directly from your command line using natural language.

---

## Quick Start

The fastest way to add Kubeshark as an MCP server in Claude Code:

```bash
claude mcp add --transport stdio kubeshark -- \
  /path/to/kubeshark mcp --url https://kubeshark.example.com
```

Replace `/path/to/kubeshark` with the actual path to your Kubeshark binary, and the URL with your Kubeshark deployment.

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

#### URL Mode

Connect directly to an existing Kubeshark deployment:

```bash
claude mcp add --transport stdio kubeshark -- \
  /path/to/kubeshark mcp --url https://kubeshark.example.com
```

#### Proxy Mode

Let Kubeshark proxy into the cluster via kubectl:

```bash
claude mcp add --transport stdio kubeshark -- \
  /path/to/kubeshark mcp --kubeconfig ~/.kube/config
```

To enable cluster management operations (start/stop Kubeshark):

```bash
claude mcp add --transport stdio kubeshark -- \
  /path/to/kubeshark mcp --allow-destructive --kubeconfig ~/.kube/config
```

#### Scoping

Add `--scope` to control where the config is stored:

```bash
# Available across all your projects
claude mcp add --scope user --transport stdio kubeshark -- \
  /path/to/kubeshark mcp --url https://kubeshark.example.com

# Shared with your team via git
claude mcp add --scope project --transport stdio kubeshark -- \
  /path/to/kubeshark mcp --url https://kubeshark.example.com
```

### Option 2: Config File

You can also edit the config files directly.

#### Local / User Scope (`~/.claude.json`)

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/path/to/kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
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
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
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
/path/to/kubeshark mcp --list-tools --url https://kubeshark.example.com

# If using proxy mode, verify kubectl access
kubectl get pods -l app=kubeshark-hub
```

### Tools not loading

- Confirm Kubeshark Hub is running and MCP is enabled
- If using `--url` mode, verify the URL is reachable: `curl https://kubeshark.example.com/api/mcp`
- Check that L7 dissection is enabled if you need API-level data

---

## What's Next

- [MCP CLI Reference](/en/mcp/cli) — All CLI options and modes
- [MCP in Action](/en/mcp_in_action) — Full walkthrough of an AI-driven investigation
- [Use Cases](/en/mcp_use_cases) — Scenarios and example prompts
- [How MCP Works](/en/mcp) — Technical details of the protocol
