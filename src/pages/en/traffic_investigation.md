---
title: Traffic Investigation 
description:  
layout: ../../layouts/MainLayout.astro
---

Kubeshark provides real-time protocol-level visibility to K8s traffic. Coupled with a rich query language and a modern Web UI, **Kubeshark** can be very helpful in identifying culprits. 

## Identity-aware Service Map

**Kubeshark** offers an instant, identity-aware **Service Map** that updates in real time, and can be used to focus your analysis on specific parts of the cluster. 

The **Service Map** provides the following information in a visual graph:
- Label identity for internal workloads and DNS identity for external workloads
- Connectivity information including direction indicated by arrows
- Connection protocol indicated by the arrow color
- Connection density indicated by the number of requests and the arrow thickness

#### Focus on Specific Parts of the Cluster

A busy cluster can generate a very dense **Service Map**. **Kubeshark** enables you to focus on specific parts of your cluster by using it in conjunction with a [KFL query](/en/filtering) to reduce the scope of analysis to only a subset of your cluster's traffic.  

For example, the following query will analyze the ingress traffic of two pods and the egress traffic of a third pod:

![Query a Subset of Traffic](/query-subset.png)

The resulting query will show the following service map:

![Service Map Subset](/service-map-subset.png)

## Rich Query Language

As K8s network is massive, KFL enables you to find the \`needle in the haystack\`.

Here are a few examples:

#### Filtering traffic that uses a specific token (or tokens in general)

![Detecting Tokens](/kfl-token.png)

#### Focusing on a Certain Node

KFL is quite rich and can help you narrow down and speed up your investigation.

Here's another example, when you'd like to analyze the traffic at a specific node or set of nodes.

![KFL Node](/kfl-node.png)

#### Historic Traffic Snapshot Analysis

**Kubeshark** can retain the captured traffic over a long period of time, enabling **Kubeshark** to present a historic traffic snapshot.

The example below presents traffic captured between two timestamps:

![Historical Traffic](/history1.png)