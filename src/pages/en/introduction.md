---
title: Kubeshark - Network Observability for the AI Era
description: Give AI agents and SREs real-time and retrospective access to every packet and API call, cluster-wide — purpose-built to plug into AI-driven workflows.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Give AI agents and SREs real-time and retrospective access to **every packet and API call**, cluster-wide — purpose-built to plug into **AI-driven workflows**.

[Kubeshark](https://kubeshark.com) delivers cluster-wide, real-time, identity and protocol-aware, visibility into API (L7) and L4 (TCP, UDP, SCTP) traffic, including encrypted (TLS) payloads, as it flows through your containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

Investigate network data with AI-powered natural language prompts. Identify anomalies, detect security threats, optimize costs and improve performance, like never before.

---

## Why Kubeshark?

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Network Data for AI-Driven Workflows</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Kubeshark serves up token-efficient L4 and L7 network data — ready for AI agents to query, correlate, and act on. Responses are sized for AI consumption, not raw packet dumps.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Deep Visibility for Engineers</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Deep packet inspection with full Kubernetes and API context — so SREs, network engineers, DevOps, and platform engineers can trace any request to its source, from TCP connections to API payloads.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Incident Response</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Export PCAPs from any point in time. Immutable, long-term PCAP retention. A CCTV + flight recorder for Kubernetes — with all actions controllable by AI agents.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Root Cause Analysis</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Crush MTTR. Slice and dice network data for insight, query any point in time cluster-wide, get instant root cause visualization — works with your favorite AI assistants.</p>
</div>

</div>

---

## How It Works

[Kubeshark](https://kubeshark.com) offers two powerful modes for different use cases:

### Real-Time API Dissection

See traffic as it happens. [Kubeshark](https://kubeshark.com) captures and dissects API calls in real-time, giving you immediate visibility into what's happening across your cluster. This is ideal for:

- **Live debugging** - Diagnose issues as they occur
- **Root cause analysis** - See the exact request/response that caused a failure
- **Development workflows** - Watch API calls while testing

### Traffic Recording & Deferred Analysis

For comprehensive forensics, [Kubeshark](https://kubeshark.com) can capture complete L4 traffic (PCAP) and analyze it later:

```
  CAPTURE          STORE           ANALYZE          ENRICH
     |                |                |                |
     v                v                v                v
Lightweight      Complete PCAP    L7 dissection    Kubernetes
L4 capture  ---> retained for ---> on-demand or ---> context
on prod nodes    full history     scheduled        added
```

This enables:
- **Complete traffic history** for forensic investigation
- **Minimal production overhead** when you don't need real-time analysis
- **Long-term retention** for compliance and auditing

---

## Protocol Support

[Kubeshark](https://kubeshark.com) supports **20+ protocols** across multiple layers, with automatic TLS decryption:

| Category | Protocols |
|----------|-----------|
| **HTTP/REST** | HTTP/1.0, HTTP/1.1, HTTP/2, WebSocket, GraphQL |
| **Messaging** | Apache Kafka, AMQP (RabbitMQ), Redis |
| **RPC** | gRPC over HTTP/2 |
| **Authentication** | LDAP, RADIUS, DIAMETER |
| **Network** | DNS, ICMP, TCP, UDP, SCTP |
| **Security** | TLS (with automatic decryption) |

<div class="callout callout-tip">

**TLS Decryption**: Kubeshark can intercept encrypted traffic **without requiring access to private keys** by hooking into runtime cryptographic libraries (OpenSSL, Go crypto/tls, BoringSSL).

</div>

[View full protocol documentation →](/en/protocols)

---

## AI Integration

Kubeshark connects AI assistants directly to your network data via the **Model Context Protocol (MCP)**—the open standard for AI tool integration. Ask questions in natural language, investigate incidents, and analyze traffic patterns—all through your preferred AI tool.

[Learn more about AI Integration →](/en/mcp_use_cases)

---

## Quick Start

Get [Kubeshark](https://kubeshark.com) running in 60 seconds:

```bash
# Add the Helm repository
helm repo add kubeshark https://helm.kubeshark.com

# Install Kubeshark
helm install kubeshark kubeshark/kubeshark
```

Then open the dashboard:

```bash
kubectl port-forward svc/kubeshark-front 8899:80
```

Open [http://localhost:8899](http://localhost:8899) in your browser.

[Full installation guide →](/en/install)

---

## Next Steps

- [Installation Guide](/en/install) - Detailed setup instructions
- [Dashboard Overview](/en/ui) - Learn the [Kubeshark](https://kubeshark.com) interface
- [Best Practices](/en/best_practice) - Production deployment tips
- [Capture Filters](/en/pod_targeting) - Target specific traffic
