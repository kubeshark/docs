---
title: Identity-aware Service Map
description: Kubeshark offers a Service Dependency Graph to display your Kubernetes cluster.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** offers an instant, identity-aware **Service Map** that updates in real time, and can be used to focus your analysis on specific parts of the cluster. 

The **Service Map** provides the following information in a visual graph:
- Label identity for internal workloads and DNS identity for external workloads
- Connectivity information including direction indicated by arrows
- Connection protocol indicated by the arrow color
- Connection density indicated by the number of requests and the arrow thickness

![Service Dependency Graph](/service-dependency-graph.png)

To view the **Service Map** click on its button in the upper right hand corner.

![Service Map Button](/service-map-button.png)

The **Service Map** is quite sophisticated and can be used to support multiple use-cases. Here are a few:

### Focus on Specific Parts of the Cluster

A busy cluster can generate a very dense **Service Map**. **Kubeshark** enables you to focus on specific parts of your cluster by using it in conjunction with a [KFL query](/en/kfl) to reduce the scope of analysis to only a subset of your cluster's traffic.  

For example, the following query will analyze the ingress traffic of two pods and the egress traffic of a third pod:

![Query a Subset of Traffic](/query-subset.png)

The resulting query will show the following service map:

![Service Map Subset](/service-map-subset.png)

KFL is quite rich and can help you narrow down and speed up your investigation.

> **TIP:** The DNS information can easily clutter the view. To remove the DNS information from the **Service Map**, simply add the following KFL syntax to the query: `  ! dns  ` or `  dns == false  `

![No DNS](/no-dns.png)

Here's another example, when you'd like to analyze the traffic at a specific node or set of nodes.

![KFL Node](/kfl-node.png)

### View Real Time Changes

By default, the **Service Map** updates in real time and can show changes that are inferred directly from traffic as traffic is streaming in.

If you have a lot of traffic, the image can be jumpy as it updates every 500ms. If you'd like to see a static view of the **Service Map**, simply pause the streaming.

![Stop Streaming](/stop-streaming.png)

### Historic Traffic Snapshot Analysis

The **Service Map** provides two methods to analyze historic traffic:
1. Using a KFL query that includes a time window
2. Using the **Service Map** functionality on a [previously exported PCAP file](/en/pcap#export-a-pcap-snapshot)

**Kubeshark** can retain the captured traffic over a long period of time, enabling **Kubeshark** to present a historic traffic snapshot.

The example below presents traffic captured between two timestamps:

![Historical Traffic](/history1.png)

### Internal and External Workload Identity-aware

With the distributed and highly dynamic nature of Kubernetes, determining service identities can be challenging and require rich context (e.g. code instrumentation). 

**Kubeshark** subscribes to Kubernetes API events and dissects DNS traffic to conclude the identity of internal and external service connection. It infers the required information directly from traffic and requires no code instrumentation.