---
title: Data Time To Live (TTL)
description: Provides real-time Kubernetes network visibility and forensics by capturing and monitoring all traffic and payloads within and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

TTL values can be controlled. However, increasing TTL values will likely cause increased resource consumption, especially storage. 

You should also consider using the [Traffic Recorder](/en/traffic_recorder) for medium to long-term retention.

## JSON TTL

The JSON file includes the API call's metadata, which contains all the information related to the request/response pair. The default JSON TTL is set to 5 minutes. Once discarded (e.g., after 5 minutes), all API details will vanish from the dashboard, and a notification appears:

![Error Message](/storage_error.jpg) 

## PCAP TTL

The PCAP file includes the L4 stream data. The default PCAP TTL is set to 10 seconds. Once a PCAP file is deleted (e.g., after 10 seconds), it becomes unavailable for download:

![Download PCAP Button Disabled](/download_disabled.png)

A PCAP TTL of 10 seconds allows scripts to process the API entry and decide on actions for the PCAP (e.g., storage, export), but it is insufficient for manual download. 

## Storage

Extending either the JSON or the PCAP TTLs is likely to increase storage capacity. Storage limits are set by `tap.storageLimit`, defaulting to `500Mi`. Exceeding this limit triggers pod eviction, purging storage, and restarting the pod.

## Suggested Configuration

To adjust the limit:

```yaml
--set tap.storageLimit=5Gi
--set tap.misc.jsonTTL=15m
--set tap.misc.pcapTTL=30s
```

or

```yaml
tap:
  misc:
    jsonTTL: 15m
    pcapTTL: 30s
  storageLimit: 5Gi
```