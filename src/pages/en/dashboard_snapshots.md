---
title: Snapshots
description: Create, browse, and manage traffic snapshots from the Kubeshark dashboard.
layout: ../../layouts/MainLayout.astro
---

The Snapshots panel provides access to [Traffic Snapshots](/en/v2/traffic_snapshots) directly from the dashboard. Create new snapshots, browse existing ones, download PCAPs, and optionally run [Delayed Indexing](/en/v2/l7_api_dissection#delayed-indexing) to make the snapshot queryable.

---

## Creating Snapshots

![Create Snapshot Dialog](/create-snapshot-dialog.png)

To create a new snapshot:

1. **Name** — Enter a descriptive name (e.g., `incident-2024-02-01`, `checkout-debug`)
2. **Nodes** — Select all nodes or specific worker nodes to include
3. **Time Window** — Select a start and end time using the date/time picker. The picker marks the range for which L7 data exists, so you can tell at a glance whether the window you are about to snapshot was being indexed
4. Click **Create**

The snapshot is extracted from [Raw Capture](/en/v2/raw_capture) buffers and moved to dedicated storage on the Hub. The time window can span from minutes to days — limited only by how much raw capture data is available.

---

## Snapshot Status

Worker nodes are copied in parallel, and each node's copy succeeds or fails on its own.

| Status | Meaning |
|--------|---------|
| `in_progress` | The copy is still running |
| `completed` | Every node copied successfully |
| `partially_completed` | At least one node copied and at least one failed. Shown with warning styling and selectable in the status filter |
| `failed` | No node succeeded, or the snapshot breached the size limit |

A `partially_completed` snapshot is usable: download, PCAP export, cloud upload and delayed indexing are all available on it. It simply omits the failed nodes' data, so treat it as a partial view of the cluster for that window rather than a complete one. Only `failed` snapshots have nothing to offer.

---

## Permissions

Each action is gated on a capability, so what the panel offers depends on the role the caller resolves to — with or without authentication enabled. See [Roles & Permissions](/en/roles).

| Action | Capability | Built-in roles |
|--------|------------|----------------|
| Browse, download, export PCAP | `snapshot:read` | `kubeshark-admin`, `kubeshark-snapshot`, `kubeshark-viewer` |
| Create, delete, rename, upload | `snapshot:write` | `kubeshark-admin`, `kubeshark-snapshot` |
| Start / stop delayed indexing | `snapshot:dissection` | `kubeshark-admin`, `kubeshark-snapshot` |

A role with a [namespace scope](/en/roles#namespace-scope) also sees the Download and Export PCAP buttons **disabled** on snapshots taken outside that scope, with the tooltip *"Snapshot is outside your namespace scope"*. The rows stay visible; the data does not leave the Hub.

---

## Downloading Snapshots

Select a snapshot and click **Download** to retrieve its archive from the Hub.

Raw capture is paused on every worker for the duration of the download, so the download's own traffic through the ingress doesn't end up in the capture. Capture resumes when the download finishes, and the Hub logs how long it was paused. Real-time indexing is unaffected.

A download that stops making progress — a laptop that went to sleep, a dropped port-forward, a stalled proxy — is terminated after a minute without a successful write, so capture resumes on its own instead of staying off until the connection dies. A slow download that keeps making progress is never cut off, but note that it keeps capture paused for as long as it runs.

---

## PCAP Export

Export snapshots as PCAP files for analysis in [Wireshark](https://www.wireshark.org/) — no indexing required. An alternative to deploying `tcpdump`, copying files from nodes, and manually aggregating them.

Snapshots include all raw TCP/UDP packets, **including decrypted TLS traffic**, along with Kubernetes and OS context.

1. Select a snapshot from the list
2. Click **PCAP**
3. Open the downloaded file in Wireshark

![Opening the PCAP in Wireshark](/wireshark.png)

---

## Delayed Indexing (Optional)

To **query** the snapshot's traffic, visualize results in the dashboard, or process them with an AI agent, run [Delayed Indexing](/en/v2/l7_api_dissection#delayed-indexing).

1. Select the snapshot from the list
2. Click **Index** to start delayed indexing
3. Monitor progress as the snapshot is processed
4. Once complete, the snapshot appears as a [traffic source](/en/ui#traffic-source) in the dashboard

Indexing runs on the Hub, not on worker nodes — keeping production compute unaffected. After indexing, the snapshot's API calls are queryable with KFL, just like real-time traffic.

---

## Cloud Storage

When [Cloud Storage](/en/snapshots_cloud_storage) is configured, a connection badge appears in the Snapshots toolbar indicating the provider and connection status:

![Snapshots tab showing Connected to S3 badge](/snapshots-connected-s3.png)

A green **Connected to S3** (or **Connected to Azure Blob** or **Connected to GCS**) badge confirms the hub has validated access to the configured bucket or container. If the connection fails, the hub will not start — see [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) for troubleshooting.

### Snapshot Location

A snapshot can exist **locally**, **in the cloud**, or **both**. The **Location** column shows the current state:

| Location | Description |
|----------|-------------|
| **Local** | Stored on the hub only |
| **Cloud** | Stored in cloud storage only |
| **Local + Cloud** | Stored in both locations |

All operations — Download, PCAP export, and Delayed Indexing — require the snapshot to be **local**. Cloud-only snapshots must be downloaded to the hub before these actions are available.

### Uploading to the Cloud

New snapshots are always created locally. To upload to cloud storage, click the cloud upload button next to the Local badge:

![Snapshot with Local badge and upload to cloud button](/snapshots-upload-to-cloud.png)

Once uploaded, the snapshot is available from any cluster that shares the same cloud storage configuration — enabling cross-cluster sharing, backup/restore, and long-term retention.

### Deleting Snapshots

Snapshots can be deleted independently from each location. When a snapshot exists in both locations, you can choose to delete it locally, from the cloud, or both.

---

## What's Next

- [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) — Configure S3, Azure Blob, or GCS storage
- [KFL Reference](/en/v2/kfl2) — Query language for indexed snapshots
- [Raw Capture Configuration](/en/v2/raw_capture_config) — Storage size and capture settings
