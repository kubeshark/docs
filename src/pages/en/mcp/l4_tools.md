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
- **Network health metrics** — TCP handshake RTT (connection establishment timing)

This provides a lightweight way to understand cluster connectivity patterns without the overhead of full payload dissection.

---

## When to Use L4 vs L7

| Use Case | L4 Flows | L7 Dissection |
|----------|----------|---------------|
| Dependency mapping | Ideal | Overkill |
| "What's connected to X?" | Ideal | Overkill |
| Bandwidth analysis | Ideal | Not available |
| Network health (TCP RTT) | Ideal | Not available |
| API payload inspection | Not available | Required |
| Request/response debugging | Not available | Required |
| Application latency | Not available | Required |

**Rule of thumb**: Use L4 for connectivity and network health questions, L7 for content and application behavior questions.

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
| `format` | string | Response format: `compact` (default), `full`, `raw` |
| `aggregate` | string | Aggregation level: `pod`, `namespace`, `node`, `service` |
| `l4proto` | string | Protocol filter: `tcp`, `udp` |
| `ip` | string | Filter by IP address |
| `ns` | string | Filter by namespace |
| `pod` | string | Filter by pod name |
| `svc` | string | Filter by service name |
| `limit` | int | Max results to return |

### Response Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| `compact` | LLM-optimized with totals (default) | AI queries, dependency mapping |
| `full` | All fields including `cgroup_id`, `container_id`, raw rates | Detailed debugging, container correlation |
| `raw` | Direct `IPIPPortEntry` from workers | Low-level analysis, original field names |

### Response (format=compact, default)

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
        "rx_bytes": 81920,
        "tcp_handshake_p50_us": 1250,
        "tcp_handshake_p90_us": 2100,
        "tcp_handshake_p99_us": 4500
      },
      "server_stats": {
        "tx_pkts": 800,
        "rx_pkts": 1000,
        "tx_bytes": 81920,
        "rx_bytes": 102400,
        "tcp_handshake_p50_us": 1180,
        "tcp_handshake_p90_us": 1950,
        "tcp_handshake_p99_us": 4200
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

### Response (format=full)

Includes additional fields for detailed debugging:

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
        "node": "node-1",
        "container_id": "abc123def456",
        "cgroup_id": 12345
      },
      "server": {
        "ip": "10.0.0.2",
        "port": 8080,
        "pod": "backend-xyz789",
        "ns": "default",
        "svc": "backend",
        "node": "node-2",
        "container_id": "xyz789ghi012",
        "cgroup_id": 67890
      },
      "client_stats": {
        "tx_pkts": 1000,
        "rx_pkts": 800,
        "tx_bytes": 102400,
        "rx_bytes": 81920,
        "tx_pps": 50.5,
        "rx_pps": 40.2,
        "tx_bps": 4096000,
        "rx_bps": 3276800,
        "timestamp": "2025-01-15T10:30:00Z",
        "tcp_handshake_p50_us": 1250,
        "tcp_handshake_p90_us": 2100,
        "tcp_handshake_p99_us": 4500
      },
      "server_stats": { ... },
      "totals": { ... }
    }
  ],
  "total": 42,
  "truncated": false
}
```

### Response (format=raw)

Returns the original `IPIPPortEntry` structure from workers with native field names.

### Example Requests

```
GET /mcp/flows?ns=default&l4proto=tcp
→ "Show me all TCP flows in the default namespace"

GET /mcp/flows?pod=frontend&aggregate=service
→ "What services is the frontend talking to?"

GET /mcp/flows?format=full&pod=backend
→ "Show detailed flow info including container IDs for backend"

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

### Network Health Analysis

> *"Show me TCP flows with handshake times over 10ms"*

> *"Which connections have elevated network latency?"*

> *"Compare TCP handshake times across availability zones"*

TCP handshake RTT metrics reveal network-level issues that application metrics miss.

---

## TCP Handshake RTT

For TCP flows, Kubeshark captures **TCP handshake timing**—the time to complete the 3-way handshake (SYN → SYN-ACK → ACK). This is a direct measure of network round-trip time.

### What It Measures

| Perspective | Measurement |
|-------------|-------------|
| **Client** | Time from sending SYN to receiving SYN-ACK |
| **Server** | Time from receiving SYN to receiving ACK |

Both represent the network RTT to the peer—useful for detecting network latency and congestion.

### Fields

| Field | Description |
|-------|-------------|
| `tcp_handshake_p50_us` | 50th percentile (median) handshake time in microseconds |
| `tcp_handshake_p90_us` | 90th percentile handshake time in microseconds |
| `tcp_handshake_p99_us` | 99th percentile handshake time in microseconds |

### Interpretation Guide

