---
title: Incident Investigation & Root Cause Analysis
description: Use AI to investigate production incidents by analyzing network traffic for root cause analysis.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

When production breaks, time is critical. Instead of manually sifting through logs and dashboards, ask the AI to investigate.

---

## The Problem

Traditional incident response involves:
- Jumping between multiple tools (logs, metrics, traces)
- Writing ad-hoc queries to find relevant data
- Manually correlating timestamps across systems
- Deep expertise in protocols and Kubernetes internals

When you're paged at 3 AM, these challenges compound. Every minute of downtime costs money and erodes user trust.

---

## How MCP Helps

With Kubeshark's MCP server, you can describe the problem in natural language and let the AI do the investigation:

**Example prompts:**

> *"The checkout flow started failing at 2:15 PM. Find all API calls to payment-related services in that timeframe and identify what went wrong."*

> *"Users are reporting 504 errors on the /api/orders endpoint. Trace the request path and find where the timeout is occurring."*

> *"Pod order-service-abc123 crashed 10 minutes ago. Show me its network activity in the 2 minutes before the crash—what external calls was it making?"*

> *"Compare the traffic patterns from the last hour with yesterday at the same time. What's different?"*

> *"Something broke. I don't know what. Show me all 5xx errors in the last 30 minutes and identify patterns."*

---

## What the AI Can Do

- **Query traffic history** for specific time windows
- **Filter by service, endpoint, status code**, or error type
- **Trace request chains** across multiple services
- **Correlate network errors** with application failures
- **Identify the exact request/response** that caused the issue
- **Compare traffic patterns** with historical baselines
- **Build timelines** showing the sequence of failures
- **Find upstream causes** by tracing dependencies

---

## Example Investigation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > Users are reporting checkout failures. Investigate.                          │
│                                                                                 │
│  ● Investigating checkout failures                                              │
│    ├─ Querying recent traffic to checkout-related services...                   │
│    ├─ Found 2,847 checkout requests in last 30 minutes                          │
│    ├─ Analyzing error patterns...                                               │
│    └─ Tracing failure path...                                                   │
│                                                                                 │
│  Investigation results:                                                         │
│                                                                                 │
│  Error rate: 23% of checkout requests failing (was 0.1% yesterday)              │
│                                                                                 │
│  Root cause identified:                                                         │
│    • payment-service returning 503 errors                                       │
│    • Upstream cause: stripe-integration pod has 5s timeout                      │
│    • Stripe API latency spiked to 4.8s at 14:23 UTC                             │
│    • Connection pool exhausted after 47 concurrent requests                     │
│                                                                                 │
│  Timeline:                                                                      │
│    14:22:58  Stripe API latency: 200ms → 4.2s                                   │
│    14:23:15  First 503 from payment-service                                     │
│    14:23:45  Connection pool exhausted                                          │
│    14:24:00  Error rate reaches 23%                                             │
│                                                                                 │
│  Evidence: I can show you the specific failing requests if needed.              │
│                                                                                 │
│  Recommendation: Add circuit breaker to stripe-integration, or                  │
│  increase timeout with connection pool limits.                                  │
│                                                                                 │
│  > Show me one of the failing requests                                          │
│                                                                                 │
│  Request at 14:23:47 UTC:                                                       │
│    POST /api/v1/checkout                                                        │
│    → frontend-7d4b8c6f9-x2k4m                                                   │
│    → payment-service-5c8d9f4e2-k8m3n                                            │
│    → stripe-integration-3a7b2c1d-p9q4r (TIMEOUT after 5000ms)                   │
│                                                                                 │
│    Response: 503 Service Unavailable                                            │
│    Body: {"error": "upstream_timeout", "service": "stripe"}                     │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Why Network Data for Incidents

| Traditional Approach | With Kubeshark MCP |
|---------------------|-------------------|
| Check logs for errors | See the actual failing request and response |
| Guess which service failed | Trace the exact failure path |
| Estimate when it started | Know the precise timestamp |
| Assume the root cause | See the upstream dependency that caused it |
| Hope you logged enough | Every API call is captured |

---

## What's Next

- [MCP in Action](/en/mcp_in_action) — Complete walkthrough of an investigation
- [Security Analysis](/en/mcp/security_analysis) — Find security issues in traffic
- [Performance Debugging](/en/mcp/performance_debugging) — Track down latency issues
