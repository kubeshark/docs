---
title: Identity-aware Service Map
description: Kubeshark offers a Service Dependency Graph that visualizes the relationships within your Kubernetes cluster.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides a comprehensive understanding of the complex network of interactions inside your cluster. You can toggle between service, pod, and namespace perspectives and monitor latency, bandwidth, and throughput for services, pods, nodes, and namespaces.

The **Service Map** displays the following data in a visual graph:
- Multiple identity layers such as namespaces, pod names, service names for internal workloads, and DNS identities for external workloads.
- Key Performance Indicators (KPIs) like latency, throughput, and bandwidth.
- Service connectivity details including protocol, direction, and density.

![Service Dependency Graph](/new-service-map.png)

To access the **Service Map**, click its button located in the upper right corner.

![Service Map Button](/service-map-button.png)

The **Service Map** boasts advanced features and caters to a variety of use-cases, including:

### Focus on Specific Parts of the Cluster

Dense clusters can yield cluttered **Service Maps**. With **Kubeshark**, you can zero in on particular sections of your cluster by pairing it with a [KFL filter](/en/filtering), narrowing down your analysis to specific segments of your cluster's traffic.

For instance, the query below examines the ingress traffic from two pods and the egress traffic from another:

![Query a Subset of Traffic](/query-subset.png)

The outcome of this query reveals the ensuing service map:

![Service Map Subset](/service-map-subset.png)

KFL's robust capabilities can significantly refine and expedite your investigations.

> **TIP:** To declutter and remove DNS details from the **Service Map**, use the KFL syntax: `  ! dns  ` or `  dns == false  `.

![No DNS](/no-dns.png)

As another example, if you want to investigate traffic for a particular node or a group of nodes, you can use the following:

![KFL Node](/kfl-node.png)

### View Real-Time Changes

By default, the **Service Map** refreshes in real-time, displaying changes inferred directly from incoming traffic.

If your cluster experiences high traffic, the visuals might appear unstable, refreshing approximately every 500ms. To observe a steady rendition of the **Service Map**, simply halt the streaming.

![Stop Streaming](/stop-streaming.png)
