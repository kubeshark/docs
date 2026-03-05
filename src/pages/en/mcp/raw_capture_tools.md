---
title: MCP Snapshots & Raw Capture Tools
description: MCP endpoints for snapshots, raw packet capture, and PCAP export.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

> **Coming Soon — V2.00:** MCP integration is coming as part of Kubeshark V2.00. [Read the announcement](https://kubeshark.com/post/kubeshark-v2-00-coming-soon).

Kubeshark's MCP server exposes **snapshot and raw capture tools** that enable AI assistants to create point-in-time traffic snapshots, query data boundaries, and export PCAP files for external analysis.

---

## MCP Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/raw-capture` | GET | Check if raw capture is enabled |
| `/mcp/data-boundaries` | GET | Get available data time range |
| `/mcp/snapshots` | GET | List all snapshots |
| `/mcp/snapshots` | POST | Create a new snapshot |
| `/mcp/snapshots/:name` | GET | Get snapshot details |
| `/mcp/snapshots/:name` | DELETE | Delete a snapshot |
| `/mcp/snapshots/:name/pcap` | GET | Export snapshot as PCAP |

---

## Endpoint: `/mcp/raw-capture`

Check if raw packet capture is enabled.

### Response

```json
{
  "enabled": true,
  "session_id": "abc123"
}
```

Raw capture must be enabled to create snapshots and export PCAP files.

---

## Endpoint: `/mcp/data-boundaries`

Get the available time range for snapshots and queries.

### Response

```json
{
  "cluster": {
    "oldest_ts": 1706745000000,
    "newest_ts": 1706748600000
  },
  "nodes": [
    {
      "name": "worker-1",
      "oldest_ts": 1706745000000,
      "newest_ts": 1706748600000
    },
    {
      "name": "worker-2",
      "oldest_ts": 1706745100000,
      "newest_ts": 1706748600000
    }
  ]
}
```

Use this to understand what time range of data is available before creating snapshots.

### Example Request

```
GET /mcp/data-boundaries
→ "What time range of traffic data is available?"
→ "How far back can I create a snapshot?"
```

---

## Snapshot Endpoints

Snapshots capture a point-in-time view of traffic for later analysis or export.

### POST `/mcp/snapshots`

Create a new snapshot.

**Request:**
```json
{
  "name": "incident-001",
  "duration": "1h"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique snapshot identifier |
| `duration` | string | Time duration to capture (e.g., `30m`, `1h`, `2h`) |

**Response:**
```json
{
  "success": true,
  "name": "incident-001",
  "status": "in_progress"
}
```

### GET `/mcp/snapshots`

List all snapshots.

```json
{
  "snapshots": [
    {
      "name": "incident-001",
      "status": "completed",
      "size_bytes": 52428800,
      "created_at": "2025-01-15T10:30:00Z",
      "duration": "1h"
    },
    {
      "name": "debug-session",
      "status": "in_progress",
      "size_bytes": 10485760,
      "created_at": "2025-01-15T11:00:00Z",
      "duration": "30m"
    }
  ]
}
```

### GET `/mcp/snapshots/:name`

Get details for a specific snapshot.

```json
{
  "name": "incident-001",
  "status": "completed",
  "size_bytes": 52428800,
  "created_at": "2025-01-15T10:30:00Z",
  "duration": "1h",
  "start_ts": 1706745000000,
  "end_ts": 1706748600000,
  "node_count": 3,
  "packet_count": 1500000
}
```

### DELETE `/mcp/snapshots/:name`

Delete a snapshot.

```json
{
  "success": true,
  "name": "incident-001"
}
```

### GET `/mcp/snapshots/:name/pcap`

Export snapshot as a merged PCAP file for Wireshark analysis. Supports optional filtering by nodes, time range, and BPF expression to extract only the packets you need.

Returns binary PCAP data with `Content-Type: application/vnd.tcpdump.pcap`.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `nodes` | string | Comma-separated list of node names to include (default: all nodes) |
| `bpf_filter` | string | BPF filter expression (e.g., `tcp port 80`, `udp port 53`) |
| `start_time` | integer | Start timestamp in Unix milliseconds — only include packets after this time |
| `end_time` | integer | End timestamp in Unix milliseconds — only include packets before this time |

All parameters are optional. When omitted, the full unfiltered snapshot is exported.

#### Examples

Export the full snapshot:
```bash
curl http://localhost:8898/mcp/snapshots/incident-001/pcap -o snapshot.pcap
```

Export only HTTP traffic:
```bash
curl "http://localhost:8898/mcp/snapshots/incident-001/pcap?bpf_filter=tcp%20port%2080" -o http-only.pcap
```

Export from a specific node within a time window:
```bash
curl "http://localhost:8898/mcp/snapshots/incident-001/pcap?nodes=worker-1&start_time=1706745000000&end_time=1706746000000" -o filtered.pcap
```

Export only DNS traffic:
```bash
curl "http://localhost:8898/mcp/snapshots/incident-001/pcap?bpf_filter=udp%20port%2053" -o dns.pcap
```

#### MCP Tool Usage

The `export_snapshot_pcap` MCP tool exposes the same filtering capabilities:

```json
{
  "tool": "export_snapshot_pcap",
  "arguments": {
    "id": "f4c41e9c-28b9-4c9d-8ddb-128cd7e09ff3",
    "nodes": ["worker-1", "worker-2"],
    "bpf_filter": "tcp port 443",
    "start_time": 1706745000000,
    "end_time": 1706746000000
  }
}
```

---

## Use Cases

### Incident Evidence Collection

> *"Create a snapshot of the last 30 minutes for the incident"*

> *"What time range of data do we have available?"*

> *"Export the snapshot as PCAP for the security team"*

> *"Export only HTTPS traffic from worker-1 during the breach window"*

Snapshots preserve traffic evidence for later forensic analysis. PCAP filters let you extract exactly the traffic relevant to an incident.

### Compliance & Auditing

> *"Create a snapshot of all traffic to the payment service"*

> *"Export traffic from the breach window as PCAP"*

> *"List all snapshots we've created this week"*

PCAP exports provide immutable evidence for compliance requirements.

### Offline Analysis

> *"Export this traffic so I can analyze it in Wireshark"*

> *"Export only DNS traffic for the network team"*

> *"Create a snapshot I can share with the network team"*

PCAP files can be analyzed with standard network tools outside of Kubeshark. Use BPF filters to reduce file size and focus on relevant protocols.

### Debugging Sessions

> *"Capture the next hour of traffic while I reproduce the bug"*

> *"Save this traffic so we can review it later"*

> *"Export just the last 5 minutes of traffic from the affected node"*

Snapshots allow teams to capture traffic during debugging sessions for later review. Time range and node filters help narrow down to the relevant window.

---

## Snapshot Lifecycle

```
+--------------+     +--------------+     +--------------+
|    Create    |---->| In Progress  |---->|  Completed   |
|    (POST)    |     |  (capturing) |     |   (ready)    |
+--------------+     +--------------+     +------+-------+
                                                 |
                     +--------------+            |
                     |    Export    |<-----------+
                     |    (PCAP)    |            |
                     +--------------+            |
                                                 |
                     +--------------+            |
                     |    Delete    |<-----------+
                     |              |
                     +--------------+
```

---

## What's Next

- [L7 Tools Reference](/en/mcp/l7_tools) — Query API transactions
- [L4 Tools Reference](/en/mcp/l4_tools) — Lightweight connectivity visibility
- [Traffic Snapshots](/en/v2/traffic_snapshots) — More about snapshots
- [Snapshots](/en/dashboard_snapshots) — Create snapshots and export PCAP
