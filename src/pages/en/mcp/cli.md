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
kubeshark mcp --url https://kubeshark.example.com
```

This starts an MCP server that communicates over stdin/stdout using the MCP protocol, connecting to an existing Kubeshark deployment.

To see available tools:

```bash
kubeshark mcp --list-tools --url https://kubeshark.example.com
```

---

## Configuration for Claude Desktop

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

### URL Mode (Recommended)

Connect directly to an existing Kubeshark deployment:

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
- Connects directly to the Kubeshark Hub
- No kubectl or kubeconfig required
- Cluster management tools (start/stop) are disabled
- All traffic analysis tools work normally

### Proxy Mode

When no `--url` is provided, the MCP CLI will:

1. **Proxy into the cluster** using kubectl port-forward
2. **Connect to deployed Kubeshark** if it's running
3. All traffic analysis tools work normally

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/path/to/kubeshark",
      "args": ["mcp", "--kubeconfig", "/path/to/.kube/config"]
    }
  }
}
```

By default, proxy mode operates in **read-only mode**. To enable AI assistants to start or stop Kubeshark, add `--allow-destructive`:

```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/path/to/kubeshark",
      "args": ["mcp", "--allow-destructive", "--kubeconfig", "/path/to/.kube/config"]
    }
  }
}
```

---

## CLI Options

| Option | Description |
|--------|-------------|
| `--url` | Connect directly to Kubeshark URL (disables cluster management) |
| `--kubeconfig` | Path to kubeconfig file for proxy mode |
| `--allow-destructive` | Enable destructive operations (`start_kubeshark`, `stop_kubeshark`) |
| `--list-tools` | List available MCP tools and exit |
| `--mcp-config` | Print MCP client configuration JSON and exit |

### Generate Configuration

To generate the Claude Desktop configuration automatically:

```bash
kubeshark mcp --mcp-config --url https://kubeshark.example.com
```

Output:
```json
{
  "mcpServers": {
    "kubeshark": {
      "command": "/usr/local/bin/kubeshark",
      "args": ["mcp", "--url", "https://kubeshark.example.com"]
    }
  }
}
```

### Examples

```bash
# List available tools from a Kubeshark instance
kubeshark mcp --list-tools --url https://kubeshark.example.com

# Use specific kubeconfig (proxy mode)
kubeshark mcp --kubeconfig ~/.kube/config

# Enable destructive operations (proxy mode)
kubeshark mcp --allow-destructive --kubeconfig ~/.kube/config

# Connect to local port-forwarded instance
kubeshark mcp --url http://localhost:8899
```

---

## Available Tools

The MCP server exposes tools dynamically from the Kubeshark Hub. Use `--list-tools` to see all available tools.

### Traffic Analysis Tools

These tools are fetched from the Hub and work in both URL and proxy modes:

| Tool | Description |
|------|-------------|
| `list_workloads` | List pods, services, namespaces with observed traffic |
| `list_api_calls` | Query L7 API transactions (HTTP, gRPC, Redis, Kafka, DNS) |
| `get_api_call` | Get detailed information about a specific API call |
| `get_api_stats` | Get aggregated API statistics |
| `list_l4_flows` | List L4 (TCP/UDP) network flows with traffic stats |
| `get_l4_flow_summary` | Get L4 connectivity summary (top talkers, cross-ns traffic) |
| `get_dissection_status` | Check L7 protocol parsing status |
| `enable_dissection` | Enable L7 protocol dissection |
| `disable_dissection` | Disable L7 protocol dissection |
| `list_snapshots` | List all PCAP snapshots |
| `create_snapshot` | Create a new PCAP snapshot |
| `get_snapshot` | Get snapshot details |
| `delete_snapshot` | Delete a snapshot |
| `export_snapshot_pcap` | Export snapshot as PCAP file |

### Cluster Management Tools (Proxy Mode Only)

These tools are only available in proxy mode (without `--url`):

| Tool | Description | Requires |
|------|-------------|----------|
| `check_kubeshark_status` | Check if Kubeshark is running (read-only) | - |
| `start_kubeshark` | Deploy Kubeshark to the cluster | `--allow-destructive` |
| `stop_kubeshark` | Remove Kubeshark from the cluster | `--allow-destructive` |

