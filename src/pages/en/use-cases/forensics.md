---
title: Traffic Forensics
description: Investigate past issues in Kubernetes without advance preparation — continuous traffic recording to cloud storage, on-demand snapshots, and full reconstruction of any time window.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

**"Your app was misbehaving during the weekend."**

That's the entire bug report. No logs, no error codes, no timestamps. A customer or internal team noticed something was off — maybe a failed transaction, maybe slow responses, maybe intermittent errors — and now it's Monday morning and someone needs to figure out what happened.

This is the reality for any team that operates and supports deployed applications — support engineers, SREs, DevOps teams, platform teams, or developers who own their services in production. By the time an issue is reported, the evidence is in the past. There are no packet captures from that moment, no debug logs that were conveniently enabled, and no way to reproduce the exact conditions.

**What can you actually do?** Read whatever logs exist and hope they contain something useful. Most of the time, they don't.

Kubeshark changes this entirely. With Kubeshark running in your cluster, **every network interaction is continuously recorded to cloud storage** — and available for investigation at any time, without any advance preparation.

<div class="callout callout-info">

**How this differs from [Incident Response](/en/use-cases/incident_response):** In the incident response use case, Kubeshark records to a local rolling buffer and a snapshot is taken on demand when an incident is detected. Traffic Forensics goes further — **all traffic is continuously backed up to cloud storage** (e.g., AWS S3), providing days, weeks, or months of historical reach. This requires significantly more storage, but means you can investigate issues that were reported long after they occurred, without anyone having created a snapshot at the time.

</div>

---

## The Problem: Nothing to Go On

Any team responsible for a deployed application faces this scenario constantly:

- **"The checkout flow was broken yesterday afternoon"** — which service? Which API call? What error?
- **"Something was slow between 2 PM and 3 PM last Thursday"** — was it the network? The application? A specific dependency?
- **"A specific workload was misbehaving at a specific time"** — what was it doing? What was it communicating with? What responses was it getting?

Traditional observability tools offer limited help:

| Tool | What You Can Do After the Fact |
|---|---|
| **Logs** | Read whatever the application chose to log — often missing the critical detail |
| **Metrics** | See that error rates or latency increased — but not *why* |
| **Traces** | Only available for instrumented services, and only if sampling captured the relevant requests |
| **Packet capture** | Nothing — you weren't capturing at the time |

The gap is fundamental: **you can't investigate what you didn't record.** And you can't know in advance what you'll need to investigate.

---

## How Kubeshark Solves This

### Always-On Recording to Cloud Storage

Kubeshark continuously captures all network traffic, Kubernetes events, and operating system events across every node in the cluster. This recorded data is stored in an immutable cloud storage bucket (e.g., AWS S3), with [configurable retention](/en/v2/raw_capture_config):

- **One day** — cover the last 24 hours of activity
- **One week** — investigate issues reported after the weekend
- **One month** — handle delayed customer complaints and SLA reviews
- **One year** — meet compliance and audit requirements

The cloud bucket serves as a long-term, immutable archive of everything that happened on the network. Continuous recording to cloud storage requires significantly more storage than the local rolling buffer used in [incident response](/en/use-cases/incident_response), but the trade-off is complete historical coverage — you can investigate any point in the retention window, not just moments where someone thought to create a snapshot.

Storage is managed automatically — Kubeshark ensures it stays within allocated limits while retaining as much historical data as possible.

**No preparation is needed.** No one has to decide in advance what to capture, which services to target, or when to start recording. Kubeshark captures everything, all the time.

### On-Demand Snapshots from Cloud Storage

When an issue needs investigation, a team member creates a [traffic snapshot](/en/v2/traffic_snapshots) — selecting a specific time window from the data stored in the cloud bucket:

- **"Last Friday, 2 PM to 3 PM"** — the hour when the customer reported slowness
- **"Saturday 8 AM to Sunday 6 PM"** — the full weekend when the app was misbehaving
- **"Yesterday, 14:23 to 14:28"** — a precise 5-minute window around a known failure

The snapshot pulls all raw data from that time window — packets, Kubernetes events, OS events — and makes it available for analysis. The investigation can be narrowed to **specific workloads**, **specific namespaces**, or the **entire cluster**, depending on what's known about the issue.

### Dissection: See What Actually Happened

Once a snapshot is created, [on-demand dissection](/en/v2/l7_api_delayed) reconstructs the raw data into a complete, human-readable view of everything that occurred during that window:

| What You See | What It Tells You |
|---|---|
| **Chronological API call sequence** | The exact order of service interactions — who called what, when, and in what order |
| **Full request/response payloads** | What was sent and what was received — headers, body, status codes |
| **DNS resolution history** | Service discovery behavior — failures, latency, stale cache entries |
| **TCP connection health** | [L4 Expert Insights](/en/mcp/tcp_insights) — retransmission rates, handshake latency, zero-window events, connection lifecycle |
| **Service topology** | Which services communicated, traffic volume, error rates — the actual dependency graph during that window |
| **Kubernetes context** | Pod, service, namespace, node, labels — mapped to every connection and API call |
| **OS-level context** | Which process inside which container initiated each connection |

