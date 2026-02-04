---
title: Performance Debugging
description: Use AI to find latency bottlenecks and performance issues by analyzing network traffic timing data.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Latency issues are notoriously hard to debug in distributed systems. AI can analyze timing data across thousands of requests to find patterns.

---

## The Problem

When users report slowness:
- It's hard to know which service is the bottleneck
- Latency can be intermittent and hard to reproduce
- Multiple services might each add small delays that compound
- Database queries or external API calls might be the real culprit
- Aggregated metrics hide outliers

---

## How MCP Helps

Ask performance-focused questions:

**Example prompts:**

> *"The /api/checkout endpoint is slow. Break down where time is being spent across the request chain."*

> *"Find API calls with response times over 500ms in the last hour. Which services and endpoints are slowest?"*

> *"Compare response times for the product-service today vs. yesterday. What changed?"*

> *"Is there a correlation between request payload size and latency for the upload endpoint?"*

> *"Which database queries (calls to postgres service) are taking more than 100ms?"*

> *"Show me the P50, P95, and P99 latencies for each endpoint on user-service."*

> *"Find requests where most of the time is spent waiting for downstream services."*

---

## What the AI Can Do

- **Analyze latency distributions** across endpoints
- **Identify slow downstream dependencies**
- **Find requests with unusually high response times**
- **Compare performance across time periods**
- **Correlate latency with request characteristics** (size, parameters)
- **Trace slow requests** through the full call chain
- **Decompose latency** (network, processing, downstream)
- **Identify N+1 query patterns**

---

## Example Debugging Session

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > The product listing page is slow. Find out why.                              │
│                                                                                 │
│  ● Analyzing product listing performance                                        │
│    ├─ Querying /api/products traffic...                                         │
│    ├─ Analyzing latency distribution...                                         │
│    └─ Tracing slow requests...                                                  │
│                                                                                 │
│  Performance Analysis for GET /api/products:                                    │
│                                                                                 │
│  Latency Distribution (last hour):                                              │
│    P50:  45ms   ✓ Good                                                          │
│    P95:  230ms  ⚠ Acceptable                                                    │
│    P99:  1,847ms ✗ Too slow                                                     │
│                                                                                 │
│  The P99 is 41x slower than P50. Investigating outliers...                      │
│                                                                                 │
│  Root cause found: N+1 query pattern                                            │
│                                                                                 │
│  When request includes ?include=reviews:                                        │
│    • product-service calls review-service once per product                      │
│    • 50 products = 50 sequential calls to review-service                        │
│    • Each call: ~35ms                                                           │
│    • Total: 1,750ms just for reviews                                            │
│                                                                                 │
│  Evidence:                                                                      │
│    Request at 14:23:15 (1,823ms total):                                         │
│    ├─ product-service processing: 42ms                                          │
│    ├─ postgres query: 31ms                                                      │
│    └─ review-service calls: 1,750ms (50 calls × 35ms)                           │
│                                                                                 │
│  Requests without ?include=reviews: P99 = 89ms ✓                                │
│                                                                                 │
│  Recommendation: Batch the review-service calls or add a bulk endpoint          │
│  GET /api/reviews?product_ids=1,2,3...                                          │
│                                                                                 │
│  > Show me other endpoints with N+1 patterns                                    │
│                                                                                 │
│  Scanning for N+1 patterns across all endpoints...                              │
│                                                                                 │
│  Found 3 endpoints with N+1 behavior:                                           │
│                                                                                 │
│  1. GET /api/products?include=reviews (described above)                         │
│     Impact: 2,340 req/hr, P99 = 1,847ms                                         │
│                                                                                 │
│  2. GET /api/orders (when fetching order items)                                 │
│     Pattern: 1 call to inventory-service per line item                          │
│     Impact: 890 req/hr, P99 = 920ms                                             │
│                                                                                 │
│  3. GET /api/users/{id}/permissions                                             │
│     Pattern: 1 call to role-service per permission check                        │
│     Impact: 5,600 req/hr, P99 = 340ms                                           │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Patterns to Find

| Pattern | What to Ask |
|---------|-------------|
| **Slow endpoints** | "Which endpoints have P99 > 500ms?" |
| **N+1 queries** | "Find services making many sequential calls to the same downstream" |
| **Timeout issues** | "Show requests that timed out and what they were waiting for" |
| **Payload impact** | "Does response size correlate with latency?" |
| **Cold starts** | "Are first requests to a pod slower than subsequent ones?" |
| **Dependency latency** | "Which downstream service adds the most latency?" |

---

## What's Next

- [Incident Investigation](/en/mcp/incident_investigation) — Debug production failures
- [Architecture Discovery](/en/mcp/architecture_discovery) — Map service dependencies
- [Autonomous Development](/en/mcp/autonomous_development) — Verify performance in dev
