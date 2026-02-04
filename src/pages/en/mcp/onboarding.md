---
title: Onboarding & Learning
description: Help new team members understand the system by exploring actual traffic patterns with AI assistance.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

New team members can use AI to explore and understand the system without requiring deep expertise.

---

## The Problem

Onboarding to a complex microservices system is overwhelming:
- Documentation may be incomplete or outdated
- Understanding traffic patterns requires tribal knowledge
- Learning the query languages and tools takes time
- Asking senior engineers for every question isn't scalable
- Architecture diagrams show intent, not reality

---

## How MCP Helps

New team members can ask exploratory questions:

**Example prompts:**

> *"Give me an overview of this cluster's architecture based on actual traffic patterns."*

> *"What are the most heavily used APIs in the system?"*

> *"Explain what the order-processing-service does based on its network traffic."*

> *"What protocols are used in this cluster? Show me examples of each."*

> *"I'm new to this codebase. What services does the team I'm joining own, and how do they communicate?"*

> *"Walk me through what happens when a user places an order."*

---

## What the AI Can Do

- **Generate architecture overviews** from actual traffic
- **Identify the most active services** and endpoints
- **Explain service behavior** based on network patterns
- **Show examples** of different protocol usage
- **Help navigate the system** without prior knowledge
- **Answer "how does X work?"** questions with real data
- **Trace user journeys** through the system

---

## Example Onboarding Session

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > I just joined the team. Give me an overview of how this system works.        │
│                                                                                 │
│  ● Analyzing cluster traffic patterns                                           │
│    ├─ Discovering services...                                                   │
│    ├─ Mapping communication patterns...                                         │
│    └─ Identifying key flows...                                                  │
│                                                                                 │
│  Welcome! Here's an overview based on actual traffic:                           │
│                                                                                 │
│  SERVICES (23 total, grouped by function):                                      │
│                                                                                 │
│  User-facing:                                                                   │
│    • api-gateway - Entry point, routes to internal services                     │
│    • frontend - Serves web UI, calls api-gateway                                │
│                                                                                 │
│  Core business:                                                                 │
│    • order-service - Handles order creation/management (2,340 req/hr)           │
│    • payment-service - Processes payments via Stripe                            │
│    • inventory-service - Manages stock levels                                   │
│    • user-service - User accounts and authentication                            │
│                                                                                 │
│  Supporting:                                                                    │
│    • notification-service - Sends emails via SendGrid                           │
│    • search-service - Product search via Elasticsearch                          │
│    • recommendation-service - ML-based recommendations                          │
│                                                                                 │
│  Data:                                                                          │
│    • postgres (3 instances) - Primary database                                  │
│    • redis-cache - Caching layer                                                │
│    • kafka - Event streaming                                                    │
│                                                                                 │
│  KEY USER FLOWS:                                                                │
│                                                                                 │
│  1. Browse products:                                                            │
│     frontend → api-gateway → search-service → elasticsearch                     │
│                                                                                 │
│  2. Place order:                                                                │
│     frontend → api-gateway → order-service → inventory-service                  │
│                           → payment-service → Stripe API                        │
│                           → notification-service → SendGrid                     │
│                                                                                 │
│  3. User login:                                                                 │
│     frontend → api-gateway → user-service → postgres                            │
│                                           → redis (session)                     │
│                                                                                 │
│  > Tell me more about the order-service. What does it do?                       │
│                                                                                 │
│  order-service analysis (based on traffic):                                     │
│                                                                                 │
│  ENDPOINTS:                                                                     │
│    POST /api/orders           - Create new order (1,200/hr)                     │
│    GET  /api/orders/{id}      - Get order details (3,400/hr)                    │
│    GET  /api/orders           - List user's orders (890/hr)                     │
│    PUT  /api/orders/{id}      - Update order status (120/hr)                    │
│    DELETE /api/orders/{id}    - Cancel order (45/hr)                            │
│                                                                                 │
│  DEPENDENCIES (what it calls):                                                  │
│    • inventory-service - Reserve/release stock                                  │
│    • payment-service - Process payments                                         │
│    • user-service - Validate user                                               │
│    • postgres - Store order data                                                │
│    • kafka - Publish order events                                               │
│                                                                                 │
│  CONSUMERS (what calls it):                                                     │
│    • api-gateway - All external requests                                        │
│    • notification-service - Get order details for emails                        │
│    • admin-dashboard - Order management                                         │
│                                                                                 │
│  INTERESTING PATTERNS:                                                          │
│    • Orders publish events to Kafka topic "order-events"                        │
│    • Uses optimistic locking (I see retry patterns on conflicts)                │
│    • Caches frequently-accessed orders in Redis                                 │
│                                                                                 │
│  > What should I know about working on this service?                            │
│                                                                                 │
│  Tips based on traffic analysis:                                                │
│                                                                                 │
│  1. The /api/orders/{id} endpoint is heavily cached - if you change             │
│     order data, remember to invalidate the Redis cache                          │
│                                                                                 │
│  2. Order creation is a saga pattern:                                           │
│     inventory-reserve → payment-charge → confirm                                │
│     If payment fails, inventory is automatically released                       │
│                                                                                 │
│  3. The notification-service consumes Kafka events, not direct API calls        │
│     Changes to order events will affect email notifications                     │
│                                                                                 │
│  4. High traffic endpoint: GET /api/orders/{id} - optimize carefully            │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Onboarding Questions to Try

| Goal | What to Ask |
|------|-------------|
| **System overview** | "Give me an overview of this cluster's architecture" |
| **Understand a service** | "What does X service do? Show me its traffic patterns" |
| **Learn a flow** | "Walk me through what happens when a user does Y" |
| **Find dependencies** | "What services does X depend on?" |
| **Discover patterns** | "What communication patterns are used? (sync, async, etc.)" |
| **Team scope** | "What services are in the payments namespace?" |

---

## What's Next

- [Architecture Discovery](/en/mcp/architecture_discovery) — Deep dive into service mapping
- [Troubleshooting & Debugging](/en/mcp/troubleshooting) — Debug issues in your new codebase
- [MCP in Action](/en/mcp_in_action) — See a complete investigation example
