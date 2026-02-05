---
title: MCP CLI
description: Run Kubeshark's MCP server from the command line for AI assistant integration.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

The `kubeshark mcp` command runs an MCP (Model Context Protocol) server over stdio, enabling AI assistants like Claude Desktop, Cursor, and other MCP-compatible clients to query Kubeshark's network visibility data.

---

## Quick Start

```bash
kubeshark mcp
```

This starts an MCP server that communicates over stdin/stdout using the MCP protocol.

---

## Configuration for Claude Desktop

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/path/to/kubeshark",
      "args": ["mcp"]
    }
  }
}
```

### How It Works

When started without `--url`, the MCP CLI will:

1. **Attempt to proxy** into the running Kubernetes cluster
2. **Connect to deployed Kubeshark** if it's running
3. **If Kubeshark isn't running**, AI assistants can use the `start_kubeshark` tool to deploy it

This means AI assistants can fully manage Kubeshark—checking status, starting, stopping, and querying traffic—all through natural conversation.

---

## Direct URL Mode

If Kubeshark is already running and accessible via URL (e.g., exposed via ingress or port-forward):

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/path/to/kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
    }
  }
}
```

In URL mode:
- Connects directly to the Kubeshark hub
- No kubectl or kubeconfig required
- Cluster management tools (start/stop/check) are disabled
- All traffic analysis tools work normally

---

## CLI Options

| Option | Description |
|--------|-------------|
| `--kubeconfig` | Path to kubeconfig file |
| `--url` | Connect directly to Kubeshark URL (disables cluster management) |
| `--context` | Kubernetes context to use |
| `--namespace` | Namespace where Kubeshark is deployed |

### Examples

```bash
# Use specific kubeconfig
kubeshark mcp --kubeconfig ~/.kube/config

# Connect to existing Kubeshark instance
kubeshark mcp --url http://localhost:8899

# Use specific Kubernetes context
kubeshark mcp --context production-cluster
```

---

## Available Tools

The MCP CLI exposes tools that AI assistants can invoke:

### Cluster Management Tools

These tools work regardless of whether Kubeshark is running:

| Tool | Description |
|------|-------------|
| `check_kubeshark_status` | Check if Kubeshark is running in the cluster |
| `start_kubeshark` | Start Kubeshark to capture traffic (runs `kubeshark tap`) |
| `stop_kubeshark` | Stop Kubeshark and clean up resources (runs `kubeshark clean`) |

### Traffic Analysis Tools

These tools require Kubeshark to be running:

| Tool | Description |
|------|-------------|
| `list_workloads` | List pods, services, namespaces, and nodes with L7 traffic |
| `list_api_calls` | Query L7 API transactions (HTTP, gRPC, Redis, Kafka, etc.) |
| `get_api_call` | Get detailed information about a specific API call by ID |
| `get_api_stats` | Get aggregated API statistics |

---

## Tool Details

### `check_kubeshark_status`

Returns whether Kubeshark is currently deployed and running.

**Response:**
```json
{
  "running": true,
  "namespace": "default",
  "hub_ready": true,
  "workers_ready": 3,
  "workers_total": 3
}
```

### `start_kubeshark`

Starts Kubeshark in the cluster.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `namespaces` | string[] | Namespaces to tap (optional, defaults to all) |
| `pod_filter` | string | Pod name filter pattern (optional) |

**Example:**
```json
{
  "namespaces": ["default", "sock-shop"],
  "pod_filter": "frontend*"
}
```

### `stop_kubeshark`

Stops Kubeshark and removes all resources from the cluster.

### `list_workloads`

Lists Kubernetes workloads that have L7 traffic.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `namespace` | string | Filter by namespace (optional) |
| `type` | string | Filter by type: `pod`, `service`, `namespace`, `node` |

### `list_api_calls`

Queries L7 API transactions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `kfl` | string | KFL filter expression |
| `limit` | int | Maximum results (default: 100) |
| `start` | int64 | Start timestamp (Unix ms) |
| `end` | int64 | End timestamp (Unix ms) |

**Example:**
```json
{
  "kfl": "http and response.status >= 400",
  "limit": 50
}
```

### `get_api_call`

Gets detailed information about a specific API call.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The API call ID |

### `get_api_stats`

Gets aggregated statistics about API traffic.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `kfl` | string | KFL filter expression (optional) |
| `group_by` | string | Group by: `endpoint`, `service`, `namespace`, `status` |

---

## Example Conversation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Claude Desktop                                                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  User: Is Kubeshark running in my cluster?                                       │
│                                                                                  │
│  Claude: Let me check.                                                           │
│                                                                                  │
│  [Calling check_kubeshark_status]                                                │
│                                                                                  │
│  Kubeshark is running in your cluster:                                           │
│  - Namespace: default                                                            │
│  - Hub: Ready                                                                    │
│  - Workers: 3/3 ready                                                            │
│                                                                                  │
│  User: Show me any HTTP 500 errors in the last hour                              │
│                                                                                  │
│  Claude: I'll query the API traffic for 500 errors.                              │
│                                                                                  │
│  [Calling list_api_calls with kfl="http and response.status == 500"]             │
│                                                                                  │
│  Found 12 HTTP 500 errors in the last hour:                                      │
│                                                                                  │
│  1. POST /api/checkout → payment-service (500)                                   │
│     Time: 10:23:45 | Latency: 2340ms                                             │
│                                                                                  │
│  2. GET /api/inventory/item/123 → inventory-service (500)                        │
│     Time: 10:25:12 | Latency: 156ms                                              │
│  ...                                                                             │
│                                                                                  │
│  The payment-service is responsible for 8 of the 12 errors.                      │
│  Would you like me to investigate the payment service further?                   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Cannot connect to cluster

1. Verify kubectl works: `kubectl get nodes`
2. Check your kubeconfig: `kubectl config current-context`
3. Try specifying the kubeconfig explicitly: `kubeshark mcp --kubeconfig ~/.kube/config`

### Kubeshark not running

The AI assistant can start Kubeshark using the `start_kubeshark` tool. Simply ask:

> "Start Kubeshark in my cluster"

### Cluster management tools disabled

If using `--url` mode, cluster management tools (start/stop/check) are disabled since the CLI connects directly to an existing Kubeshark instance.

### MCP server not responding

1. Test the CLI directly: `kubeshark mcp`
2. Verify Kubeshark can connect to your cluster: `kubeshark tap`
3. Check Claude Desktop logs for errors

---

## What's Next

- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
- [L7 Tools Reference](/en/mcp/l7_tools) — HTTP endpoint reference
- [Use Cases](/en/mcp_use_cases) — What you can do with MCP
