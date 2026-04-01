---
title: Why Kubeshark
description: Making Kubernetes network traffic accessible — the ground truth of what actually happens in a cluster, and why it has remained inaccessible until now.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Network traffic is the ground truth of what happens in a Kubernetes cluster. It's also nearly impossible to use: **invisible** (pod-to-pod traffic never hits a physical interface), **enormous** (gigabytes per minute), and **ephemeral** (IP-to-workload mappings shift constantly).

Kubeshark makes it accessible — to humans and AI agents alike.

---

## Beyond Wireshark

Wireshark is built for a single engineer inspecting a single PCAP on a single machine. In Kubernetes, that model breaks:

- **Doesn't scale.** 100 nodes = 100 tcpdump sessions, 100 files, 100x the size.
- **Can't keep up.** Cluster traffic volume exceeds what a human can visually inspect.
- **Missing context.** Raw PCAPs have IPs and ports — not pod names, namespaces, or labels.

Kubeshark delivers cluster-wide L4/L7 traffic — structured, Kubernetes-enriched, and ready for consumption. When deep inspection is needed, it hands the right PCAP to Wireshark: small, filtered, and contextually relevant.

---

## Built for AI

Network data is the richest signal in a cluster, yet raw packets are too expensive for AI agents to process. Kubeshark closes this gap — think of it as **Google Search for network data**:

- Indexes cluster-wide traffic so queries are fast and low-cost
- Filters and structures data for AI-friendly token budgets
- Works in real-time and retrospectively
- Integrates into [incident response](/en/use-cases/incident_response) and [root cause analysis](/en/use-cases/forensics) workflows via [MCP](/en/mcp)

The result: AI-driven RCA that processes 10x the traffic in 1/10th the time.

---

## How It Works

1. **[Capture](/en/pod_targeting)** — eBPF at the kernel level. No sidecars, no packet loss, minimal overhead. Raw traffic sits in short-term FIFO retention per node.
2. **[Snapshot & retain](/en/dashboard_snapshots)** — Create filtered PCAP snapshots anytime; export to [cloud storage](/en/snapshots_cloud_storage) (S3, Azure Blob, GCS) for long-term retention.
3. **[Real-time inspection](/en/use-cases/real_time_traffic_inspection)** — Traffic indexed on the wire at cluster speed for live monitoring and troubleshooting.
4. **[Retrospective indexing](/en/v2/l7_api_dissection#delayed-indexing)** — Snapshots parsed into L7 protocols (HTTP, gRPC, Redis, Kafka, DNS, …), fully indexed with Kubernetes context.
5. **[AI access via MCP](/en/mcp)** — AI agents query and correlate network data at reasonable token cost.
6. **[Dashboard](/en/ui)** — Wireshark-like UI with cluster-wide L4/L7 visibility.

---

## What's Next

- [Installation](/en/install) — Get Kubeshark running in your cluster
- [Real-time Traffic Inspection](/en/use-cases/real_time_traffic_inspection) — See live traffic as it flows
- [Incident Response](/en/use-cases/incident_response) — Investigate incidents with captured traffic
- [Traffic Forensics](/en/use-cases/forensics) — Reconstruct past events from recorded traffic
- [AI Integration](/en/mcp_use_cases) — Connect AI agents to your network data
