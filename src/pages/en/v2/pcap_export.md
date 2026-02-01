---
title: Cluster-wide PCAP Export
description: Export PCAP files from Kubeshark Snapshots with a single click—no manual setup or node-level copying required.
layout: ../../../layouts/MainLayout.astro
mascot: Hello
---

> This feature is part of [Kubeshark](https://kubeshark.com) V2.00, scheduled to release in early 2026.

An alternative to deploying [tcpdump](https://www.tcpdump.org/), copying files, and manually opening them in [Wireshark](https://www.wireshark.org/).
[Kubeshark](https://kubeshark.com) can be set to continuously capture and retain all raw TCP/UDP packets, **including decrypted TLS traffic**, alongside relevant [Kubernetes](https://kubernetes.io/) and Linux OS events.
Users can download a cluster-wide [PCAP](https://www.ietf.org/archive/id/draft-gharris-opsawg-pcap-01.html) file on demand for any selected past time window and open it directly in [Wireshark](https://www.wireshark.org/).

1. Go to the **Snapshots** tab
2. Create a new snapshot
3. **Optionally** select the nodes (default: all nodes)
4. **Optionally** select the time frame (default: last one hour)
5. Press **Create**

![The Snapshots Tab](/snapshots.png)

Once the snapshot is ready, click the PCAP file to export its contents and open it in [Wireshark](https://www.wireshark.org/).

![Opening the PCAP in Wireshark](/wireshark.png)

## Configuration

Here's an example Helm chart segment with the relevant configuration values:

```yaml
tap:
  storageLimit: 50Gi        # Ensure `tap.capture.raw.storageSize` is less than this value
  capture:
    raw:
      enabled: true         # Enable or disable raw capture
      storageSize: 10Gi     # Node-level FIFO buffer size; must be smaller than `tap.storageLimit`
  snapshots:
    storageClass: gp2       # PVC storage class (e.g., gp2 for EKS) – highly recommended
    storageSize: 1000Gi     # Storage size allocated for the snapshots folder
```

## Backend Capture Rules

Use the following Helm chart segment to include or exclude specific workloads. If no rules are defined, [Kubeshark](https://kubeshark.com) captures all TCP and UDP traffic.

```yaml
tap:
  regex: .*
  namespaces: []
  excludedNamespaces: []
```

> Read more about [Capture Filters](/en/pod_targeting)

## Recommended Usage

* Enable raw capture by default
* Use a PVC with ample storage
* Allocate significant storage limits, especially for the snapshots folder (e.g., 1TB–2TB)
* Apply backend capture rules to target specific workloads and reduce noise
