---
title: Why Network Data Matters
description: Understanding the wealth of information in network traffic — the ground truth of what actually happens in a Kubernetes cluster.
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
| **TCP Handshake Latency** | Initial RTT measured from the 3-way handshake (SYN → SYN-ACK)—the cleanest network latency measurement, free of application processing delay. P50/P90/P99 percentiles across all connections |
| **Connection Lifecycle** | Full [connection completeness](/en/mcp/tcp_insights#connection-completeness-bitmask) tracking—SYN, SYN-ACK, ACK, DATA, FIN, RST as a bitmask per connection. Reveals incomplete handshakes, resets, half-open connections, and abnormal terminations |
| **Congestion & Packet Loss** | Per-connection retransmission rate (the single most useful health indicator), fast retransmissions triggered by duplicate ACKs, out-of-order packets, missing segments—with clear thresholds (0-1% healthy, 1-5% degraded, 5%+ severe) |
| **Receiver Backpressure** | Zero-window events (receiver overwhelmed, can't read fast enough), window-full events (sender filled receiver's buffer), average receive window size, window scaling negotiation—distinguishing application bottlenecks from network problems |
| **Latency & Jitter** | Per-connection RTT min/max/avg with sample count, RTT jitter (standard deviation), time-to-first-byte, handshake time vs. connection time—detecting bufferbloat (low min, high max), congestion (avg >> min), and TLS overhead (connection time >> handshake time) |
| **Throughput & Efficiency** | Goodput (useful application data) vs. total bytes per connection—quantifying bandwidth wasted on retransmissions. Bytes, packets, and throughput rates per flow, per service, per node |
| **DNS Resolution** | Every query and response, resolution latency, NXDOMAIN errors, TTL behavior, caching effectiveness |
| **TLS Negotiation** | Handshake timing, cipher selection, certificate exchange, protocol version, handshake failures |
| **Encrypted Traffic** | TLS-encrypted communication—HTTPS payloads, mTLS service-to-service calls, encrypted database connections |
| **Cross-Node & Cross-AZ Traffic** | Node-to-node latency, cross-availability-zone round-trip times, remote node communication patterns |

For the complete TCP metrics reference including diagnostic decision trees, see [TCP Expert Insights](/en/mcp/tcp_insights).

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

## What Network Data Provides That Other Sources Don't

Modern observability relies on three pillars: **logs**, **metrics**, and **traces**. Each captures a different slice of reality. Network data fills the gaps that all three leave behind.

| Pillar | What It Shows | What It Misses |
|--------|---------------|----------------|
| **Logs** | What the application chose to record | Unlogged errors, external service responses, exact payloads |
| **Metrics** | Aggregated measurements over time | Individual request details, root cause of anomalies |
| **Traces** | Request path through instrumented services | Uninstrumented services, actual payload content, network-level issues |
| **Network Data** | Exact bytes exchanged between services, per-connection TCP health (retransmissions, RTT, jitter, window pressure, connection lifecycle), full API payloads | Application internal state (but captures all external interactions) |

Network data is unique because it provides:

- **Complete coverage** — captures everything, not just what's instrumented or what a developer thought to log
- **Zero code changes** — works with any application, any language, any framework, including third-party and legacy services
- **Exact reproduction** — the precise request that caused a failure, not a statistical summary
- **Full depth** — from L4 TCP health (retransmissions, latency, connection lifecycle) to L7 API content (headers, payloads, status codes) in a single data source
- **Historical record** — go back in time to any moment in your traffic history

---

## What's Next

- [Installation](/en/install) — Get Kubeshark running in your cluster
- [Real-time Traffic Inspection](/en/use-cases/real_time_traffic_inspection) — See live traffic as it flows
- [Incident Response](/en/use-cases/incident_response) — Investigate incidents with captured traffic
- [Traffic Forensics](/en/use-cases/forensics) — Reconstruct past events from recorded traffic
