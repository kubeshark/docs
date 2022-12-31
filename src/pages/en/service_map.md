---
title: Service Map
description: Kubeshark offers a Service Dependency Graph to display your Kubernetes cluster.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** offers a **Service Dependency Graph** to display your Kubernetes cluster.

![Service Dependency Graph](/service-dependency-graph.png)

The **Service Map** is quite sophisticated and updates in real time as traffic is streaming in. Unlike other existing **Service Map** solutions that show system-wide dependencies, you can use **Kubeshark** to analyze the dependencies of a specific traffic snapshot/subset represented by a query.

For example, this query will analyze the dependencies of three Pods:

![Query a Subset of Traffic](/query-subset.png)

The resulting query will show the following service map:

![Service Map Subset](/service-map-subset.png)

If you have a lot of traffic, the image can be jumpy as it updates in real time every 500ms. If you'd like to view the service dependencies of a traffic snapshot, simply pause the streaming.

To view the **Service Map** click on the Service Map button in the upper right hand corner.

![Service Map Button](/service-map-button.png)

> **TIP:** You can view the service dependency map of a previously stored PCAP file