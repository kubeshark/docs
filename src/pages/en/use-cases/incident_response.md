---
title: Incident Response
description: Retroactive network forensics for Kubernetes — continuous traffic recording, point-in-time snapshots, and AI-driven investigation to find root cause even after the incident has begun.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

**A CCTV-style "network flight recorder" for incident responders — record everything, replay anything, investigate with AI.**

When a production incident occurs — whether it's a service crash, a bug causing cascading failures, a misconfigured deployment, or a cluster-wide outage — understanding the root cause becomes the single most critical task. But here's the problem: **by the time you know you need evidence, it's already gone.**

You can't retroactively add logging. You can't go back and start a packet capture. The network traffic, system events, and API calls that led to the failure — the very evidence you need — have already passed and are no longer recoverable through conventional means.

Kubeshark solves this by acting as a "network flight recorder" for your Kubernetes cluster:

- **Continuously records** all raw network traffic, Kubernetes events, and OS events across every node — with [configurable retention](/en/v2/raw_capture_config) from hours to months or indefinitely with cloud backup
- **Preserves evidence on demand** — a single action creates an immutable [traffic snapshot](/en/v2/traffic_snapshots) of any time window, consolidating data from all nodes into dedicated storage
- **Reconstructs the full picture** — [on-demand dissection](/en/v2/l7_api_delayed) turns raw packets into a complete, chronological view of every API call, DNS query, TCP connection, and system event
- **Makes investigation accessible** — explore captured traffic visually through the [Dashboard](/en/ui) or conversationally through [AI-powered MCP tools](/en/mcp)
- **Retains artifacts for compliance** — snapshots serve as immutable forensic evidence, exportable to cloud storage or as PCAP files for independent analysis

---

## The Evidence Problem

Traditional incident response follows a frustrating pattern:

1. **Incident is detected** — alerts fire, users report errors, dashboards turn red
2. **Investigation begins** — the team scrambles to understand what happened
3. **Evidence is missing** — the traffic that caused the incident is gone; logs don't contain enough detail; there's no packet capture of the critical moments
4. **Reactive instrumentation** — engineers add debug logging, deploy trace collectors, start packet captures
5. **Waiting for recurrence** — the team hopes the problem happens again, this time with visibility in place
6. **Hours or days pass** — MTTR climbs while the team works with incomplete information

The fundamental issue: **the most important evidence — what happened in the moments leading up to the incident — is the hardest to obtain after the fact.**

Logs only contain what developers chose to record ahead of time. Metrics show aggregated symptoms, not causes. Traces require pre-existing instrumentation and miss uninstrumented services. None of these can be added retroactively to capture what already happened.

---

## The Scale and Distribution Challenge

Even if you wanted to capture network traffic proactively, Kubernetes environments make it extremely difficult:

- **Scale** — a production cluster generates gigabytes of traffic per minute across hundreds of pods and thousands of concurrent connections
- **Distribution** — traffic is spread across every node in the cluster; a single API transaction may traverse multiple nodes
- **Ephemerality** — pods come and go, IPs are reassigned, and the network topology changes constantly
- **Storage** — capturing and retaining raw packet data at cluster scale requires careful storage management

Without a purpose-built solution, teams are forced to capture traffic with limited scope — a specific pod, a specific time window, a specific protocol. This means you're always guessing *where* and *when* the next incident will originate, and you're almost always wrong.

---

## How Kubeshark Solves This

### Continuous Raw Capture

Kubeshark runs a [raw capture](/en/v2/raw_capture) agent on every node in the cluster, continuously recording:

- **All network traffic** — every packet flowing through the cluster, across all pods, services, namespaces, and nodes
- **Kubernetes events** — pod lifecycle, deployments, scaling events, and configuration changes
- **Operating system events** — process-level context, container mapping, and syscall activity

The retention window is configurable — **one hour, one day, one month, or indefinitely (using cloud storage backup)** — depending on your compliance requirements and storage budget. Kubeshark automatically manages the allocated storage, ensuring it never exceeds limits while retaining as much historical data as possible through the [raw capture configuration](/en/v2/raw_capture_config).

This is the critical difference: **the recording is always on.** When an incident occurs, the evidence is already captured.

### Point-in-Time Snapshots

When an incident is detected, a single action creates a [traffic snapshot](/en/v2/traffic_snapshots) — an immutable copy of all raw data from a specific time window:

- **"Last 5 minutes"** — capture the immediate context around a just-detected failure
- **"Between 1:00 PM and 2:00 PM yesterday"** — investigate an incident that was reported after the fact
- **"Last 24 hours"** — preserve a full day of traffic for a complex, slow-developing issue

The snapshot includes all raw packet data and events from every worker node in the cluster. These artifacts are collected from all workers and consolidated into dedicated storage on the Hub. Optionally, snapshots can also be exported to a cloud storage bucket (e.g., AWS S3) for long-term retention.

