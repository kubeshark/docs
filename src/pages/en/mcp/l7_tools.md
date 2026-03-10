---
title: MCP L7 Tools
description: L7 API transaction visibility through MCP endpoints for debugging, security analysis, and performance monitoring.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubeshark's MCP server exposes **L7 API tools** that provide full visibility into HTTP, gRPC, and other application-layer traffic—enabling AI assistants to query, filter, and analyze API transactions.

---

## What is L7 API Dissection?

L7 dissection reconstructs application-layer protocols from raw network packets:

- **Full request/response payloads** — Headers, body, query parameters
- **Protocol-specific fields** — HTTP methods, status codes, gRPC metadata
- **Timing data** — Request/response latency
- **Kubernetes context** — Pod, service, namespace for each endpoint

This provides deep visibility into what services are actually saying to each other.

---

## MCP Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | GET | Discovery endpoint - list all available MCP capabilities |
| `/mcp/calls` | GET | Query L7 API transactions |
| `/mcp/tools/get_api_call_details` | POST | Get full details for a single API call |
| `/mcp/dissection` | GET | Get current dissection status |
| `/mcp/dissection/enable` | POST | Enable L7 protocol parsing |
| `/mcp/dissection/disable` | POST | Disable L7 protocol parsing |

---

## Endpoint: `/mcp/calls`

Query L7 API transactions with filtering and formatting options.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `kfl` | string | (all) | KFL2 filter expression |
| `limit` | int | 100 | Max items (1-1000) |
| `format` | string | `compact` | Response format: `compact`, `full`, `raw` |
| `group_by` | string | - | Group results: `node`, `ns`, `worker` |
| `start` | int64 | - | Start timestamp (Unix ms) |
| `end` | int64 | - | End timestamp (Unix ms) |
| `db` | string | (real-time) | Query dissection DB: `<snapshot>/<dissection>` |

The `db` parameter allows querying [delayed dissection](/en/mcp/delayed_dissection) databases instead of real-time data.

### Response Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| `compact` | LLM-optimized with essential fields (default) | AI queries, quick analysis |
| `full` | All fields including raw headers, full body | Detailed debugging |
| `raw` | Original BaseEntry format from workers | Low-level analysis |

### Response (format=compact)

```json
{
  "calls": [
    {
      "id": "node1/204/0",
      "ts": 1769998106100,
      "src": {
        "ip": "10.0.1.5",
        "port": 51148,
        "pod": "frontend-abc123",
        "ns": "default"
      },
      "dst": {
        "ip": "10.0.2.10",
        "port": 8080,
        "pod": "backend-xyz789",
        "ns": "default",
        "svc": "backend",
        "node": "worker-1"
      },
      "proto": "http",
      "method": "GET",
      "path": "/api/users",
      "status": 200,
      "latency_ms": 45
    }
  ],
  "total": 150,
  "truncated": false
}
```

### Example Requests

```
GET /mcp/calls?kfl=http and response.status == 500
→ "Show me all HTTP 500 errors"

GET /mcp/calls?kfl=request.path contains "/api/orders"&limit=50
→ "Show the last 50 requests to the orders API"

GET /mcp/calls?kfl=src.ns == "frontend" and dst.ns == "backend"&format=full
→ "Show full details of traffic from frontend to backend namespace"

GET /mcp/calls?start=1706745000000&end=1706748600000
→ "Show all API calls in this time window"
```

---

## Endpoint: `/mcp/tools/get_api_call_details`

Fetch full details for a single API call found via `list_api_calls`. Returns extended request/response payloads, L4 flow statistics, L4 connection info, and optionally the connection PCAP.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | string | Yes | - | Entry ID from `list_api_calls` (e.g. `/170710/0`) |
| `node_id` | string | Yes | - | Node name from the entry's `src.node` or `dst.node` field |
| `include_payload` | boolean | No | `true` | Fetch full request/response body |
| `include_l4` | boolean | No | `true` | Fetch L4 flow and connection info |
| `include_pcap` | boolean | No | `false` | Include connection PCAP data as base64 |
| `max_payload_size` | integer | No | `65536` | Max bytes per payload body. Larger payloads are truncated |

