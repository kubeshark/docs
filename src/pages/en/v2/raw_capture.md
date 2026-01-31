---
title: Raw Capture
description: Continuous L4 packet capture introduced in V2.00, guaranteeing no data loss with minimal impact on production resources.
layout: ../../../layouts/MainLayout.astro
---

**Raw Capture** continuously captures all L4 (TCP/UDP) network traffic with minimal CPU usage, guaranteeing no data loss. It operates independently from L7 API dissection and serves as the single source of truth for all traffic analysis.

## Configuration

Enable and configure raw capture in your Helm values:

```yaml
tap:
  capture:
    stopped: false            # Whether L7 dissection is stopped
    stopAfter: 5m             # Auto-stop dissection after idle period
    raw:
      enabled: true           # Enable raw capture (independent of stopped)
      storageSize: 1Gi        # Node-level FIFO buffer size
    dbMaxSize: 500Mi          # Maximum database size
```

Raw capture adheres to [Capture Filters](/en/pod_targeting). Use filters to target specific workloads and reduce storage usage:

```yaml
tap:
  regex: .*
  namespaces: []
  excludedNamespaces: []
```

## What You Can Do with Raw Capture

- **[Create Traffic Snapshots](/en/v2/traffic_snapshots)** - Immutable cluster-wide snapshots for any time window
- **[Export to PCAP](/en/v2/pcap_export)** - Download PCAP files for analysis in Wireshark or other tools
- **Delayed API Dissection** - Process traffic using non-production compute resources
- **Historical Investigations** - Analyze past traffic on-demand, identify trends, detect anomalies

## Independent from L7 Dissection

Raw Capture operates independently from real-time L7 API dissection:

- When `tap.capture.stopped=true`, L7 API dissection stops
- When `tap.capture.raw.enabled=true`, raw capture continues regardless of dissection state

This means you can run raw capture continuously while [enabling and disabling L7 dissection on demand](/en/on_off_switch). This is ideal for production environments where you want guaranteed traffic capture with minimal overhead, enabling real-time dissection only when needed.

## Goals

### 1. Minimal Impact on Production Resources

Compared to API dissection, raw capture consumes very little CPU resources. While L7 API dissection requires substantial CPU and memory for real-time parsing, raw capture primarily writes data to disk—a far less resource-intensive operation.

### 2. No Data Loss

CPU resources are the main factor in losing or not losing traffic. Since raw capture uses minimal CPU, it guarantees no data loss. Every packet is captured and retained.

## Single Source of Truth

Once captured, raw data becomes the **single source of truth**. This data can then be:

- **Downloaded as PCAP** - For further investigation using [Wireshark](https://www.wireshark.org/) or other tools
- **Delayed API Dissection** - Processed using non-production compute resources, guaranteeing minimum impact on production

## How It Works

Raw Capture operates at the node level, capturing packets before any processing occurs. The capture mechanism collects data from three layers simultaneously:

- **Network layer** - Raw packet data (TCP/UDP)
- **Kubernetes layer** - Control plane events
- **Operating system layer** - eBPF-based insights

Most of the work involves writing data to disk, which is far less resource-intensive than real-time parsing. This enables continuous capture with negligible impact on production workloads.

## Architecture Shift in V2.00

V2.00 represents a fundamental redesign from V1.00. Instead of starting with L7 API dissection, V2.00 begins at L4 by capturing complete network flows, then applies API dissection on top when needed. This approach ensures:

- Complete visibility regardless of protocol support or dissection capability
- Minimal impact on production workloads
- Traffic can be inspected in real-time, periodically, or after an incident is reported

## Delayed API Dissection

A key benefit of raw capture is **delayed API dissection**:

- Traffic is captured on production nodes with minimal overhead
- API dissection can be performed later on non-production compute
- Real-time dissection remains available but is optional
- Run delayed dissection continuously in the background, enable real-time on-demand

This addresses the core challenge that dissecting cluster-wide traffic into API calls requires substantially more CPU and memory than simple packet capture.

## Benefits

- **Production Safe** - Minimal CPU usage guarantees negligible impact on production workloads
- **No Data Loss** - Low resource consumption eliminates packet loss
- **Complete Visibility** - Captures all traffic regardless of protocol support
- **Single Source of Truth** - All captured data available for multiple use cases
- **Flexible Analysis** - Investigate with Wireshark or delayed API dissection on non-production compute
