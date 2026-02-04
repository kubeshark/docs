---
title: MCP Server - AI-Powered Network Analysis
description: Enable AI assistants to analyze Kubernetes network traffic using Kubeshark's MCP (Model Context Protocol) server.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

The **Model Context Protocol (MCP)** is an open standard that enables AI assistants like Claude, ChatGPT, and other LLMs to interact with external tools and data sources. Kubeshark's MCP server exposes real-time and historical network traffic data to AI, enabling powerful natural language queries across your Kubernetes cluster.

---

## Why Use Kubeshark with AI?

Traditional network debugging requires deep expertise in protocols, packet analysis, and Kubernetes internals. With MCP, you can simply *ask questions* about your network traffic:

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Instant Insights</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Ask questions in plain English instead of writing complex KFL queries or analyzing raw packet data manually.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Deep Analysis</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI can correlate patterns across thousands of API calls, identifying anomalies and root causes that would take hours to find manually.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Contextual Understanding</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">The AI understands both Kubernetes concepts and network protocols, providing answers with full context of your infrastructure.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Automated Remediation</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI can suggest fixes and even execute remediations—like capturing traffic, exporting telemetry, or applying K8s policies.</p>
</div>

</div>

---

## What is MCP?

The **Model Context Protocol (MCP)** was introduced by Anthropic as an open standard for connecting AI assistants to external data sources and tools. Think of it as a universal adapter that lets AI models interact with any system that implements the protocol.

```
┌─────────────────┐     MCP Protocol     ┌─────────────────┐
│                 │ ◄──────────────────► │                 │
│  AI Assistant   │                      │  Kubeshark MCP  │
│  (Claude, etc.) │   JSON-RPC 2.0       │     Server      │
│                 │                      │                 │
└─────────────────┘                      └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │   Kubernetes    │
                                         │  Network Data   │
                                         │  (L4/L7, PCAP)  │
                                         └─────────────────┘
```

### Key MCP Concepts

| Concept | Description |
|---------|-------------|
| **Resources** | Data that the MCP server exposes to AI (e.g., traffic streams, API calls, service maps) |
| **Tools** | Actions the AI can perform (e.g., capture traffic, export PCAP, filter by service) |
| **Prompts** | Pre-defined query templates for common analysis tasks |

---

## Kubeshark MCP Capabilities

Kubeshark's MCP server provides AI assistants with comprehensive access to your network data:

### Traffic Analysis

- **Real-time API calls** — Stream live HTTP, gRPC, Kafka, and other L7 traffic
- **Historical queries** — Access retained traffic for forensic investigation
- **Full payloads** — Request/response bodies, headers, and metadata
- **TLS decrypted** — See encrypted traffic in plaintext

### Kubernetes Context

- **Pod and service identity** — Know exactly which workloads are communicating
- **Namespace awareness** — Filter and scope queries by namespace
- **Node distribution** — Understand traffic patterns across your cluster

### Operational Tools

- **Traffic capture** — Trigger targeted packet capture on demand
- **PCAP export** — Export traffic for offline analysis in Wireshark
- **Snapshot creation** — Create point-in-time traffic snapshots
- **Filter application** — Apply KFL filters to focus on specific traffic

---

## Example Use Cases

### Incident Investigation

> *"There was a checkout failure at 2:15 PM. Show me all API calls to the payment service in that 5-minute window and identify any errors."*

The AI will:
1. Query Kubeshark for traffic to the payment service between 2:10-2:20 PM
2. Filter for error responses (5xx status codes)
3. Correlate with upstream services to trace the failure path
4. Summarize the root cause with relevant request/response details

### Architecture Discovery

> *"Map out how the order-service communicates with other services. What APIs does it call and what calls it?"*

The AI will:
1. Query the service map for order-service connections
2. Analyze API call patterns (endpoints, methods, frequencies)
3. Generate a dependency diagram with traffic volumes

### Security Analysis

> *"Are there any services making unexpected external connections or calling APIs without authentication headers?"*

The AI will:
1. Identify all egress traffic leaving the cluster
2. Flag any connections to unexpected destinations
3. Find API calls missing Authorization headers
4. Highlight any unusual patterns or potential data exfiltration

### Performance Debugging

> *"Why is the user-service slow? Show me response times and identify bottlenecks."*

The AI will:
1. Analyze latency distribution for user-service endpoints
2. Identify slow database queries or downstream dependencies
3. Compare current performance against historical baselines
4. Pinpoint specific requests causing latency spikes

### Compliance & Auditing

> *"Create a snapshot of all traffic to PCI-scoped services in the last hour and export it for the security team."*

