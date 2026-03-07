---
title: AI Integration
description: Connect AI assistants to real Kubernetes network data for conversational debugging, autonomous development, and incident investigation.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark connects AI assistants directly to your live Kubernetes network traffic via the **Model Context Protocol (MCP)**. Instead of sifting through dashboards and logs, you ask questions in natural language and get answers backed by real network evidence.

---

## What AI Can Do With Network Data

With Kubeshark's MCP server, your AI assistant can:

- **Investigate incidents** — Ask "why is checkout failing?" and get root cause analysis across thousands of API calls
- **Verify code changes** — Deploy code and confirm it behaves correctly at the network level
- **Audit security** — Identify unencrypted traffic, unexpected external calls, or leaked credentials in headers
- **Map dependencies** — Discover how services communicate, including hidden dependencies
- **Analyze performance** — Find latency bottlenecks, connection churn, and retry storms

---

## Conversational Debugging

Instead of manually querying dashboards, you have a conversation. Here's an example — a developer gets paged about checkout latency:

```
+---------------------------------------------------------------------------------+
| Terminal                                                                        |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  > What can you tell me about my frontend service?                              |
|                                                                                 |
|  * Analyzing 12,847 API calls over the last hour...                             |
|                                                                                 |
|  OK Healthy:                                                                    |
|    - Latency is good (45ms P50)                                                 |
|    - TCP connections are fast (< 5ms)                                           |
|    - 97.7% success rate                                                         |
|                                                                                 |
|  ! Needs Attention:                                                             |
|    1. Checkout failures - 2.3% of /api/v1/checkout return 503                   |
|    2. Retry storms - cart-service retrying 3x within 100ms                      |
|    3. Connection churn - 847 new connections/min to catalogue-db                |
|                                                                                 |
|  > Tell me more about those checkout 503 errors.                                |
|                                                                                 |
|  * Examining 127 failed requests...                                             |
|                                                                                 |
|  All 503 errors occur when payment-service exceeds its 5s timeout.              |
|  Root cause: synchronous calls to an external gateway that spiked               |
|  to 4.8s P99 latency at 14:22 UTC, exhausting the connection pool.             |
|                                                                                 |
|  Recommendation: Add circuit breaker on payment-service gateway calls.          |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

What would take 4-6 hours of manual investigation takes a 3-minute conversation.

Here's another example — debugging a webhook integration issue:

```
+---------------------------------------------------------------------------------+
| Terminal                                                                        |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  > My webhook endpoint isn't receiving events from the payment provider.        |
|    What's going on?                                                             |
|                                                                                 |
|  * Investigating webhook traffic...                                             |
|                                                                                 |
|  Payment provider IS sending webhooks, but they're failing:                     |
|                                                                                 |
|  Last 5 attempts (from 203.0.113.50 - Stripe IP):                              |
|    14:23:15  /webhooks/payment  -> 415 Unsupported Media Type                   |
|    14:18:22  /webhooks/payment  -> 415 Unsupported Media Type                   |
|    14:13:30  /webhooks/payment  -> 415 Unsupported Media Type                   |
|                                                                                 |
|  Root cause: Content-Type mismatch                                              |
|    Provider sends:  application/json; charset=utf-8                             |
|    Your endpoint expects: application/json (exact match)                        |
|                                                                                 |
|  The "; charset=utf-8" suffix causes your framework to reject it.              |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

**Common debugging scenarios:**

| Issue | What to Ask |
|-------|-------------|
| Not receiving requests | "Is my service receiving any traffic? Show me recent requests." |
| Wrong response | "What exactly is service X returning for endpoint Y?" |
| Header issues | "Show me all headers being sent to my endpoint" |
| Payload mismatch | "Compare what's sent vs. what's received" |
| Connection errors | "Why am I getting connection refused/reset errors?" |
| Auth failures | "What auth headers are being sent? Are they valid?" |
| Timeout issues | "Which requests are timing out and how long do they take?" |

---

## Autonomous Development

AI coding tools can write code, but they can't see how it behaves in a real cluster. Kubeshark closes this gap with a **deploy → verify → fix** loop:

```
+---------------------------------------------------------------------------------+
| Terminal                                                                        |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  > I've updated order-service to add caching. Deploy and verify.                |
|                                                                                 |
|  * Deploying and analyzing 847 API calls...                                     |
|                                                                                 |
|  ! Issues detected:                                                             |
|    1. Cache miss on every request - all 12 requests hit the database            |
|       Root cause: cache key includes a timestamp (cache.go:47)                  |
|    2. Missing Cache-Control header in responses                                 |
|                                                                                 |
|  > Fix it                                                                       |
|                                                                                 |
|  * Applying fix, redeploying, re-verifying...                                   |
|                                                                                 |
|  OK All verifications passed:                                                   |
|    - First request: DB call (45ms)                                              |
|    - Subsequent requests: Cache hit, no DB call (2ms)                           |
|    - Cache-Control header present                                               |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

The AI writes code, Kubeshark shows what that code actually does, and the AI fixes issues based on real network evidence — all without manual intervention.

### What Network Feedback Catches

Kubeshark provides feedback that logs, metrics, and test assertions miss:

| Traditional Testing | Network-Level Verification |
|---------------------|---------------------------|
| "Test passed (200 OK)" | "Response was 200, but payload had wrong field types" |
| "No errors in logs" | "3 unexpected retries occurred, masking a connection issue" |
| "Latency within SLA" | "Latency is fine, but you're making 5 redundant DB calls" |
| "Auth test passed" | "Auth works, but token is sent to downstream services unmasked" |

| Without Kubeshark | With Kubeshark |
|------------------|----------------|
| AI writes code, hopes it works | AI writes code, verifies it works |
| Issues found in production | Issues found before commit |
| "Works in tests" ≠ works in prod | Verified against real cluster behavior |

---

## Works With Your Tools

Kubeshark's MCP server works with any MCP-compatible AI assistant:

- **Claude Code** — Terminal-based AI coding
- **Claude Desktop** — Conversational analysis
- **Cursor** — AI-powered IDE
- **GitHub Copilot** — VS Code and GitHub integration

---

## What's Next

- [Getting Started](/en/mcp_getting_started) — Set up MCP in minutes
- [How It Works](/en/mcp) — Technical details of the MCP protocol
- [The MCP CLI](/en/mcp/cli) — All connection options
