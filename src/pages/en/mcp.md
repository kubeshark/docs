---
title: MCP - Introduction
description: Enable AI assistants to analyze Kubernetes network traffic using Kubeshark's MCP (Model Context Protocol) server.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

The **Model Context Protocol (MCP)** is an open standard that enables AI assistants like Claude, ChatGPT, and other LLMs to interact with external tools and data sources. Kubeshark's MCP server exposes real-time and historical network traffic data to AI, enabling powerful natural language queries across your Kubernetes cluster.

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

[See detailed use cases →](/en/mcp_use_cases)

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

## What's Next

- [Use Cases](/en/mcp_use_cases) — Detailed scenarios for AI-powered network analysis
- [Dashboard Overview](/en/ui) — Learn the Kubeshark interface
- [L7 API Dissection](/en/v2/l7_api_dissection) — Understand how API traffic is analyzed
