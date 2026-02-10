---
title: MCP - How It Works
description: Understanding the Model Context Protocol and how Kubeshark connects AI assistants to your Kubernetes network data.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

> **Coming Soon — V2.00:** MCP integration is coming as part of Kubeshark V2.00. [Read the announcement](https://kubeshark.com/post/kubeshark-v2-00-coming-soon).

[Network traffic holds answers](/en/why_network_data) to your toughest debugging, security, and performance questions. The **Model Context Protocol (MCP)** is how AI assistants access that data.

---

## What is MCP?

The **Model Context Protocol (MCP)** is an open standard introduced by Anthropic for connecting AI assistants to external data sources and tools. Think of it as a universal adapter—any AI that supports MCP can interact with any system that implements it.

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

MCP defines three core concepts:

| Concept | Description |
|---------|-------------|
| **Resources** | Data the server exposes to the AI (traffic streams, API calls, service maps) |
| **Tools** | Actions the AI can perform (capture traffic, export PCAP, apply filters) |
| **Prompts** | Pre-defined templates for common analysis tasks |

---

## What Kubeshark Exposes via MCP

Kubeshark's MCP server gives AI assistants access to your complete network picture:

### L7 Traffic Data (API Calls)

| Resource | Description |
|----------|-------------|
| Real-time stream | Live traffic as it flows through your cluster |
| Historical queries | Past traffic within your retention window |
| Full payloads | Request/response bodies, headers, metadata |
| Decrypted TLS | Encrypted traffic in plaintext |

### L4 Network Flows (TCP/UDP)

| Resource | Description |
|----------|-------------|
| Connection flows | TCP/UDP connections between workloads |
| Traffic statistics | Bytes, packets, and rates per flow |
| TCP handshake RTT | Connection establishment timing (network health indicator) |
| Protocol breakdown | TCP vs UDP traffic distribution |

### Kubernetes Context

| Resource | Description |
|----------|-------------|
| Pod identity | Source and destination workloads for each request |
| Service mapping | Which services communicate and how |
| Namespace scope | Traffic organized by namespace |
| Node distribution | Traffic patterns across cluster nodes |

### Operational Tools

| Tool | Description |
|------|-------------|
| `capture_traffic` | Start targeted packet capture |
| `export_pcap` | Export traffic for Wireshark analysis |
| `create_snapshot` | Point-in-time traffic snapshots |
| `apply_filter` | Focus results with KFL filters |

### L4 Network Analysis Tools

| Tool | Description |
|------|-------------|
| `list_l4_flows` | List TCP/UDP flows with traffic stats and TCP handshake RTT |
| `get_l4_flow_summary` | High-level summary: top talkers, cross-namespace traffic |

#### TCP Handshake RTT Fields

The `list_l4_flows` tool returns TCP handshake timing metrics that measure network health:

| Field | Description |
|-------|-------------|
| `tcp_handshake_p50_us` | 50th percentile TCP handshake time (microseconds) |
| `tcp_handshake_p90_us` | 90th percentile TCP handshake time (microseconds) |
| `tcp_handshake_p99_us` | 99th percentile TCP handshake time (microseconds) |

These metrics measure the time to complete the TCP 3-way handshake:
- **Client perspective**: Time from sending SYN to receiving SYN-ACK
- **Server perspective**: Time from receiving SYN to receiving ACK

**Interpretation:**
- **< 1ms**: Excellent (same-node or same-datacenter communication)
- **1-10ms**: Good (typical cross-node within cluster)
- **10-100ms**: Elevated (possible network congestion or cross-AZ traffic)
- **> 100ms**: High latency (cross-region or network issues)

---

## Setting Up MCP

### Prerequisites

- Kubeshark installed in your cluster
- An MCP-compatible AI client (Claude Desktop, Cursor, VS Code with Continue, etc.)

### Enable the MCP Server

Via Helm values:

```yaml
mcp:
  enabled: true
  port: 8898
```

Or command line:

```bash
helm install kubeshark kubeshark/kubeshark \
  --set mcp.enabled=true \
  --set mcp.port=8898
```

### Connect Your AI Client

#### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kubeshark": {
      "url": "http://localhost:8898/mcp",
      "name": "Kubeshark"
    }
  }
}
```

<div class="callout callout-tip">

**Remote Clusters**: Set up port forwarding first:
```bash
kubectl port-forward svc/kubeshark-hub 8898:8898
```

</div>

#### Other MCP Clients

Any MCP-compatible client can connect. The server implements standard MCP over HTTP with JSON-RPC 2.0.

---

## How AI Uses the Data

When you ask a question, the AI:

1. **Understands intent** — Parses your natural language query
2. **Queries Kubeshark** — Uses MCP tools to fetch relevant traffic
3. **Analyzes results** — Correlates patterns, identifies anomalies
4. **Responds conversationally** — Explains findings in plain language

### Example Interaction

**You ask:**
> "Why did the checkout fail for user 12345 at 2:15 PM?"

**AI actions:**
1. Queries traffic to checkout-related services between 2:10-2:20 PM
2. Filters for requests containing user ID 12345
3. Identifies a 500 error from payment-service
4. Examines the error response payload
5. Traces upstream to find the root cause

**AI responds:**
> "The checkout failed because payment-service returned a 500 error at 2:15:23 PM. The error payload shows 'Invalid card token.' The request to the upstream token-service succeeded, but returned an expired token. The token was generated at 1:15 PM and has a 1-hour TTL."

---

## Security Considerations

<div class="callout callout-warning">

**Access Control**: The MCP server provides access to network traffic including API payloads. Ensure appropriate controls:

- Restrict MCP endpoint access to authorized users
- Use network policies to limit who can reach the MCP port
- Enable authentication if exposing beyond localhost

</div>

The MCP server respects Kubeshark's data redaction policies. If you've configured sensitive data redaction, the AI sees redacted values.

---

## Troubleshooting

### MCP Server Not Responding

```bash
# Verify Kubeshark is running
kubectl get pods -l app=kubeshark-hub

# Check MCP-related logs
kubectl logs -l app=kubeshark-hub | grep -i mcp

# Verify port forwarding (if remote)
kubectl port-forward svc/kubeshark-hub 8898:8898
```

### AI Not Finding Expected Data

- Verify Kubeshark is capturing traffic from target namespaces
- Check that L7 dissection is enabled for API-level queries
- Ensure time ranges cover when the traffic occurred
- Confirm the service/pod names match what's in the cluster

---

## What's Next

- [Why Network Data Matters](/en/why_network_data) — The value of network-level visibility
- [Use Cases](/en/mcp_use_cases) — Detailed scenarios and example prompts
- [KFL2 Filters](/en/v2/kfl2) — Write powerful traffic filters
