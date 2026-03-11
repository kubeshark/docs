---
title: Why Network Data Matters
description: Understanding why Kubernetes network traffic is the ground truth of what actually happens in a cluster — and why it has remained inaccessible until now.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubernetes network traffic is the most truthful record of what actually happens in a cluster. Every API call, every database query, every failed handshake, every retry — it's all there in the packets. This data is critical across nearly every domain in IT: incident response, root cause analysis, security forensics, compliance, reliability engineering, and performance optimization.

Yet this data remains largely inaccessible.

---

## The Fundamental Challenge

Three properties of Kubernetes networking make it uniquely difficult to capture and use.

**It's invisible.** In Kubernetes, pods communicate through virtual network interfaces within isolated network namespaces. Traffic between pods scheduled on the same node traverses the virtual bridge and never touches a physical interface. Traditional network monitoring that relies on span ports or physical taps simply cannot see it. You can't control which traffic stays in-node and which crosses the wire — scheduling decisions, autoscaling, and rolling deployments constantly reshape the topology.

**It's enormous.** A moderately busy cluster generates gigabytes of traffic per minute. Capturing it requires significant storage. Transferring it requires bandwidth. Processing it requires compute. Every step in the traditional workflow breaks down at Kubernetes scale.

**It's ephemeral.** Pods are created and destroyed continuously. The IP address that belonged to a payment service five minutes ago now belongs to a logging sidecar. Network namespaces appear and vanish. The mapping between what you see in the packets (IPs, ports) and what you care about (services, deployments, namespaces) is constantly shifting.

---

## Why the Traditional Workflow Can't Scale

The established approach to network-level troubleshooting follows a linear, manual sequence:

1. An incident occurs.
2. An engineer identifies which node(s) to investigate.
3. They attempt to run tcpdump — but in Kubernetes, this is harder than it sounds. Containers are built with minimal dependencies; tcpdump is rarely installed, and the stripped-down container OS may not support it. Installing tcpdump requires elevated privileges (CAP_NET_RAW, CAP_NET_ADMIN) that most security policies prohibit.
4. They capture traffic into a PCAP file.
5. They copy the PCAP to a workstation.
6. They open it in Wireshark and visually scan for anomalies.
7. They correlate what they find with logs, metrics, and traces from other systems.

Every step in this sequence has a scaling problem:

- **Reactive by nature.** You start capturing after you know there's an incident. The traffic that caused the problem — the failed request, the unexpected payload, the connection reset — is already gone. This is the most fundamental limitation: you cannot go back in time.
- **One node at a time.** tcpdump runs on a single node. A Kubernetes cluster may have dozens or hundreds of nodes. An incident may involve traffic patterns that span multiple nodes, namespaces, and services.
- **No Kubernetes context.** Raw PCAPs show IP addresses and ports. They don't show pod names, service names, namespaces, or deployment labels. At cluster scale, manual IP-to-workload resolution is impractical.
- **Wireshark doesn't scale either.** Wireshark is an extraordinary tool for deep packet inspection, but it's designed for a human operator working with a manageable capture file. Loading gigabytes of raw traffic overwhelms it.
- **Storage and transfer costs.** Full packet capture at cluster scale generates enormous volumes. Storing it on-node competes with application workloads for disk. Transferring it off-node is slow.

---

## The AI Opportunity — and the Gap

AI-driven workflows for incident response and root cause analysis hold enormous potential. Large language models can query, correlate, and reason across multiple data sources simultaneously. They can follow chains of causality that would take a human operator hours to trace manually.

But there's a gap. The data sources currently available to AI agents are the ones that are already structured and accessible: logs (text, easily ingested), metrics (numeric time series), and traces (structured spans). These are the low-hanging fruit of observability.

The network — the richest, most ground-truth source of what actually happened — remains out of reach for AI. There are two reasons:

**Access.** There is no standard mechanism for an AI agent to request, filter, and retrieve network traffic from a Kubernetes cluster. The tcpdump workflow described above is entirely manual.

**Format.** Even if an AI agent could obtain a PCAP file, raw packet capture is binary data. The token cost is prohibitive and the signal-to-noise ratio is terrible. What AI agents need is structured, indexed, contextually enriched network data — queryable and filterable — not raw bytes.

---

## How Kubeshark Solves This

Kubeshark is a Kubernetes-native network observability platform that makes packet-level traffic data continuously available, retrospectively queryable, and accessible to both engineers and AI agents.

### Always-On Kernel-Level Capture

Kubeshark uses eBPF to hook into the kernel's networking stack on every node, capturing traffic continuously without requiring any instrumentation, sidecars, or elevated pod privileges. Capture happens at the kernel level, below the container runtime, seeing all traffic — including in-node pod-to-pod communication that never reaches a physical interface.

Traffic is stored in a FIFO (first-in, first-out) buffer on each node. The retention window is determined by the allocated storage. Capture patterns can be tuned to target specific workloads, namespaces, or traffic profiles — reducing the capture footprint and extending the retention window.

