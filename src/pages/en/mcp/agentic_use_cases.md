---
title: Agentic Use Cases
description: Build autonomous AI agents that leverage Kubeshark's network visibility for monitoring, incident response, and regression verification.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark's MCP integration enables AI agents to work autonomously with real-time Kubernetes network data. This page covers three powerful agentic use cases that transform how teams monitor, investigate, and validate their systems.

---

## Overview

| Use Case | Description | Key Benefit |
|----------|-------------|-------------|
| [Network Monitoring](#network-monitoring-agent) | Continuous traffic analysis and anomaly detection | Proactive issue identification |
| [Incident Response](#incident-response-agent) | Forensic investigation of production incidents | Faster root cause analysis |
| [Regression Verification](#regression-verification-agent) | Automated validation after deployments | Confidence before release |

Each use case represents a different phase of the software lifecycle—from ongoing operations to incident handling to deployment validation.

---

## Network Monitoring Agent

**Purpose:** Continuously monitor network traffic patterns and alert on anomalies before they become incidents.

A network monitoring agent runs as a background process, periodically querying Kubeshark to analyze traffic patterns, detect anomalies, and surface potential issues.

### What It Monitors

- **Error rate spikes** — Sudden increases in 4xx/5xx responses
- **Latency degradation** — Response times exceeding baselines
- **Traffic anomalies** — Unusual call patterns or unexpected service communication
- **Protocol violations** — Malformed requests or responses
- **Security concerns** — Unencrypted traffic, missing auth headers, suspicious payloads

### Example Agent Loop

```
+-----------------------------------------------------------------------+
|                     NETWORK MONITORING AGENT                           |
|                                                                        |
|   Every 5 minutes:                                                     |
|   ┌─────────────────────────────────────────────────────────────────┐  |
|   │  1. Query L4 flows for traffic volume and connection stats      │  |
|   │  2. Query L7 calls for error rates and latency percentiles      │  |
|   │  3. Compare against baseline thresholds                         │  |
|   │  4. If anomaly detected → Alert + capture snapshot              │  |
|   │  5. Generate summary report                                     │  |
|   └─────────────────────────────────────────────────────────────────┘  |
|                                                                        |
+-----------------------------------------------------------------------+
```

### Sample Prompts

> *"Monitor the cluster for the next hour. Alert me if error rates exceed 1% or if any service latency goes above 500ms."*

> *"Watch traffic to the payment-service. Flag any unusual patterns or unexpected callers."*

> *"Generate a traffic summary every 15 minutes showing top talkers, error rates, and any anomalies."*

### What the Agent Does

1. **Establishes baselines** — Learns normal traffic patterns over time
2. **Detects deviations** — Identifies when current behavior differs from baseline
3. **Captures evidence** — Creates snapshots when anomalies occur
4. **Reports findings** — Provides actionable summaries with specific observations

---

## Incident Response Agent

**Purpose:** Rapidly investigate production incidents using network-level evidence to identify root cause.

When an incident occurs, an incident response agent (also called a forensic agent) works backwards through network data to reconstruct what happened, when, and why.

### Investigation Capabilities

- **Timeline reconstruction** — Build a sequence of events leading to the incident
- **Dependency mapping** — Identify which services were involved
- **Payload inspection** — Examine request/response bodies for clues
- **Error correlation** — Link errors across services to find the source
- **Comparison analysis** — Compare incident traffic with known-good baselines

### The Forensic Process

```
+-----------------------------------------------------------------------+
|                      INCIDENT RESPONSE AGENT                           |
|                                                                        |
|   Input: "Users are seeing checkout failures since 14:30"              |
|                                                                        |
|   ┌─────────────────────────────────────────────────────────────────┐  |
|   │  1. Query checkout-service traffic from 14:00-14:45             │  |
|   │  2. Identify error patterns (status codes, error messages)      │  |
|   │  3. Trace error origins across upstream/downstream services     │  |
|   │  4. Examine payloads for malformed data or missing fields       │  |
|   │  5. Correlate with deployments or config changes                │  |
|   │  6. Present timeline with evidence and root cause hypothesis    │  |
|   └─────────────────────────────────────────────────────────────────┘  |
|                                                                        |
|   Output: "inventory-service started returning 503s at 14:28 due to    |
|            database connection pool exhaustion. This cascaded to       |
|            checkout failures when inventory checks failed."            |
|                                                                        |
+-----------------------------------------------------------------------+
```

### Sample Prompts

> *"Investigate why the checkout flow is failing. Look at traffic from the last 30 minutes and identify the root cause."*

> *"We had an outage at 3am. Analyze the network traffic around that time and tell me what went wrong."*

> *"The payment service is returning intermittent 500 errors. Find out which downstream dependency is causing them."*

### What the Agent Discovers

- **The exact timestamp** when issues started
- **The originating service** where errors first appeared
- **The cascade path** showing how the issue propagated
- **Specific evidence** — actual request/response data proving the root cause
- **Contributing factors** — traffic spikes, connection issues, or payload problems

---

## Regression Verification Agent

**Purpose:** Validate that deployments haven't introduced regressions by comparing network behavior before and after changes.

A regression verification agent captures traffic patterns before deployment, then validates that the same patterns hold after deployment—catching behavioral changes that tests might miss.

### What It Validates

- **API contract compliance** — Response schemas match expectations
- **Call patterns** — Same services called in same order
- **Performance characteristics** — Latency stays within acceptable range
- **Error rates** — No new error conditions introduced
- **Side effects** — No unexpected downstream calls or data mutations

### The Verification Workflow

```
+-----------------------------------------------------------------------+
|                   REGRESSION VERIFICATION AGENT                        |
|                                                                        |
|   Before Deployment:                                                   |
|   ┌─────────────────────────────────────────────────────────────────┐  |
|   │  1. Capture baseline snapshot of service traffic                │  |
|   │  2. Record call patterns, response schemas, latencies           │  |
|   │  3. Document expected behavior characteristics                   │  |
|   └─────────────────────────────────────────────────────────────────┘  |
|                                                                        |
|   After Deployment:                                                    |
|   ┌─────────────────────────────────────────────────────────────────┐  |
|   │  1. Run same test scenarios                                      │  |
|   │  2. Capture post-deployment traffic                              │  |
|   │  3. Compare against baseline                                     │  |
|   │  4. Flag any behavioral differences                              │  |
|   │  5. Report: PASS (no regression) or FAIL (differences found)    │  |
|   └─────────────────────────────────────────────────────────────────┘  |
|                                                                        |
+-----------------------------------------------------------------------+
```

### Sample Prompts

> *"Capture a baseline of the order-service API behavior, then deploy my changes and verify nothing broke."*

> *"Compare traffic patterns before and after the v2.1 release. Flag any differences in API responses or call patterns."*

> *"Run the integration test suite and verify that the network behavior matches the previous release."*

### Regression Types Detected

| Regression Type | Example |
|----------------|---------|
| **Schema changes** | Response missing a field that was present before |
| **New errors** | Endpoint returning 500 that previously returned 200 |
| **Performance degradation** | P95 latency increased from 50ms to 200ms |
| **Behavioral changes** | Service now makes 3 DB calls instead of 1 |
| **Missing calls** | Audit logging call no longer happening |
| **Extra calls** | New unexpected call to external service |

---

## Building Your Own Agent

Each use case can be implemented as an autonomous agent using any MCP-compatible AI assistant. The key components:

1. **Kubeshark MCP connection** — Provides the tools for querying network data
2. **Agent logic** — The reasoning and decision-making loop
3. **Trigger mechanism** — Schedule-based, event-based, or manual invocation
4. **Output handling** — Alerts, reports, or actions based on findings

### MCP Tools Used

| Tool | Monitoring | Incident Response | Regression |
|------|:----------:|:-----------------:|:----------:|
| `list_api_calls` | ✓ | ✓ | ✓ |
| `list_l4_flows` | ✓ | ✓ | ✓ |
| `get_l4_flow_summary` | ✓ | ✓ | |
| `create_snapshot` | ✓ | ✓ | ✓ |
| `get_data_boundaries` | | ✓ | ✓ |
| `export_snapshot_pcap` | | ✓ | |

---

## What's Next

- [Autonomous Development](/en/mcp/autonomous_development) — CI/CD integration with network feedback
- [Conversational Debugging](/en/mcp/troubleshooting) — Interactive investigation workflows
- [L7 API Calls](/en/mcp/l7_tools) — Deep dive into L7 query tools
- [Snapshots & Raw Capture](/en/mcp/raw_capture_tools) — Capturing evidence for analysis
