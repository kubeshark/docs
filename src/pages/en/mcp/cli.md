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

<div class="callout callout-tip">

**Gated Hub (`tap.auth.enabled: true`):** the MCP surface is gated on the `mcp:use` capability (granted to `kubeshark-admin`). In the default proxy mode (with kube access) the CLI mints and auto-renews a short-lived `kubeshark-cli` ServiceAccount token for you. In `--url` mode it can't mint one, so pass a token explicitly:

```bash
export KUBESHARK_HUB_TOKEN=$(kubectl create token kubeshark-cli --audience kubeshark-hub)
kubeshark mcp --url https://kubeshark.example.com --token "$KUBESHARK_HUB_TOKEN"
```

The `--url` token is short-lived and does **not** auto-renew — on a `401` the CLI tells you to re-mint and restart. This requires `tap.auth.cli.enabled: true` and your identity listed under `tap.auth.cli.subjects`. See [Roles & Permissions](/en/roles#cli-and-headless-credentials-on-a-gated-hub).

</div>

---

## CLI Options

| Option | Description |
|--------|-------------|
| `--url` | Connect directly to Kubeshark URL (no kubectl required) |
| `--token` | ServiceAccount / bearer token for a gated Hub in `--url` mode; also read from `KUBESHARK_HUB_TOKEN`. Mint with `kubectl create token kubeshark-cli --audience kubeshark-hub`. Ignored without `--url` (proxy mode mints and auto-renews the token from kube access). |
| `--kubeconfig` | Path to kubeconfig file |
| `--allow-destructive` | Enable start/stop Kubeshark operations |
| `--list-tools` | List available MCP tools and exit |

---

## What's Next

- [How MCP Works](/en/mcp) — Architecture and protocol details
- [MCP in Action](/en/mcp_in_action) — See AI-driven workflows in practice
- [AI Skills](/en/mcp/skills) — Open-source skills for specific workflows
