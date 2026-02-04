---
title: Autonomous Development & Testing
description: Close the dev-to-production feedback loop with AI-powered code verification using network-level insights.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Close the loop between code and production behavior. Use AI to write, deploy, test, and verify code—with network-level feedback that goes deeper than logs or test assertions.

---

## The Problem

Traditional development workflows have a gap:
- Unit tests verify isolated logic, not integration behavior
- Integration tests check outcomes, not how they happened
- Logs show what the app chose to record, not what actually occurred
- Issues often only surface in production, far from the code change

Developers working with local Kubernetes clusters (KinD, minikube) lack visibility into how their code actually behaves at the network level.

---

## How MCP Helps

With Kubeshark running in your local cluster and connected to your AI assistant (like Claude Code), development becomes an autonomous loop:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTONOMOUS DEV LOOP                          │
│                                                                 │
│    ┌──────────┐     ┌──────────┐     ┌──────────┐              │
│    │  Write   │────►│  Deploy  │────►│   Test   │              │
│    │   Code   │     │  to K8s  │     │          │              │
│    └──────────┘     └──────────┘     └────┬─────┘              │
│          ▲                                │                     │
│          │                                ▼                     │
│    ┌─────┴────┐                    ┌──────────┐                │
│    │   Fix    │◄───────────────────│ Kubeshark│                │
│    │  Issues  │   Network Feedback │   MCP    │                │
│    └──────────┘                    └──────────┘                │
│                                                                 │
│    Loop continues until code is verified                        │
└─────────────────────────────────────────────────────────────────┘
```

**Example prompts:**

> *"Deploy my changes to the local cluster and verify the new /api/orders endpoint works correctly."*

> *"Run the integration tests and use Kubeshark to verify the API calls are correct—check payloads, headers, and downstream calls."*

> *"Test my authentication middleware. Verify it properly rejects invalid tokens and check what headers it adds to valid requests."*

> *"I changed the retry logic. Deploy and verify that failed requests are retried exactly 3 times with exponential backoff."*

---

## What Network Feedback Catches

Kubeshark provides feedback that logs, metrics, and test assertions miss:

| Traditional Testing | Network-Level Verification |
|---------------------|---------------------------|
| "Test passed (200 OK)" | "Response was 200, but payload had wrong field types" |
| "No errors in logs" | "3 unexpected retries occurred, masking a connection issue" |
| "Latency within SLA" | "Latency is fine, but you're making 5 redundant DB calls" |
| "Auth test passed" | "Auth works, but token is sent to downstream services unmasked" |

**Specific issues the AI catches:**
- Malformed payloads that "work" but violate API specs
- Extra API calls that shouldn't happen (N+1 queries)
- Missing or incorrect headers (auth, correlation IDs, content-type)
- Serialization bugs (wrong date formats, encoding issues)
- Downstream services called with wrong parameters
- Retry/timeout logic that doesn't behave as intended
- Connection pooling issues

---

## The Autonomous Loop in Action

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > I've updated the order-service to add caching. Deploy it and verify          │
│    it works correctly.                                                          │
│                                                                                 │
│  ● Building and deploying order-service                                         │
│    ├─ Running unit tests... ✓ 23 passed                                         │
│    ├─ Building container image...                                               │
│    ├─ Deploying to local cluster...                                             │
│    └─ Waiting for rollout... ✓ Ready                                            │
│                                                                                 │
│  ● Running integration tests with network verification                          │
│    ├─ Executing test suite...                                                   │
│    ├─ Creating Kubeshark snapshot...                                            │
│    ├─ Analyzing 847 API calls...                                                │
│    └─ Verifying network behavior...                                             │
│                                                                                 │
│  ⚠ Issues detected:                                                             │
│                                                                                 │
│  1. Cache miss on every request                                                 │
│     Expected: First request hits DB, subsequent requests use cache              │
│     Actual: All 12 requests to /api/orders/{id} called the database             │
│     Evidence: 12 calls to postgres-service for same order ID                    │
│                                                                                 │
│  2. Missing Cache-Control header                                                │
│     Expected: Response includes Cache-Control: max-age=300                      │
│     Actual: Header not present in any response                                  │
│                                                                                 │
│  Root cause: The cache key includes a timestamp, making every lookup unique.    │
│                                                                                 │
│  Suggested fix: Remove timestamp from cache key in order-service/cache.go:47    │
│                                                                                 │
│  > Yes, apply the fix                                                           │
│                                                                                 │
│  ● Applying fix                                                                 │
│    ├─ Updating order-service/cache.go...                                        │
│    ├─ Rebuilding and redeploying...                                             │
│    └─ Re-running verification...                                                │
│                                                                                 │
│  ● Network verification results                                                 │
│    ├─ First request: DB call ✓                                                  │
│    ├─ Subsequent requests: Cache hit (no DB call) ✓                             │
│    ├─ Cache-Control header present ✓                                            │
│    └─ Response times: 45ms (cold) → 2ms (cached) ✓                              │
│                                                                                 │
│  ✓ All verifications passed. Your caching implementation is working correctly.  │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Another Example: Verifying Retry Logic

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > I implemented retry logic for the payment service. It should retry           │
│    3 times with exponential backoff (1s, 2s, 4s). Deploy and verify.            │
│                                                                                 │
│  ● Deploying and testing retry logic                                            │
│    ├─ Deploying payment-client...                                               │
│    ├─ Configuring payment-service to fail first 2 requests...                   │
│    ├─ Triggering test payment...                                                │
│    └─ Analyzing retry behavior...                                               │
│                                                                                 │
│  ⚠ Retry logic has issues:                                                      │
│                                                                                 │
│  Expected: 3 retries with 1s, 2s, 4s delays                                     │
│  Actual: 3 retries with 1s, 1s, 1s delays                                       │
│                                                                                 │
│  Network evidence:                                                              │
│    Request 1: 14:23:15.000 → 503 Service Unavailable                            │
│    Request 2: 14:23:16.012 → 503 Service Unavailable  (delay: 1.01s)            │
│    Request 3: 14:23:17.018 → 503 Service Unavailable  (delay: 1.00s)            │
│    Request 4: 14:23:18.025 → 200 OK                   (delay: 1.00s)            │
│                                                                                 │
│  The backoff multiplier isn't being applied.                                    │
│                                                                                 │
│  Found in payment-client/retry.go:23:                                           │
│    delay := baseDelay  // Should be: delay := baseDelay * (1 << attempt)        │
│                                                                                 │
│  > Fix it                                                                       │
│                                                                                 │
│  ● Fixing and re-verifying                                                      │
│    ├─ Applying fix to retry.go...                                               │
│    ├─ Redeploying...                                                            │
│    └─ Re-running test...                                                        │
│                                                                                 │
│  ✓ Retry logic verified:                                                        │
│    Request 1: 14:25:00.000 → 503  (initial)                                     │
│    Request 2: 14:25:01.005 → 503  (delay: 1.00s) ✓                              │
│    Request 3: 14:25:03.011 → 503  (delay: 2.00s) ✓                              │
│    Request 4: 14:25:07.018 → 200  (delay: 4.00s) ✓                              │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Why This Matters

This closes the feedback loop between development and production behavior:

- **Shift-left network visibility** — Catch integration issues before they reach staging or production
- **Autonomous verification** — AI handles the test-analyze-fix cycle with minimal human intervention
- **Deeper than unit tests** — Verify actual network behavior, not just mocked responses
- **Production-like insights** — Same visibility you'd have in production, in your local environment
- **Faster iteration** — No more "works on my machine" vs production discrepancies

---

## What the AI Can Do

- Deploy code changes to local Kubernetes cluster
- Run unit and integration tests
- Create Kubeshark snapshots of test traffic
- Analyze API calls for correctness (payloads, headers, status codes)
- Verify downstream service interactions
- Identify issues and suggest code fixes
- Re-run verification after fixes are applied
- Continue loop until code is verified

---

## What's Next

- [Troubleshooting & Debugging](/en/mcp/troubleshooting) — Debug integration issues
- [Performance Debugging](/en/mcp/performance_debugging) — Verify performance characteristics
- [MCP in Action](/en/mcp_in_action) — See a complete investigation example
