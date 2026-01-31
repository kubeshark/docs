---
title: Traffic Snapshots
description: Cluster-wide traffic snapshots for a specific time window, enabling forensic analysis and incident investigation.
layout: ../../../layouts/MainLayout.astro
---

**Traffic Snapshots** create cluster-wide, immutable traffic snapshots from all nodes for a specific time window. Snapshots are stored separately from raw capture and persist indefinitely.

## Configuration

We recommend assigning a Persistent Volume Claim (PVC) for snapshots. Configure in your Helm values:

```yaml
tap:
  snapshots:
    storageClass: ""          # Storage class for snapshot PVCs (recommended)
    storageSize: 20Gi         # Size allocated for snapshots
```

### AWS Example

When using AWS, use the `gp2` storage class:

```yaml
tap:
  snapshots:
    storageClass: gp2
    storageSize: 1000Gi
```

Once a dedicated storage class is configured, the storage size can be far larger than the standard size allocated to worker nodes.

## Creating a Snapshot

![Create Snapshot Dialog](/create-snapshot-dialog.png)

To create a snapshot:

1. **Name** - Enter a descriptive name for the snapshot
2. **Nodes** - Select all nodes or specific nodes to include
3. **Snapshot time** - Choose the time window (e.g., last 5 minutes, last 1 hour, last 12 hours)
4. Click **Create**

## Managing Snapshots

![Snapshots Tab](/snapshots-tab.png)

The **Snapshots** tab displays all snapshots with their details:
- **Name** and **Size**
- **Start Time** and **End Time** - The captured time window
- **Status** - Creation progress (e.g., Completed)
- **Created At** - When the snapshot was created
- **Nodes** - Which nodes are included

### Actions

For each snapshot, you can:

- **Download** - Retrieve the snapshot archive for offline storage
- **PCAP** - Export to PCAP file for analysis in Wireshark or other tools
- **Delete** - Remove the snapshot

## Architecture

[Raw Capture](/en/v2/raw_capture) is controlled by Helm values. When enabled, Kubeshark continuously captures traffic based on [Capture Filters](/en/pod_targeting). The actual storage will not surpass the configured Helm values, so capture can continue indefinitely. The more storage allocated, the larger the time window of retained data.

In parallel—and independently—users can inspect real-time traffic or not. At any point, users can request a snapshot of the raw traffic.

### What's in a Snapshot

Snapshots contain three correlated data sources from raw capture:

- **Raw PCAP traffic** - Network packets (TCP/UDP)
- **Kubernetes events** - Control plane activity
- **Operating system events** - eBPF-based insights

Correlating all three sources enables future dissection to show traffic with full Kubernetes and operating system context.

### Snapshot Lifecycle

1. User requests a snapshot for selected nodes and a specified time window
2. The snapshot archive is moved to the Hub
3. The snapshot becomes **immutable**
4. Raw capture files may be recycled over time, but **snapshots live forever**

