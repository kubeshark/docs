---
title: Anatomy of Kubeshark
description: The distributed architecture of Kubeshark that enables scalable network traffic capture, explained with diagrams.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

**A distributed packet capture system with a minimal footprint, designed for large-scale production clusters.**

![Anatomy of **Kubeshark**](/diagram.png)

**Kubeshark** offers two primary deployment methods:

1. On-demand, lightweight traffic investigation accessible through a [CLI](/en/install#cli) for anyone with [kubectl](https://kubernetes.io/docs/reference/kubectl/) access.
2. Long-term deployment via a [helm chart](/en/install#helm), providing stable and secure access to developers without the need for `kubectl` access.

**Kubeshark** does not require any prerequisites such as CNI, service mesh, or coding knowledge. It functions without the need for a proxy or sidecar, and does not necessitate any changes to existing architecture. The CLI option enables you to commence K8s traffic investigation in just a few minutes.

**Kubeshark** is comprised of four software components that integrate seamlessly:

## CLI

The CLI, a binary distribution of the Kubeshark client, is written in the [Go](https://go.dev/) language. It is an optional component that offers a lightweight on-demand option to use **Kubeshark** that doesn't leave any permanent footprint.

Once downloaded, you can simply use the `tap` command to begin monitoring cluster-wide API traffic:

```shell
kubeshark tap                                       - tap all pods in all namespaces
kubeshark tap -n sock-shop "(catalo*|front-end*)"   - tap only pods that match the regex in a certain namespace
```

## The Dashboard

**Kubeshark**'s dashboard is a [React](https://reactjs.org/) application packaged as a Kubernetes (K8s) deployment. It operates within the K8s control plane and communicates with the [**Hub**](#hub) via WebSocket, displaying captured traffic in real-time as a scrolling feed.

![Kubeshark UI](/kubeshark-ui.png)

**Service Name**: `kubeshark-front`

> **NOTE:** For more information, refer to the [dashboard documentation](/en/ui).

## Hub

The **Hub** is a Kubernetes deployment that acts as a gateway to the [**Workers**](#worker). It hosts an HTTP server and performs several key functions:

- Accepting WebSocket connections along with their respective filters.
- Establishing WebSocket connections to the Workers.
- Receiving processed traffic from the Workers.
- Streaming results back to the requestors.
- Managing Worker states via HTTP requests.

**Service Name**: `kubeshark-hub`

## Worker

Each Worker is deployed into your cluster as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/), ensuring coverage of every node in your cluster by Kubeshark.

Each Worker provides two services: 

1. A network packet sniffer.
2. A kernel tracer.

These services capture packets from all network interfaces, reassemble TCP streams, and, if dissectable, store them as [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) files. The traffic collected is then transmitted to the [**Hub**](#hub) via WebSocket.

**Kubeshark** stores raw packets and dissects them on-demand based on [filtering criteria](/en/filtering).

**Service Name**: `kubeshark-worker-daemon-set-<id>`

### Distributed PCAP-based Storage

Kubeshark employs distributed PCAP-based storage, with each Worker storing captured Layer 4 (L4) streams in the root file system of its node.

### Low Network Overhead

To minimize potential network overhead, only a selected portion of the traffic is sent over the network upon request.