This solves the most fundamental limitation of the traditional workflow: **you no longer need to predict when an incident will happen.** The traffic is already captured. You go back in time.

### Snapshots: Preserving What Matters

At any point — via the dashboard or through [MCP](/en/mcp) (Model Context Protocol), enabling AI agent access — a snapshot can be created from the raw capture buffer. Snapshots are filtered by time window, nodes, and workloads, extracting exactly the relevant traffic.

Snapshots serve a tiered retention model:

- **Short-term (node FIFO buffer):** Continuous, automatic, limited by allocated storage. Old data is overwritten as new data arrives.
- **Medium-term (Hub storage):** Snapshots are copied to centralized storage in the Kubeshark Hub, ensuring critical data isn't lost when the FIFO buffer cycles.
- **Long-term (cloud bucket):** Snapshots can be exported to [S3-compatible cloud storage](/en/snapshots_cloud_storage) for immutable, long-term retention — serving compliance requirements, forensic investigations, and audit trails.

### PCAP Export with Surgical Precision

From any snapshot, users and AI agents can export PCAP data filtered by time range, nodes, IP addresses, ports, and — critically — Kubernetes workload identities (pod names, service names, namespace labels). The exported PCAP contains exactly the material information, reducing file size by orders of magnitude compared to a raw full capture.

Wireshark remains a first-class tool in the workflow, but it's used for what it's best at — deep, focused inspection — rather than brute-force searching.

### Dissection: Making Traffic Queryable

A snapshot can be [dissected](/en/v2/l7_api_delayed) — a process that parses the raw packets, reconstructs application-layer protocols (HTTP, gRPC, Redis, Kafka, DNS, and more), and indexes the results into a searchable, queryable database. Think of it as the difference between a pile of documents and a search engine.

Once dissected, traffic is queryable through KFL (Kubeshark Filter Language), with full Kubernetes context enrichment: every packet and API call is tagged with its source and destination pod, service, namespace, and node.

### AI-Native Access via MCP

Kubeshark exposes its full capabilities through [MCP](/en/mcp) (Model Context Protocol), making every operation — checking capture status, creating snapshots, exporting PCAPs, querying dissected traffic, analyzing flows — available to AI agents as tool calls.

This closes the gap. An AI agent performing root cause analysis can:

1. Query L4 flow data to understand the connectivity topology.
2. Create a snapshot of the relevant time window.
3. Dissect the snapshot to index the traffic.
4. Query the dissected data — filtering by service, endpoint, status code, latency — to isolate anomalies.
5. Drill into specific API calls for full request/response payloads.
6. Export a filtered PCAP for archival or further human inspection.

The data is structured and token-efficient. Instead of feeding an LLM raw binary packets, Kubeshark provides Kubernetes-enriched, protocol-decoded network data.

---

## Why Not Existing Alternatives?

**Service meshes (Istio, Linkerd)** provide L7 observability through sidecar proxies, but only for traffic that flows through the mesh. They produce access logs and metrics — useful, but not packet-level data. You can't export a PCAP from Istio. You can't reconstruct the exact bytes of a failed request.

**Cilium Hubble** provides flow-level visibility using eBPF, but it operates at the flow metadata level — source, destination, verdict, protocol. It doesn't capture full packets, can't produce PCAPs, and doesn't provide L7 payload inspection. It's a network flow log, not a network recorder.

**Traditional packet brokers and TAPs** work at the physical network layer and have no awareness of Kubernetes constructs. They can't map traffic to pods, services, or namespaces. They're designed for hardware-centric environments, not dynamic container orchestration.

Kubeshark occupies a unique position: packet-level fidelity (full PCAP-grade capture), continuous and retrospective (always-on with time-travel), Kubernetes-native (full context enrichment), and AI-accessible (MCP integration). No other tool combines all four.

---

## The Outcome

**Before Kubeshark:** Incident occurs → engineer identifies affected nodes → attempts to install/run tcpdump (permissions, namespace issues) → captures traffic on one node at a time → copies PCAPs to workstation → opens in Wireshark → manually scans for anomalies → tries to correlate IPs to workload names → repeats across nodes → finds root cause (hours to days, if at all).

**With Kubeshark:** Incident occurs → AI agent (or engineer) queries the already-captured data → creates a filtered snapshot → dissects it → queries structured, Kubernetes-enriched data → correlates with other sources → identifies root cause → exports targeted PCAP for evidence. Minutes, not hours. Automated, not manual. Scalable across the entire cluster, not limited to one node.

For compliance-driven organizations, the always-on capture with tiered retention (FIFO → Hub → cloud bucket) provides an immutable audit trail of network activity — critical for industries like finance and healthcare where forensic evidence and chain-of-custody requirements apply.

For platform and reliability teams, Kubeshark provides Wireshark-grade network visibility without the Wireshark-era workflow — continuous, Kubernetes-aware, and accessible through both human interfaces and AI-driven automation.

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
- [AI Integration](/en/mcp_use_cases) — Connect AI agents to your network data