Once a snapshot is created, it is **immutable** — the evidence is preserved regardless of what happens next in the cluster. Pods can restart, nodes can be replaced, storage can rotate — the snapshot remains intact.

Snapshot creation can be performed **manually through the dashboard, or programmatically via [MCP tools](/en/mcp)** — including by an AI agent as part of an automated response pipeline.

---

## The Incident Response Workflow

### 1. Incident Detected

An alert fires — elevated error rates, increased latency, service unavailability. An on-call engineer is paged, or an automated response agent is triggered.

### 2. Preserve the Evidence

The first action is to create a snapshot covering the relevant time window. This can be a manual action through the dashboard, or an automated step performed by an AI agent via the [snapshot MCP tools](/en/mcp/raw_capture_tools).

The goal is to secure the raw evidence in immutable storage before it rotates out of the capture buffer — even if the investigation doesn't begin immediately.

### 3. Investigate

With the snapshot secured and dissected, the investigation begins. Kubeshark provides two complementary ways to sift through the captured traffic and find the root cause.

#### Visual Investigation via the Dashboard

Kubeshark's [Dashboard](/en/ui) provides a visual interface for investigating dissected snapshots. The dashboard is designed to help you filter out the noise and find the needle in the haystack:

- The [L4/L7 workload map](/en/v2/service_map) shows the communication topology during the snapshot window — which services communicated, error rates, and traffic volume at a glance
- The [L7 API stream](/en/api_stream) displays the chronological sequence of API calls with full request/response payloads, filterable by service, namespace, status code, or any other attribute
- [Display filters (KFL)](/en/display_filters) narrow the view to exactly the traffic that matters — isolating specific services, error codes, or traffic patterns from the surrounding noise:

```
http and response.status >= 500 and dst.namespace == "production"
```
```
dns and response.code == "NXDOMAIN"
```

- The [PCAP viewer](/en/v2/l4_to_l7) allows drill-down from L7 API calls to the underlying L4 packets for deep inspection

#### AI-Powered Investigation via MCP

Kubeshark's [MCP tools](/en/mcp) expose the entire forensic pipeline — dissection, traffic querying, and analysis — to AI agents. This means an engineer can also drive the investigation through natural language conversation, with the AI agent executing the underlying operations.

**Example: Investigating a suspected breach**

An engineer receives a report of suspicious activity in a specific availability zone:

**Prompt 1 — Preserve the evidence:**

> *"We have a suspected breach in our us-east-1 AZ. It was around 2 PM earlier today. Please create a traffic snapshot between 12:00 PM and 2:30 PM for all nodes in us-east-1."*

The AI agent calls the snapshot MCP tool, targeting the specific nodes in the affected availability zone and the requested time window. Within moments, all raw traffic, Kubernetes events, and OS events from that 2.5-hour window are preserved in immutable storage — safe from rotation, pod restarts, or any further cluster changes.

**Prompt 2 — Dissect and investigate:**

> *"Please dissect the snapshot and show me all traffic related to the namespace: critical-production-assets."*

The AI agent triggers [on-demand dissection](/en/v2/l7_api_delayed) of the snapshot, then queries the reconstructed traffic filtered to the target namespace. The engineer now sees a complete, chronological view of every API call, DNS query, TCP connection, and system event involving workloads in that namespace — spanning the entire 2.5-hour window, across all nodes in the availability zone.

From here, the engineer can continue the conversation — drilling into specific connections, examining payloads, identifying anomalous patterns — all through natural language, with the AI agent translating each question into the appropriate MCP tool calls.

#### What the dissected snapshot reveals

Regardless of whether you investigate through the dashboard or through an AI agent, the dissected snapshot provides:

