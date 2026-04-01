---
title: AI-Driven Workflows
description: Kubeshark delivers AI-optimized network data to power incident response, root cause analysis, and security workflows.
layout: ../../../layouts/MainLayout.astro
---

Network traffic is the richest source of information in a Kubernetes cluster, but raw packet data is too large and too expensive in tokens for AI agents to process.

Kubeshark indexes, structures, and enriches network data with full Kubernetes context, then exposes it to AI agents via [MCP](/en/mcp). AI agents can slice and dice cluster-wide traffic at a reasonable token cost — powering [incident response](/en/use-cases/incident_response) and [root cause analysis](/en/use-cases/forensics) workflows capable of processing 10x the traffic in 1/10th the time.

---

## AI Agent New Skills

Through MCP, AI agents get tools to:

- Query L4 flows and L7 API calls cluster-wide
- Create [snapshots](/en/dashboard_snapshots) from any point in time
- Trigger [indexing](/en/v2/l7_api_dissection#delayed-indexing) to index traffic into queryable records
- Filter by service, endpoint, status code, latency, or any Kubernetes identity
- Drill into specific API calls for full request/response payloads
- Export filtered PCAPs for archival or Wireshark analysis
- Access [TCP Expert Insights](/en/mcp/tcp_insights) — retransmissions, RTT, jitter, connection lifecycle

---

## Example Prompts

> *"The checkout flow failed at 2:15 PM. Find all API calls to payment services and identify what went wrong."*

> *"Find API calls without Authorization headers that should have them."*

> *"Show TCP flows with handshake times over 10ms. Which connections have network latency?"*

> *"Export traffic to payment-gateway between 3-4 PM yesterday for the security team."*

---

## Works With Your Tools

| Tool | Use Case |
|------|----------|
| **Claude Desktop** | Interactive troubleshooting |
| **Claude Code** | Terminal-based debugging |
| **Cursor** | AI coding with network feedback |
| **VS Code + Continue** | IDE-integrated analysis |

---

## Get Started

```bash
claude mcp add kubeshark -- kubeshark mcp
```

---

## AI Skills

AI Skills are open-source, reusable instructions that teach AI agents how to use Kubeshark's MCP tools for specific workflows. Skills follow the open [Agent Skills](https://github.com/anthropics/skills) format and work with Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor, and other compatible agents.

| Skill | Description |
|-------|-------------|
| [`network-rca`](https://github.com/kubeshark/kubeshark/tree/master/skills/network-rca) | Network Root Cause Analysis — retrospective traffic analysis via snapshots, with PCAP export (for Wireshark/compliance) and delayed indexing (for AI-driven API-level investigation) |
| [`kfl`](https://github.com/kubeshark/kubeshark/tree/master/skills/kfl) | KFL2 (Kubeshark Filter Language) expert — complete reference for writing, debugging, and optimizing traffic filters across all supported protocols |

**Planned skills:**
- `api-security` — OWASP API Top 10 assessment against live or snapshot traffic
- `incident-response` — 7-phase forensic incident investigation methodology
- `network-engineering` — Real-time traffic analysis, latency debugging, dependency mapping

More skills coming soon. See the [skills repository](https://github.com/kubeshark/kubeshark/tree/master/skills) for installation instructions and contributing guidelines.

[AI Skills documentation →](/en/mcp/skills)

---

## What's Next

- [AI Integration - Introduction](/en/mcp_use_cases) — Connect your AI tools
- [MCP in Action](/en/mcp_in_action) — See AI-driven workflows in practice
- [How MCP Works](/en/mcp) — Technical details
- [AI Skills](/en/mcp/skills) — Open-source skills for specific workflows
