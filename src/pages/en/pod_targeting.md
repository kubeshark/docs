---
title: Capture Filters
description: Optimizing resource consumption through pod targeting
layout: ../../layouts/MainLayout.astro
---

Resource consumption (e.g., CPU and memory) is key in Kubernetes. **Kubeshark**'s resource consumption is linearly dependent on the amount of traffic it processes. There are many ways to control resource consumption, and this `Capture Filters` feature is one of them.

Capture Filters can help you focus on traffic of interest and avoid processing traffic that isn't of interest.

Pods in Kubernetes launch and terminate dynamically on nodes scheduled by Kubernetes. To process relevant traffic only, **Kubeshark** monitors Kubernetes events, especially pod start and termination events, so it can start processing the pods' traffic when they start on the node they start on. If pods terminate and start elsewhere, **Kubeshark** will process the traffic for the pod on the new node.

The results per pod of interest are:
1. Identifying the node the pod runs on
2. Identifying the relevant pod IPs as there can be several (e.g., pod IP, service IP, multi-NIC IP, etc.)
3. Capturing traffic on the target node related to the target IPs
4. Processing captured traffic

## Pod Targeting

Pod Targeting enables the targeting of specific pods using pod regex (**reg**ular **ex**pression) and a list of namespaces. It monitors Kubernetes events to track pods that match these criteria across nodes and replicas, tapping into their traffic from launch until termination.

## Namespace Targeting

**Kubeshark** will monitor Kubernetes events and process traffic for all pods that are part of the target namespaces across all nodes in the cluster.

### Excluding Namespaces

The opposite operation to targeting namespaces is excluding namespaces. Explicitly ignore traffic from pods that are part of the excluded namespaces list.

## Explicit BPF Expression (Traffic Targeting)

Another way to target specific traffic is by using an explicit BPF expression written in [BPF syntax](https://biot.com/capstats/bpf.html). This BPF expression will be used to target traffic, and any Pod Targeting rules will be ignored. Examples of BPF expressions include: `net 10.10.0.0/16 or host 12.13.14.15`.

> Setting an explicit BPF expression that overrides other rules is available only when AF_PACKET is used as a packet capture library. Read [here](/en/packet_capture#af_packet) to learn how to explicitly set AF_PACKET as the packet capture library.

## Dynamically Changing The Traffic Targeting Rules

You can dynamically set the *Pod Targeting* properties and the *BPF expression* from the dashboard. To operate the *Pod Targeting* dialog window, press the `kube` button located to the right of the *Pod Targeting* section.

![Activate Pod Targeting](/pod_targeting_cta.png)

In the dialog window, you can set the namespaces and the pod regex:

![Operate Pod Targeting Dialog](/pod_targeting_open.png)

The following video demonstrates the behavior:

<div style="position: relative; padding-bottom: 51.875%; height: 0;"><iframe src="https://www.loom.com/embed/458f924403e94a0e8d80f2b81b1252b7?sid=b505561a-2831-4f41-8d02-8936109afa4a" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Processing Traffic Consumes CPU and Memory

**Kubeshark**'s resource consumption is directly related to the amount of traffic it processes. This becomes a significant issue in busy clusters. [Limiting CPU and memory consumption](/en/performance#container-memory-and-cpu-limitations) doesn't guarantee efficient operation if the allocated resources are insufficient for the traffic volume that **Kubeshark** needs to handle.

Moreover, the dynamic and distributed architecture of Kubernetes can lead to challenges in tracking and tapping targeted pods, as pods may start and stop, have replicas, and move across nodes.

These Grafana panels show the implications on CPU and memory consumption:

![Pod Targeting Changes](/pod_targeting_grafana.png)

## Starting with Default Traffic Targeting Rules

Default rules can be set in the configuration (e.g., values.yaml). For instance, the following configuration directs **Kubeshark** to process only traffic associated with pods matching the regex `catal.*` in the `ks-load` or `sock-shop` namespaces:

```yaml
tap:
  regex: catal.*
  namespaces:
  - ks-load
  - sock-shop
  excludeNamespaces:
  - kube-system
```

Setting a BPF expression will override any existing Pod Targeting rules.

```yaml
tap:
  regex: catal.*
  namespaces:
  - ks-load
  - sock-shop
  bpfOverride: net 10.10.0.0/16
```

## KFL vs. Traffic Targeting (Display vs. Capture Filters)

[KFL](/en/filtering) should not be confused with Traffic Targeting as they serve different purposes. KFL statements only affect the data presented in the Dashboard, whereas Traffic Targeting determines which pods are targeted and, consequently, which traffic is tapped.

For those familiar with Wireshark, KFL can be likened to Wireshark's Display Filters, and Traffic Targeting to Wireshark's BPF (Berkeley Packet Filter) filters.