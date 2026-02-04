---
title: Architecture Discovery & Service Mapping
description: Use AI to discover actual service dependencies and map your runtime architecture from network traffic.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Understanding how services actually communicate—not how they're supposed to—is essential for debugging, planning, and security.

---

## The Problem

Documentation gets stale. Teams change. New services get deployed. Before long, nobody fully understands:
- Which services depend on which
- What APIs are actually being called
- How traffic flows through the system
- What would break if a service goes down

Architecture diagrams show intent. Network traffic shows reality.

---

## How MCP Helps

Ask the AI to map your actual runtime architecture:

**Example prompts:**

> *"Map out all the services that communicate with the inventory-service. What calls it, and what does it call?"*

> *"Show me the complete request flow when a user places an order—every service-to-service call from start to finish."*

> *"Which services would be affected if the redis-cache pod becomes unavailable?"*

> *"What external APIs does our cluster call? Group them by destination domain."*

> *"Find all services that talk to the database directly instead of going through the data-access-layer."*

> *"Show me which services have circular dependencies."*

> *"What's the critical path for the checkout flow?"*

---

## What the AI Can Do

- **Build service dependency graphs** from actual traffic
- **Identify all consumers** of a specific service
- **Trace end-to-end request flows** across services
- **Discover undocumented dependencies** between services
- **Find services bypassing** intended architecture patterns
- **Quantify traffic volumes** between services
- **Identify single points of failure**
- **Map external dependencies**

---

## Example Discovery

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > Map the dependencies for order-service. What calls it and what does          │
│    it call?                                                                     │
│                                                                                 │
│  ● Analyzing traffic for order-service                                          │
│    ├─ Querying inbound traffic...                                               │
│    ├─ Querying outbound traffic...                                              │
│    └─ Building dependency map...                                                │
│                                                                                 │
│  order-service Dependencies:                                                    │
│                                                                                 │
│  INBOUND (services that call order-service):                                    │
│  ┌─────────────────────────────────────────────────────────────┐                │
│  │  api-gateway          ──────►  order-service               │                │
│  │    • POST /api/orders         (2,340 req/hr)               │                │
│  │    • GET /api/orders/{id}     (5,120 req/hr)               │                │
│  │                                                             │                │
│  │  admin-dashboard      ──────►  order-service               │                │
│  │    • GET /api/orders          (89 req/hr)                  │                │
│  │    • PUT /api/orders/{id}     (12 req/hr)                  │                │
│  │                                                             │                │
│  │  notification-worker  ──────►  order-service               │                │
│  │    • GET /api/orders/{id}     (1,200 req/hr)               │                │
│  └─────────────────────────────────────────────────────────────┘                │
│                                                                                 │
│  OUTBOUND (services that order-service calls):                                  │
│  ┌─────────────────────────────────────────────────────────────┐                │
│  │  order-service        ──────►  inventory-service           │                │
│  │    • POST /reserve            (2,340 req/hr)               │                │
│  │    • DELETE /reserve/{id}     (89 req/hr)                  │                │
│  │                                                             │                │
│  │  order-service        ──────►  payment-service             │                │
│  │    • POST /charge             (2,340 req/hr)               │                │
│  │                                                             │                │
│  │  order-service        ──────►  postgres (direct!)          │                │
│  │    • TCP :5432                (7,200 req/hr)               │                │
│  │                                                             │                │
│  │  order-service        ──────►  redis-cache                 │                │
│  │    • TCP :6379                (28,800 req/hr)              │                │
│  └─────────────────────────────────────────────────────────────┘                │
│                                                                                 │
│  ⚠ Note: order-service connects directly to postgres.                          │
│    Expected: traffic should go through data-access-layer                        │
│                                                                                 │
│  > What would break if redis-cache goes down?                                   │
│                                                                                 │
│  Impact analysis for redis-cache failure:                                       │
│                                                                                 │
│  DIRECT DEPENDENTS (would fail immediately):                                    │
│    • order-service (28,800 req/hr)                                              │
│    • user-service (12,400 req/hr)                                               │
│    • session-service (45,000 req/hr)                                            │
│                                                                                 │
│  INDIRECT DEPENDENTS (would fail via cascade):                                  │
│    • api-gateway → order-service                                                │
│    • api-gateway → user-service                                                 │
│    • frontend → session-service                                                 │
│                                                                                 │
│  ESTIMATED IMPACT: 73% of user-facing requests would fail                       │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Discovery Questions

| Goal | What to Ask |
|------|-------------|
| **Map a service** | "What services call X and what does X call?" |
| **Trace a flow** | "Show the complete request path for [user action]" |
| **Impact analysis** | "What would break if X goes down?" |
| **Find violations** | "Which services bypass the API gateway?" |
| **External deps** | "What external APIs do we depend on?" |
| **Traffic volume** | "Which service-to-service paths have the most traffic?" |

---

## What's Next

- [Performance Debugging](/en/mcp/performance_debugging) — Find latency bottlenecks
- [Incident Investigation](/en/mcp/incident_investigation) — Trace failures across services
- [Onboarding & Learning](/en/mcp/onboarding) — Help new team members understand the system