The AI will:
1. Identify PCI-scoped services based on namespace or labels
2. Create a traffic snapshot for the specified time window
3. Export as PCAP with full Kubernetes context
4. Provide a summary report of the captured traffic

---

## Setting Up MCP

### Prerequisites

- Kubeshark v2.x or later installed in your cluster
- An MCP-compatible AI client (Claude Desktop, Cursor, VS Code with Continue, etc.)

### Configuration

Enable the MCP server in your Kubeshark Helm values:

```yaml
mcp:
  enabled: true
  port: 8898
```

Or via Helm install:

```bash
helm install kubeshark kubeshark/kubeshark \
  --set mcp.enabled=true \
  --set mcp.port=8898
```

### Connecting Your AI Client

#### Claude Desktop

Add Kubeshark to your Claude Desktop MCP configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kubeshark": {
      "url": "http://localhost:8898/mcp",
      "name": "Kubeshark Network Analyzer"
    }
  }
}
```

<div class="callout callout-tip">

**Port Forwarding**: If Kubeshark is running in a remote cluster, set up port forwarding first:
```bash
kubectl port-forward svc/kubeshark-hub 8898:8898
```

</div>

#### Other MCP Clients

Any MCP-compatible client can connect to Kubeshark's MCP endpoint. The server implements the standard MCP protocol over HTTP with JSON-RPC 2.0.

---

## MCP Server Reference

### Available Resources

| Resource | Description |
|----------|-------------|
| `traffic/stream` | Real-time traffic stream with optional filters |
| `traffic/history` | Historical traffic within a time range |
| `services/map` | Service dependency map |
| `services/list` | List of discovered services |
| `namespaces` | Available namespaces |
| `protocols` | Detected protocols and their traffic volumes |

### Available Tools

| Tool | Description |
|------|-------------|
| `capture_traffic` | Start a targeted traffic capture |
| `export_pcap` | Export traffic as PCAP file |
| `create_snapshot` | Create a point-in-time traffic snapshot |
| `apply_filter` | Apply a KFL filter to narrow results |
| `get_service_details` | Get detailed info about a specific service |

---

## Best Practices

### Be Specific with Time Ranges

When investigating incidents, provide specific time windows to help the AI focus on relevant data:

> *"Show me errors between 14:00 and 14:30 UTC"* ✓

Rather than:

> *"Show me recent errors"* ✗

### Use Service and Namespace Context

Help the AI understand scope by mentioning specific services or namespaces:

> *"Analyze traffic to the payment-service in the checkout namespace"* ✓

### Start Broad, Then Narrow

For complex investigations, start with a broad question and let the AI help you narrow down:

1. *"What services had errors in the last hour?"*
2. *"Show me details of the payment-service errors"*
3. *"What was the request payload for the failed transaction with ID xyz?"*

### Leverage Historical Comparisons

Use Kubeshark's traffic retention to compare current behavior with past baselines:

> *"Compare today's API latency with the same time yesterday. What changed?"*

---

## Security Considerations

<div class="callout callout-warning">

**Access Control**: The MCP server provides access to potentially sensitive network data including API payloads. Ensure appropriate access controls are in place:

- Limit MCP server access to authorized users
- Consider network policies to restrict MCP endpoint access
- Use authentication if exposing MCP beyond localhost

</div>

The MCP server respects Kubeshark's existing access controls and data redaction policies. If you have sensitive data redaction configured, the AI will see redacted values.

---

## Troubleshooting

### MCP Server Not Responding

1. Verify the MCP server is enabled:
   ```bash
   kubectl get pods -l app=kubeshark-hub
   ```

2. Check the hub logs for MCP-related messages:
   ```bash
   kubectl logs -l app=kubeshark-hub | grep -i mcp
   ```

3. Ensure port forwarding is active if accessing remotely

### AI Not Finding Data

- Verify Kubeshark is capturing traffic from the target namespaces
- Check that L7 dissection is enabled if asking about API-level data
- Ensure the time range covers when the traffic occurred

### Connection Refused

- Verify the MCP port (default 8898) is not blocked by network policies
- Check that the MCP endpoint URL is correct in your client configuration

---

## What's Next

- [Dashboard Overview](/en/ui) — Learn the Kubeshark interface
- [L7 API Dissection](/en/v2/l7_api_dissection) — Understand how API traffic is analyzed
- [Traffic Snapshots](/en/v2/traffic_snapshots) — Create point-in-time captures
- [KFL2 Filters](/en/v2/kfl2) — Write powerful traffic filters
