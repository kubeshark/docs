---
title: Security Analysis & Threat Detection
description: Use AI to detect security threats, audit authentication, and find vulnerabilities in network traffic.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Network traffic reveals security issues that application logs miss. Use AI to continuously monitor for threats and investigate suspicious activity.

---

## The Problem

Security teams face challenges like:
- Detecting data exfiltration through legitimate-looking API calls
- Identifying lateral movement between services
- Finding services communicating without proper authentication
- Spotting unusual traffic patterns that indicate compromise
- Auditing east-west traffic that perimeter tools don't see

---

## How MCP Helps

Ask security-focused questions about your network traffic:

**Example prompts:**

> *"Are any pods making outbound connections to external IPs that aren't in our allowed list?"*

> *"Find all API calls in the last hour that don't have Authorization headers but should."*

> *"Which internal services are accessible from the public-facing namespace? Show me the actual traffic."*

> *"Analyze traffic patterns for the user-service. Is there anything unusual compared to its normal behavior?"*

> *"Find any instances of sensitive data (credit card patterns, SSNs, API keys) appearing in request or response bodies."*

> *"Show me all traffic from pods that were created in the last 24 hours."*

> *"Are there any services making unusually large data transfers?"*

---

## What the AI Can Do

- **Audit authentication headers** across all API calls
- **Identify unexpected egress traffic** leaving the cluster
- **Detect unusual traffic volumes** or patterns
- **Find services communicating** outside their normal dependencies
- **Search payloads for sensitive data** patterns
- **Map attack surfaces** by showing all ingress points
- **Identify lateral movement** between namespaces
- **Compare behavior** against historical baselines

---

## Example Analysis

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > Run a security audit on the production namespace. Look for anything          │
│    suspicious.                                                                  │
│                                                                                 │
│  ● Running security audit on production namespace                               │
│    ├─ Analyzing authentication patterns...                                      │
│    ├─ Checking egress traffic...                                                │
│    ├─ Scanning for sensitive data exposure...                                   │
│    └─ Comparing against baseline behavior...                                    │
│                                                                                 │
│  Security Audit Results:                                                        │
│                                                                                 │
│  ⚠ Issues Found:                                                                │
│                                                                                 │
│  1. Missing Authentication (HIGH)                                               │
│     • internal-api service accepts requests without Authorization header        │
│     • 847 unauthenticated requests in last hour                                 │
│     • Sources: frontend-service, admin-dashboard, unknown-pod-x7k2m             │
│                                                                                 │
│  2. Unexpected Egress (MEDIUM)                                                  │
│     • analytics-service connecting to 203.0.113.45:443                          │
│     • IP not in allowed egress list                                             │
│     • 12 connections in last 4 hours, 2.3 MB transferred                        │
│                                                                                 │
│  3. Sensitive Data Exposure (HIGH)                                              │
│     • user-service returning unmasked credit card numbers                       │
│     • Pattern: "card_number": "4532-XXXX-XXXX-XXXX" in 23 responses             │
│     • Last 4 digits should be masked, full number exposed                       │
│                                                                                 │
│  4. Unusual Traffic Pattern (LOW)                                               │
│     • data-export-service traffic 340% above baseline                           │
│     • Started 2 hours ago, coincides with new deployment                        │
│     • Likely legitimate but worth investigating                                 │
│                                                                                 │
│  ✓ No Issues:                                                                   │
│     • No lateral movement detected between namespaces                           │
│     • All external API calls using TLS                                          │
│     • No unusual port usage                                                     │
│                                                                                 │
│  > Tell me more about that unknown pod making unauthenticated requests          │
│                                                                                 │
│  Investigating unknown-pod-x7k2m:                                               │
│                                                                                 │
│    Created: 47 minutes ago                                                      │
│    Namespace: production                                                        │
│    Image: internal-registry/debug-tools:latest                                  │
│    Requests to internal-api: 312                                                │
│    Endpoints accessed: /api/users, /api/admin/config, /api/secrets              │
│                                                                                 │
│  ⚠ This pod is accessing sensitive endpoints without authentication.           │
│    The image "debug-tools" and recent creation time are suspicious.             │
│                                                                                 │
│  Recommendation: Investigate immediately. Consider isolating this pod.          │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Security Patterns to Detect

| Pattern | What to Ask |
|---------|-------------|
| **Missing auth** | "Find API calls without Authorization headers" |
| **Data exfiltration** | "Show large outbound data transfers to external IPs" |
| **Lateral movement** | "What namespaces is this pod communicating with?" |
| **Credential exposure** | "Search for API keys or tokens in request/response bodies" |
| **Anomalous behavior** | "Compare this service's traffic to its baseline" |
| **Reconnaissance** | "Find services scanning multiple endpoints rapidly" |

---

## What's Next

- [Incident Investigation](/en/mcp/incident_investigation) — Investigate production incidents
- [Compliance & Auditing](/en/mcp/compliance_auditing) — Generate audit reports
- [Architecture Discovery](/en/mcp/architecture_discovery) — Map service dependencies
