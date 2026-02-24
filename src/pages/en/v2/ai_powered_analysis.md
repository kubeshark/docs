---
title: AI-Powered Analysis
description: Give your AI assistant eyes into your Kubernetes network—every API call, every connection, every payload.
layout: ../../../layouts/MainLayout.astro
---

> **Coming Soon — V2.00:** MCP integration is coming as part of Kubeshark V2.00. [Read the announcement](https://kubeshark.com/post/kubeshark-v2-00-coming-soon).

**Your AI assistant can now see inside your cluster.** Every API call. Every connection. Every payload. Real-time and historical.

Kubeshark bridges AI to your production network via the **Model Context Protocol (MCP)**—the open standard used by Claude, Cursor, and other AI tools. The result: network investigation through conversation.

---

## The Problem

When production breaks, you piece together clues from logs, metrics, and traces—none of which show you **what actually happened**. You guess. You add logging. You try to reproduce. Hours pass.

**What if your AI could just look?**

---

## What Changes

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Guessing → Seeing</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI sees the exact request that failed—headers, payload, response, timing. No inference required.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Hours → Seconds</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Ask "why did checkout fail?" and get an answer with evidence. Instant root cause analysis.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Reactive → Proactive</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI spots anomalies in traffic patterns before they become outages.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">Code → Production</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI coding tools deploy, observe network behavior, and fix issues—closed-loop development.</p>
</div>

</div>

---

## Real Investigation

**You:** "Something broke around 2pm. What happened?"

**AI:** *Queries traffic, analyzes patterns...*

> I found a cascade failure starting at 14:02 UTC:
>
> 1. **Root cause**: payment-service returning 503s—connection pool exhaustion to stripe-gateway
> 2. **Impact**: 847 failed checkout requests over 12 minutes
> 3. **Evidence**: TCP handshake RTT to stripe-gateway spiked to 450ms (normally 2ms)
>
> Here are the first 5 failed requests with full payloads...

**You:** "Show me the network flows to stripe-gateway"

**AI:** *Fetches L4 data...*

> Active flows show elevated latency:
> - P50 RTT: 180ms (expected: <5ms)
> - P99 RTT: 450ms
> - 23 connections in TIME_WAIT
>
> This indicates upstream congestion or a network path issue.

With [TCP Expert Insights](/en/mcp/tcp_insights), the AI can go deeper — querying per-connection retransmission rates, zero-window events, RTT jitter, and connection completeness to pinpoint whether the issue is packet loss, receiver backpressure, or a failing network path.

---

## Use Cases

### Incident Investigation

When production breaks, describe the problem and let AI investigate:

> *"The checkout flow failed at 2:15 PM. Find all API calls to payment services and identify what went wrong."*

> *"Users report 504 errors on /api/orders. Trace the request path and find the timeout."*

> *"Pod order-service crashed 10 minutes ago. Show its network activity before the crash."*

### Security Analysis

Network traffic reveals what logs miss:

> *"Find API calls without Authorization headers that should have them."*

> *"Are any pods making outbound connections to IPs not in our allow list?"*

> *"Which internal services are accessible from the public namespace? Show the traffic."*

> *"Find sensitive data patterns (credit cards, API keys) in request/response bodies."*

### Architecture Discovery

Understand how services *actually* communicate:

> *"Map all services that communicate with inventory-service. What calls it? What does it call?"*

> *"Show the complete request flow when a user places an order—every service-to-service call."*

> *"Which services would be affected if redis-cache goes down?"*

> *"Find services that talk to the database directly instead of through the data-access layer."*

### Performance Debugging

Find where time is spent:

> *"The /api/checkout endpoint is slow. Break down where time is spent across the request chain."*

> *"Find API calls with response times over 500ms. Which services are slowest?"*

> *"Compare response times for product-service today vs. yesterday."*

> *"Which database queries are taking more than 100ms?"*

### Network Health

TCP handshake timing reveals infrastructure issues:

> *"Show TCP flows with handshake times over 10ms. Which connections have network latency?"*

> *"What's the P99 TCP handshake time to external services? Is our egress healthy?"*

> *"Find cross-namespace flows and check their RTT. Any bottlenecks?"*

### Compliance & Auditing

Network traffic provides immutable audit trails:

> *"Create a report of all API calls that accessed customer PII in the last 24 hours."*

> *"Export traffic to payment-gateway between 3-4 PM yesterday for the security team."*

> *"Generate an audit trail for order ID 12345—every API call that processed it."*

---

## What AI Sees

| Resource | Access |
|----------|--------|
| **L7 API Traffic** | Every HTTP request/response, gRPC call, Kafka message—full payloads |
| **L4 Network Flows** | TCP/UDP connections, bytes, packets, handshake timing |
| **Traffic Snapshots** | Point-in-time captures for forensic investigation |
| **Kubernetes Context** | Pod names, services, namespaces, labels—not just IPs |
| **Historical Data** | Any moment within your retention window |

---

## Works With Your Tools

| Tool | Use Case |
|------|----------|
| **Claude Desktop** | Interactive troubleshooting |
| **Claude Code** | Terminal-based debugging |
| **Cursor** | AI coding with network feedback |
| **VS Code + Continue** | IDE-integrated analysis |

One Kubeshark deployment. Every AI tool connected.

---

## Get Started

```bash
# Connect Claude Code
claude mcp add kubeshark -- kubeshark mcp --url https://your-kubeshark.example.com

# Or use proxy mode
claude mcp add kubeshark -- kubeshark mcp --proxy
```

Then ask:

> "What services are running? Show me any errors."

---

## What's Next

- [AI Assistant - Getting Started](/en/mcp_use_cases) — Connect your AI tools
- [Conversational Debugging](/en/mcp/troubleshooting) — Deep dive investigation
- [Autonomous Development](/en/mcp/autonomous_development) — Closed-loop coding
- [How MCP Works](/en/mcp) — Technical details