> **Note:** `id` and `node_id` come from `list_api_calls` results with `format=full`. Each entry in the full format includes `conn_id`, `flow_id`, and `node_id` fields needed for this drill-down.

### Response

```json
{
  "entry": {
    "id": "/170710/0",
    "ts": 1769998106100,
    "src": { "ip": "10.0.1.5", "port": 51148, "pod": "frontend-abc123", "ns": "default" },
    "dst": { "ip": "10.0.2.10", "port": 8080, "pod": "backend-xyz789", "ns": "default", "svc": "backend" },
    "proto": "http",
    "method": "POST",
    "path": "/api/orders",
    "status": 201,
    "latency_ms": 87,
    "conn_id": 42,
    "node_id": "worker-1"
  },
  "req_body": "{\"item\":\"widget\",\"qty\":3}",
  "resp_body": "{\"order_id\":\"ord-12345\",\"status\":\"created\"}",
  "truncated": false,
  "l4_flow": {
    "flow_id": 170710,
    "state": "established",
    "local_pkts": 1250,
    "local_bytes": 524288,
    "remote_pkts": 980,
    "remote_bytes": 412600,
    "local_pps": 42,
    "local_bps": 17476,
    "remote_pps": 33,
    "remote_bps": 13753
  },
  "l4_conn": {
    "conn_id": 42,
    "state": "established",
    "local_pkts": 320,
    "local_bytes": 131072,
    "remote_pkts": 280,
    "remote_bytes": 115200
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `entry` | APICallFull | Full entry details (same format as `list_api_calls` with `format=full`) |
| `req_body` | string | Extended request body (when `include_payload=true`) |
| `resp_body` | string | Extended response body (when `include_payload=true`) |
| `truncated` | boolean | `true` if payload was truncated to `max_payload_size` |
| `l4_flow` | object | L4 flow statistics — bytes, packets, PPS, BPS (when `include_l4=true`) |
| `l4_conn` | object | L4 connection info — state, byte/packet counts (when `include_l4=true`) |

### Typical Drill-Down Workflow

1. **List calls** — `list_api_calls` with `format=full` to get entries with `id`, `node_id`, and `conn_id`
2. **Pick an entry** — Identify the call you want to inspect
3. **Get details** — `get_api_call_details` with the entry's `id` and `node_id`
4. **Analyze** — Inspect full payloads, L4 stats, or download PCAP

```
list_api_calls (format=full) → pick entry → get_api_call_details(id, node_id)
                                                ├── req_body / resp_body
                                                ├── l4_flow (traffic stats)
                                                ├── l4_conn (connection info)
                                                └── pcap (if include_pcap=true)
