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

- [L4 Tools Reference](/en/mcp/l4_tools) — Lightweight connectivity visibility
- [KFL2 Filters](/en/v2/kfl2) — Write powerful traffic filters
- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
