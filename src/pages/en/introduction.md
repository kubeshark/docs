---
title: Kubeshark - Kubernetes Network Observability
description: Real-time Kubernetes network visibility and forensics, capturing and monitoring all traffic and payloads going in, out, and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Think [Wireshark](https://www.wireshark.org/)—reimagined for [Kubernetes](https://kubernetes.io/). Capture every packet, inspect every API call, and investigate ongoing and past incidents with complete traffic history—all with minimal production overhead.

[Kubeshark](https://kubeshark.com) delivers cluster-wide, real-time, identity and protocol-aware, visibility into API (L7) and L4 (TCP, UDP, SCTP) traffic, including encrypted (TLS) payloads, as it flows through your containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

Investigate network data with AI-powered natural language prompts. Identify anomalies, detect security threats, optimize costs and improve performance, like never before.

---

## Why Kubeshark?

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Cluster-Wide API Visibility</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Inspect real-time, cluster-wide API calls with full Kubernetes and operating system contexts. Troubleshoot your applications, trace service dependencies, and accelerate root cause analysis.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">AI-Powered Root Cause Analysis</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Identify root causes at the speed of LLMs. Provide direct access to L4, L7, and API traffic data. Ask in natural language: "Which APIs violate their OAS specs?" or "What services show poor health?"</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">AI-Driven Incident Response</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Never lose a packet. At the onset of an incident—or first symptoms—trigger a snapshot of recent hours traffic from involved workloads and replay every step like CCTV footage.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Continuous Forensics</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Store all raw traffic indefinitely and create a snapshot from any time window—days, weeks, or months later. When a customer complains, rewind to the exact moment and replay every packet and API call.</p>
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
