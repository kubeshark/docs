---
title: Why Kubeshark
description: Making Kubernetes network traffic accessible — the ground truth of what actually happens in a cluster, and why it has remained inaccessible until now.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

## Wireshark vs. Kubeshark

Kubeshark brings Wireshark-like capabilities to Kubernetes, with instant, cluster-wide PCAP access. You can still go deep with Wireshark. But Wireshark serves a different purpose: it is built for human inspection, which is limited in scale and takes a lot of time.

Wireshark requires a PCAP file, typically obtained through something like tcpdump. This works well for targeted analysis on a single machine. In Kubernetes, two things break down:

1. **File size.** Wireshark is designed for manageable capture files. Kubernetes clusters generate gigabytes of traffic per minute across distributed nodes. Capturing, copying, and loading these files on an analysis desktop doesn't scale.

2. **Human inspection.** Wireshark assumes a network engineer will visually inspect the traffic. The volume of data in a Kubernetes cluster exceeds what a human can process.

Beyond scalability, there is a **context gap**. Raw PCAPs contain IPs and ports — not pod names, service names, namespaces, or deployment labels. Mapping IPs to Kubernetes workload identities is a challenge Wireshark was never designed to solve.

**Kubeshark** addresses all three problems. It delivers cluster-wide, instant access to L4 and L7 traffic — structured, Kubernetes-enriched, and optimized for AI consumption. AI agents can process massive network data without prohibitive token costs. The result: AI-driven RCA workflows capable of processing 10x the traffic in 1/10th the time.

When deep inspection is needed, Kubeshark delivers the right PCAP to Wireshark — small, filtered, and contextually relevant.

---

## Challenges Processing Network Data

Three properties of Kubernetes networking make traffic difficult to capture and use:

- **Invisible.** Pods communicate through virtual network interfaces in isolated namespaces. In-node pod-to-pod traffic never touches a physical interface. Span ports and physical taps cannot see it.

- **Enormous.** A moderately busy cluster generates gigabytes of traffic per minute. Capturing, transferring, and processing it at scale is resource-intensive.

- **Ephemeral.** Pods are created and destroyed continuously. The mapping between IPs/ports and services/deployments/namespaces shifts constantly.

---

## The AI Gap

Network traffic is the richest source of information in a Kubernetes cluster, yet AI agents are effectively prohibited from processing it — the token cost of raw packet data would be unbearable.

Kubeshark closes this gap. It enables AI agents to slice and dice network data, serving it up significantly reduced in size and optimized to be digested by AI agents:

- Cluster-wide packets and dissected API calls, filtered to what matters
- Data sized for AI consumption
- Works in real-time and retrospectively

Think of Kubeshark as Google Search for network data — it indexes cluster-wide traffic so that querying it is fast and low-cost, whether the consumer is a human or an AI agent.

Kubeshark is built to integrate into AI-driven workflows — particularly [incident response](/en/use-cases/incident_response) and [root cause analysis](/en/use-cases/forensics) — by providing AI-optimized access to the information hidden in network traffic.

---

## What Kubeshark Does

1. **[Capture](/en/pod_targeting)** — Targets important workloads using eBPF at the kernel level. No packet loss. No sidecars. Hardly consumes any compute resources. Raw traffic is stored in short-term FIFO retention on each node, automatically cycling old data as new data arrives.

2. **[Snapshot and retain](/en/dashboard_snapshots)** — PCAP snapshots can be created at any point from the short-term retention data, filtered by time window, nodes, and workloads. Snapshots can be exported to [long-term, immutable cloud storage](/en/snapshots_cloud_storage) (AWS S3, Azure Blob, Google Cloud Storage).

3. **[Real-time inspection](/en/use-cases/real_time_traffic_inspection)** — A parallel and independent route from the capture-snapshot-dissect process. Traffic is dissected on the wire at the speed of Kubernetes, enabling real-time monitoring and real-time troubleshooting. Consumes CPU and memory resources on the nodes.

4. **[Retrospective dissection and indexing](/en/v2/l7_api_delayed)** — Snapshots are parsed into application-layer protocols (HTTP, gRPC, Redis, Kafka, DNS, and more), indexed, and can respond to any query instantly. Every record is tagged with full Kubernetes context.

5. **[AI access via MCP](/en/mcp)** — AI agents get tools to slice and dice, query, and correlate network data at a reasonable token cost.

6. **[Dashboard](/en/ui)** — A rich UI with Wireshark-like capabilities, giving human operators instant, cluster-wide visibility into L4 and L7 traffic.

---

## What's Next

- [Installation](/en/install) — Get Kubeshark running in your cluster
- [Real-time Traffic Inspection](/en/use-cases/real_time_traffic_inspection) — See live traffic as it flows
- [Incident Response](/en/use-cases/incident_response) — Investigate incidents with captured traffic
- [Traffic Forensics](/en/use-cases/forensics) — Reconstruct past events from recorded traffic
- [AI Integration](/en/mcp_use_cases) — Connect AI agents to your network data
