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
| **Worker** | Traffic capture and dissection | DaemonSet (every targeted node) |
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

---

## Worker Resources

Workers run on each node as a DaemonSet, capturing and dissecting traffic.

### Sniffer

Captures network packets:

```yaml
tap:
  resources:
    sniffer:
      limits:
        cpu: ""               # No limit (default)
        memory: 3Gi
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
        memory: 3Gi
      requests:
        cpu: 50m
        memory: 50Mi
```

| Setting | Default | Description |
|---------|---------|-------------|
| `limits.cpu` | `""` (unlimited) | Maximum CPU |
| `limits.memory` | `3Gi` | Maximum memory |
| `requests.cpu` | `50m` | Guaranteed CPU |
| `requests.memory` | `50Mi` | Guaranteed memory |

**Sizing considerations:**
- CPU usage scales with traffic volume and dissection complexity
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
    storageClass: ""          # Storage class (e.g., gp2)
    storageSize: 10Gi         # Total snapshot storage
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
      initialDelaySeconds: 15
      periodSeconds: 10
      successThreshold: 1
      failureThreshold: 3
```

### Sniffer Probes

```yaml
tap:
  probes:
    sniffer:
      initialDelaySeconds: 15
      periodSeconds: 10
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
4. Disable real-time dissection and use [Delayed Dissection](/en/v2/l7_api_delayed) instead

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
