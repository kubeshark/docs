---
title: GitHub Copilot Integration
description: Connect Kubeshark's MCP server to GitHub Copilot for AI-powered Kubernetes network analysis in VS Code and GitHub.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

[GitHub Copilot](https://github.com/features/copilot) supports the Model Context Protocol (MCP), allowing you to connect Kubeshark and query Kubernetes network traffic using natural language directly from VS Code or the Copilot coding agent.

---

## VS Code (Copilot Chat)

### Option 1: Workspace Configuration

Create `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
    }
  }
}
```

This configuration is shared with your team when committed to version control.

### Option 2: User Configuration

For personal configuration across all projects, add to your VS Code settings (`settings.json`):

```json
{
  "mcp.servers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
    }
  }
}
```

<div class="callout callout-warning">

**Requires VS Code 1.99+** — MCP support is generally available starting from VS Code 1.102.

</div>

---

## Copilot Coding Agent (GitHub.com)

Configure MCP servers for the Copilot coding agent in your repository settings on GitHub.com.

Navigate to **Settings → Copilot → Coding agent** and add:

```json
{
  "type": "stdio",
  "command": "kubeshark",
  "args": ["mcp", "--url", "https://kubeshark.example.com"]
}
```

Supported transport types: `"local"`, `"stdio"`, `"http"`, or `"sse"`

<div class="callout callout-tip">

**Remote MCP servers**: Copilot coding agent supports remote MCP servers, allowing you to connect to Kubeshark deployments without local binary installation.

</div>

---

## Copilot CLI

If you're using [Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli), add Kubeshark with:

```bash
/mcp add kubeshark -- kubeshark mcp --url https://kubeshark.example.com
```

Configuration is saved to `~/.copilot` directory.

---

## Connection Modes

| Mode | Command | Use When |
|------|---------|----------|
| **URL Mode** | `kubeshark mcp --url <url>` | Kubeshark is already running and accessible |
| **Proxy Mode** | `kubeshark mcp --kubeconfig ~/.kube/config` | Let the CLI proxy into your cluster |

### Proxy Mode Example

```json
{
  "servers": {
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
  "servers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp", "--allow-destructive", "--kubeconfig", "/path/to/.kube/config"]
    }
  }
}
```

---

## Verifying the Connection

In VS Code with Copilot Chat, you can verify the MCP server is connected by checking the MCP status in the Copilot panel or running:

```
@workspace What MCP servers are available?
```

For Copilot CLI:

```bash
/mcp list
```

---

## Example Prompts

Once connected, try asking Copilot:

> "What services are running in my Kubernetes cluster?"

> "Show me any HTTP 500 errors in the last hour."

> "Which pods are communicating with the payment service?"

> "Find slow API calls with response times over 500ms."

---

## Enterprise Configuration

<div class="callout callout-warning">

**Admin approval may be required**: MCP in Copilot is disabled by default for organizations and enterprises. An administrator must enable the "MCP servers in Copilot" policy.

</div>

Administrators can:
- Enable/disable MCP for the organization
- Configure an MCP registry URL for approved servers
- Set access control policies for which servers developers can use

See [GitHub's MCP access documentation](https://docs.github.com/en/copilot/how-tos/administer-copilot/configure-mcp-server-access) for details.

---

## Troubleshooting

### MCP server not appearing

- Verify the Kubeshark binary is in your PATH or use an absolute path
- Check that VS Code version is 1.99 or later
- Restart VS Code after adding the configuration

### Connection errors

```bash
# Test the binary directly
kubeshark mcp --list-tools --url https://kubeshark.example.com

# If using proxy mode, verify kubectl access
kubectl get pods -l app=kubeshark-hub
```

### Organization restrictions

If you receive permission errors, contact your organization administrator to enable MCP servers in Copilot settings.

---

## What's Next

- [MCP CLI Reference](/en/mcp/cli) — All CLI options and modes
- [Conversational Debugging](/en/mcp/troubleshooting) — Investigation workflows
- [How MCP Works](/en/mcp) — Technical details of the protocol
