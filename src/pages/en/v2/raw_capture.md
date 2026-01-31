---
title: Raw Capture
description: Continuous L4 packet capture introduced in V2.00, guaranteeing no data loss with minimal impact on production resources.
layout: ../../../layouts/MainLayout.astro
---

**Raw Capture** is a core functionality introduced in **Kubeshark V2.00** that continuously captures all L4 (TCP/UDP) network traffic. It adheres to [Capture Filters](/en/pod_targeting) (backend filtering rules), allowing you to target specific workloads.

## Goals

### 1. Minimal Impact on Production Resources

Compared to API dissection, raw capture consumes very little CPU resources. While L7 API dissection requires substantial CPU and memory for real-time parsing, raw capture primarily writes data to disk—a far less resource-intensive operation.

### 2. No Data Loss

CPU resources are the main factor in losing or not losing traffic. Since raw capture uses minimal CPU, it guarantees no data loss. Every packet is captured and retained.

## Single Source of Truth

Once captured, raw data becomes the **single source of truth**. This data can then be:

- **Downloaded as PCAP** - For further investigation using [Wireshark](https://www.wireshark.org/) or other tools
- **Delayed API Dissection** - Processed using non-production compute resources, guaranteeing minimum impact on production

## Architecture Shift in V2.00

V2.00 represents a fundamental redesign from V1.00. Instead of starting with L7 API dissection, V2.00 begins at L4 by capturing complete network flows, then applies API dissection on top when needed. This approach ensures:

- Complete visibility regardless of protocol support or dissection capability
- Minimal impact on production workloads
- Traffic can be inspected in real-time, periodically, or after an incident is reported

## How It Works

Raw Capture operates at the node level, capturing packets before any processing occurs. The capture mechanism collects data from three layers simultaneously:

- **Network layer** - Raw packet data (TCP/UDP)
- **Kubernetes layer** - Control plane events
- **Operating system layer** - eBPF-based insights

Most of the work in V2.00 involves writing data to disk, which is far less resource-intensive than real-time parsing. This enables continuous capture with negligible impact on production workloads.

## Delayed API Dissection

A key benefit of raw capture is **delayed API dissection**:

- Traffic is captured on production nodes with minimal overhead
- API dissection can be performed later on non-production compute
- Real-time dissection remains available but is optional
- Run delayed dissection continuously in the background, enable real-time on-demand

This addresses the core challenge that dissecting cluster-wide traffic into API calls requires substantially more CPU and memory than simple packet capture.

## Features Enabled by Raw Capture

Raw Capture serves as the foundation for several Kubeshark features:

- **[Cluster-wide PCAP Export](/en/v2/pcap_export)** - Export PCAP files for any time window
- **Historical Investigations** - Analyze past traffic on-demand, identify trends, detect anomalies
- **AI-powered Analysis** - MCP server provides access to raw traffic for AI-driven investigations

## Configuration

Enable and configure raw capture in your Helm values:

```yaml
tap:
  capture:
    stopped: false            # Whether capture is stopped
    stopAfter: 5m             # Auto-stop after idle period
    raw:
      enabled: true           # Enable raw capture
      storageSize: 1Gi        # Node-level FIFO buffer size
    dbMaxSize: 500Mi          # Maximum database size
```

## Benefits

- **Production Safe** - Minimal CPU usage guarantees negligible impact on production workloads
- **No Data Loss** - Low resource consumption eliminates packet loss
- **Complete Visibility** - Captures all traffic regardless of protocol support
- **Single Source of Truth** - All captured data available for multiple use cases
- **Flexible Analysis** - Investigate with Wireshark or delayed API dissection on non-production compute

## Capture Filters

Raw capture adheres to [Capture Filters](/en/pod_targeting). Use filters to target specific workloads and reduce storage usage:

```yaml
tap:
  regex: .*
  namespaces: []
  excludedNamespaces: []
```
