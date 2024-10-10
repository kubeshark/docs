---
title: Continuos PCAP Recording (pcapdump)
description: 
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** can automatically and continuously record and store all captured traffic while managing a time window and storage limits. This means you can export recorded traffic to your local folder at any time for retention or further analysis with [Wireshark](https://www.wireshark.org/). This process can optionally happen automatically, regardless of whether anyone is actively using the dashboard.

This extends to all TCP, UDP, SCTP, [TLS](/en/encrypted_traffic) and Envoy/Istio related traffic.

## Export PCAP Files Locally

The `kubeshark` CLI allows you to export all saved PCAP files from all nodes and merge them into a single PCAP file, which can then be analyzed using tools like [Wireshark](https://www.wireshark.org/).

```shell
kubeshark pcapdump --dest=/tmp                                  # Copy all PCAP files to a local destination
kubeshark pcapdump                                              # Copy all PCAP files to the local folder
```

## Automatic & Continuous

The `pcapdump` operation is configured to start automatically by default when **Kubeshark** is deployed and [traffic capture](/en/on_off_switch) is enabled. It runs as long as **Kubeshark** is active or until the `pcapdump` operation is explicitly stopped.

> Note: Traffic capture is set to `stopped` by default. You can change this by setting `-- set tap.stopped=false`.

## Capture Filters

**Kubeshark** captures traffic based on [capture filters](/en/pod_targeting). The traffic is stored in local PCAP files on the Kubernetes node's disk, with time window and storage managed automatically.

Examples of capture filters:

```yaml
tap:
  regex: .*front                    # Capture traffic only for pods matching the regex
  namespaces:                       # From the following namespaces
  - ns1
  - ns2
  excludedNamespaces:               # Exclude these namespaces
  - ns3
  bpfOverride: "net 0.0.0.0/0"      # Override the capture filter with a BPF expression
```

> Read more in the [capture filters section](/en/pod_targeting).

## Time Window and Storage Management

**Kubeshark** manages the time window and storage limits, discarding older files that fall outside the defined time window or exceed the storage limit.

For example, if the time window is set to 24 hours and the storage limit is 50MB, **Kubeshark** retains files recorded within the last 24 hours, as long as the storage usage doesn't exceed 50MB. Files older than 24 hours or those exceeding the storage limit are discarded.

## Configuration

The `pcapdump` configuration can be set using Helm values:

```yaml
pcapdump:
  enabled: true                     # Enable / disable 
  maxTime: 1h                       # Time window
  maxSize: 50MB                     # Max storage size
```

### Using the CLI

The `kubeshark` CLI enables you to start, stop, and modify the recording operation, as well as adjust configuration values such as the time window and storage size. Here are a few examples:

```shell
kubeshark pcapdump --enable=true                                # Enable operation
kubeshark pcapdump --enable=false                               # Disable operation
kubeshark pcapdump --enable=true --maxSize=500MB --maxTime=2h   # Set properties
```

### `pcapdump` vs. Traffic Recorder

While `pcapdump` and the [Traffic Recorder](/en/traffic_recorder) share similarities, they serve different purposes.

`pcapdump` is analogous to TCPdump: a simple way to capture PCAP traffic for analysis in [Wireshark](https://www.wireshark.org/). However, with only PCAP files, you miss out on the Kubernetes context (e.g., pod, service, namespace names).

On the other hand, the [Traffic Recorder](/en/traffic_recorder) allows you to work within the **Kubeshark** dashboard and store traffic for offline analysis, including the Kubernetes context.

## Troubleshooting

If you see the following log message in the Worker, you are likely not recording all traffic.
```yaml
2024-10-08T23:26:11Z WRN source/pcap_dumper.go:468 > Packet channel is full, dropping current batch of packets
```