---
title: AI & Network Data
description: Why AI-powered analysis transforms how teams debug, secure, and optimize Kubernetes applications.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Network traffic is the **ground truth** of what happens in your Kubernetes cluster. [It contains everything](/en/why_network_data)—API payloads, performance data, security signals, and infrastructure health. Kubeshark captures and enriches this data with full Kubernetes context.

But [accessing this data effectively](/en/why_network_data#the-accessibility-challenge) has traditionally required deep expertise and complex tools. AI changes that.

---

## The Opportunity: AI-Powered Analysis

What if you could simply *ask questions* about your network traffic?

> *"What API calls failed in the last hour and why?"*

> *"Show me the exact request that caused the payment service to return a 500 error."*

> *"Which services are communicating without authentication?"*

> *"Compare today's latency patterns with yesterday—what changed?"*

This is what Kubeshark's MCP integration enables. By connecting AI assistants to your network data, complex analysis becomes a conversation.

---

## How It Works

Kubeshark exposes network data through the **Model Context Protocol (MCP)**—an open standard for connecting AI assistants to external data sources.

```
┌─────────────────┐                      ┌─────────────────┐
│                 │     MCP Protocol     │                 │
│  AI Assistant   │ ◄──────────────────► │    Kubeshark    │
│ (Claude, etc.)  │                      │                 │
│                 │                      │                 │
└─────────────────┘                      └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │   Kubernetes    │
                                         │  Network Data   │
                                         │  (L4/L7, PCAP)  │
                                         └─────────────────┘
```

The AI assistant can:
- Query L7 API transactions with natural language
- Filter traffic by service, namespace, status code, latency
- Analyze patterns across thousands of requests
- Create snapshots and export PCAP files
- Control Kubeshark (start, stop, configure)

---

## What Makes This Powerful

### Natural Language Queries

No need to learn query syntax. Just ask:

| Instead of... | Just ask... |
|---------------|-------------|
| Writing KFL filters | "Show me failed requests to the payment service" |
| Correlating timestamps | "What happened in the 5 minutes before the crash?" |
| Manual traffic analysis | "Which endpoints are slowest?" |
| Reading packet captures | "What's in the request body?" |

### AI-Driven Investigation

The AI doesn't just fetch data—it analyzes it:

- Identifies patterns across requests
- Correlates errors with their causes
- Suggests root causes based on evidence
- Compares current behavior with baselines

### Full Context

Because Kubeshark provides [complete Kubernetes context](/en/why_network_data#how-kubeshark-bridges-the-gap), the AI understands:

- Which pods and services are involved
- The full request/response payloads
- Timing and latency data
- The relationship between calls

---

## What's Next

- [Use Cases](/en/mcp_use_cases) — Real-world scenarios for AI-powered analysis
- [How MCP Works](/en/mcp) — Technical details on the protocol
- [Why Network Data Matters](/en/why_network_data) — Deep dive into network visibility
