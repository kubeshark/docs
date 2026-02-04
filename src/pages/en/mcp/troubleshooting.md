---
title: Conversational Debugging
description: Use AI to debug integration issues, verify API behavior, and troubleshoot service communication through natural conversation.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Day-to-day debugging gets faster when you can ask questions instead of writing queries.

---

## The Problem

Developers spend significant time:
- Figuring out why their service isn't receiving expected requests
- Understanding what data another service is actually sending
- Debugging integration issues between services
- Verifying that their changes work correctly in the cluster
- Comparing what's documented vs. what's actually happening

---

## How MCP Helps

Ask debugging questions naturally:

**Example prompts:**

> *"Is my user-service receiving requests from the API gateway? Show me the last 10 requests."*

> *"What exactly is the notification-service sending to the email-provider? Show me the request body."*

> *"The frontend says it's sending the right headers, but the backend disagrees. Show me what's actually in the HTTP request."*

> *"Find all 4xx errors returned by my service in the last 30 minutes. What requests caused them?"*

> *"My service calls the inventory API but gets empty responses. Show me the actual request and response."*

> *"Why is my service getting 'connection refused' errors to the database?"*

---

## What the AI Can Do

- **Show actual request/response payloads**
- **Verify headers, query parameters, and body content**
- **Find errors and their corresponding requests**
- **Compare what's sent vs. what's received**
- **Filter traffic to/from specific pods or deployments**
- **Identify mismatches** between expected and actual behavior
- **Track retry attempts and their outcomes**
- **Show connection-level issues** (TCP resets, timeouts)

---

## Example Debugging Session

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > My webhook endpoint isn't receiving events from the payment provider.        │
│    What's going on?                                                             │
│                                                                                 │
│  ● Investigating webhook traffic                                                │
│    ├─ Searching for traffic to webhook endpoints...                             │
│    ├─ Checking for payment provider traffic...                                  │
│    └─ Analyzing connection attempts...                                          │
│                                                                                 │
│  Found the issue:                                                               │
│                                                                                 │
│  Payment provider IS sending webhooks, but they're failing:                     │
│                                                                                 │
│  Last 5 webhook attempts (from 203.0.113.50 - Stripe IP):                       │
│  ┌────────────────────────────────────────────────────────────────┐             │
│  │ Time       │ Endpoint              │ Status │ Reason          │             │
│  ├────────────┼───────────────────────┼────────┼─────────────────┤             │
│  │ 14:23:15   │ /webhooks/payment     │ 415    │ Unsupported     │             │
│  │ 14:18:22   │ /webhooks/payment     │ 415    │ Media Type      │             │
│  │ 14:13:30   │ /webhooks/payment     │ 415    │                 │             │
│  │ 14:08:45   │ /webhooks/payment     │ 415    │                 │             │
│  │ 14:03:52   │ /webhooks/payment     │ 415    │                 │             │
│  └────────────────────────────────────────────────────────────────┘             │
│                                                                                 │
│  Root cause: Content-Type mismatch                                              │
│                                                                                 │
│  Payment provider sends:                                                        │
│    Content-Type: application/json; charset=utf-8                                │
│                                                                                 │
│  Your endpoint expects:                                                         │
│    Content-Type: application/json (exact match)                                 │
│                                                                                 │
│  The "; charset=utf-8" suffix is causing your framework to reject it.           │
│                                                                                 │
│  > Show me the full request that failed                                         │
│                                                                                 │
│  Request at 14:23:15 UTC:                                                       │
│                                                                                 │
│  POST /webhooks/payment HTTP/1.1                                                │
│  Host: api.yourcompany.com                                                      │
│  Content-Type: application/json; charset=utf-8                                  │
│  Stripe-Signature: t=1642262595,v1=abc123...                                    │
│  Content-Length: 847                                                            │
│                                                                                 │
│  {                                                                              │
│    "id": "evt_1234567890",                                                      │
│    "type": "payment_intent.succeeded",                                          │
│    "data": {                                                                    │
│      "object": {                                                                │
│        "id": "pi_abcdef",                                                       │
│        "amount": 2000,                                                          │
│        "currency": "usd"                                                        │
│        ...                                                                      │
│      }                                                                          │
│    }                                                                            │
│  }                                                                              │
│                                                                                 │
│  Response: 415 Unsupported Media Type                                           │
│  Body: {"error": "Content-Type must be application/json"}                       │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Common Debugging Scenarios

| Issue | What to Ask |
|-------|-------------|
| **Not receiving requests** | "Is my service receiving any traffic? Show me recent requests." |
| **Wrong response** | "What exactly is service X returning for endpoint Y?" |
| **Header issues** | "Show me all headers being sent to my endpoint" |
| **Payload mismatch** | "Compare what's sent vs. what's received" |
| **Connection errors** | "Why am I getting connection refused/reset errors?" |
| **Auth failures** | "What auth headers are being sent? Are they valid?" |
| **Timeout issues** | "Which requests are timing out and how long do they take?" |

---

## What's Next

- [Incident Investigation](/en/mcp/incident_investigation) — Debug production failures
- [Performance Debugging](/en/mcp/performance_debugging) — Find latency issues
- [Autonomous Development](/en/mcp/autonomous_development) — Verify code in local cluster
