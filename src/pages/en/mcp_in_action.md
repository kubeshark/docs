---
title: MCP in Action
description: A real-world example of using AI to analyze Kubernetes service health through Kubeshark's MCP server.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

This page walks through a complete example of AI-powered network analysis—from the user's question to actionable insights.

---

## The Scenario

A developer gets paged: checkout latency has spiked and users are abandoning carts. Instead of diving into dashboards and logs, they ask their AI assistant (configured with Kubeshark's MCP server) to investigate.

---

## The Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          USER  ←→  AI  ←→  KUBESHARK                         │
└──────────────────────────────────────────────────────────────────────────────┘

  USER                           AI                           KUBESHARK
    │                            │                                │
    │  "What can you tell me     │                                │
    │   about my frontend        │                                │
    │   service?"                │                                │
    │ ─────────────────────────► │                                │
    │                            │                                │
    │                            │  GET /mcp/data-boundaries      │
    │                            │ ─────────────────────────────► │
    │                            │                                │
    │                            │  ◄─ 3 nodes, 14:00-15:00 UTC   │
    │                            │                                │
    │                            │  POST /mcp/snapshots           │
    │                            │  {name: "frontend-analysis"}   │
    │                            │ ─────────────────────────────► │
    │                            │                                │
    │                            │  ◄─ 850 MB snapshot ready      │
    │                            │                                │
    │                            │  POST /delayed_dissection      │
    │                            │ ─────────────────────────────► │
    │                            │                                │
    │                            │  ◄─ 12,847 API calls dissected │
    │                            │                                │
    │                            │  GET /mcp/calls?kfl=...        │
    │                            │ ─────────────────────────────► │
    │                            │                                │
    │                            │  ◄─ Traffic data (JSON)        │
    │                            │                                │
    │                            │  ┌─────────────────────┐       │
    │                            │  │ AI analyzes:        │       │
    │                            │  │ • Performance       │       │
    │                            │  │ • Anomalies         │       │
    │                            │  │ • API patterns      │       │
    │                            │  └─────────────────────┘       │
    │                            │                                │
    │  "Based on 12,847 API      │                                │
    │   calls, here's what I     │                                │
    │   found..."                │                                │
    │ ◄───────────────────────── │                                │
    │                            │                                │
    │  "Tell me more about       │                                │
    │   those 503 errors"        │                                │
    │ ─────────────────────────► │                                │
    │                            │                                │
    │                            │  GET /mcp/calls?kfl=           │
    │                            │  response.status==503          │
    │                            │ ─────────────────────────────► │
    │                            │                                │
    │                            │  ◄─ 127 failed requests        │
    │                            │                                │
    │  "All 503 errors occur     │                                │
    │   when payment-service     │                                │
    │   exceeds 5s timeout..."   │                                │
    │ ◄───────────────────────── │                                │
    │                            │                                │
    ▼                            ▼                                ▼
```

---

## The Conversation

**User:**
> "What can you tell me about my service? The name is `frontend`."

**AI (via MCP):**
> "Let me examine the last hour of your frontend service's operation. I'll create a snapshot from the recorded traffic and analyze the API calls for anomalies."

---

## Behind the Scenes: MCP Tool Calls

Kubeshark continuously records network traffic, Kubernetes events, and operating system events across all nodes. When the AI needs to analyze traffic, it creates a snapshot—isolating a time window from this continuous recording for focused analysis.

### 1. Check Data Availability

```
GET /mcp/data-boundaries
```
→ Returns: 3 nodes with recorded data from 14:00 to 15:00 UTC

### 2. Create Snapshot from Recorded Traffic

```
POST /mcp/snapshots
{
  "name": "frontend-analysis",
  "duration": "1h"
}
```
→ Kubeshark isolates the last hour of recorded traffic into a dedicated snapshot
→ Returns: Snapshot creation started

### 3. Wait for Snapshot Completion

```
GET /mcp/snapshots/frontend-analysis
```
→ Polls until complete
→ Returns: 850 MB isolated across 3 nodes

### 4. Start L7 Dissection

```
POST /delayed_dissection.DelayedDissection/Start
{
  "snapshot_name": "frontend-analysis",
  "dissection_name": "analysis-1"
}
```
→ Returns: Dissection job running

### 5. Wait for Dissection Completion

```
GET /delayed_dissection.DelayedDissection/GetStatus
```
→ Polls until complete
→ Returns: 12,847 API calls dissected

### 6. Query Outbound Traffic (from frontend)

```
GET /mcp/calls?db=frontend-analysis/analysis-1&kfl=src.pod contains "frontend"&limit=1000&format=full
```
→ Returns: 3,421 calls from frontend service

### 7. Query Inbound Traffic (to frontend)

```
GET /mcp/calls?db=frontend-analysis/analysis-1&kfl=dst.svc=="frontend"&limit=1000&format=full
```
→ Returns: 8,926 calls to frontend service

---

## The Analysis

With the dissected traffic in hand, the AI examines the data and identifies:

### Performance Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| Latency P50 | 45ms | Healthy |
| Latency P99 | 230ms | Acceptable |
| TCP handshake | < 5ms | Normal |
| Error rate | 2.3% | Elevated |

### Anomalies Detected

- **Checkout failures**: `/api/v1/checkout` returning 503 errors (2.3% of requests)
- **Retry storms**: `cart-service` → `frontend` showing same request 3x within 100ms
- **Connection churn**: 847 new TCP connections/minute to `catalogue-db`

### API Flow Analysis

- **User journey**: login → catalogue → cart → checkout
- **Missing observability**: 12% of requests lack correlation IDs
- **Blocking pattern**: checkout calls payment-service synchronously

---

## The Report

**AI Response:**

> "Based on analyzing 12,847 API calls over the last hour, here's what I found about your `frontend` service:
>
> **Healthy:**
> - Overall latency is good (45ms P50)
> - TCP connection establishment is fast (< 5ms)
> - Most endpoints return success (97.7% 2xx responses)
>
> **Needs Attention:**
>
> 1. **Checkout failures** — 2.3% of `/api/v1/checkout` calls return 503. The upstream `payment-service` appears to be timing out under load.
>
> 2. **Retry storms** — `cart-service` is retrying failed requests too aggressively, sending the same request 3 times within 100ms. This amplifies traffic during incidents.
>
> 3. **Database connection churn** — Your service is creating 847 new connections/minute to `catalogue-db`. Consider implementing connection pooling.
>
> 4. **Synchronous blocking** — The checkout flow calls `payment-service` synchronously, blocking the request thread. Consider making this async or adding a timeout.
>
> Want me to dig deeper into any of these issues?"

---

## Drilling Deeper

The developer wants to understand the checkout failures:

**User:**
> "Tell me more about those checkout 503 errors. What's causing them?"

**AI (makes additional MCP calls):**

```
GET /mcp/calls?db=frontend-analysis/analysis-1&kfl=request.path=="/api/v1/checkout" and response.status==503&format=full
```

**AI Response:**

> "I examined all 127 failed checkout requests. Here's what I found:
>
> **Pattern:** All 503 errors occur when `payment-service` response time exceeds 5 seconds. Your frontend has a 5-second timeout configured.
>
> **Root cause:** `payment-service` is making synchronous calls to an external payment gateway. When the gateway is slow (P99 latency 4.8s), requests stack up and exhaust the connection pool.
>
> **Timeline:** Failures started at 14:23 UTC, correlating with a latency spike from the external gateway.
>
> **Evidence:**
> - 14:22:58 — Gateway latency jumps from 200ms to 4.2s
> - 14:23:15 — First 503 from payment-service
> - 14:23:45 — payment-service connection pool exhausted (saw TCP RST packets)
>
> **Recommendation:** Add circuit breaker on payment-service's external gateway calls, or increase the connection pool size with shorter timeouts.
>
> Want me to capture a PCAP of the failing requests for deeper analysis?"

---

## Key MCP Capabilities Used

| Capability | MCP Endpoint | Purpose |
|------------|--------------|---------|
| Data availability | `GET /mcp/data-boundaries` | Know what time range of recorded traffic is available |
| Snapshot creation | `POST /mcp/snapshots` | Isolate a time window from continuous recording |
| Protocol dissection | `DelayedDissection/Start` | Parse L7 protocols (HTTP, gRPC, etc.) |
| Traffic query | `GET /mcp/calls` | Retrieve dissected API calls |
| Filtering | `kfl=...` parameter | Focus on specific service, path, status |

---

## What Made This Possible

Without MCP, this investigation would require:

1. SSH into nodes or configure tcpdump
2. Export PCAPs and load into Wireshark
3. Manually filter and correlate thousands of packets
4. Write custom scripts to aggregate findings
5. Build the timeline by hand

**Time estimate:** 4-6 hours for an experienced engineer

With Kubeshark's MCP server, the AI:

1. Queried continuously recorded traffic—no setup needed
2. Created a snapshot isolating the relevant time window
3. Dissected protocols and correlated requests/responses
4. Identified patterns across 12,847 API calls
5. Built the timeline and traced the root cause

**Time estimate:** 3 minutes of conversation

---

## Try It Yourself

Once you have Kubeshark's MCP server configured, try asking:

- *"Analyze my `[service-name]` service and tell me what you find"*
- *"Are there any error patterns in the `[namespace]` namespace?"*
- *"Compare traffic to `[service]` between 9 AM and 10 AM vs yesterday"*
- *"What services does `[service]` depend on? Are any of them unhealthy?"*

The AI will handle the snapshot creation, dissection, and analysis—you just ask questions.

---

## What's Next

- [Use Cases](/en/mcp_use_cases) — More scenarios for AI-powered analysis
- [How It Works](/en/mcp) — Technical details of the MCP protocol
- [L7 API Dissection](/en/v2/l7_api_dissection) — How Kubeshark parses protocols
