---
title: Kubeshark - Kubernetes Network Observability
description: Real-time Kubernetes network visibility and forensics, capturing and monitoring all traffic and payloads going in, out, and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Think [Wireshark](https://www.wireshark.org/)—reimagined for [Kubernetes](https://kubernetes.io/). Capture every packet, decode every API call, and investigate incidents with complete traffic history—all with minimal production overhead.

[Kubeshark](https://kubeshark.com) delivers cluster-wide, real-time, identity-aware visibility into API traffic, including encrypted (TLS) payloads, as it flows through your containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

---

## Why Kubeshark?

<div class="feature-grid">

### Real-Time Debugging

Diagnose issues as they happen with cluster-wide, real-time API visibility. See the exact requests and responses causing failures—no waiting, no log correlation, just immediate answers.

### Performance Optimization

Inspect network-level data to identify bottlenecks, slow API calls, and inefficient service communication patterns. Optimize your cluster performance with real data.

### Security Analysis

Detect anomalies and investigate suspicious patterns across your entire cluster. Monitor for unauthorized access, data exfiltration, and policy violations in real-time.

### Forensic Investigation

When issues aren't caught in real-time, access complete traffic history to investigate what happened. Replay and analyze captured traffic to understand past incidents.

</div>

---

## What's New in v2.00

<div class="callout callout-info">

**v2.00** introduces a fundamentally new architecture that delivers deep packet inspection with minimal production impact.

</div>

| Feature | Benefit |
|---------|---------|
| **Complete L4 Traffic Retention** | Never miss a packet—all network flows are captured and stored for later inspection |
| **Deferred API Dissection** | Resource-intensive L7 analysis happens off-production, keeping your nodes lean |
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
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    CAPTURE      │────▶│     STORE       │────▶│    ANALYZE      │────▶│     ENRICH      │
│                 │     │                 │     │                 │     │                 │
│  Lightweight    │     │  Complete PCAP  │     │  L7 Dissection  │     │  Kubernetes Context    │
│  L4 capture on  │     │  data retained  │     │  on-demand or   │     │  (pods, svcs,   │
│  prod nodes     │     │  for history    │     │  scheduled      │     │  namespaces)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
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
| **Traffic Capture** | Cluster-wide packet capture using eBPF and AF_PACKET |
| **L7 API Dissection** | Protocol-aware analysis with request/response correlation |
| **TLS Decryption** | See encrypted traffic in plaintext without certificates |
| **Service Map** | Visualize service dependencies and traffic flows |
| **Traffic Recording** | Schedule captures or trigger on specific events |
| **Offline Analysis** | Analyze captured traffic and export to S3/GCS |
| **Service Mesh Support** | Native Istio, Linkerd integration with mTLS visibility |

---

## Next Steps

- [Installation Guide](/en/install) - Detailed setup instructions
- [Dashboard Overview](/en/ui) - Learn the [Kubeshark](https://kubeshark.com) interface
- [Best Practices](/en/best_practice) - Production deployment tips
- [Capture Filters](/en/pod_targeting) - Target specific traffic
