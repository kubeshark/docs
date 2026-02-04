---
title: MCP L4 Tools
description: Real-time L4 connectivity visibility through MCP endpoints for dependency mapping and traffic analysis.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

L4 flow endpoints provide **real-time, cluster-wide connectivity visibility** without requiring L7 API dissection—enabling dependency mapping and traffic analysis with minimal overhead.

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

### `/mcp/flows` — List L4 Flows

Returns L4 flows with filtering and aggregation options.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `aggregate` | string | Aggregation level: `pod`, `namespace`, `node`, `service` |
| `l4proto` | string | Protocol filter: `tcp`, `udp` |
| `ip` | string | Filter by IP address |
| `ns` | string | Filter by namespace |
| `pod` | string | Filter by pod name |
| `svc` | string | Filter by service name |
| `limit` | int | Maximum results to return |

**Example Request:**

```
GET /mcp/flows?ns=default&l4proto=tcp&limit=100
```

**Response:**

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

---

### `/mcp/flows/summary` — Connectivity Summary

Returns high-level statistics about cluster connectivity.

**Response:**

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

---

## Use Cases

### Dependency Discovery

**Example prompts:**

> *"What services does the frontend depend on?"*

> *"Generate a dependency graph for the checkout service"*

> *"Which pods communicate with the database?"*

The AI can use `/mcp/flows` to map all upstream and downstream connections for any workload.

### Security Auditing

**Example prompts:**

> *"Show all cross-namespace traffic"*

> *"What's connecting to the secrets-manager service?"*

> *"Are there any unexpected connections to sensitive namespaces?"*

Cross-namespace flows often represent security boundaries—L4 data reveals these connections instantly.

### Traffic Analysis

**Example prompts:**

> *"Which connections use the most bandwidth?"*

> *"Top 10 flows by packet rate"*

> *"How much traffic is going to external IPs?"*

Flow statistics include bytes, packets, and rates—useful for capacity planning and cost analysis.

### Active Workload Discovery

**Example prompts:**

> *"Which pods are actively communicating right now?"*

> *"What namespaces have traffic flowing?"*

> *"Is the payment-service receiving any connections?"*

L4 flows show **active** connections, not just running pods—revealing what's actually in use.

---

## What AI Can Derive from Flows

From raw L4 flow data, LLMs can derive:

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

Each flow contains detailed endpoint information:

```
Flow
├── proto: "tcp" | "udp"
├── client
│   ├── ip: string
│   ├── pod: string
│   ├── ns: string (namespace)
│   ├── svc: string (service name)
│   └── node: string
├── server
│   ├── ip: string
│   ├── port: number
│   ├── pod: string
│   ├── ns: string
│   ├── svc: string
│   └── node: string
├── client_stats
│   ├── tx_pkts: number
│   ├── rx_pkts: number
│   ├── tx_bytes: number
│   └── rx_bytes: number
├── server_stats
│   └── (same as client_stats)
└── totals
    ├── pkts: number
    ├── bytes: number
    ├── pps: number (packets per second)
    └── bps: number (bits per second)
```

---

## What's Next

- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
- [L4/L7 Workload Map](/en/v2/service_map) — Visualize service dependencies
- [Use Cases](/en/mcp_use_cases) — More AI-powered analysis scenarios
