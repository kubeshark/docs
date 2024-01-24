---
title: Pod Targeting
description: Optimizing resource consumption through pod targeting
layout: ../../layouts/MainLayout.astro
---

## Processing Traffic Consumes CPU and Memory

**Kubeshark**'s resource consumption is directly related to the amount of traffic it processes. This becomes a significant issue in busy clusters. [Limiting CPU and memory consumption](/en/performance#container-memory-and-cpu-limitations)] doesn't guarantee efficient operation if the allocated resources are insufficient for the traffic volume that **Kubeshark** needs to handle.

Moreover, the dynamic and distributed architecture of Kubernetes can lead to challenges in tracking and tapping targeted pods, as pods may start and stop, have replicas, and move across nodes.

## Consumption Optimization Through Pod Targeting 

Pod targeting allows **Kubeshark** to process traffic from specific pods only, discarding traffic from non-targeted pods.

**Kubeshark** enables the targeting of specific pods using pod regex (**reg**ular **ex**pression) and a list of namespaces. It monitors Kubernetes events to track pods that match these criteria across nodes and replicas, tapping into their traffic from launch until termination.

For instance, the following configuration directs **Kubeshark** to process only traffic associated with pods matching the regex `catal.*` in the `ks-load` or `sock-shop` namespaces:

```yaml
tap:
  regex: catal.*
  namespaces:
  - ks-load
  - sock-shop
```

The rest of the traffic will be discarded.

## KFL vs. Pod Targeting (Display vs. Capture Filters)

KFL should not be confused with [Pod Targeting](/en/pod_targeting) as they serve different purposes. KFL statements only affect the data presented in the Dashboard, whereas Pod Targeting determines which pods are targeted and, consequently, which traffic is tapped.

For those familiar with Wireshark, KFL can be likened to Wireshark's Display Filters, and Pod Targeting to Wireshark's BPF (Berkeley Packet Filter) filters.

## Using the Dashboard

> Feature available from the next patch release

You can dynamically set the *Pod Targeting* properties from the dashboard. To operate the *Pod Targeting* dialog window, press the `kube` button located to the right of the *Pod Targeting* section.

![Activate Pod Targeting](/pod_targeting_cta.png)

In the dialog window, you can set the namespaces and the pod regex:

![Operate Pod Targeting Dialog](/pod_targeting_open.png)

The following video demonstrates the behavior:

<div style="position: relative; padding-bottom: 51.87500000000001%; height: 0;"><iframe src="https://www.loom.com/embed/458f924403e94a0e8d80f2b81b1252b7?sid=b505561a-2831-4f41-8d02-8936109afa4a" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

These Grafana panels show the implications on CPU and memory consumption:

![Pod Targeting Changes](/pod_targeting_grafana.png)
