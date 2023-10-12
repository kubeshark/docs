---
title: Short-term Traffic Retention
description: What to expect and how to control the short-term traffic retention
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides real-time visibility into API traffic, enabling its users to view full API traffic details within a short-term retention window. This window is determined by the throughput and the storage allocated for it, all at the K8s node level. Once outside of this window, details are no longer available to view and attempting to do so will result in an error.

![Error Message](/storage_error.png)

> For information on long-term traffic retention, read the [Traffic Recording & Offline Analysis](/en/cloud_forensics) section.

## Guardrails: Hard Limit & Soft Limit

Because storage can fill up rapidly, we have established certain guardrails to prevent overuse of disk resources.

The storage limitation is regulated by the `tap.storagelimit` configuration value, with the default set to `200Mi`. This value represents a hard limit. If storage surpasses this limit, it will result in pod eviction. When the Worker pod is evicted, the storage is purged and the pod immediately restarts from scratch.

To increase this limit, simply provide a different value (e.g., setting it to 1GB with `--set tap.storagelimit=1Gi`).

### Soft Limit

To avoid eviction, the Worker continuously monitors the storage size and purges it once it reaches 50% of the hard limit (based on the aforementioned configuration value).
