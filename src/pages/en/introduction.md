---
title: Network Observability for the AI Era
description: Give AI agents and SREs real-time and retrospective access to every packet and API call, cluster-wide — purpose-built to plug into AI-driven workflows.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Give AI agents and SREs real-time and retrospective access to **every packet and API call**, cluster-wide — purpose-built to plug into **AI-driven workflows**.

## Deep Visibility for Engineers

[Kubeshark](https://kubeshark.com) delivers cluster-wide, real-time, identity and protocol-aware, visibility into API (L7) and L4 (TCP, UDP, SCTP) traffic, including encrypted (TLS) payloads, as it flows through your containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

## Network Data for AI-Driven Workflows

Slice and dice cluster-wide network data with AI agents. Token-efficient, queryable, real-time and retrospective — not raw packet dumps.

<iframe src="/mcp-demo.html" style="width: 100%; height: 480px; border: none; border-radius: 12px; margin: 1.5rem 0;"></iframe>

*The above is a recording of a live session*

---

## Why Kubeshark?

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Incident Response</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Powering AI-driven IR workflows— Like a CCTV + flight recorder for Kubernetes. Export PCAPs from any point in time with immutable retention.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Root Cause Analysis</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Crush MTTR — from hours to minutes. AI agents slice and dice network data, query any point in time cluster-wide, and get to the root cause at scale.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Network Observability</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Instant, cluster-wide visibility. Wireshark-like capabilities for Kubernetes, with real-time and retrospective deep packet inspection and PCAP access.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc; min-height: 8rem;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Security & Compliance</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI agents scan traffic for sensitive data, anomalies, policy violations, and suspicious behavior. Immutable retention for forensic evidence and compliance.</p>
</div>

</div>

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

## Next Steps

- [Installation Guide](/en/install) - Detailed setup instructions
- [Dashboard Overview](/en/ui) - Learn the [Kubeshark](https://kubeshark.com) interface
- [Best Practices](/en/best_practice) - Production deployment tips
- [Capture Filters](/en/pod_targeting) - Target specific traffic
