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
      "args": ["mcp"],
      "env": {
        "PATH": "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin",
        "HOME": "/Users/YOUR_USERNAME",
        "KUBECONFIG": "/Users/YOUR_USERNAME/.kube/config"
      }
    }
  }
}
```

### Why Environment Variables Are Required

MCP servers run in a sandboxed environment without access to your shell's PATH or environment variables. Without the `env` section, kubectl commands will fail with authentication errors.

| Cluster Type | Required in PATH |
|--------------|------------------|
| **EKS** | `/usr/local/bin` (for `aws` CLI) |
| **GKE** | Path to `gcloud` |
| **Standard** | Path to `kubectl` |

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

### "kubectl not found" or authentication errors

Ensure the `env` section in your config includes the correct PATH:

```json
"env": {
  "PATH": "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin",
  "HOME": "/Users/YOUR_USERNAME",
  "KUBECONFIG": "/Users/YOUR_USERNAME/.kube/config"
}
```

### Cluster management tools disabled

If using `--url` mode, cluster management tools (start/stop/check) are disabled. Use kubeconfig mode for full functionality.

### MCP server not responding

1. Test the CLI directly: `kubeshark mcp`
2. Verify Kubeshark can connect to your cluster: `kubeshark tap`
3. Check Claude Desktop logs for errors

---

## What's Next

- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
- [L7 Tools Reference](/en/mcp/l7_tools) — HTTP endpoint reference
- [Use Cases](/en/mcp_use_cases) — What you can do with MCP
