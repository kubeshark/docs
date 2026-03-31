---
title: MCP Snapshots, Raw Capture & Delayed Indexing Tools
description: MCP endpoints for snapshots, raw packet capture, PCAP export, workload & IP resolution, and delayed indexing.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubeshark's MCP server exposes **snapshot, raw capture, resolution, and delayed indexing tools** that enable AI assistants to create point-in-time traffic snapshots, discover which workloads and IPs are present in a snapshot, export PCAP files (including per-pod filtered exports), and run delayed indexing to make snapshots queryable.

---

## MCP Endpoints Overview

| Endpoint / Tool | Method | Description |
|----------|--------|-------------|
| `/mcp/raw-capture` | GET | Check if raw capture is enabled |
| `/mcp/data-boundaries` | GET | Get available data time range |
| `/mcp/snapshots` | GET | List all snapshots |
| `/mcp/snapshots` | POST | Create a new snapshot |
| `/mcp/snapshots/:name` | GET | Get snapshot details |
| `/mcp/snapshots/:name` | DELETE | Delete a snapshot |
| `/mcp/snapshots/:name/pcap` | GET | Export snapshot as PCAP (with filters) |
| `get_file_url` | MCP tool | Resolve a relative path to a download URL |
| `download_file` | MCP tool | Download a file from Kubeshark to local disk |
| `get_cloud_storage_status` | MCP tool | Check cloud storage configuration and connectivity |
| `upload_snapshot_to_cloud` | MCP tool | Upload a snapshot to cloud storage (async) |
| `download_snapshot_from_cloud` | MCP tool | Download a snapshot from cloud storage (async) |
| `get_cloud_job_status` | MCP tool | Poll async cloud job progress |
| `list_workloads` | MCP tool | List or look up workloads (pods/services) in a snapshot |
| `list_ips` | MCP tool | List or look up IPs in a snapshot |
| `/mcp/resolve/workloads` | GET | REST endpoint for workload resolution |
| `/mcp/resolve/ips` | GET | REST endpoint for IP resolution |
| `/mcp/databases` | GET | List all databases (real-time + indexed snapshots) |
| `/mcp/dissections` | POST | Start a delayed indexing job |
| `/mcp/dissections` | GET | List indexing jobs |
| `/mcp/dissections/:snapshot/:name` | GET | Get indexing job status |
| `/mcp/dissections/:snapshot/:name/stop` | POST | Stop a running indexing job |
| `/mcp/dissections/:snapshot/:name` | DELETE | Delete an indexed snapshot |

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

## Workload & IP Resolution Tools

Snapshots store a resolution database that maps IPs to Kubernetes workloads and vice versa. The `list_workloads` and `list_ips` tools let AI agents query this database to discover which pods and services are present in a snapshot, what IPs they used, and use that information to scope further analysis — for example, downloading a PCAP filtered to specific pods.

### `list_workloads`

List or look up workloads (pods and services) recorded in a snapshot's resolution database. Supports both singular lookup (by name + namespace) and filtered listing over the entire snapshot.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `snapshot_id` | string | No | Snapshot ID (required for filtered listing) |
| `name` | string | No | Exact workload name (singular lookup) |
| `namespace` | string | No | Exact namespace (required with `name`) |
| `namespaces` | array | No | Filter by one or more namespaces |
| `name_regex` | string | No | Filter workload names by regex |
| `labels` | object | No | Filter by Kubernetes labels (AND logic) |
| `type` | string | No | Filter by workload type: `pod` or `service` |
| `timestamp` | integer | No | Filter IP records by timestamp (Unix ms) |

**Singular lookup** — find a specific workload by name and namespace (works live and against snapshots):

```json
{
  "tool": "list_workloads",
  "arguments": {
    "name": "payment-api",
    "namespace": "default"
  }
}
```

**Filtered listing** — discover all workloads in a snapshot matching criteria:

```json
{
  "tool": "list_workloads",
  "arguments": {
    "snapshot_id": "incident-001",
    "namespaces": ["production"],
    "labels": { "app": "checkout" },
    "type": "pod"
  }
}
```

**Response:**
```json
{
  "workloads": [
    {
      "name": "checkout-7f8b9c6d4-xk2lm",
      "namespace": "production",
      "kind": "pod",
      "labels": { "app": "checkout", "version": "v2" },
      "ips": [
        { "ip": "10.244.1.15", "timestamp": 1706745000000 }
      ]
    }
  ],
  "total": 1
}
```

### `list_ips`

List or look up IPs recorded in a snapshot's resolution database. Supports singular lookup (by IP) and filtered listing.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `snapshot_id` | string | No | Snapshot ID (required for filtered listing) |
| `ip` | string | No | Exact IP address (singular lookup) |
| `namespaces` | array | No | Filter by one or more namespaces |
| `name_regex` | string | No | Filter associated workload names by regex |
| `labels` | object | No | Filter by Kubernetes labels (AND logic) |
| `timestamp` | integer | No | Filter records by timestamp (Unix ms) |

**Singular lookup** — resolve a single IP to its workload (works live and against snapshots):

