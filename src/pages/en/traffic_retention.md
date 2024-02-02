---
title: Traffic Retention
description: Provides real-time Kubernetes network visibility and forensics by capturing and monitoring all traffic and payloads within and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Kubeshark** captures all Layer 4 (UDP and TCP) streams, temporarily storing each stream in a separate PCAP file on the root file system of each cluster node.

Following successful analysis, all API information (e.g., headers, path, payload) is stored in a dedicated JSON file for each request/response pair.

## PCAP - Network Traces

PCAP (Packet Capture) is both an API and a [file format](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html#name-introduction) widely used by network analysis tools like [Wireshark](https://wireshark.org), [Fiddler](https://www.telerik.com/fiddler), and [TCPdump](https://www.tcpdump.org/).

It provides comprehensive packet data from the Ethernet header to the application payload, offering complete visibility of application and network interactions before and after events.

#### PCAP Download

You can download the PCAP file for further analysis in Wireshark using the PCAP download button.

![Download PCAP Button](/pcap_download.png)

#### PCAP TTL

Once a PCAP file is deleted (e.g., after 10 seconds), it becomes unavailable for download:

![Download PCAP Button Disabled](/download_disabled.png)

A PCAP TTL of 10 seconds allows scripts to process the API entry and decide on actions for the PCAP (e.g., storage, export), but it is insufficient for manual download. The TTL is configurable:

```yaml
tap:
  misc:
    pcapTTL: 10s
```
or by using: `--set tap.misc.pcapTTL=10s`

## API Metadata (JSON)

Complete API metadata is stored in a JSON file, including all elements visible on the Dashboard and more. The file can be accessed or downloaded via the API index link:

![API JSON link](/api_json.png)
```json
{
    "dst": {...},
    "elapsedTime": 0,
    "entryFile": "000000017720_pcap-0_entry.json",
    "error": null,
    "failed": false,
    "id": "10.0.41.65:30001/000000017720.pcap-0",
    "index": 0,
    "node": {...},
    "outgoing": false,
    "passed": false,
    "protocol": {...},
    "record": "",
    "request": {...},
    "requestSize": 111,
    "response": {...},
    "responseSize": 164,
    "src": {...},
    "startTime": "2023-12-19T20:44:30.360984398Z",
    "stream": "000000017720.pcap",
    "timestamp": 1703018670360,
    "tls": false,
    "worker": "10.0.41.65:30001"
}
```
#### JSON TTL

Once discarded (e.g., after 5 minutes), API details vanish from the dashboard, and a notification appears:

![Error Message](/storage_error.png)

JSON TTL is configurable:

```yaml
tap:
  misc:
    jsonTTL: 5m
```
or by using: `--set tap.misc.jsonTTL=5m`

## Storage

Increasing PCAP TTL in busy clusters can quickly fill storage, necessitating an increase in storage capacity.

Storage limits are set by `tap.storagelimit`, defaulting to `500Mi`. Exceeding this limit triggers pod eviction, purging storage and restarting the pod:

To adjust the limit:

```yaml
--set tap.storagelimit=1Gi
```

## Traffic Recorder

Designed to retain selected network traffic (PCAP and JSONs) longer without straining storage.

> More details in the [Traffic Recorder](/en/traffic_recorder) section.

## Data Persistency

Kubeshark defaults to ephemeral storage, risking data loss upon pod restarts. Optional persistent volume claims can safeguard data.

> Details in the [Data Persistency](/en/data_persistency) section.

## Long-Term Immutable Traffic Retention

For extended retention, it's advised to export traffic to external data stores like GCS or AWS S3.

> See [AWS S3](/en/integrations_aws_s3) and [GCS](/en/integrations_gcs) sections for more.