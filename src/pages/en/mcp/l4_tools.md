---
title: MCP L4 Tools
description: Real-time L4 connectivity visibility through MCP tools for dependency mapping and traffic analysis.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubeshark's MCP server exposes **L4 flow tools** that provide real-time, cluster-wide connectivity visibility without requiring L7 API dissection—enabling dependency mapping and traffic analysis with minimal overhead.

---

## Prerequisites

| Requirement | Status |
|-------------|--------|
| Kubeshark running | Required |
| Raw capture enabled | Not required |
| L7 dissection enabled | Not required |

L4 flows are available with a basic Kubeshark installation—no additional features need to be enabled. This makes them the lowest-overhead option for connectivity visibility.

---

## What are L4 Flows?

A **flow** is an L4 connection between two peers (TCP or UDP). Unlike L7 API dissection which reconstructs full HTTP/gRPC requests, L4 flows show:

- **Who is talking to whom** — Pod-to-pod, service-to-service connections
- **Connection statistics** — Bytes, packets, rates
- **Transport protocol** — TCP or UDP
- **Real-time state** — Currently active connections

This provides a lightweight way to understand cluster connectivity patterns without the overhead of full payload dissection.

---

## When to Use L4 vs L7

| Use Case | L4 Flows | L7 Dissection |
|----------|----------|---------------|
| Dependency mapping | Ideal | Overkill |
| "What's connected to X?" | Ideal | Overkill |
| Bandwidth analysis | Ideal | Not available |
| API payload inspection | Not available | Required |
| Request/response debugging | Not available | Required |
| Latency analysis | Basic | Detailed |

**Rule of thumb**: Use L4 for connectivity questions, L7 for content questions.

---

## MCP Endpoints

Kubeshark exposes the following L4 endpoints via MCP:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/flows` | GET | List L4 flows with filtering and aggregation |
| `/mcp/flows/summary` | GET | Get high-level connectivity summary |

---

## Endpoint: `/mcp/flows`

Returns L4 flows with filtering and aggregation options.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `aggregate` | string | Aggregation level: `pod`, `namespace`, `node`, `service` |
| `l4proto` | string | Protocol filter: `tcp`, `udp` |
| `ip` | string | Filter by IP address |
| `ns` | string | Filter by namespace |
| `pod` | string | Filter by pod name |
| `svc` | string | Filter by service name |
| `limit` | int | Max results to return |

### Response

```json
{
  "flows": [
    {
      "proto": "tcp",
      "client": {
        "ip": "10.0.0.1",
        "pod": "frontend-abc123",
        "ns": "default",
        "svc": "frontend",
        "node": "node-1"
      },
      "server": {
        "ip": "10.0.0.2",
        "port": 8080,
        "pod": "backend-xyz789",
        "ns": "default",
        "svc": "backend",
        "node": "node-2"
      },
      "client_stats": {
        "tx_pkts": 1000,
        "rx_pkts": 800,
        "tx_bytes": 102400,
        "rx_bytes": 81920
      },
      "server_stats": {
        "tx_pkts": 800,
        "rx_pkts": 1000,
        "tx_bytes": 81920,
        "rx_bytes": 102400
      },
      "totals": {
        "pkts": 3600,
        "bytes": 368640,
        "pps": 100.5,
        "bps": 8388608
      }
    }
  ],
  "total": 42,
  "truncated": false
}
```

### Example Requests

```
GET /mcp/flows?ns=default&l4proto=tcp
→ "Show me all TCP flows in the default namespace"

GET /mcp/flows?pod=frontend&aggregate=service
→ "What services is the frontend talking to?"