```json
{
  "tool": "list_ips",
  "arguments": {
    "ip": "10.244.1.15"
  }
}
```

**Filtered listing** — find all IPs belonging to workloads matching criteria:

```json
{
  "tool": "list_ips",
  "arguments": {
    "snapshot_id": "incident-001",
    "namespaces": ["production"],
    "name_regex": "checkout.*"
  }
}
```

**Response:**
```json
{
  "ips": [
    {
      "ip": "10.244.1.15",
      "records": [
        {
          "name": "checkout-7f8b9c6d4-xk2lm",
          "namespace": "production",
          "timestamp": 1706745000000
        }
      ]
    }
  ],
  "total": 1
}
```

### REST Endpoints

The same capabilities are available via REST:

| Endpoint | Description |
|----------|-------------|
| `GET /mcp/resolve/workloads?name=...&namespace=...` | Singular workload lookup |
| `GET /mcp/resolve/workloads?snapshot_id=...&namespaces=...&name_regex=...&labels=key=val` | Filtered workload listing |
| `GET /mcp/resolve/ips?ip=...` | Singular IP lookup |
| `GET /mcp/resolve/ips?snapshot_id=...&namespaces=...&name_regex=...&labels=key=val` | Filtered IP listing |

The `labels` query parameter uses comma-separated `key=value` pairs: `labels=app=checkout,version=v2`.

### Combining Resolution with PCAP Export

A powerful workflow is using resolution tools to discover workload IPs, then filtering PCAP exports to only include traffic for specific pods:

1. **Discover pods** — Use `list_workloads` to find pods in a snapshot by namespace, labels, or name pattern
2. **Get IPs** — Extract the IP addresses from the workload response
3. **Export filtered PCAP** — Use `export_snapshot_pcap` with a BPF filter targeting those IPs

```
list_workloads (snapshot + filters)
  → workload IPs: [10.244.1.15, 10.244.2.23]
    → export_snapshot_pcap with bpf_filter="host 10.244.1.15 or host 10.244.2.23"
      → download_file → pod-specific.pcap
```

**Example — export PCAP for a specific pod:**

```json
// Step 1: Find the pod
{
  "tool": "list_workloads",
  "arguments": {
    "snapshot_id": "incident-001",
    "namespaces": ["production"],
    "name_regex": "payment-api.*",
    "type": "pod"
  }
}
// → Returns IPs: ["10.244.1.15"]

// Step 2: Export PCAP filtered to that pod's IP
{
  "tool": "export_snapshot_pcap",
  "arguments": {
    "id": "incident-001",
    "bpf_filter": "host 10.244.1.15"
  }
}

// Step 3: Download the file
{
  "tool": "download_file",
  "arguments": {
    "path": "/mcp/snapshots/incident-001/pcap?bpf_filter=host%2010.244.1.15",
    "dest": "/tmp/payment-api-traffic.pcap"
  }
}
```

---

## File Download Tools

When `export_snapshot_pcap` (or other tools) return a relative file path, use these tools to retrieve the file. They are available in all MCP server modes (proxy, URL, destructive).

### `get_file_url`

Resolves a relative file path into a fully-qualified download URL that can be shared with the user for manual download.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | Yes | The relative file path returned by a Hub tool (e.g., `/snapshots/abc/data.pcap`) |

**Example:**
```json
{
  "tool": "get_file_url",
  "arguments": {
    "path": "/mcp/snapshots/f4c41e9c/pcap"
  }
}
```

**Response:** A full URL like `http://localhost:8898/api/mcp/snapshots/f4c41e9c/pcap`

### `download_file`

Downloads a file from Kubeshark to the local filesystem. This is the preferred way to retrieve PCAP exports. Uses a dedicated HTTP client with streaming support for large files (up to 10 GB).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | Yes | The relative file path returned by a Hub tool |
| `dest` | string | No | Local destination file path. Defaults to the filename from the path in the current directory |

**Example:**
```json
{
  "tool": "download_file",
  "arguments": {
    "path": "/mcp/snapshots/f4c41e9c/pcap",
    "dest": "/tmp/incident.pcap"
  }
}
```

**Response:**
```json
{
  "url": "http://localhost:8898/api/mcp/snapshots/f4c41e9c/pcap",
  "path": "/tmp/incident.pcap",
  "size": 52428800
}
```

### Typical PCAP Export Workflow

1. **Export** — Call `export_snapshot_pcap` with optional filters. It returns a relative file path.
2. **Download** — Call `download_file` with that path to save the PCAP locally.
3. **Share** — Alternatively, call `get_file_url` to get a download URL to share with others.

```
export_snapshot_pcap → relative path → download_file → local .pcap file
                                     → get_file_url  → shareable URL
```

---

## Cloud Storage Tools

These tools manage snapshot upload/download to cloud object storage (Amazon S3 or Azure Blob Storage). Cloud storage must be configured via [Helm values](/en/snapshots_cloud_storage) before these tools can be used.

### `get_cloud_storage_status`

Check whether cloud storage is configured and connected.

**Parameters:** None

