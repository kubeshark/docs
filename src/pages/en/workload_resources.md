---
title: Workload Resources
description: Configure CPU, memory, and storage limits for Kubeshark components.
layout: ../../layouts/MainLayout.astro
---

Configure resource allocations for Kubeshark's three main components: Hub, Worker (Sniffer/Tracer), and Front-end.

---

## Component Overview

| Component | Role | Runs On |
|-----------|------|---------|
| **Hub** | Central aggregator, API server, snapshot storage | Single pod |
| **Worker** | Traffic capture and indexing | DaemonSet (every targeted node) |
| **Front** | Dashboard UI | Single pod |

---

## Hub Resources

The Hub aggregates traffic from all workers and serves the dashboard API.

```yaml
tap:
  resources:
    hub:
      limits:
        cpu: ""               # No limit (default)
        memory: 5Gi
      requests:
        cpu: 50m
        memory: 50Mi
```

| Setting | Default | Description |
|---------|---------|-------------|
| `limits.cpu` | `""` (unlimited) | Maximum CPU |
| `limits.memory` | `5Gi` | Maximum memory |
| `requests.cpu` | `50m` | Guaranteed CPU |
| `requests.memory` | `50Mi` | Guaranteed memory |

**Sizing considerations:**
- Memory scales with number of concurrent connections and API call volume
- Increase limits for high-traffic clusters
- Snapshot storage is separate (see [Snapshots Configuration](/en/v2/raw_capture_config#snapshot-storage))

### Recommended Sizing by Cluster Size

The chart defaults (`requests: cpu 50m, memory 50Mi`) are intentionally low so a first install fits anywhere — they are **not** appropriate for production. Under any real traffic the Hub will be running unguaranteed and will rely entirely on burst, which is fine on idle nodes and painful under contention.

The profiles below come from end-to-end load tests run with [perfshark](https://github.com/kubeshark/perfshark) against the Hub at four representative cluster sizes. Each profile assumes the same per-worker traffic pattern: 100 captured entries per second per worker, 50 flows per response, 1 connected dashboard client, sustained for 10 minutes.

| Cluster size | Workers (DaemonSet pods) | Captured pods | Aggregate entries/s | Hub CPU (avg / peak) | Hub memory (avg / peak) |
|:---|---:|---:|---:|---:|---:|
| Small  | 10  | 100  | 1,000  | 194m / 205m   | 2.6 Gi / 3.3 Gi |
| Medium | 50  | 500  | 5,000  | 912m / 935m   | 3.0 Gi / 3.9 Gi |
| Large  | 100 | 1,000 | 10,000 | 1,587m / 1,620m | 2.8 Gi / 3.7 Gi |
| X-Large | 200 | 2,000 | 20,000 | 1,646m / 1,919m | 3.0 Gi / 4.3 Gi |

#### Suggested requests / limits

| Cluster size | `requests.cpu` | `requests.memory` | `limits.cpu` | `limits.memory` |
|:---|---:|---:|---:|---:|
| Small  | `250m`  | `4Gi` | `1`   | `5Gi` |
| Medium | `1`     | `4Gi` | `2`   | `5Gi` |
| Large  | `1500m` | `4Gi` | `2`   | `5Gi` |
| X-Large | `2`     | `5Gi` | `3`   | `6Gi` |

`requests.cpu` is sized to roughly the observed average (CPU is throttleable, so giving the scheduler a realistic baseline matters more than ceiling); `requests.memory` is sized above the observed peak so the Hub is guaranteed enough memory not to be OOM-killed during bursts. Limits add roughly 25-30% headroom on top.

**What the numbers reveal:**

- **Memory is largely flat across cluster sizes** (~3-4 Gi). The dominant cost is the dissector working set and stream buffers, not the number of connections. Going from a 10-worker cluster to a 200-worker cluster adds roughly 1 Gi of memory.
- **Memory is stable**: growth on the largest tiers ran **negative** (~-1.9 %/min) across the 10-minute window — no sustained leak. On the smallest tier the growth rate is positive but the absolute footprint stays under 4 Gi.
- **CPU scales sublinearly with workers**: doubling from 100 to 200 workers only added ~4% to average CPU, suggesting a single Hub replica still has headroom past 200 workers on commodity hardware.

#### Example: X-Large profile

```yaml
tap:
  resources:
    hub:
      requests:
        cpu: 2
        memory: 5Gi
      limits:
        cpu: 3
        memory: 6Gi
```

#### When to deviate

These profiles assume the perfshark traffic shape (100 entries/s/worker, average flow size). Two patterns push the Hub above the profiles:

- **Heavy per-flow payloads or many dashboard clients** — both inflate stream-buffer memory. Raise `requests.memory` and `limits.memory` by roughly the ratio of your observed throughput to the table's.
- **Bursty traffic** — if peak entries/s far exceed average, raise `limits.cpu` first; the Hub will burn through it during bursts and idle the rest of the time.

You can reproduce these numbers against your own cluster shape with `perfshark perf run tier-<size>`; the [perfshark repo](https://github.com/kubeshark/perfshark) documents the harness and lets you swap the scenario YAML to match your traffic profile.

---

## Worker Resources

Workers run on each node as a DaemonSet, capturing and indexing traffic.

### Sniffer

Captures network packets:

```yaml
tap:
  resources:
    sniffer:
      limits:
        cpu: ""               # No limit (default)
        memory: 5Gi
      requests:
        cpu: 50m
        memory: 50Mi
```

### Tracer

Handles eBPF-based tracing (TLS decryption, process correlation):

```yaml
tap:
  resources:
    tracer:
      limits:
        cpu: ""               # No limit (default)
        memory: 5Gi
      requests:
        cpu: 50m
        memory: 50Mi
```

| Setting | Default | Description |
|---------|---------|-------------|
| `limits.cpu` | `""` (unlimited) | Maximum CPU |
| `limits.memory` | `5Gi` | Maximum memory |
| `requests.cpu` | `50m` | Guaranteed CPU |
| `requests.memory` | `50Mi` | Guaranteed memory |

**Sizing considerations:**
- CPU usage scales with traffic volume and indexing complexity
- Memory scales with connection tracking and payload buffering
- Use [Capture Filters](/en/pod_targeting) to reduce load

---

## Front-end Resources

The front-end serves the dashboard UI:

```yaml
tap:
  resources:
    front:
      limits:
        cpu: 750m
        memory: 1Gi
      requests:
        cpu: 50m
        memory: 50Mi
```

The front-end is lightweight and typically doesn't require adjustment.

---

## Storage

### Worker Storage

Each worker stores captured traffic temporarily:

```yaml
tap:
  storageLimit: 5Gi           # Max storage per worker
```

When storage exceeds this limit, the pod is evicted and restarted.

### Raw Capture Storage

Node-level FIFO buffer for raw packet capture:

```yaml
tap:
  capture:
    raw:
      storageSize: 1Gi        # Per-node buffer size
```

Must be less than `tap.storageLimit`.

### Snapshot Storage

Dedicated Hub storage for snapshots:

```yaml
tap:
  snapshots:
    local:
      storageClass: ""        # Storage class (e.g., gp2)
      storageSize: 20Gi       # Total snapshot storage
```

See [Raw Capture & Snapshots Configuration](/en/v2/raw_capture_config) for details.

---

## Traffic Sampling

Reduce resource usage by processing only a percentage of traffic:

```yaml
tap:
  trafficSampleRate: 100      # 0-100, default is 100 (all traffic)
```

Setting `trafficSampleRate: 20` processes only 20% of L4 streams.

---

## Health Probes

Configure liveness and readiness probes:

### Hub Probes

```yaml
tap:
  probes:
    hub:
      initialDelaySeconds: 5
      periodSeconds: 5
      successThreshold: 1
      failureThreshold: 3
```

### Sniffer Probes

```yaml
tap:
  probes:
    sniffer:
      initialDelaySeconds: 5
      periodSeconds: 5
      successThreshold: 1
      failureThreshold: 3
```

---

## OOMKilled and Evictions

If containers exceed memory limits, they are OOMKilled. If storage exceeds limits, pods are evicted.

**To prevent this:**
1. Increase resource limits
2. Use [Capture Filters](/en/pod_targeting) to target fewer workloads
3. Reduce `trafficSampleRate`
4. Disable real-time indexing and use [Delayed Indexing](/en/v2/l7_api_dissection#delayed-indexing) instead

---

## Complete Example

```yaml
tap:
  # Storage
  storageLimit: 10Gi

  capture:
    raw:
      storageSize: 5Gi

  snapshots:
    local:
      storageClass: gp2
      storageSize: 100Gi

  # Hub resources
  resources:
    hub:
      limits:
        cpu: 2000m
        memory: 8Gi
      requests:
        cpu: 100m
        memory: 256Mi

    # Worker resources
    sniffer:
      limits:
        cpu: 1000m
        memory: 4Gi
      requests:
        cpu: 100m
        memory: 128Mi

    tracer:
      limits:
        cpu: 1000m
        memory: 4Gi
      requests:
        cpu: 100m
        memory: 128Mi

    # Front-end resources
    front:
      limits:
        cpu: 500m
        memory: 512Mi
      requests:
        cpu: 50m
        memory: 64Mi

  # Reduce load
  trafficSampleRate: 50
```

---

## What's Next

- [Helm Configuration Reference](/en/helm_reference) — All configuration options
- [Capture Filters](/en/pod_targeting) — Reduce workload targeting
- [Performance](/en/v2/performance) — Performance tuning guide
