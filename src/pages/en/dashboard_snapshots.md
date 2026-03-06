---
title: Snapshots
description: Create, browse, and manage traffic snapshots from the Kubeshark dashboard.
layout: ../../layouts/MainLayout.astro
---

The Snapshots panel provides access to [Traffic Snapshots](/en/v2/traffic_snapshots) directly from the dashboard. Create new snapshots, browse existing ones, and run [Delayed Dissection](/en/v2/l7_api_delayed) on captured traffic.

---

## Creating Snapshots

![Create Snapshot Dialog](/create-snapshot-dialog.png)

To create a new snapshot:

1. **Name** — Enter a descriptive name (e.g., `incident-2024-02-01`, `checkout-debug`)
2. **Nodes** — Select all nodes or specific worker nodes to include
3. **Time Window** — Choose the time range (e.g., last 5 minutes, last 1 hour, last 12 hours)
4. Click **Create**

The snapshot is extracted from [Raw Capture](/en/v2/raw_capture) buffers and moved to dedicated storage on the Hub.

| Constraint | Description |
|------------|-------------|
| Maximum window | Limited by raw capture buffer size and traffic rate |
| Availability | Data must not have been recycled from raw capture |

---

## Browsing Snapshots

![Snapshots Tab](/snapshots-tab.png)

The Snapshots tab displays all available snapshots:

| Field | Description |
|-------|-------------|
| Name | Snapshot identifier |
| Size | Total data size |
| Start Time / End Time | Captured time window |
| Status | Pending, In Progress, Completed, Dissected |
| Created At | When the snapshot was created |
| Nodes | Which nodes are included |

---

## Snapshot Actions

| Action | Description |
|--------|-------------|
| **Dissect** | Run [Delayed Dissection](/en/v2/l7_api_delayed) on the snapshot |
| **Download** | Retrieve the snapshot archive for offline storage |
| **PCAP** | Export to PCAP file for Wireshark analysis |
| **Delete** | Remove the snapshot and free storage |

---

## Running Delayed Dissection

To analyze a snapshot with L7 protocol dissection:

1. Select the snapshot from the list
2. Click **Dissect** to start [Delayed Dissection](/en/v2/l7_api_delayed)
3. Monitor progress as the snapshot is processed
4. Once complete, view dissected API calls in the [L7 API Stream](/en/api_stream)

Dissection runs on the Hub, not on worker nodes—keeping production compute unaffected.

---

## Viewing Dissected Snapshots

After dissection completes, the snapshot's API calls appear in the L7 API Stream. Use [Display Filters](/en/display_filters) to navigate the dissected traffic.

The stream shows the same rich data as real-time dissection:
- Full request/response payloads
- Headers and status codes
- Kubernetes context (pod, service, namespace)
- Timing information

---

## PCAP Export

Export snapshots as PCAP files for analysis in [Wireshark](https://www.wireshark.org/)—an alternative to deploying `tcpdump`, copying files from nodes, and manually aggregating them.

Snapshots include all raw TCP/UDP packets, **including decrypted TLS traffic**, along with Kubernetes and OS context.

To export:
1. Select a snapshot from the list
2. Click **PCAP**
3. Open the downloaded file in Wireshark

![Opening the PCAP in Wireshark](/wireshark.png)

---

## Cloud Storage

When [Cloud Storage](/en/snapshots_cloud_storage) is configured, a connection badge appears in the Snapshots toolbar indicating the provider and connection status:

![Snapshots tab showing Connected to S3 badge](/snapshots-connected-s3.png)

A green **Connected to S3** (or **Connected to Azure Blob**) badge confirms the hub has validated access to the configured bucket or container. If the connection fails, the hub will not start — see [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) for troubleshooting.

### Uploading Snapshots to the Cloud

New snapshots are always created locally first and display a **Local** badge in the **Location** column. To upload a snapshot to cloud storage, click the cloud upload button next to the Local badge:

![Snapshot with Local badge and upload to cloud button](/snapshots-upload-to-cloud.png)

Once uploaded, the snapshot is available from any cluster that shares the same cloud storage configuration — enabling cross-cluster sharing, backup/restore, and long-term retention.

### Location Filter

Use the **Location** filter in the toolbar to switch between local and cloud snapshots:

| Location Filter | Description |
|-----------------|-------------|
| **All** | Show all snapshots (local and cloud) |
| **Local** | Show only snapshots stored locally on the hub |
| **Cloud** | Show only snapshots available in cloud storage |

---

## Best Practices

### Naming Conventions

Use descriptive names that include context:
- `incident-2024-02-01-checkout-failure`
- `debug-payment-service-slow`
- `audit-q1-2024`

### When to Create Snapshots

| Scenario | Recommendation |
|----------|----------------|
| Incident reported | Immediately capture relevant time window |
| Before maintenance | Preserve baseline traffic for comparison |
| Compliance audit | Create periodic snapshots per retention policy |
| Performance investigation | Capture before and during load tests |

### Storage Management

Monitor snapshot storage usage. Snapshots persist until explicitly deleted.

```yaml
tap:
  snapshots:
    local:
      storageSize: 100Gi    # Allocate sufficient local storage
```

For long-term retention, consider enabling [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) to upload snapshots to S3 or Azure Blob Storage.

See [Helm Configuration](/en/helm_reference#snapshots--local-storage) for storage settings.

---

## What's Next

- [Traffic Snapshots](/en/v2/traffic_snapshots) — Conceptual overview
- [Delayed Dissection](/en/v2/l7_api_delayed) — Run L7 analysis on snapshots