**Response:**
```json
{
  "enabled": true,
  "provider": "s3",
  "connected": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Whether cloud storage is configured |
| `provider` | string | Provider name (`s3` or `azblob`), only present when enabled |
| `connected` | boolean | Whether the connection to the provider is active |

### `upload_snapshot_to_cloud`

Upload a completed snapshot to cloud storage. The operation runs asynchronously — use `get_cloud_job_status` to poll progress.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Snapshot ID to upload |

**Example:**
```json
{
  "tool": "upload_snapshot_to_cloud",
  "arguments": {
    "id": "incident-001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "job_id": "job-abc123"
}
```

> The snapshot must be in `completed` status before uploading.

### `download_snapshot_from_cloud`

Download a snapshot from cloud storage to the local hub. The operation runs asynchronously — use `get_cloud_job_status` to poll progress.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Snapshot ID to download from cloud |

**Example:**
```json
{
  "tool": "download_snapshot_from_cloud",
  "arguments": {
    "id": "incident-001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "job_id": "job-xyz789"
}
```

> Fails if the snapshot already exists locally.

### `get_cloud_job_status`

Poll the status of an async cloud upload or download job.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job ID returned by `upload_snapshot_to_cloud` or `download_snapshot_from_cloud` |

**Response:**
```json
{
  "job_id": "job-abc123",
  "snapshot_id": "incident-001",
  "operation": "upload",
  "status": "completed",
  "started_at": 1706745000000,
  "completed_at": 1706745060000
}
```

| Field | Type | Description |
|-------|------|-------------|
| `job_id` | string | Job identifier |
| `snapshot_id` | string | Associated snapshot ID |
| `operation` | string | `upload` or `download` |
| `status` | string | `in_progress`, `completed`, or `failed` |
| `error` | string | Error details (only present when `status=failed`) |
| `started_at` | int64 | Job start time (Unix ms) |
| `completed_at` | int64 | Job completion time (Unix ms, only present when completed or failed) |

### Typical Cloud Storage Workflow

1. **Check** — `get_cloud_storage_status` to verify cloud storage is configured
2. **Upload** — `upload_snapshot_to_cloud` to start the upload (returns `job_id`)
3. **Poll** — `get_cloud_job_status` with the `job_id` until status is `completed` or `failed`

```
get_cloud_storage_status → upload_snapshot_to_cloud → get_cloud_job_status (poll)
                         → download_snapshot_from_cloud → get_cloud_job_status (poll)
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

### Workload Discovery & Targeted PCAP

> *"Which pods are present in this snapshot?"*

> *"Show me all workloads in the production namespace from this snapshot"*

> *"Download a PCAP with only the payment-api pod's traffic"*

> *"Find all pods with the label app=checkout and export their traffic"*

Resolution tools let you discover what workloads were active during a snapshot and extract traffic for specific pods — no need to know IPs upfront.

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
                     | Cloud Upload |<-----------+
                     |   (async)    |            |
                     +--------------+            |
                                                 |
                     +----------------+          |
                     | Cloud Download |--------->+
                     |    (async)     |
                     +----------------+
                                                 |
                     +--------------+            |
                     |    Delete    |<-----------+
                     |              |
                     +--------------+
```

---

## Delayed Indexing Endpoints

Delayed indexing runs L7 protocol analysis on a snapshot, making its traffic queryable with KFL — via the dashboard or AI agents. PCAP export does **not** require indexing.

### POST `/mcp/dissections`

Start a delayed indexing job on a snapshot.

**Request:**
```json
{
  "snapshot": "incident-2024-02-01",
  "name": "full-indexing"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `snapshot` | string | Name of the snapshot to index |
| `name` | string | Name for this indexing job |

### GET `/mcp/dissections/:snapshot/:name`

Get the status of an indexing job.

| Status | Description |
|--------|-------------|
| `pending` | Created, not started |
| `downloading` | Downloading snapshot from hub |
| `running` | Processing PCAPs |
| `uploading` | Uploading results |
| `completed` | Done, ready to query |
| `failed` | Error occurred |
| `cancelled` | User cancelled |

### GET `/mcp/databases`

List all available databases for querying — includes both real-time worker databases and indexed snapshot databases.

### Querying Indexed Snapshots

Once indexing is complete, query the snapshot using the `db` parameter on `/mcp/calls`:

```bash
# Real-time (default)
GET /mcp/calls?kfl=http

# Indexed snapshot
GET /mcp/calls?kfl=http&db=incident-2024-02-01/full-indexing
```

The `db` parameter format is: `<snapshot>/<indexing-job-name>`

### Other Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/dissections` | GET | List all indexing jobs (optionally filter by snapshot) |
| `/mcp/dissections/:snapshot/:name/stop` | POST | Stop a running indexing job |
| `/mcp/dissections/:snapshot/:name` | DELETE | Delete an indexing job and its database |

---

## What's Next

- [L7 Tools Reference](/en/mcp/l7_tools) — Query API transactions
- [L4 Tools Reference](/en/mcp/l4_tools) — Lightweight connectivity visibility
- [Traffic Snapshots](/en/v2/traffic_snapshots) — More about snapshots
