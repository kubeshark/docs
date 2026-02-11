---
title: Why Network Data Matters
description: Understanding the wealth of information in network traffic and how Kubeshark provides deep visibility into Kubernetes applications.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

The network carries **everything**. Every API call, every database query, every service-to-service interaction flows through it. Unlike logs (which show what an application *chose* to record) or metrics (which show aggregates over time), network traffic is the **ground truth** of what actually happened.

---

## The Network as Source of Truth

In a Kubernetes environment, network traffic contains far more than connectivity data. It's where your entire application executes.

### Network Layer

| What's in the Data | Examples |
|-------------------|----------|
| **Packet-Level Context** | Source/destination IP, port, protocol, packet size, TCP flags (SYN/ACK/FIN/RST), MTU, fragmentation |
| **TCP Handshake Latency** | Round-trip time of the 3-way handshake, isolating network latency from application processing |
| **Connection Lifecycle** | Establishment, reuse, and teardown—keep-alive behavior, connection pool utilization, resets, half-open connections |
| **Congestion & Packet Loss** | Retransmissions, window scaling, zero-window events, duplicate ACKs, buffer pressure |
| **DNS Resolution** | Every query and response, resolution latency, NXDOMAIN errors, TTL behavior, caching effectiveness |
| **TLS Negotiation** | Handshake timing, cipher selection, certificate exchange, protocol version, handshake failures |
| **Encrypted Traffic** | TLS-encrypted communication—HTTPS payloads, mTLS service-to-service calls, encrypted database connections |
| **Traffic Volume & Rates** | Bytes, packets, and throughput per flow, per service, per node—bandwidth consumption and payload size distribution |
| **Cross-Node & Cross-AZ Traffic** | Node-to-node latency, cross-availability-zone round-trip times, remote node communication patterns |

### Application & Business Logic

| What's in the Data | Examples |
|-------------------|----------|
| **Complete Payloads** | Full request and response bodies, headers, metadata—every byte exchanged between services |
| **API Transactions** | Reconstructed request-response pairs—`POST /api/checkout` → `200 OK` with full bodies on both sides |
| **Distributed Flows** | Multi-service call chains that make up a single user action—frontend → gateway → auth → payment → database |
| **Service-to-Service Communication** | Every internal (east-west) interaction—API calls, cache lookups, message queue publish/consume |
| **Request-Response Latency** | Time from request sent to response received at each hop, without sampling or averaging |
| **Retry & Timeout Behavior** | Automatic retries, backoff patterns, timeout configurations—retry storms, cascading timeouts in action |

### Kubernetes Context

| What's in the Data | Examples |
|-------------------|----------|
| **Pod Identity** | Source and destination pod name, namespace, labels, and owning deployment for every connection |
| **Service Mapping** | Which services communicate, resolved from ClusterIP to backing pods—actual traffic paths vs. declared intent |
| **Namespace Boundaries** | Cross-namespace traffic flows, namespace isolation verification |
| **Node Placement** | Which node each workload runs on, revealing topology-aware routing and data locality patterns |

### Operating System Context

| What's in the Data | Examples |
|-------------------|----------|
| **Process Identity** | The exact process (PID, binary name) that initiated or accepted each connection |
| **Socket State** | Open sockets, socket-to-process mapping, file descriptor usage per container |
| **Container Mapping** | Container ID and runtime context linked to each network flow |
| **Syscall Context** | System calls (connect, accept, sendto, recvfrom) that triggered network activity |

### Infrastructure & Security

| What's in the Data | Examples |
|-------------------|----------|
| **Network Policies** | Which traffic is allowed or denied by Kubernetes NetworkPolicy, Calico, or Cilium rules—and what's violating them |
| **Firewall Decisions** | Traffic blocked or permitted by iptables, nftables, or cloud security groups—drops, rejects, and pass-throughs |
| **Load Distribution** | How traffic spreads across replicas, endpoints, and nodes—hot spots, imbalanced routing, uneven utilization |
| **Authentication & Authorization** | Tokens, credentials, API keys as they transit the wire—JWT, OAuth flows, 401/403 response patterns |
| **Sensitive Data in Transit** | PII, payment data, and regulated information flowing between services—credit card numbers, health records in API payloads |
| **Rate Limiting** | Throttling decisions and 429 responses—which clients are being limited, at what thresholds, and how often |

---

## The Scale Problem

Network data is massive. A single Kubernetes cluster can generate **gigabytes of traffic per minute** across hundreds of nodes, thousands of pods, and tens of thousands of concurrent connections. This isn't log data measured in lines—it's raw packet data measured in terabytes per day.

- **Volume** — Every API call, health check, DNS lookup, and database query produces packets. Even a modest cluster generates millions of packets per minute.
- **Distribution** — Data is spread across every node, captured at different network interfaces and kernel namespaces. A single API transaction may span multiple nodes, each holding a fragment.
- **Speed** — Packets are ephemeral and must be captured in real time. Buffers overflow, packets drop, and gaps appear. There's no "retry" for missed traffic.

These forces compound: capturing at scale, processing raw packets into protocol-level conversations, and correlating across services each multiplies the cost. Most teams either sample aggressively (losing completeness) or capture only during active incidents (missing the traffic that led up to the problem).

---

## The Context Problem

Raw network packets contain valuable data, but they lack the context needed to make sense of it.

### What Raw Packets Don't Tell You

A captured packet shows:
- Source IP: `10.244.1.15`
- Destination IP: `10.244.2.23`
- Port: `8080`
- Payload: `{"user_id": 12345, "action": "checkout"}`

But it doesn't tell you:
- Which pod sent it? Which service?
- What namespace? What deployment?
- Which process inside the container?
- Is this normal behavior or anomalous?

