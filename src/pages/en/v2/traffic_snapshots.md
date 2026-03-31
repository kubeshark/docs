---
title: Traffic Snapshots
description: Cluster-wide traffic snapshots for a specific time window, enabling forensic analysis and incident investigation.
layout: ../../../layouts/MainLayout.astro
---

Traffic Snapshots extract any time window from the available [Raw Capture](/en/v2/raw_capture) data and preserve it permanently in dedicated, immutable storage.

**Key value:**
- **Download cluster-wide PCAPs** — filtered by time, nodes, workloads, and IPs. Get exactly what matters, ready for Wireshark or any PCAP-compatible tool.
- **Long-term retention** — store snapshots and PCAPs in cloud storage (S3, Azure Blob) for compliance, audits, and future investigation.

---

## How It Works

```
+------------------------------------------------------------------+
|  RAW CAPTURE (Node-level FIFO)                                   |
|  +-----+-----+-----+-----+-----+-----+-----+-----+               |
|  | Old |     |     |     |     |     |     | New | <-- New data  |
|  +--+--+-----+-----+-----+-----+-----+-----+-----+               |
|     |                                                            |
|     v  Recycled (discarded)                                      |
+------------------------------------------------------------------+
                          |
                          |  Create Snapshot (before recycled)
                          v
+------------------------------------------------------------------+
|  SNAPSHOT STORAGE (Immutable)                                    |
|  +------------------------------------------+                    |
|  |  incident-2024-02-01                     |  Persists forever  |
|  |  Time: 14:00 - 14:30                     |                    |
|  +------------------------------------------+                    |
+------------------------------------------------------------------+
```

When you create a snapshot, the selected time window is extracted from raw capture buffers and moved to dedicated storage on the Hub, where it becomes immutable and persists until you delete it.

### What's in a Snapshot

Snapshots contain three correlated data sources from raw capture:

- **Raw PCAP traffic** - Network packets (TCP/UDP)
- **Kubernetes events** - Control plane activity
- **Operating system events** - eBPF-based insights

Correlating all three sources enables indexing to show traffic with full Kubernetes and operating system context.

---

## What You Can Do with a Snapshot

| Action | Description |
|--------|-------------|
| [PCAP Export](/en/dashboard_snapshots#pcap-export) | Download raw packets for Wireshark or any PCAP-compatible tool |
| [Delayed Indexing](/en/v2/l7_api_dissection#delayed-indexing) | Run full L7 traffic indexing on non-production compute |
| [Cloud Backup](/en/snapshots_cloud_storage) | Upload to S3 or Azure Blob for long-term retention and cross-cluster sharing |

---

## Storage Options

### Local Storage

A dedicated persistent volume can be attached to the Hub for snapshot storage. Since snapshots are centralized on the Hub (not distributed across worker nodes), a single volume serves all needs.

See [Helm Configuration Reference](/en/helm_reference#snapshots--local-storage) for `tap.snapshots.local.storageClass` and `tap.snapshots.local.storageSize` settings.

### Cloud Storage

Snapshots can also be uploaded to cloud object storage for cross-cluster sharing, backup/restore, and long-term retention. Supported providers: **Amazon S3** and **Azure Blob Storage**.

See [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) for setup instructions.

| Resource | Link |
|----------|------|
| Local Storage Configuration | [Snapshot Storage Settings](/en/v2/raw_capture_config#snapshot-storage) |
| Cloud Storage Configuration | [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) |
| User Guide | [Creating & Managing Snapshots](/en/dashboard_snapshots) |
