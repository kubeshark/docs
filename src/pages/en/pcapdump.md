---
title: Continuos PCAP Recording (pcapdump)
description: 
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** automatically and continuously records and stores all captured traffic, managing both a time window and storage limits. This enables you to export recorded traffic to your local folder at any time for retention or further analysis using [Wireshark](https://www.wireshark.org/).

This functionality covers all TCP, UDP, and SCTP traffic—encrypted and unencrypted—including traffic related to Envoy/Istio.

## Exporting PCAP Files Locally

### Prerequisite

Before using the `pcapdump` command, ensure that **Kubeshark** is running and actively capturing traffic.

> The `pcapdump` command works regardless of whether you have a license or if the license is valid. It has no limitations and operates seamlessly on clusters of any size. Additionally, the command functions without requiring the dashboard to be active.

Use one of the following commands to deploy Kubeshark:

```shell
kubeshark tap
helm install kubeshark kubeshark/kubeshark
```

> Learn more about installing Kubeshark in the [installation guide](/en/install).

### Use the Pcapdump Command

The `kubeshark` CLI allows you to export all saved PCAP files from all nodes, merging them into a single file for analysis in tools like [Wireshark](https://www.wireshark.org/).

```shell
kubeshark pcapdump --dest=/tmp  # Export all PCAP files to a specified local directory
kubeshark pcapdump              # Export all PCAP files to the current directory
```

## Automatic & Continuous Operation

By default, the `pcapdump` process starts automatically when **Kubeshark** is deployed and [traffic capture](/en/on_off_switch) is enabled. It remains active as long as **Kubeshark** is running unless explicitly stopped.

## Capture Filters

Traffic capture in **Kubeshark** operates based on configurable [capture filters](/en/pod_targeting). Captured traffic is stored in local PCAP files on the Kubernetes node’s disk, with time window and storage limits managed automatically.

Example capture filter configuration:

```yaml
tap:
  regex: .*front                    # Capture traffic for pods matching the regex
  namespaces:                       # From the specified namespaces
    - ns1
    - ns2
  excludedNamespaces:               # Exclude traffic from these namespaces
    - ns3
  bpfOverride: "net 0.0.0.0/0"      # Override with a custom BPF expression
```

> Read more about filters in the [capture filters documentation](/en/pod_targeting).

## Time Window and Storage Management

**Kubeshark** ensures efficient management of storage and time limits by discarding older files outside the defined time window or exceeding the storage quota.

For example, with a time window of 24 hours and a storage limit of 50 MB, **Kubeshark** retains files recorded within the last 24 hours as long as the total storage remains under 50 MB. Files exceeding these constraints are automatically deleted.

## Configuration

> While the default configuration is typically sufficient, the following settings can be customized if needed.

You can adjust the `pcapdump` configuration via Helm values:

```yaml
pcapdump:
  enabled: true                     # Enable or disable PCAP recording
  maxTime: 1h                       # Time window for file retention
  maxSize: 50MB                     # Maximum storage limit
```

### `pcapdump` vs. Traffic Recorder

While `pcapdump` and the [Traffic Recorder](/en/traffic_recorder) serve similar purposes, they are designed for different use cases:

- **`pcapdump`**: A lightweight, TCPdump-like utility for capturing PCAP traffic for external analysis in [Wireshark](https://www.wireshark.org/). It primarily stores Layer 4 (L4) traffic, but without Kubernetes context (e.g., pod, service, or namespace names).
  
- **Traffic Recorder**: Integrated with the **Kubeshark** dashboard, it enables traffic capture and storage for offline analysis. It captures both Layer 4 (L4) and Layer 7 (L7) traffic, along with Kubernetes context.