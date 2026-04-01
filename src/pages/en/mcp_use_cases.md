---
title: AI Integration
description: Connect AI agents to Kubeshark via MCP to query, analyze, and investigate Kubernetes network traffic using natural language.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark exposes cluster-wide network data to AI agents via **MCP (Model Context Protocol)** — enabling them to query traffic, investigate API calls, and perform root cause analysis through natural language.

Works with Claude Code, Cursor, and any MCP-compatible AI.

```bash
brew install kubeshark
claude mcp add kubeshark -- kubeshark mcp
```

[Full installation instructions →](/en/mcp/cli)

---

## Example: AI-Driven Investigation

A developer gets paged — checkout latency has spiked. Instead of diving into dashboards and logs, they ask their AI assistant:

```
> What can you tell me about my frontend service?

  * Creating snapshot from last 1 hour of traffic...
  * Running L7 protocol indexing...
  * Querying API calls (12,847 found)...

  Based on analyzing 12,847 API calls over the last hour:

  Healthy:
    - Overall latency is good (45ms P50)
    - TCP connection establishment is fast (< 5ms)
    - Most endpoints return success (97.7% 2xx responses)

  Needs Attention:
    1. Checkout failures — 2.3% of /api/v1/checkout return 503
    2. Retry storms — cart-service retrying 3x within 100ms
    3. Connection churn — 847 new connections/min to catalogue-db

> Tell me more about those checkout 503 errors.

  I examined all 127 failed checkout requests:

  Pattern: All 503 errors occur when payment-service response time
  exceeds 5 seconds (your configured timeout).

  Root cause: payment-service makes synchronous calls to an external
  payment gateway. When the gateway is slow (P99: 4.8s), requests
  stack up and exhaust the connection pool.

  Timeline:
    14:22:58  Gateway latency: 200ms -> 4.2s
    14:23:15  First 503 from payment-service
    14:23:45  Connection pool exhausted (TCP RST packets observed)

  Recommendation: Add circuit breaker on payment-service's gateway
  calls, or increase connection pool with shorter timeouts.
```

### Behind the Scenes

The AI agent uses MCP tools to autonomously:

1. Check what raw capture data is available across nodes
2. Create a snapshot isolating the relevant time window
3. Run delayed indexing to parse L7 protocols
4. Query the indexed traffic with KFL filters
5. Analyze patterns and anomalies across thousands of API calls

---

## What AI Agents Can Do

Through MCP, AI agents get tools to:

- Query L4 flows and L7 API calls cluster-wide
- Create [snapshots](/en/v2/traffic_snapshots) from any point in time
- Run [delayed indexing](/en/v2/l7_api_dissection#delayed-indexing) to make traffic queryable
- Filter by service, endpoint, status code, latency, or any Kubernetes identity
- Drill into specific API calls for full request/response payloads
- Export filtered PCAPs for archival or Wireshark analysis
- Access [TCP Expert Insights](/en/mcp/tcp_insights) — retransmissions, RTT, jitter, connection lifecycle

---

## How MCP Works

**MCP (Model Context Protocol)** is an open standard for connecting AI assistants to external data sources. Any AI that supports MCP can interact with Kubeshark.

```
+------------------+                     +------------------+
|                  |    MCP Protocol     |                  |
|  AI Assistant    | <-----------------> |  Kubeshark MCP   |
|  (Claude, etc.)  |   (JSON-RPC 2.0)    |     Server       |
|                  |                     |                  |
+------------------+                     +--------+---------+
                                                  |
                                                  v
                                         +------------------+
                                         |   Kubernetes     |
                                         |  Network Data    |
                                         |  (L4/L7, PCAP)   |
                                         +------------------+
```

The MCP server exposes tools dynamically from the Kubeshark Hub. AI agents discover available tools at runtime and use them to query indexed traffic, create snapshots, export PCAPs, and more.

Use `kubeshark mcp --list-tools` to see all available tools.

---

## What's Next

- [Installation](/en/mcp/cli) — Install and connect your AI assistant
- [AI-Driven Workflows](/en/v2/ai_powered_analysis) — Deeper look at AI capabilities
- [AI Skills](/en/mcp/skills) — Open-source skills for specific workflows
- [KFL Reference](/en/v2/kfl2) — Query language syntax
