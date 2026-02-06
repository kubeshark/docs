---
title: Raw Capture Configuration
description: Configure raw capture settings including storage, capture filters, and node-level FIFO buffers.
layout: ../../../layouts/MainLayout.astro
---

Configure raw capture to control storage allocation, capture scope, and buffer sizes.

---

## Basic Configuration

Enable and configure raw capture in your Helm values:

```yaml
tap:
  capture:
    raw:
      enabled: true           # Enable raw capture
      storageSize: 1Gi        # Node-level FIFO buffer size
```

When enabled, raw capture continuously stores all L4 traffic matching your [Capture Filters](/en/pod_targeting).

---

## Storage Configuration

### Node-Level FIFO Buffer

Each worker node maintains a FIFO (first-in, first-out) buffer for raw traffic:

```yaml
tap:
  capture:
    raw:
      storageSize: 1Gi        # Size per node
```

When the buffer fills, older data is automatically recycled. Larger buffers retain longer time windows.

**Sizing guidance:**
- Traffic volume depends on your workload
- Monitor actual usage to tune the size
- Consider peak traffic periods

### Snapshot Storage

[Traffic Snapshots](/en/v2/traffic_snapshots) are stored separately and persist indefinitely. Configure dedicated storage:

```yaml
tap:
  snapshots:
    storageClass: ""          # Storage class for snapshot PVCs
    storageSize: 20Gi         # Size allocated for snapshots
```

#### AWS Example

```yaml
tap:
  snapshots:
    storageClass: gp2
    storageSize: 1000Gi
```

With a dedicated storage class, snapshot storage can be far larger than node-local storage.

---

## Capture Filters

Raw capture adheres to [Capture Filters](/en/pod_targeting). Use filters to target specific workloads and reduce storage usage:

```yaml
tap:
  regex: .*                   # Pod name regex
  namespaces: []              # Target namespaces (empty = all)
  excludedNamespaces: []      # Namespaces to exclude
```

### Examples

**Capture only specific namespaces:**

```yaml
tap:
  namespaces:
    - production
    - staging
```

**Exclude system namespaces:**

```yaml
tap:
  excludedNamespaces:
    - kube-system
    - monitoring
```

**Target specific pods:**

```yaml
tap:
  regex: "frontend-.*|backend-.*"
```

---

## Database Size

Configure the maximum size for dissected API data:

```yaml
tap:
  capture:
    dbMaxSize: 500Mi          # Maximum database size
```

This controls storage for L7 dissection results, not raw capture data.

---

## Independence from L7 Dissection

Raw capture operates independently from real-time L7 API dissection:

```yaml
tap:
  capture:
    stopped: false            # Whether L7 dissection is stopped
    stopAfter: 5m             # Auto-stop dissection after idle period
    raw:
      enabled: true           # Raw capture continues regardless
```

- `stopped: true` stops L7 dissection but raw capture continues
- `raw.enabled: true` enables raw capture regardless of dissection state

This allows continuous raw capture with minimal overhead while [enabling L7 dissection on demand](/en/on_off_switch).

---

## Complete Example

```yaml
tap:
  # Capture filters
  regex: .*
  namespaces:
    - default
    - production
  excludedNamespaces:
    - kube-system

  capture:
    stopped: false            # L7 dissection enabled
    stopAfter: 5m             # Auto-stop after 5 minutes idle
    raw:
      enabled: true           # Raw capture always on
      storageSize: 2Gi        # 2GB per node
    dbMaxSize: 500Mi          # 500MB for dissection DB

  snapshots:
    storageClass: gp2         # AWS storage class
    storageSize: 100Gi        # 100GB for snapshots
```

---

## What's Next

- [Raw Capture](/en/v2/raw_capture) — Overview of raw capture capabilities
- [Traffic Snapshots](/en/v2/traffic_snapshots) — Create and manage snapshots
- [Capture Filters](/en/pod_targeting) — Target specific workloads
