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
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Real-Time API Visibility</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Inspect real-time, cluster-wide API calls with full Kubernetes and operating system contexts. Troubleshoot your applications, trace service dependencies, and accelerate root cause analysis.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Complete Packet Retention</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">An alternative to <code style="font-size: 1.1rem;">tcpdump</code>. Kubeshark continuously captures cluster-wide traffic with minimal overhead—always on, zero setup. Export as PCAP for analysis in Wireshark.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">AI-Powered Traffic Analysis</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Ask any question about your network data using natural language prompts. For example: "Which APIs violate their OAS specs?" or "What services show poor health?"—instant answers.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Forensic Investigation</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Investigate ongoing or past incidents. Go back in time and replay the exact network state—every API call, payload, and error at the moment of the incident. Never lose a packet. Always have answers.</p>
</div>

</div>

---

## What's New in v2.00

<div class="callout callout-info">

**v2.00** introduces a fundamentally new architecture that delivers deep packet inspection with minimal production impact.

</div>

| Feature | Benefit |
|---------|---------|
| [**Complete L4 Traffic Retention**](/en/v2/raw_capture) | Never miss a packet—all network flows are captured and stored for later inspection |
| [**Deferred API Dissection**](/en/v2/l7_api_dissection) | Resource-intensive L7 analysis happens off-production, keeping your nodes lean |
| **Improved Reliability** | Significant improvements in API dissection accuracy through extensive bug fixes |
| **AI-Ready (MCP Server)** | Expose raw traffic and insights to AI tools for intelligent analysis |

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
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     CAPTURE      │────▶│      STORE       │────▶│     ANALYZE      │────▶│      ENRICH      │
│                  │     │                  │     │                  │     │                  │
│   Lightweight    │     │  Complete PCAP   │     │  L7 Dissection   │     │    Kubernetes    │
│   L4 capture on  │     │  data retained   │     │  on-demand or    │     │  context (pods,  │
│   prod nodes     │     │  for history     │     │  scheduled       │     │  svcs, ns, etc.) │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
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

## AI-Powered Analysis

Kubeshark exposes network data to AI tools via its MCP server, enabling natural language queries across your traffic history. Ask questions like:

**Incident Investigation**
- *"Something broke at 2pm. Capture that traffic, dissect it, and tell me what failed."*
- *"Why is checkout slow? Show me the API call chain and where time is being spent."*

**Architecture Discovery**
- *"Map out how services communicate. What calls what?"*
- *"Which services would be affected if the user-service goes down?"*

**Security Analysis**
- *"Are there any unexpected external connections or unusual API patterns?"*
- *"Show me all requests without authentication headers."*

**Root Cause Analysis**
- *"Compare traffic from yesterday's snapshot to today. What changed?"*
- *"Correlate the K8s pod restarts with the API errors happening at the same time."*

**Evidence Collection**
- *"Create a snapshot of the last hour from the payments nodes and export the PCAP for the security team."*

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

## Key Capabilities

| Capability | Description |
|------------|-------------|
| [**Traffic Capture**](/en/v2/raw_capture) | Cluster-wide packet capture using eBPF and AF_PACKET |
| [**L7 API Dissection**](/en/v2/l7_api_dissection) | Protocol-aware analysis with request/response correlation |
| [**TLS Decryption**](/en/encrypted_traffic) | See encrypted traffic in plaintext without certificates |
| [**Service Map**](/en/v2/service_map) | Visualize service dependencies and traffic flows |
| [**Traffic Recording**](/en/traffic_recorder) | Schedule captures or trigger on specific events |
| [**Offline Analysis**](/en/offline_analysis) | Analyze captured traffic and export to S3/GCS |
| [**Service Mesh Support**](/en/service_mesh) | Native Istio, Linkerd integration with mTLS visibility |

---

## Next Steps

- [Installation Guide](/en/install) - Detailed setup instructions
- [Dashboard Overview](/en/ui) - Learn the [Kubeshark](https://kubeshark.com) interface
- [Best Practices](/en/best_practice) - Production deployment tips
- [Capture Filters](/en/pod_targeting) - Target specific traffic