```

### Example: Debugging a Failed Request

```json
{
  "tool": "get_api_call_details",
  "arguments": {
    "id": "/170710/0",
    "node_id": "worker-1",
    "include_payload": true,
    "include_l4": true,
    "include_pcap": false
  }
}
```

---

## Endpoint: `/mcp/dissection`

Get or control L7 dissection status.

### GET `/mcp/dissection`

Returns current dissection state.

```json
{
  "enabled": true
}
```

### POST `/mcp/dissection/enable`

Enable L7 protocol parsing on all workers.

```json
{
  "success": true,
  "enabled": true
}
```

### POST `/mcp/dissection/disable`

Disable L7 protocol parsing.

```json
{
  "success": true,
  "enabled": false
}
```

### Typical Flow

1. AI checks status: `GET /mcp/dissection`
2. If disabled, enables it: `POST /mcp/dissection/enable`
3. Queries API data: `GET /mcp/calls?kfl=...`
4. Optionally disables when done: `POST /mcp/dissection/disable`

---

## Endpoint: `/mcp` (Discovery)

Returns all available MCP endpoints and their capabilities.

### Response

```json
{
  "name": "Kubeshark MCP Server",
  "version": "1.0",
  "description": "Model Context Protocol server exposing Kubeshark's L7 API visibility data for AI assistants",
  "endpoints": [
    {
      "path": "/mcp/calls",
      "method": "GET",
      "description": "Query L7 API transactions",
      "params": [
        {"name": "kfl", "type": "string", "description": "KFL2 filter expression"},
        {"name": "limit", "type": "int", "description": "Max results"}
      ]
    }
  ]
}
```

AI assistants can use this to dynamically discover available capabilities.

---

## Use Cases

### Debugging API Errors

> *"Show me all 500 errors in the last hour"*

> *"What requests caused the payment service to fail?"*

> *"Find all requests to /api/checkout that took longer than 2 seconds"*

The AI uses `/mcp/calls` with KFL filters to find problematic requests.

### Security Analysis

> *"Show me all API calls without Authorization headers"*

> *"Find requests containing sensitive data patterns"*

> *"What external APIs is this service calling?"*

Full payload visibility enables security-focused queries.

### Performance Debugging

> *"Which endpoints have the highest latency?"*

> *"Show me slow database queries"*

> *"Compare response times before and after the deployment"*

Timing data in each call enables latency analysis.

### Incident Investigation

> *"Show me all traffic to the affected service during the outage"*

> *"What API calls happened in the 5 minutes before the crash?"*

> *"Find all requests from the problematic pod"*

Time-bounded queries help reconstruct incident timelines.

---

## KFL Filter Examples

KFL (Kubeshark Filter Language) enables powerful queries:

| Filter | Description |
|--------|-------------|
| `http` | All HTTP traffic |
| `http and response.status >= 400` | HTTP errors |
| `grpc` | All gRPC traffic |
| `request.path contains "/api/v1"` | Specific API paths |
| `src.ns == "frontend"` | Traffic from frontend namespace |
| `dst.pod == "database"` | Traffic to database pod |
| `request.headers["Authorization"] == ""` | Missing auth headers |
| `response.latency > 1000` | Slow responses (>1s) |

See [KFL2 Documentation](/en/v2/kfl2) for full syntax.

---

## Data Structure Reference

### APICall Object (compact)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique call identifier |
| `ts` | int64 | Timestamp (Unix ms) |
| `src` | Endpoint | Source endpoint |
| `dst` | Endpoint | Destination endpoint |
| `proto` | string | Protocol: `http`, `grpc`, `redis`, etc. |
| `method` | string | HTTP method or RPC name |
| `path` | string | Request path |
| `status` | int | Response status code |
| `latency_ms` | float | Request-response latency |

### Additional Fields in `format=full`

The `full` format includes all compact fields plus:

| Field | Type | Description |
|-------|------|-------------|
| `conn_id` | uint64 | Connection identifier (used by `get_api_call_details`) |
| `node_id` | string | Node name where the call was captured (used by `get_api_call_details`) |
| `flow_id` | uint64 | L4 flow identifier |
| `req_headers` | object | Request headers |
| `resp_headers` | object | Response headers |
| `req_body` | string | Request body preview |
| `resp_body` | string | Response body preview |
| `req_size` | int | Request body size in bytes |
| `resp_size` | int | Response body size in bytes |
| `worker` | string | Worker pod that captured the call |

### Endpoint Object

| Field | Type | Description |
|-------|------|-------------|
| `ip` | string | IP address |
| `port` | int | Port number |
| `pod` | string | Kubernetes pod name |
| `ns` | string | Kubernetes namespace |
| `svc` | string | Kubernetes service name |
| `node` | string | Kubernetes node name |

---

## What's Next

- [Delayed Dissection](/en/mcp/delayed_dissection) — Analyze snapshots with L7 dissection
- [L4 Tools Reference](/en/mcp/l4_tools) — Lightweight connectivity visibility
- [KFL2 Filters](/en/v2/kfl2) — Write powerful traffic filters
- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