GET /mcp/flows?limit=100
→ "Show me the first 100 flows"
```

---

## Endpoint: `/mcp/flows/summary`

Returns high-level statistics about cluster connectivity.

### Query Parameters

None required.

### Response

```json
{
  "total_flows": 150,
  "tcp_flows": 120,
  "udp_flows": 30,
  "total_bytes": 10485760,
  "total_pkts": 50000,
  "unique_clients": 25,
  "unique_servers": 10,
  "top_by_bytes": [
    {
      "client_pod": "frontend-abc123",
      "server_pod": "backend-xyz789",
      "bytes": 1048576
    }
  ],
  "top_by_pkts": [
    {
      "client_pod": "frontend-abc123",
      "server_pod": "backend-xyz789",
      "pkts": 10000
    }
  ],
  "by_namespace": {
    "default": 50,
    "kube-system": 30,
    "monitoring": 20
  },
  "cross_namespace": [
    {
      "src_ns": "default",
      "dst_ns": "monitoring",
      "flows": 5,
      "bytes": 1024
    }
  ]
}
```

### Example Requests

```
GET /mcp/flows/summary
→ "Give me an overview of cluster connectivity"
→ "What namespaces have cross-namespace traffic?" (check cross_namespace field)
→ "Which connections use the most bandwidth?" (check top_by_bytes field)
```

---

## Use Cases

### Dependency Discovery

> *"What services does the frontend depend on?"*

> *"Generate a dependency graph for the checkout service"*

> *"Which pods communicate with the database?"*

The AI uses `/mcp/flows` to map all upstream and downstream connections for any workload.

### Security Auditing

> *"Show all cross-namespace traffic"*

> *"What's connecting to the secrets-manager service?"*

> *"Are there any unexpected connections to sensitive namespaces?"*

Cross-namespace flows often represent security boundaries—L4 data reveals these connections instantly.

### Traffic Analysis

> *"Which connections use the most bandwidth?"*

> *"Top 10 flows by packet rate"*

> *"How much traffic is going to external IPs?"*

Flow statistics include bytes, packets, and rates—useful for capacity planning and cost analysis.

### Active Workload Discovery

> *"Which pods are actively communicating right now?"*

> *"What namespaces have traffic flowing?"*

> *"Is the payment-service receiving any connections?"*

L4 flows show **active** connections, not just running pods—revealing what's actually in use.

---

## What AI Can Derive

From L4 flow data, AI assistants can derive:

| Insight | How |
|---------|-----|
| **Active pods** | Unique pods appearing in client/server fields |
| **Active services** | Unique services with traffic |
| **Active namespaces** | Namespaces with communicating pods |
| **Idle pods** | Compare flow data with pod list—pods with no flows |
| **Dependency graph** | Map all upstream/downstream connections |
| **Traffic hotspots** | Sort by bytes/packets to find high-volume paths |
| **External egress** | Flows where server IP is outside cluster CIDR |

---

## Data Structure Reference

### Flow Object

| Field | Type | Description |
|-------|------|-------------|
| `proto` | string | Transport protocol: `tcp` or `udp` |
| `client` | Endpoint | Client-side connection info |
| `server` | Endpoint | Server-side connection info |
| `client_stats` | Stats | Traffic statistics from client perspective |
| `server_stats` | Stats | Traffic statistics from server perspective |
| `totals` | Totals | Aggregated statistics |

### Endpoint Object

| Field | Type | Description |
|-------|------|-------------|
| `ip` | string | IP address |
| `port` | integer | Port number (server only) |
| `pod` | string | Kubernetes pod name |
| `ns` | string | Kubernetes namespace |
| `svc` | string | Kubernetes service name |
| `node` | string | Kubernetes node name |

### Stats Object

| Field | Type | Description |
|-------|------|-------------|
| `tx_pkts` | integer | Transmitted packets |
| `rx_pkts` | integer | Received packets |
| `tx_bytes` | integer | Transmitted bytes |
| `rx_bytes` | integer | Received bytes |

### Totals Object

| Field | Type | Description |
|-------|------|-------------|
| `pkts` | integer | Total packets |
| `bytes` | integer | Total bytes |
| `pps` | float | Packets per second |
| `bps` | float | Bits per second |

---

## What's Next

- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
- [L4/L7 Workload Map](/en/v2/service_map) — Visualize service dependencies
- [Use Cases](/en/mcp_use_cases) — More AI-powered analysis scenarios
