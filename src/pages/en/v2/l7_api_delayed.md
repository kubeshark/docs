---
title: Delayed Dissection
description: Run L7 API dissection on captured traffic using non-production compute resources, minimizing production impact.
layout: ../../../layouts/MainLayout.astro
---

**Delayed Dissection** enables full [L7 API Dissection](/en/v2/l7_api_dissection) functionality on captured traffic. Capture raw packets on production nodes with minimal overhead, then run complete protocol analysis later—on non-production compute, on your schedule.

The result is identical to real-time dissection: full request/response payloads, headers, timing, and Kubernetes context.

---

## Why Delayed Dissection?

Real-time L7 API dissection requires substantial CPU and memory to parse protocols, reconstruct request/response pairs, and maintain state. This creates a trade-off:

| Approach | CPU Impact | Data Loss Risk | When to Use |
|----------|------------|----------------|-------------|
| Real-time dissection | High | Higher under load | Active debugging, development |
| Delayed dissection | Minimal | None | Production monitoring, forensics |

Delayed dissection addresses this by:

- **Capturing everything** with minimal CPU usage
- **Analyzing later** when resources are available
- **Using non-production compute** for heavy processing

---

## How It Works

```
PRODUCTION                           NON-PRODUCTION
+------------------+                 +------------------+
|                  |                 |                  |
|  Raw Capture     |--- Snapshot --->|  L7 Dissection   |
|  (minimal CPU)   |                 |  (full parsing)  |
|                  |                 |                  |
+------------------+                 +--------+---------+
                                              |
                                              v
                                     +------------------+
                                     |  Dissection DB   |
                                     |  (queryable)     |
                                     +------------------+
```

1. **Capture**: [Raw Capture](/en/v2/raw_capture) continuously stores L4 traffic with minimal CPU
2. **Snapshot**: Create a [Traffic Snapshot](/en/v2/traffic_snapshots) for the time window of interest
3. **Dissect**: Run L7 protocol analysis on the snapshot
4. **Query**: Access the dissected data via the Dashboard or MCP

---

## Key Benefits

### Production Safe

Raw capture uses minimal CPU—primarily disk I/O. The heavy lifting of protocol parsing happens elsewhere, ensuring production workloads aren't affected.

### No Data Loss

Since capture requires minimal resources, packet loss is eliminated. Every request and response is preserved for later analysis.

### Flexible Timing

Run dissection:
- **Immediately** after an incident is reported
- **Periodically** in the background
- **On-demand** when investigation is needed

### Complete Context

Delayed dissection produces the same rich data as real-time:
- Full request/response payloads
- Headers, status codes, timing
- Kubernetes identity (pod, service, namespace)
- Process-level context from eBPF

---

## Workflow

### 1. Ensure Raw Capture is Enabled

See [Configuration](/en/v2/raw_capture_config) for raw capture and snapshot storage settings.

### 2. Create a Snapshot

When you need to analyze a time window, create a [Traffic Snapshot](/en/v2/traffic_snapshots):

- Select the nodes to include
- Choose the time window
- The snapshot becomes immutable

### 3. Run Delayed Dissection

Start dissection on the snapshot. This can be done via:
- The Dashboard UI
- [MCP endpoints](/en/mcp/delayed_dissection) (for AI-driven analysis)

### 4. Query the Results

Once complete, the dissection database contains fully parsed API calls:

- View in the Dashboard
- Query via [MCP](/en/mcp/l7_tools) with `?db=<snapshot>/<dissection>`
- Export for further analysis

---

## Comparison with Real-Time Dissection

| Feature | Real-Time | Delayed |
|---------|-----------|---------|
| See traffic live | Yes | No |
| CPU impact on production | High | Minimal |
| Data loss under load | Possible | None |
| Analyze past traffic | Limited by retention | Yes |
| Requires snapshot | No | Yes |

**Best practice**: Use both together—raw capture always on, real-time dissection enabled when actively debugging.

---

## What's Next

- [Raw Capture](/en/v2/raw_capture) — Configure continuous packet capture
- [Traffic Snapshots](/en/v2/traffic_snapshots) — Create snapshots for dissection
- [MCP Delayed Dissection](/en/mcp/delayed_dissection) — MCP endpoints for automated dissection
