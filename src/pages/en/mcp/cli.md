---
title: MCP Installation
description: Install and configure Kubeshark's MCP server for AI assistant integration.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

## Install

```bash
brew install kubeshark
```

Or download from [GitHub Releases](https://github.com/kubeshark/kubeshark/releases/latest).

---

## Connect an AI Agent

**Claude Code:**

```bash
claude mcp add kubeshark -- kubeshark mcp
```

**Cursor / VS Code:** Add to your MCP configuration:

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

**Without kubectl access** (connect directly to an existing deployment):

```bash
claude mcp add kubeshark -- kubeshark mcp --url https://kubeshark.example.com
```

---

## CLI Options

| Option | Description |
|--------|-------------|
| `--url` | Connect directly to Kubeshark URL (no kubectl required) |
| `--kubeconfig` | Path to kubeconfig file |
| `--allow-destructive` | Enable start/stop Kubeshark operations |
| `--list-tools` | List available MCP tools and exit |

---

## What's Next

- [How MCP Works](/en/mcp) — Architecture and protocol details
- [MCP in Action](/en/mcp_in_action) — See AI-driven workflows in practice
- [AI Skills](/en/mcp/skills) — Open-source skills for specific workflows
