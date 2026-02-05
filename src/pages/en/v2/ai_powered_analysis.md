---
title: AI-Powered Analysis
description: Query network data using natural language through AI assistants.
layout: ../../../layouts/MainLayout.astro
---

Kubeshark exposes network data to AI assistants via the **Model Context Protocol (MCP)**, enabling natural language queries across your traffic.

---

## What MCP Enables

| Capability | Description |
|------------|-------------|
| Natural language queries | Ask questions instead of writing filters |
| AI-driven investigation | Pattern detection, root cause analysis |
| Closed-loop development | AI coding tools verify code via network behavior |
| Full Kubernetes context | Every query includes pod, service, namespace |

---

## How It Works

```
+------------------+                     +------------------+
|                  |    MCP Protocol     |                  |
|  AI Assistant    | <-----------------> |    Kubeshark     |
|  (Claude, etc.)  |                     |                  |
+------------------+                     +------------------+
                                                  |
                                                  v
                                         +------------------+
                                         |   Network Data   |
                                         |  (L4/L7, PCAP)   |
                                         +------------------+
```

AI assistants connect to Kubeshark's MCP server and can:
- Query L7 API calls with filters
- Analyze L4 connection flows
- Create and manage traffic snapshots
- Run delayed dissection on captured traffic
- Start/stop Kubeshark in the cluster

---

## Example Queries

| Use Case | Example Prompt |
|----------|----------------|
| Incident investigation | "Show me failed requests to payment-service in the last hour" |
| Architecture discovery | "Map out how services communicate" |
| Security analysis | "Find requests without authentication headers" |
| Performance debugging | "Why is checkout slow? Where is time spent?" |

---

## Integration with Core Concepts

AI-powered analysis builds on Kubeshark's core capabilities:

| Core Concept | AI Integration |
|--------------|----------------|
| [Raw Capture](/en/v2/raw_capture) | AI can query data boundaries and create snapshots |
| [Traffic Snapshots](/en/v2/traffic_snapshots) | AI creates and manages snapshots for analysis |
| [Real-time Dissection](/en/v2/l7_api_realtime) | AI queries live API traffic |
| [Delayed Dissection](/en/v2/l7_api_delayed) | AI triggers dissection and queries results |

---

## What's Next

- [AI Integration - Introduction](/en/mcp_use_cases) — Use cases and capabilities
- [How MCP Works](/en/mcp) — Technical details
- [MCP CLI](/en/mcp/cli) — Connect AI assistants to Kubeshark
