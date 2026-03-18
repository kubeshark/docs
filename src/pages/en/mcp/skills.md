---
title: AI Skills
description: Install and use Kubeshark AI skills for network root cause analysis and traffic filtering with Claude Code and other AI agents.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

AI skills teach your AI agent how to use Kubeshark's MCP tools for specific workflows like root cause analysis, traffic filtering, and forensic investigation. Skills use the open [Agent Skills](https://github.com/anthropics/skills) format and work with Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor, and other compatible agents.

---

## Available Skills

| Skill | Description |
|-------|-------------|
| `network-rca` | Network Root Cause Analysis. Retrospective traffic analysis via snapshots, with two investigation routes: **PCAP** (for Wireshark/compliance) and **Dissection** (for AI-driven API-level investigation). |
| `kfl` | KFL2 (Kubeshark Filter Language) expert. Complete reference for writing, debugging, and optimizing CEL-based traffic filters across all supported protocols. Background skill — loads automatically when filters are needed. |

---

## Prerequisites

Skills require the Kubeshark MCP server and CLI:

```bash
# Install the CLI
brew install kubeshark

# Add the MCP server (Claude Code)
claude mcp add kubeshark -- kubeshark mcp
```

For other AI assistants, see the [MCP Installation](/en/mcp/cli) page.

---

## Installation

### Option 1: Claude Code Plugin (Recommended)

Install as a Claude Code plugin directly from GitHub:

```
/plugin marketplace add kubeshark/kubeshark
/plugin install kubeshark
```

Skills appear as `/kubeshark:network-rca` and `/kubeshark:kfl`. The plugin also bundles the MCP configuration automatically.

### Option 2: Clone and Run

Clone the Kubeshark repo and start Claude Code from within it — skills trigger automatically:

```bash
git clone https://github.com/kubeshark/kubeshark
cd kubeshark
claude
```

### Option 3: Manual Installation

Clone the repo and symlink or copy the skills into your Claude Code skills directory:

```bash
git clone https://github.com/kubeshark/kubeshark
mkdir -p ~/.claude/skills

# Symlink (recommended — stays in sync with the repo)
ln -s $PWD/kubeshark/skills/network-rca ~/.claude/skills/network-rca
ln -s $PWD/kubeshark/skills/kfl ~/.claude/skills/kfl
```

Or copy into your project for project-scoped skills:

```bash
mkdir -p .claude/skills
cp -r kubeshark/skills/network-rca .claude/skills/
cp -r kubeshark/skills/kfl .claude/skills/
```

Or copy to your home directory for personal use across all projects:

```bash
cp -r kubeshark/skills/network-rca ~/.claude/skills/
cp -r kubeshark/skills/kfl ~/.claude/skills/
```

---

## Usage

Once installed, skills activate based on your conversation context. You can also invoke them explicitly.

### Network RCA

Use the `network-rca` skill for investigating past incidents, taking snapshots, extracting PCAPs, and comparing traffic patterns:

```
> Figure out what caused the 500 errors in the checkout service yesterday

> Take a snapshot of current traffic and compare it with yesterday's baseline

> Extract a PCAP of all traffic to the payments service in the last hour
```

The skill guides your AI agent through two investigation routes:

- **PCAP Route** — No dissection needed. Uses BPF filters, exports raw PCAP files for Wireshark analysis or compliance workflows.
- **Dissection Route** — Enables L7 dissection on snapshots for indexed, AI-driven API-level queries using KFL.

### KFL (Filter Language)

The `kfl` skill loads automatically when filters are needed. It provides complete KFL2 syntax reference, including:

- All supported protocols (HTTP, gRPC, DNS, Redis, Kafka, AMQP, and more)
- CEL operators and string/collection functions
- Kubernetes-aware filtering (by namespace, pod, service, labels)
- Time-based and L4 connection filters

Example filters the skill helps construct:

```
# HTTP 500 errors from a specific service
http && response.status == 500 && src.pod.name.matches("payment-.*")

# DNS queries to external domains
dns && !dst.namespace.exists()

# Slow API calls (over 1 second)
http && response.latency > 1000
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
|  > We had a production incident at 3am. Can you investigate what happened       |
|    with the orders service?                                                     |
|                                                                                 |
|  [network-rca skill activates]                                                  |
|                                                                                 |
|  * Checking Kubeshark status and available snapshots...                         |
|  * Found snapshot from 02:00-04:00 UTC window                                  |
|  * Enabling dissection on the snapshot...                                       |
|  * Querying for orders-service errors...                                        |
|                                                                                 |
|  I found the root cause. Here's the timeline:                                   |
|                                                                                 |
|  02:47 — orders-service started receiving connection refused from               |
|           inventory-db:5432. TCP RST packets confirm the database               |
|           stopped accepting connections.                                        |
|                                                                                 |
|  02:47-03:12 — 847 HTTP 500s from orders-service, all correlating              |
|                with failed DB connections (0 successful queries).               |
|                                                                                 |
|  03:12 — inventory-db connections restored. Errors stopped.                     |
|                                                                                 |
|  The incident was caused by a 25-minute database outage. Want me to             |
|  extract the PCAP for the incident window?                                      |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

---

## What's Next

- [MCP Installation](/en/mcp/cli) — Install and configure the MCP server
- [Claude Code Integration](/en/mcp/claude_code) — Set up Claude Code with Kubeshark
- [Use Cases](/en/mcp_use_cases) — Scenarios and example prompts
- [L7 Tools Reference](/en/mcp/l7_tools) — L7 API traffic analysis tools