---

## Prompts

The MCP server also provides pre-built prompts for common analysis tasks:

| Prompt | Description |
|--------|-------------|
| `analyze_traffic` | Analyze API traffic patterns and identify issues |
| `find_errors` | Find and summarize API errors and failures |
| `trace_request` | Trace a request path through microservices |
| `show_topology` | Show service communication topology |
| `latency_analysis` | Analyze latency patterns and identify slow endpoints |
| `security_audit` | Audit traffic for security concerns |
| `compare_traffic` | Compare traffic patterns between time periods |
| `debug_connection` | Debug connectivity issues between services |

---

## Tool Details

### `check_kubeshark_status`

Checks if Kubeshark is running in the cluster. Safe, read-only operation.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `release_namespace` | string | Namespace where Kubeshark is installed (default: "default") |

### `start_kubeshark`

Deploys Kubeshark to the cluster. Requires `--allow-destructive` flag.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `namespaces` | string | Comma-separated namespaces to tap (e.g., "default,sock-shop") |
| `pod_regex` | string | Regular expression to filter pods (e.g., "frontend.*") |
| `release_namespace` | string | Namespace where Kubeshark will be installed |

**Example:**
```json
{
  "namespaces": "default,sock-shop",
  "pod_regex": "frontend.*"
}
```

### `stop_kubeshark`

Removes Kubeshark from the cluster. Requires `--allow-destructive` flag.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `release_namespace` | string | Namespace where Kubeshark is installed |

---

## Example Conversation

```
+---------------------------------------------------------------------------------+
| Claude Desktop                                                                  |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  User: Show me the L4 network flows in my cluster                               |
|                                                                                 |
|  Claude: I'll query the L4 flows.                                               |
|                                                                                 |
|  [Calling list_l4_flows]                                                        |
|                                                                                 |
|  Here are the active L4 flows:                                                  |
|                                                                                 |
|  1. frontend-pod -> orders-service:8080 (TCP)                                   |
|     Bytes: 1.2MB | Packets: 8,432 | RTT: 2.3ms                                  |
|                                                                                 |
|  2. orders-service -> postgres:5432 (TCP)                                       |
|     Bytes: 456KB | Packets: 3,211 | RTT: 0.8ms                                  |
|                                                                                 |
|  User: Show me HTTP 500 errors in the last hour                                 |
|                                                                                 |
|  Claude: I'll query the API traffic for 500 errors.                             |
|                                                                                 |
|  [Calling list_api_calls with kfl="http and response.status == 500"]            |
|                                                                                 |
|  Found 12 HTTP 500 errors:                                                      |
|                                                                                 |
|  1. POST /api/checkout -> payment-service (500)                                 |
|     Time: 10:23:45 | Latency: 2340ms                                            |
|                                                                                 |
|  The payment-service is responsible for 8 of the 12 errors.                     |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

---

## Troubleshooting

### Cannot connect to Kubeshark URL

1. Verify the URL is accessible: `curl https://kubeshark.example.com/api/mcp`
2. Check for authentication requirements
3. Ensure the Kubeshark Hub has MCP enabled

### Cannot connect to cluster (proxy mode)

1. Verify kubectl works: `kubectl get nodes`
2. Check your kubeconfig: `kubectl config current-context`
3. Try specifying the kubeconfig explicitly: `kubeshark mcp --kubeconfig ~/.kube/config`

### Cluster management tools disabled

- In `--url` mode: Cluster management tools are always disabled
- In proxy mode without `--allow-destructive`: Only `check_kubeshark_status` is available
- Add `--allow-destructive` to enable `start_kubeshark` and `stop_kubeshark`

### MCP server not responding

1. Test with `--list-tools`: `kubeshark mcp --list-tools --url <your-url>`
2. Check that Kubeshark Hub is running and accessible
3. Check Claude Desktop logs for errors

---

## What's Next

- [How MCP Works](/en/mcp) — Understanding the Model Context Protocol
- [L7 Tools Reference](/en/mcp/l7_tools) — L7 API traffic analysis tools
- [L4 Tools Reference](/en/mcp/l4_tools) — L4 network flow tools
- [Use Cases](/en/mcp_use_cases) — What you can do with MCP
