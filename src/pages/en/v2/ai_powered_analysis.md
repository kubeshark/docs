---
title: AI-Powered Analysis
description: Transform Kubernetes troubleshooting with AI assistants that see and understand your network traffic.
layout: ../../../layouts/MainLayout.astro
---

**Your AI assistant can now see inside your cluster.** Every API call. Every connection. Every payload. In real-time and historically.

Kubeshark bridges AI to your production network via the **Model Context Protocol (MCP)**—the same open standard used by Claude, Cursor, and other AI coding tools. The result: AI-powered investigation that understands not just your code, but what it actually does on the wire.

---

## The Problem with Traditional Debugging

When something breaks in production, you piece together clues from logs, metrics, and traces—none of which show you **what actually happened**. You guess. You add more logging. You try to reproduce. Hours pass.

**What if your AI assistant could just look?**

---

## What This Changes

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">From Guessing to Seeing</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Instead of inferring what happened from logs, AI sees the exact request that failed—headers, payload, response, timing. No guesswork.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">From Hours to Seconds</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">Ask "why did checkout fail at 2pm?" and get an answer with evidence. The AI correlates errors, traces service dependencies, and identifies root causes—instantly.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">From Reactive to Proactive</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI can monitor traffic patterns and alert you to anomalies before they become outages. Spot the unusual request before it's a P1.</p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h4 style="margin: 0 0 0.5rem 0; color: #1e293b;">From Code to Production</h4>
<p style="margin: 0; color: #475569; font-size: 0.95rem;">AI coding tools can deploy code, then verify it works by observing actual network behavior. Fix bugs based on real evidence, not reproduction attempts.</p>
</div>

</div>

---

## Real Conversations, Real Answers

**You:** "Something broke around 2pm. What happened?"

**AI:** *Queries traffic, analyzes patterns, correlates errors...*

> I found a cascade failure starting at 14:02 UTC:
>
> 1. **Root cause**: payment-service started returning 503s due to connection pool exhaustion to stripe-gateway
> 2. **Impact**: 847 failed checkout requests over 12 minutes
> 3. **Evidence**: TCP handshake RTT to stripe-gateway spiked to 450ms (normally 2ms), indicating network-level issues
>
> Here are the first 5 failed requests with full payloads...

**You:** "Show me the network flows to stripe-gateway"

**AI:** *Fetches L4 data...*

> Active flows to stripe-gateway show elevated latency:
> - P50 RTT: 180ms (expected: <5ms)
> - P99 RTT: 450ms
> - 23 connections in TIME_WAIT state
>
> This suggests the gateway is overloaded or there's a network path issue.

---

## Powered by MCP

The **Model Context Protocol** is the open standard for connecting AI assistants to external tools. Kubeshark's MCP server exposes:

| Resource | What AI Can Access |
|----------|-------------------|
| **L7 API Traffic** | Every HTTP request/response, gRPC call, Kafka message—with full payloads |
| **L4 Network Flows** | TCP/UDP connections, bytes transferred, handshake timing |
| **Traffic Snapshots** | Point-in-time captures for forensic investigation |
| **Kubernetes Context** | Pod names, services, namespaces, labels—not just IPs |
| **Historical Data** | Go back in time to any moment within your retention window |

---

## Works With Your Tools

Kubeshark's MCP server integrates with any MCP-compatible AI client:

| Tool | Use Case |
|------|----------|
| **Claude Desktop** | Interactive troubleshooting and investigation |
| **Claude Code** | Terminal-based debugging with network visibility |
| **Cursor** | AI coding with production network feedback |
| **VS Code + Continue** | IDE-integrated network analysis |

One Kubeshark deployment. Every AI tool connected.

---

## The Closed Loop

For AI coding tools, this creates something new: **closed-loop development**.

```
+------------------+     +------------------+     +------------------+
|   Write Code     | --> |    Deploy to     | --> |   AI Observes    |
|   (AI assists)   |     |    Cluster       |     |   Network        |
+------------------+     +------------------+     +--------+---------+
        ^                                                  |
        |                                                  |
        +------------------  Feedback  --------------------+
                      "This endpoint returns 500"
                      "Auth header is missing"
                      "Response time is 3x slower"
```

The AI writes code, deploys it, watches it run, and fixes issues—all based on real network evidence. Integration bugs that take hours to reproduce are caught in seconds.

---

## Get Started

Connect your AI assistant to Kubeshark in minutes:

```bash
# Claude Code
claude mcp add kubeshark -- kubeshark mcp --url https://your-kubeshark.example.com

# Or use proxy mode
claude mcp add kubeshark -- kubeshark mcp --proxy
```

Then ask your first question:

> "What services are running in my cluster? Show me any errors."

---

## What's Next

- [AI Use Cases](/en/mcp_use_cases) — Detailed scenarios and example prompts
- [Conversational Debugging](/en/mcp/troubleshooting) — Deep dive into AI-driven investigation
- [MCP CLI Reference](/en/mcp/cli) — All connection options and modes
- [How MCP Works](/en/mcp) — Technical protocol details