| Handshake Time | Interpretation |
|----------------|----------------|
| **< 1ms** (< 1000 µs) | Excellent — same-node or same-datacenter |
| **1-10ms** (1000-10000 µs) | Good — typical cross-node within cluster |
| **10-100ms** (10000-100000 µs) | Elevated — possible network congestion or cross-AZ traffic |
| **> 100ms** (> 100000 µs) | High latency — cross-region or network issues |

### Problems It Solves

| Problem | How TCP Handshake RTT Helps |
|---------|----------------------------|
| **"Is it the network or the app?"** | Fast handshake + slow response = app issue. Slow handshake = network issue. |
| **Cross-AZ traffic detection** | Connections crossing availability zones show 2-10x higher RTT |
| **Network congestion** | P99 spikes during peak traffic reveal saturated paths |
| **Node-specific issues** | One node with high RTT to everything = node networking problem |
| **Intermittent timeouts** | High P99 with normal P50 = occasional network hiccups |
| **CNI/overlay issues** | Kubernetes networking misconfigurations add measurable latency |

### Example Prompts

**Debugging slowness:**
> *"The checkout service is slow. Is it a network issue or application issue?"*

**Infrastructure planning:**
> *"Are we paying a latency penalty for cross-AZ database connections?"*

**Incident investigation:**
> *"Users report intermittent timeouts to the payment service. What's causing it?"*

**Capacity planning:**
> *"Which network paths are congested during peak hours?"*

**Node troubleshooting:**
> *"Pod X is slower than other replicas connecting to the database. Why?"*

**Security/compliance:**
> *"Is sensitive data staying within our primary availability zone?"*

### Quick Decision Tree

```
Slow service?
├── TCP handshake < 5ms → Network is fine, investigate app
├── TCP handshake 10-50ms → Possible cross-AZ, check node placement
├── TCP handshake > 50ms → Network issue, check:
│   ├── Is it one source pod? → Node issue
│   ├── Is it one destination? → Target overloaded
│   └── Is it everywhere? → Cluster network issue
```

### Example: Detecting Network Issues

```json
{
  "proto": "tcp",
  "client": {
    "pod": "frontend-abc123",
    "ns": "default",
    "node": "node-1"
  },
  "server": {
    "pod": "database-xyz789",
    "ns": "data",
    "node": "node-3"
  },
  "client_stats": {
    "tcp_handshake_p50_us": 45000,
    "tcp_handshake_p90_us": 78000,
    "tcp_handshake_p99_us": 120000
  }
}
```

This flow shows **elevated handshake times** (P50: 45ms, P99: 120ms). Possible causes:
- Nodes in different availability zones
- Network congestion between nodes
- Overloaded target node

<div class="callout callout-tip">

**Tip**: Compare handshake times for connections to the same destination from different source pods. If only some sources show high latency, the issue is likely node-specific or path-specific.

</div>

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
| **Network latency** | TCP handshake RTT reveals network health |
| **Congested paths** | High P99 handshake times indicate congestion |
| **Cross-AZ traffic** | Elevated RTT between nodes in different zones |

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

| Field | Type | Format | Description |
|-------|------|--------|-------------|
| `ip` | string | all | IP address |
| `port` | integer | all | Port number (server only) |
| `pod` | string | all | Kubernetes pod name |
| `ns` | string | all | Kubernetes namespace |
| `svc` | string | all | Kubernetes service name |
| `node` | string | all | Kubernetes node name |
| `container_id` | string | full | Container ID |
| `cgroup_id` | integer | full | Cgroup ID |

### Stats Object

| Field | Type | Format | Description |
|-------|------|--------|-------------|
| `tx_pkts` | integer | all | Transmitted packets |
| `rx_pkts` | integer | all | Received packets |
| `tx_bytes` | integer | all | Transmitted bytes |
| `rx_bytes` | integer | all | Received bytes |
| `tx_pps` | float | full | TX packets per second |
| `rx_pps` | float | full | RX packets per second |
| `tx_bps` | float | full | TX bits per second |
| `rx_bps` | float | full | RX bits per second |
| `timestamp` | string | full | Last update timestamp (ISO 8601) |
| `tcp_handshake_p50_us` | integer | all | TCP handshake P50 in microseconds (TCP only) |
| `tcp_handshake_p90_us` | integer | all | TCP handshake P90 in microseconds (TCP only) |
| `tcp_handshake_p99_us` | integer | all | TCP handshake P99 in microseconds (TCP only) |

<div class="callout callout-info">

**Note**: TCP handshake fields only appear for TCP flows and only when non-zero values are available. They are omitted for UDP flows and for TCP flows where handshake timing was not captured.

</div>

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
