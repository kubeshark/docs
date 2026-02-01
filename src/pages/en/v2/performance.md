---
title: Performance
description: Understanding and optimizing L7 API dissection performance in Kubeshark.
layout: ../../../layouts/MainLayout.astro
---

**L7 API dissection** requires significant CPU and memory resources to process and analyze network traffic in real-time. Understanding performance characteristics helps optimize Kubeshark for your environment.

## Resource Consumption

Real-time API dissection accounts for most of Kubeshark's resource usage. Traffic capture itself remains comparatively lightweight—parsing operations consume far more compute than the initial packet capture phase.

| Operation | CPU Usage | Memory Usage | Where |
|-----------|-----------|--------------|-------|
| Raw Capture (L4) | Low | Low | Production |
| Real-time API Dissection (L7) | High | High | Production |
| Delayed API Dissection | Low (configurable) | Low (configurable) | Non-production |

## Raw Capture vs Real-Time Dissection

![Resource Comparison](/resource_comparison.png)

Most of the heavy lifting in V2.00 involves writing data to disk, which is far less resource-intensive than real-time parsing. This is why [Raw Capture](/en/v2/raw_capture) can run continuously with minimal impact, while real-time dissection should be enabled on-demand.

- **Raw Capture** - Primarily disk I/O, minimal CPU
- **Real-time Dissection** - CPU and memory intensive parsing operations

## Delayed Dissection

To minimize production impact, V2.00 introduces [delayed API dissection](/en/v2/raw_capture#delayed-api-dissection). Dissection is executed on non-production compute resources with low, configurable resource consumption.

This enables:
- Continuous lightweight capture on production nodes
- Dissection processing on non-production compute with configurable resources
- Real-time dissection enabled on-demand only when needed for investigation

## Reducing Resource Consumption

### Automatic Dissection Timeout

To preserve resources, L7 API dissection automatically stops after a configurable idle period (default: 5 minutes). This behavior can be overridden. See [Enabling / Disabling L7 API Dissection](/en/on_off_switch) for details.

### Disable Dissection

Disable L7 API dissection entirely using `tap.capture.stopped=true`. Dissection can be [enabled on-demand](/en/on_off_switch) when needed:

```yaml
tap:
  capture:
    stopped: true
```

### Use Capture Filters

Reduce the number of targeted workloads using [Capture Filters](/en/pod_targeting) to lower resource consumption:

```yaml
tap:
  regex: "frontend-.*"
  namespaces:
    - production
```

### Run Raw Capture Only

Let [Raw Capture](/en/v2/raw_capture) run continuously while keeping dissection disabled:

```yaml
tap:
  capture:
    stopped: true           # Dissection disabled
    raw:
      enabled: true         # Raw capture active
```

This provides complete traffic history with minimal overhead, enabling dissection only when investigation is needed.