Without Kubernetes context, you're left correlating IP addresses manually—a task that's nearly impossible in dynamic environments where pods come and go.

### API Fragmentation

The problem compounds at the API layer. A single HTTP request might span multiple TCP segments, arrive out of order, or be interleaved with other requests on the same connection. Raw packet capture sees fragments; understanding the actual API call requires reconstruction.

### The Two Worlds of Visibility

There are two approaches to Kubernetes observability, each with tradeoffs:

**Network Tools (Wireshark, tcpdump)**
- ✓ Complete payload visibility—every byte on the wire
- ✓ Every request captured, not sampled
- ✗ No Kubernetes context—just IPs and ports
- ✗ Manual correlation required

**Observability Tools (OpenTelemetry, APM)**
- ✓ Kubernetes context—pod, service, namespace
- ✓ Distributed tracing across services
- ✗ Sampled data—not every request
- ✗ No payload visibility—metrics and spans only
- ✗ Statistical/aggregated information

<div class="callout callout-info">

**The Gap**: Network tools see everything but lack identity. Observability tools have identity but lack depth. You need both.

</div>

---

## How Kubeshark Bridges the Gap

Kubeshark combines the depth of network tools with the context of observability platforms:

| Capability | Network Tools | Observability Tools | Kubeshark |
|------------|---------------|---------------------|-----------|
| Full payloads | ✓ | ✗ | ✓ |
| Every request (not sampled) | ✓ | ✗ | ✓ |
| Kubernetes identity | ✗ | ✓ | ✓ |
| Process-level context | ✗ | Partial | ✓ |
| API reconstruction | Manual | ✗ | ✓ |

Kubeshark enriches network traffic by correlating across multiple layers:

| Source | Context Added |
|--------|---------------|
| **Kubernetes API** | Pod name, service, namespace, labels, deployment |
| **eBPF (OS layer)** | Process ID, container ID, syscall context |
| **Protocol dissection** | Reconstructed API calls, request/response pairing |

The result: every API call is tagged with its complete Kubernetes identity, with full payload visibility.

```
Before (raw packet):
  10.244.1.15:43210 → 10.244.2.23:8080

After (Kubeshark enriched):
  frontend-7d4b8c6f9-x2k4m (namespace: production)
    → payment-service (namespace: production)
  Process: node (PID 1234)
  API: POST /api/v1/checkout
  Request body: {"user_id": 12345, "items": [...]}
  Response body: {"order_id": "abc-123", "status": "confirmed"}
  Latency: 145ms
  Status: 200 OK
```

---

## The Observability Gap

Modern observability relies on three pillars: **logs**, **metrics**, and **traces**. Each has limitations that network data fills.

| Pillar | What It Shows | What It Misses |
|--------|---------------|----------------|
| **Logs** | What the application chose to record | Unlogged errors, external service responses, exact payloads |
| **Metrics** | Aggregated measurements over time | Individual request details, root cause of anomalies |
| **Traces** | Request path through instrumented services | Uninstrumented services, actual payload content, network-level issues |
| **Network Data** | Exact bytes exchanged between services | Application internal state (but captures all external interactions) |

Network traffic complements these pillars by providing:

- **Complete coverage** — Captures everything, not just what's instrumented
- **Zero code changes** — Works with any application, any language, any framework
- **Exact reproduction** — See the precise request that caused a failure
- **Historical record** — Go back in time to any moment in your traffic history

---

## Who Benefits

### Site Reliability Engineers (SREs)

When production breaks at 3 AM, SREs need answers fast. Network data provides:

- The exact API call that triggered the incident
- Full request/response context, not just "500 error occurred"
- Upstream and downstream impact—what else was affected
- Timeline reconstruction—what happened in what order

**Instead of**: Correlating logs across 12 services, guessing which request failed
**With network data**: See the exact failed request, its payload, and the error response

### DevOps & Platform Engineers

Infrastructure decisions should be based on actual usage, not assumptions:

- Real service dependencies from traffic patterns
- Actual resource utilization per endpoint
- Traffic flows that inform network policy decisions
- Capacity planning based on real request volumes and sizes

**Instead of**: Maintaining outdated architecture diagrams
**With network data**: Generate accurate service maps from actual traffic

### Security Teams

Security requires visibility into what's actually happening, not what should be happening:

- All data flows, including internal east-west traffic
- Authentication and authorization patterns
- Sensitive data exposure in API payloads
- Anomalous behavior compared to baselines

**Instead of**: Relying on perimeter logs and hoping internal traffic is safe
**With network data**: Complete visibility into every service interaction

### Developers

Debugging distributed systems is hard. Network data makes it easier:

- See exactly what your service received and what it sent back
- Verify headers, payloads, and response codes match expectations
- Debug integration issues by comparing actual vs. expected traffic
- Test API contracts against real production behavior

**Instead of**: Adding debug logs, redeploying, reproducing the issue
**With network data**: Inspect the exact request that caused the bug

---

## The Accessibility Challenge

This wealth of information exists in every Kubernetes cluster. The challenge is accessing it effectively.

**Traditional approaches require:**
- Deep expertise in packet analysis and protocol internals
- Complex query languages with steep learning curves
- Manual correlation across thousands of concurrent requests
- Time—which is scarce during incidents

**The result**: Most teams underutilize their network data, or ignore it entirely, falling back to logs and metrics that tell only part of the story.

Kubeshark addresses this by providing an intuitive [Dashboard](/en/ui) and [AI-powered analysis](/en/mcp_use_cases) that makes network data accessible to everyone on the team.

---

## What's Next

- [Installation](/en/install) — Get Kubeshark running in your cluster
- [Dashboard](/en/ui) — Explore the Kubeshark interface
- [AI Integration](/en/mcp_use_cases) — Use AI to query your network data
