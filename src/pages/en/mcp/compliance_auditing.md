---
title: Compliance & Auditing
description: Use AI to generate audit reports, create evidence for compliance, and track data access patterns.
layout: ../../../layouts/MainLayout.astro
mascot: Cute
---

Regulated industries need evidence of what happened, when, and to what data. Network traffic provides an immutable audit trail.

---

## The Problem

Compliance requirements often demand:
- Complete records of data access
- Evidence for security incident investigations
- Audit trails for specific transactions
- Proof of data handling practices
- Documentation for vendor access reviews

Gathering this evidence manually is time-consuming and error-prone.

---

## How MCP Helps

Ask the AI to gather evidence and create reports:

**Example prompts:**

> *"Create a report of all API calls that accessed customer PII in the last 24 hours. Include source, destination, and timestamps."*

> *"Export all traffic to/from the payment-gateway namespace between 3 PM and 4 PM yesterday as evidence for the security team."*

> *"Which services accessed the user-database service during the reported breach window? List every call with full details."*

> *"Generate an audit trail for order ID 12345—every API call involved in processing that order."*

> *"Find all external API calls made by our cluster in the last week. We need this for the vendor access review."*

> *"Show me all access to the /api/admin endpoints and who made those requests."*

---

## What the AI Can Do

- **Query traffic for compliance scopes** (PCI, HIPAA namespaces)
- **Create point-in-time traffic snapshots**
- **Export PCAP files** with full Kubernetes context
- **Generate summary reports** of data access patterns
- **Trace specific transactions** across all services
- **Identify all external data flows**
- **Document who accessed what and when**
- **Create evidence packages** for investigations

---

## Example Audit

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Terminal - claude                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  > We had a potential data breach reported between 2-3 PM yesterday.            │
│    Generate an audit report of all access to customer data services.            │
│                                                                                 │
│  ● Generating audit report                                                      │
│    ├─ Creating snapshot for 14:00-15:00 UTC yesterday...                        │
│    ├─ Identifying customer data services...                                     │
│    ├─ Analyzing access patterns...                                              │
│    └─ Compiling report...                                                       │
│                                                                                 │
│  ═══════════════════════════════════════════════════════════════════════        │
│  AUDIT REPORT: Customer Data Access                                             │
│  Time Window: 2024-01-15 14:00:00 - 15:00:00 UTC                                │
│  Generated: 2024-01-16 09:23:45 UTC                                             │
│  ═══════════════════════════════════════════════════════════════════════        │
│                                                                                 │
│  SERVICES IN SCOPE:                                                             │
│    • user-database (PII storage)                                                │
│    • customer-service (PII API)                                                 │
│    • payment-vault (PCI data)                                                   │
│                                                                                 │
│  SUMMARY:                                                                       │
│    Total requests: 12,847                                                       │
│    Unique sources: 8 services                                                   │
│    External access: 0                                                           │
│    Anomalies detected: 2                                                        │
│                                                                                 │
│  ACCESS BY SERVICE:                                                             │
│  ┌───────────────────────┬─────────┬─────────────────────────────┐              │
│  │ Source                │ Requests│ Endpoints                   │              │
│  ├───────────────────────┼─────────┼─────────────────────────────┤              │
│  │ api-gateway           │ 8,234   │ /users/{id}, /users/search  │              │
│  │ order-service         │ 2,341   │ /users/{id}                 │              │
│  │ notification-service  │ 1,892   │ /users/{id}/email           │              │
│  │ admin-dashboard       │ 234     │ /users/*, /users/export     │              │
│  │ analytics-worker      │ 89      │ /users/aggregate            │              │
│  │ unknown-pod-x7k2m     │ 47      │ /users/*, /users/export  ⚠ │              │
│  │ debug-tools-pod       │ 10      │ /users/dump              ⚠ │              │
│  └───────────────────────┴─────────┴─────────────────────────────┘              │
│                                                                                 │
│  ⚠ ANOMALIES:                                                                   │
│                                                                                 │
│  1. unknown-pod-x7k2m (14:23:15 - 14:47:32)                                     │
│     • Pod created at 14:20:00, deleted at 14:50:00                              │
│     • Accessed /users/export 12 times                                           │
│     • Downloaded 23,847 user records                                            │
│     • No authentication headers present                                         │
│                                                                                 │
│  2. debug-tools-pod (14:31:00 - 14:31:45)                                       │
│     • Called /users/dump endpoint (not in normal API)                           │
│     • Response size: 847 MB                                                     │
│     • Source IP: internal (10.244.3.47)                                         │
│                                                                                 │
│  EVIDENCE EXPORTED:                                                             │
│    • /evidence/breach-2024-01-15/snapshot.pcap (2.3 GB)                         │
│    • /evidence/breach-2024-01-15/anomaly-1-requests.json                        │
│    • /evidence/breach-2024-01-15/anomaly-2-requests.json                        │
│    • /evidence/breach-2024-01-15/full-report.pdf                                │
│                                                                                 │
│  > Show me the exact requests from unknown-pod-x7k2m                            │
│                                                                                 │
│  ... (detailed request/response data) ...                                       │
│                                                                                 │
│  > _                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Compliance Use Cases

| Requirement | What to Ask |
|-------------|-------------|
| **PCI DSS** | "Show all access to payment card data services" |
| **HIPAA** | "Audit access to healthcare data in the PHI namespace" |
| **SOC 2** | "Generate access logs for all admin operations" |
| **GDPR** | "Trace all processing of user ID 12345's data" |
| **Incident response** | "Export evidence for the security team" |
| **Vendor review** | "List all external API calls and data transferred" |

---

## What's Next

- [Security Analysis](/en/mcp/security_analysis) — Find security vulnerabilities
- [Incident Investigation](/en/mcp/incident_investigation) — Investigate breaches
- [Architecture Discovery](/en/mcp/architecture_discovery) — Map data flows
