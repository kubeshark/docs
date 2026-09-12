---
title: Workload Resources
description: Size Kubeshark CPU and memory requests using measured Hub streaming results, and configure component limits and storage.
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
| `requests.cpu` | `50m` | Scheduling reservation and relative CPU share under contention |
| `requests.memory` | `50Mi` | Memory reservation used for scheduling |

**Sizing considerations:**

- Memory scales with number of concurrent connections and API call volume
- Increase limits for high-traffic clusters
- Snapshot storage is separate (see [Snapshots Configuration](/en/v2/raw_capture_config#snapshot-storage))

### Recommended Sizing by Cluster Size

Choose a profile from both worker count and the aggregate entry rate delivered to the dashboard. The chart defaults (`50m` CPU and `50Mi` memory requests) are installation defaults, not measured production capacity recommendations.

These are **starting requests for a workload similar to the [Hub streaming benchmark](/en/performance_benchmark)**: roughly 100 entries/s per worker and one streaming client. CPU requests for Small through Large are planning values informed by observed usage; the XL `2` request was tested directly against `50m`. The proposed memory requests provide headroom above measured process RSS, but were not themselves tested under node memory pressure. Keep the existing memory limit until you have representative measurements of your own workload.

| Profile | Workers | Nominal aggregate entries/s | `requests.cpu` | Starting `requests.memory` | `limits.memory` |
|:---|---:|---:|---:|---:|---:|
| Small | Up to 10 | ~1,000 | `250m` | `512Mi` | `5Gi` |
| Medium | Up to 50 | ~5,000 | `1` | `512Mi` | `5Gi` |
| Large | Up to 100 | ~10,000 | `1500m` | `1Gi` | `5Gi` |
| X-Large | Up to 200 | ~20,000 | `2` | `1Gi` | `5Gi` |

The measured Hub RSS averages were 165, 211, and 274 MiB for Small, Medium, and Large. An XL soak with a `2` CPU request delivered **20,132.56 entries/s for 30 minutes with zero measured Hub UI-stream drops**, using 390 MiB average and 401 MiB peak RSS. These are Hub-only measurements with synthetic workers, not memory requirements for packet capture, indexing, snapshots, or the browser. See the [results, methodology, and limitations](/en/performance_benchmark).

### Why a CPU Request Matters Without a Limit

A CPU request affects placement and the container's relative CPU share when other workloads compete on the same node. A container can use more CPU than its request when capacity is available. A CPU limit imposes a separate ceiling through throttling. See [Kubernetes resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).

Leave Hub `limits.cpu` unset (`""` in Kubeshark values) when cluster policy permits. In six controlled XL trials without a CPU limit, the three trials using a `2` request had zero drops; the three using `50m` lost 3,092, 7,071, and 3,625 entries. The Hub used more than two cores on average in the subsequent soak. Setting a two-core **limit** would impose a constraint that this test did not validate.

A request is not exclusive ownership of two cores or a throughput guarantee. Ensure the node has spare CPU for bursts and for its other workloads. Raising the request can also change pod placement; check the resulting distribution.

### Validate Against Your Workload

1. Start with the closest profile and record the actual image version, entry rate, entry sizes, worker count, and number of concurrent clients.
2. Measure delivered entries/s, Hub UI-stream drop-counter increases, CPU use, RSS, container memory usage, restarts, and metric coverage through a representative peak interval.
3. Increase CPU requests if contention coincides with drops. Inspect CPU throttling separately when a limit is configured.
4. Adjust memory reservations using observed peaks plus headroom for joins, queries, and snapshots. Process RSS is not the same as total memory charged to the container; do not set a memory limit equal to the benchmark RSS peak.
5. Repeat after changing traffic shape or client concurrency. Neither CPU nor memory is established to scale linearly with entries/s or worker count.

Older memory estimates based on the Go `Alloc/Sys` ratio multiplied by the pod limit are not RSS measurements and should not be used to justify multi-GiB Hub reservations. The benchmark uses `process_resident_memory_bytes` and reports Go heap allocation separately.

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
| `requests.cpu` | `50m` | Scheduling reservation and relative CPU share under contention |
| `requests.memory` | `50Mi` | Memory reservation used for scheduling |

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

This example uses the XL Hub starting requests above. Worker and storage values are illustrative and require separate validation for your traffic.

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
        cpu: ""
        memory: 5Gi
      requests:
        cpu: "2"
        memory: 1Gi

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

- [Helm Configuration Reference](/en/helm_reference) - All configuration options
- [Capture Filters](/en/pod_targeting) - Reduce workload targeting
- [Performance](/en/v2/performance) - Performance tuning guide
