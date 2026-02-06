---
title: Traffic Snapshots
description: Cluster-wide traffic snapshots for a specific time window, enabling forensic analysis and incident investigation.
layout: ../../../layouts/MainLayout.astro
---

Traffic Snapshots freeze a window of historical traffic from [Raw Capture](/en/v2/raw_capture) and preserve it permanently.

When you create a snapshot, you specify how far back to capture—last 5 minutes, last 1 hour, last 12 hours. The snapshot extracts that time window from raw capture buffers and moves it to dedicated storage where it becomes immutable.

| Constraint | Description |
|------------|-------------|
| Maximum window | Limited by raw capture retention (buffer size / traffic rate) |
| Storage | Snapshots persist until explicitly deleted |

### Dedicated Snapshot Storage

A dedicated persistent volume can be attached to the Hub specifically for snapshot storage. Since snapshots are centralized on the Hub (not distributed across worker nodes), a single volume serves all snapshot storage needs. This enables:

- **Larger capacity** — Store months of snapshots independent of worker node storage
- **Different storage class** — Use cost-effective storage tiers for long-term retention
- **Centralized management** — All snapshots in one location for easy access and cleanup

See [Helm Configuration Reference](/en/helm_reference#snapshots) for `tap.snapshots.storageClass` and `tap.snapshots.storageSize` settings.

| Resource | Link |
|----------|------|
| Configuration | [Snapshot Storage Settings](/en/v2/raw_capture_config#snapshot-storage) |
| User Guide | [Creating & Managing Snapshots](/en/dashboard_snapshots) |

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

[Raw Capture](/en/v2/raw_capture) continuously stores traffic in a node-level FIFO buffer. The buffer size is fixed—when it fills, older data is recycled to make room for new traffic. This allows continuous capture indefinitely, but past data is eventually lost.

**Snapshots solve this**: by creating a snapshot before data is recycled, you extract and preserve a specific time window. The snapshot is moved to dedicated storage on the Hub, where it becomes immutable and persists until you delete it.

### What's in a Snapshot

Snapshots contain three correlated data sources from raw capture:

- **Raw PCAP traffic** - Network packets (TCP/UDP)
- **Kubernetes events** - Control plane activity
- **Operating system events** - eBPF-based insights

Correlating all three sources enables future dissection to show traffic with full Kubernetes and operating system context.

### Snapshot Lifecycle

1. **Request**: User selects nodes and a time window from raw capture
2. **Extract**: Traffic data is copied from raw capture buffers
3. **Transfer**: The snapshot archive is moved to the Hub's snapshot storage
4. **Immutable**: The snapshot is now permanent—raw capture can recycle the original data

**Key point**: Once a snapshot is created, it's independent of raw capture. The original data in raw capture may be recycled over time, but the snapshot persists until you explicitly delete it.
