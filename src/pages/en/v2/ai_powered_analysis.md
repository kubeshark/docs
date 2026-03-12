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
- Trigger [dissection](/en/v2/l7_api_delayed) to index traffic into queryable records
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

## What's Next

- [AI Assistant - Getting Started](/en/mcp_use_cases) — Connect your AI tools
- [Conversational Debugging](/en/mcp/troubleshooting) — Deep dive investigation
- [Autonomous Development](/en/mcp/autonomous_development) — Closed-loop coding
- [How MCP Works](/en/mcp) — Technical details