The investigator can now **see with their own eyes** the exact sequence of events that happened during the reported time window. No guessing, no interpretation — the raw evidence, reconstructed and browsable.

---

## The Investigation Workflow

### 1. Receive the Report

A customer or internal team reports an issue: *"The app was misbehaving between 2 PM and 3 PM yesterday."*

### 2. Create a Snapshot

The engineer creates a snapshot from the cloud bucket covering the reported time window — plus some margin before and after. No special access is needed, no infrastructure changes, no coordination with other teams.

### 3. Dissect the Snapshot

On-demand dissection reconstructs the raw capture into browsable, filterable traffic. This can be triggered through the [Dashboard](/en/ui) or programmatically via [MCP tools](/en/mcp).

### 4. Investigate

The investigation can proceed through the dashboard or through AI-powered analysis:

**Visual investigation via the Dashboard:**

- Open the [workload map](/en/v2/service_map) to see the communication topology during the snapshot window
- Browse the [API stream](/en/api_stream) to see the chronological sequence of requests and responses
- Apply [display filters](/en/display_filters) to narrow down to the relevant services, endpoints, or error codes
- Drill into individual requests to inspect full payloads, headers, and timing
- Check [L4 Expert Insights](/en/mcp/tcp_insights) for network-level issues — retransmissions, latency spikes, connection failures

**AI-powered investigation via MCP:**

> *"Show me all errors returned by the checkout-service between 2 PM and 3 PM yesterday"*

> *"What was the payment-gateway communicating with during this window? Were there any timeouts?"*

> *"Find all DNS resolution failures in this snapshot"*

> *"Show me TCP connections with retransmission rates above 5% — is there a network problem?"*

### 5. Root Cause Identified

By replaying the snapshot, the engineer identifies what actually happened — the specific API call that failed, the upstream dependency that timed out, the network path that was dropping packets, or the deployment that changed behavior.

### 6. Evidence Preserved

The snapshot and its dissection results serve as a permanent record:

- **For the customer** — concrete evidence of what happened and what was done to investigate
- **For the team** — shareable, reproducible analysis that any engineer can independently review
- **For compliance** — immutable, timestamped records stored in cloud storage
- **As due diligence** — documented proof that a thorough investigation was conducted

---

## Common Scenarios

### "The App Was Slow Over the Weekend"

1. Create a snapshot covering Saturday and Sunday from the cloud bucket
2. Dissect and filter to the affected service
3. Compare request/response latency across the window — identify when slowness started and ended
4. Check TCP handshake RTT and retransmission rates — was it a network issue or application issue?
5. Look at upstream dependencies — was a database or external API responding slowly?

### "A Specific Workload Was Misbehaving at a Specific Time"

1. Create a snapshot for the reported time window
2. Dissect and narrow the investigation to the specific workload's namespace and pods
3. Inspect all inbound and outbound traffic — what requests was it receiving? What responses was it returning?
4. Check for error responses, timeouts, connection resets, or unexpected payloads
5. Trace the call chain to identify whether the issue originated in the workload itself or in a dependency

### "We Need to Verify What Happened Before and After a Deployment"

1. Create two snapshots — one from before the deployment, one from after
2. Dissect both and compare the same API endpoints across both windows
3. Look for changes in response formats, status codes, payload content, or latency profiles
4. Check health check and readiness endpoints — were they responding correctly under the new version?

### "A Customer Reports Data Inconsistency"

1. Create a snapshot covering the time window when the inconsistency occurred
2. Dissect and trace the full request chain for the affected operation
3. Inspect every hop — what data was sent by the client, what was received by each service, what was written to the database
4. Identify where the data diverged from what was expected

### "Intermittent Errors That No One Can Reproduce"

1. With cloud storage retention covering days or weeks, wait for the issue to recur
2. When it does, create a snapshot that includes multiple occurrences
3. Compare successful requests with failing ones — same endpoint, different outcomes
4. Look for patterns in timing, source pods, TCP-level anomalies, or specific request payloads

---

## No Preparation Required

The key insight is that **none of this requires advance preparation**. There is no need to:

- Decide which services to monitor in advance
- Enable debug logging before the issue occurs
- Start a packet capture and hope the problem happens again
- Instrument applications with tracing libraries

The only requirement is to have Kubeshark running in the cluster with cloud storage retention configured. Everything else — snapshot creation, dissection, investigation — happens on demand, after the fact, when someone needs answers.

---

## What's Next

- [Raw Capture Configuration](/en/v2/raw_capture_config) — Configure retention and cloud storage
- [Traffic Snapshots](/en/v2/traffic_snapshots) — Creating and managing snapshots
- [Delayed Dissection](/en/v2/l7_api_delayed) — On-demand reconstruction of snapshot data
- [TCP Expert Insights](/en/mcp/tcp_insights) — Wireshark-grade TCP metrics for deep network analysis
- [Incident Response](/en/use-cases/incident_response) — The end-to-end incident response workflow
