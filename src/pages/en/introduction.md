---
title: Network Observability for SREs & AI Agents
description: Kubeshark indexes cluster-wide network traffic at the kernel level using eBPF — delivering instant answers to any query using network, API, and Kubernetes semantics.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark indexes cluster-wide network traffic at the kernel level using eBPF — delivering instant answers to any query using network, API, and Kubernetes semantics.

## What you can do:

* **Download Retrospective PCAPs** — cluster-wide packet captures filtered by nodes, time, workloads, and IPs. Store PCAPs for long-term retention and later investigation.
* **Visualize Network Data** — explore traffic matching queries with API, Kubernetes, or network semantics through a real-time dashboard.
* **Decrypt TLS Traffic** — inspect encrypted traffic — including mTLS in service meshes — in clear text, with no keys, no certificates, and no sidecars.
* **Integrate with AI** — connect your favorite AI assistant (e.g. Claude, Copilot) to include network data in AI-driven workflows like incident response and root cause analysis.

![Kubeshark UI](/kubeshark-ui.png)

## Network Data for AI Agents

Kubeshark exposes cluster-wide network data via [MCP](/en/mcp) — enabling AI agents to query traffic, investigate API calls, and perform root cause analysis through natural language.

> *"Why did checkout fail at 2:15 PM?"*
> *"Which services have error rates above 1%?"*
> *"Show TCP retransmission rates across all node-to-node paths"*
> *"Trace request abc123 through all services"*

Works with Claude Code, Cursor, and any MCP-compatible AI.

<iframe src="/mcp-demo.html" style="width: 100%; height: 480px; border: none; border-radius: 12px; margin: 1.5rem 0;"></iframe>

*The above is a recording of a live session*

---

## TLS Decryption — See Encrypted Traffic in Clear Text

Encrypted traffic is a blind spot for most observability tools. Kubeshark removes that blind spot: it hooks the cryptographic library inside each workload with eBPF and captures plaintext directly from process memory — **no private keys, no certificates, no sidecars, no application changes**.

- Works across **OpenSSL**, **BoringSSL**, and **Go `crypto/tls`** — dynamically or statically linked, stripped or unstripped.
- Covers the dominant share of cloud-native workloads: nginx, HAProxy, Envoy, Istio, Traefik, Kong, APISIX, PostgreSQL, MySQL, Redis, MongoDB, RabbitMQ, and more.
- **Service-mesh mTLS** (Istio, Cilium Service Mesh, Consul Connect, Envoy-based meshes) is decrypted automatically — no extra setup.

[See supported images and how it works →](/en/encrypted_traffic)

---

## Protocol Support

Kubeshark supports **20+ protocols** across multiple layers:

| Category | Protocols |
|----------|-----------|
| **HTTP/REST** | HTTP/1.0, HTTP/1.1, HTTP/2, WebSocket, GraphQL |
| **Messaging** | Apache Kafka, AMQP (RabbitMQ), Redis |
| **RPC** | gRPC over HTTP/2 |
| **Authentication** | LDAP, RADIUS, DIAMETER |
| **Network** | DNS, ICMP, TCP, UDP, SCTP |
| **Security** | TLS (with automatic decryption) |

[View full protocol documentation →](/en/protocols)

---

## Top Use-Cases

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Incident Response & Root Cause Analysis</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Retrieve traffic snapshots from any point in time, index them into queryable API calls, and pinpoint the root cause — manually or through AI agents.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Network Observability</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Real-time and retrospective deep packet inspection across every node. Filter and explore traffic with Kubernetes, API, and network semantics.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Traffic Retention & PCAP Export</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Continuously capture raw traffic cluster-wide. Export PCAPs scoped by time, node, workload, and IP for Wireshark or long-term storage.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Security & Compliance</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Detect sensitive data, anomalies, and policy violations in network traffic. Immutable retention provides forensic evidence for audits and compliance.</p>
</div>

</div>

---

## Next Steps

- [Installation Guide](/en/install) - Detailed setup instructions
- [AI Integration (MCP)](/en/mcp) - Connect AI agents to network data
- [Dashboard Overview](/en/ui) - Learn the Kubeshark interface
- [Best Practices](/en/best_practice) - Production deployment tips