| What You See | What It Tells You |
|---|---|
| **Chronological API call sequence** | The exact order of service interactions leading up to the failure |
| **Full request/response payloads** | What was sent, what was received, and where the mismatch occurred |
| **DNS resolution history** | Service discovery failures, stale cache entries, resolution delays |
| **Connection lifecycle events** | Resets (RST), graceful closes (FIN), incomplete handshakes — the [connection completeness](/en/mcp/tcp_insights#connection-completeness-bitmask) bitmask tells you exactly how each connection lived and died |
| **OS-level process context** | Which container and process originated each connection |

In addition to L7 API traffic, dissected snapshots include [TCP Expert Insights](/en/mcp/tcp_insights) — Wireshark-grade metrics for every TCP connection in the snapshot:

| TCP Metric | What It Reveals During an Incident |
|---|---|
| **Initial RTT / handshake timing** | Baseline network latency — distinguishes network path issues from application slowness. High initial RTT points to infrastructure; normal RTT with slow responses points to the application |
| **Retransmission rate** | Packet loss on the wire. Above 1% indicates degraded network paths; above 5% means severe congestion or a faulty link. Fast retransmissions vs. timeout-based retransmissions indicate whether recovery is working |
| **Zero-window / window-full events** | Receiver backpressure — the application isn't reading from the socket fast enough. Points to overloaded services, slow consumers, or resource exhaustion |
| **RTT jitter** | Network path consistency. High jitter with low base RTT suggests bufferbloat or burst traffic causing variable queuing delays |
| **Goodput vs. total bytes** | Bandwidth wasted on retransmissions. If goodput is significantly less than total bytes, the connection is spending capacity re-sending lost data |
| **Connection completeness** | How each connection ended — normal close, reset, incomplete handshake, or mid-stream failure. Patterns across many connections reveal systemic issues (e.g., all connections to a service ending in RST = service crashing) |

These metrics are available through the dashboard and queryable by AI via MCP. For diagnostic decision trees and detailed metric interpretation, see the [TCP Expert Insights](/en/mcp/tcp_insights) reference.

### 4. Root Cause Identified

By replaying the snapshot — visually through the dashboard or conversationally through an AI agent — the team pinpoints the root cause. Not from logs that may have missed it, not from metrics that only showed the symptom, but from the actual network traffic that carried the failure.

### 5. Evidence Retention

After the investigation, the snapshot and its dissected data serve a dual purpose:

**As a forensic record:**
- The immutable snapshot is the authoritative evidence of what happened on the network — raw packets, Kubernetes events, and OS events, exactly as they occurred
- Snapshots can be retained on the Hub or exported to cloud storage (e.g., AWS S3) for long-term archival
- PCAP files can be exported for independent analysis in [Wireshark](https://www.wireshark.org/) or other forensic tools
- Any team member can independently dissect and review the same snapshot, ensuring reproducible conclusions

**As evidence of due diligence:**
- The snapshot demonstrates that the organization captured and preserved the relevant evidence
- The dissection and AI-powered investigation provide a documented trail of the analysis performed
- Together, these artifacts show that a thorough, systematic investigation was conducted — critical for compliance, audit, and post-mortem accountability

---

## Common Incident Scenarios

### Cascading Service Failures

**Symptom:** Multiple services reporting errors simultaneously.

**Investigation approach:**
1. Snapshot the time window starting *before* the first error appeared
2. Dissect and open the workload map to identify the origin — the service that first started returning errors
3. Inspect the failing requests at each hop to trace the cascade path
4. Look at the origin service's upstream dependencies — the root cause is often one layer deeper

### Intermittent Failures

**Symptom:** Sporadic errors or timeouts that are difficult to reproduce.

**Investigation approach:**
1. Keep continuous capture running with sufficient retention
2. When the issue recurs, snapshot a window that includes multiple occurrences
3. Compare successful and failed requests side by side
4. Check [TCP Expert Insights](/en/mcp/tcp_insights) — intermittent issues often correlate with elevated retransmission rates, high RTT jitter, or specific node-to-node paths showing packet loss. Look at `connection_completeness` to identify connections that failed mid-handshake or were reset unexpectedly

### Performance Degradation

**Symptom:** Gradually increasing latency across services.

**Investigation approach:**
1. Snapshot a window that spans the period of degradation
2. Dissect and compare `initial_rtt` (network baseline) vs. application response time — if initial RTT is normal but responses are slow, the problem is in the application; if initial RTT is elevated, the network path is degraded
3. Check retransmission rates and `zero_window_events` — high retransmissions point to network congestion; zero-window events point to an overwhelmed receiver that can't process data fast enough
4. Look at RTT jitter — if `rtt_max` is orders of magnitude above `rtt_min`, suspect bufferbloat or burst traffic causing variable queuing delays

### Failed Deployments

**Symptom:** Errors spike immediately after a new version is deployed.

**Investigation approach:**
1. Snapshot a window that covers the period before *and* after the deployment
2. Compare the new version's request/response behavior against the previous version
3. Look for schema changes, missing headers, authentication failures, or changed error formats
4. Check health check endpoints — are they responding correctly under the new version?

---

## What's Next

- [TCP Expert Insights](/en/mcp/tcp_insights) — Wireshark-grade TCP metrics, diagnostic decision trees, and metric interpretation
- [Traffic Forensics](/en/use-cases/forensics) — Deep-dive forensic analysis of captured traffic
- [Real-time Traffic Inspection](/en/use-cases/real_time_traffic_inspection) — Live traffic visibility for debugging and monitoring
- [Traffic Snapshots](/en/v2/traffic_snapshots) — Creating and managing point-in-time snapshots
- [Raw Capture](/en/v2/raw_capture) — How continuous packet capture works
- [AI-Powered Analysis](/en/v2/ai_powered_analysis) — Conversational investigation of captured traffic
