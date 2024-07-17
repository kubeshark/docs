---

title: Traffic & Pod Targeting
description: Optimizing resource consumption through pod targeting  
layout: ../../layouts/MainLayout.astro  

---

Traffic & Pod Targeting provides the means to concentrate exclusively on critical traffic while effectively managing CPU and memory usage.

## Pod Targeting

Pod Targeting enables the targeting of specific pods using pod regex (**reg**ular **ex**pression) and a list of namespaces. It monitors Kubernetes events to track pods that match these criteria across nodes and replicas, tapping into their traffic from launch until termination.

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

# VERY USEFUL TIP

## Start Kubeshark Without Processing Traffic

While it is tempting to unleash Kubeshark on a very busy cluster, this can cause Kubeshark to process all traffic across all pods, immediately consuming significant amounts of memory. This action is likely to result in multiple OOMKilled events.

We recommend starting Kubeshark without processing traffic at all and gradually adding pods or namespaces that are of interest, monitoring consumption, and adding more resources when necessary. 

When Kubeshark is not in use, we recommend shutting down traffic capture and processing.

### Shutdown Traffic Capture

> We are working to significantly simplify this operation.

The same properties can be set using the UI.

#### Use a Pod Targeting Rule That Results In An Empty Pod List

```yaml
tap:
  namespaces:
  - gibrish
```
or

```yaml
--set tap.namespaces[0]=gibrish
```

#### Use an Impossible BPF Expression

```yaml
tap:
  bpfOverride: ether[0] == 255
```
or

```yaml
--set tap.bpfOverride="ether[0] == 255"
```