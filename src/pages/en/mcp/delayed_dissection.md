---
title: MCP Delayed Dissection
description: MCP endpoints for running L7 protocol dissection on captured snapshots.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

> **Coming Soon — V2.00:** MCP integration is coming as part of Kubeshark V2.00. [Read the announcement](https://kubeshark.com/post/kubeshark-v2-00-coming-soon).

**Delayed dissection** allows you to run L7 protocol analysis on previously captured snapshots. Instead of dissecting traffic in real-time, you can capture raw packets first, then analyze them later—useful for incident investigation, compliance audits, and forensic analysis.

---

## How It Works

```
+--------------+     +--------------+     +--------------+
|   Snapshot   |---->|   Delayed    |---->|  Dissection  |
|    (PCAP)    |     |  Dissection  |     |      DB      |
+--------------+     +--------------+     +------+-------+
                                                 |
                                                 v
                                          +--------------+
                                          |  /mcp/calls  |
                                          |   ?db=...    |
                                          +--------------+
```

1. **Capture**: Create a snapshot of raw traffic
2. **Dissect**: Run delayed dissection on the snapshot
3. **Query**: Query the dissection database via `/mcp/calls?db=...`

---

## MCP Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/databases` | GET | List all databases (real-time + dissection) |
| `/mcp/dissections` | POST | Start a delayed dissection job |
| `/mcp/dissections` | GET | List dissection jobs |
| `/mcp/dissections/:snapshot/:name` | GET | Get dissection status |
| `/mcp/dissections/:snapshot/:name/stop` | POST | Stop a running dissection |
| `/mcp/dissections/:snapshot/:name` | DELETE | Delete a dissection |

---

## Endpoint: `/mcp/databases`

List all available databases for querying.

### Response

```json
{
  "databases": [
    {
      "type": "realtime",
      "node": "worker-1",
      "entry_count": 15000,
      "first_ts": 1706745000000,
      "last_ts": 1706748600000
    },
    {
      "type": "realtime",
      "node": "worker-2",
      "entry_count": 12000,
      "first_ts": 1706745100000,
      "last_ts": 1706748600000
    },
    {
      "type": "dissection",
      "snapshot": "incident-2024-02-01",
      "name": "full-dissection",
      "entry_count": 50000,
      "status": "completed",
      "first_ts": 1706740000000,
      "last_ts": 1706745000000
    }
  ]
}
```

| Type | Description |
|------|-------------|
| `realtime` | Live data on worker nodes |
| `dissection` | Dissected data from a snapshot |

---

## Endpoint: `/mcp/dissections` (POST)

Start a delayed dissection job on a snapshot.

### Request

```json
{
  "snapshot": "incident-2024-02-01",
  "name": "full-dissection"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `snapshot` | string | Name of the snapshot to dissect |
| `name` | string | Name for this dissection job |

### Response

```json
{
  "success": true,
  "snapshot": "incident-2024-02-01",
  "name": "full-dissection",
  "status": "pending"
}
```

---

## Endpoint: `/mcp/dissections/:snapshot/:name` (GET)

Get the status of a dissection job.

### Response

```json
{
  "snapshot": "incident-2024-02-01",
  "name": "full-dissection",
  "status": "running",
  "progress": 45,
  "stats": {
    "pcap_files": 10,
    "pcap_bytes": 500000000,
    "packets_processed": 500000,
    "entries_created": 25000,
    "protocol_counts": {
      "http": 20000,
      "dns": 3000,
      "redis": 2000
    }
  },
  "errors": []
}
```

### Status Values

| Status | Description |
|--------|-------------|
| `pending` | Created, not started |
| `downloading` | Downloading snapshot from hub |
| `running` | Processing PCAPs |
| `uploading` | Uploading results |
| `completed` | Done, ready to query |
| `failed` | Error occurred |
| `cancelled` | User cancelled |

---

## Endpoint: `/mcp/dissections` (GET)

List dissection jobs, optionally filtered by snapshot.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `snapshot` | string | Filter by snapshot name |

### Response

```json
{
  "dissections": [
    {
      "snapshot": "incident-2024-02-01",
      "name": "full-dissection",
      "status": "completed",
      "entry_count": 50000
    },
    {
      "snapshot": "incident-2024-02-01",
      "name": "http-only",
      "status": "running",
      "progress": 30
    }
  ]
}
```

---

## Endpoint: `/mcp/dissections/:snapshot/:name/stop` (POST)

Stop a running dissection job.

### Response

```json
{
  "success": true,
  "snapshot": "incident-2024-02-01",
  "name": "full-dissection",
  "status": "cancelled"
}
```

---

## Endpoint: `/mcp/dissections/:snapshot/:name` (DELETE)

Delete a dissection and its database.

### Response

```json
{
  "success": true,
  "snapshot": "incident-2024-02-01",
  "name": "full-dissection"
}
```

---

## Querying Dissection Databases

Once a dissection is complete, query it using the `db` parameter on `/mcp/calls`:

```bash
# Real-time (default) - queries worker databases
GET /mcp/calls?kfl=http

# Dissection DB - queries the dissected snapshot
GET /mcp/calls?kfl=http&db=incident-2024-02-01/full-dissection
```

The `db` parameter format is: `<snapshot>/<dissection>`

### Example Queries

```
GET /mcp/calls?db=incident-2024-02-01/full-dissection&kfl=http and status >= 400
→ "Show HTTP errors from the incident snapshot"

GET /mcp/calls?db=incident-2024-02-01/full-dissection&kfl=dst.svc == "payment"
→ "Show all traffic to payment service during the incident"
```

---

## Workflow Example

```
+---------------------------------------------------------------------------------+
| Terminal - AI Assistant                                                         |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  > Analyze HTTP errors from yesterday's incident snapshot                       |
|                                                                                 |
|  * Checking available databases                                                 |
|    GET /mcp/databases                                                           |
|    Found snapshot "incident-2024-02-01", no dissection yet                      |
|                                                                                 |
|  * Starting delayed dissection                                                  |
|    POST /mcp/dissections                                                        |
|    {snapshot: "incident-2024-02-01", name: "analysis"}                          |
|                                                                                 |
|  * Waiting for dissection to complete                                           |
|    GET /mcp/dissections/incident-2024-02-01/analysis                            |
|    Status: running (45%)... running (78%)... completed                          |
|                                                                                 |
|  * Querying dissection database                                                 |
|    GET /mcp/calls?db=incident-2024-02-01/analysis&kfl=http and status>=400      |
|                                                                                 |
|  Found 127 HTTP 5xx errors in the incident snapshot:                            |
|                                                                                 |
|  - 89 errors on POST /api/checkout (payment-service)                            |
|  - 23 errors on GET /api/inventory (inventory-service)                          |
|  - 15 errors on POST /api/notifications (notification-service)                  |
|                                                                                 |
|  Root cause: payment-service was returning 503 due to database connection       |
|  pool exhaustion, causing cascading failures.                                   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

---

## Use Cases

### Incident Investigation

> *"Dissect the incident snapshot and find all failed API calls"*

> *"What was the payment service receiving during the outage?"*

Analyze historical traffic without impacting production systems.

### Compliance Audits

> *"Run dissection on last month's compliance snapshot"*

> *"Find all API calls that accessed PII data"*

Generate detailed API-level audit trails from captured traffic.

### Forensic Analysis

> *"Dissect the snapshot from the security incident"*

> *"Look for any data exfiltration patterns"*

Deep analysis of captured traffic for security investigations.

---

## What's Next

- [Snapshots & Raw Capture](/en/mcp/raw_capture_tools) — Create snapshots for dissection
- [L7 Tools Reference](/en/mcp/l7_tools) — Real-time L7 queries
- [KFL2 Filters](/en/v2/kfl2) — Filter syntax for queries
