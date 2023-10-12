---
title: Anatomy of Kubeshark
description: The distributed architecture of Kubeshark that enables scalable network traffic capture, explained with diagrams.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Distributed packet capture with minimal footprint, built for large scale production clusters.

![Anatomy of **Kubeshark**](/diagram.png)

**Kubeshark** supports two main deployment methods:
1. On-demand lightweight traffic investigation using a [CLI](/en/install#cli), by anyone with [kubectl](https://kubernetes.io/docs/reference/kubectl/) access.
2. Long living deployment, using a [helm chart](/en/install#helm), in support of multiple use-cases (e.g. collaborative debugging, network monitoring, telemetry and forensics).

**Kubeshark** requires no prerequisites like: CNI, service-mesh or coding. It doesn't use a proxy or a sidecar and doesn't require architecture alterations to function. The CLI option can get your K8s traffic investigation going in only a few minutes.

**Kubeshark** comprises four software components that seamlessly integrate with one another:

## CLI

The CLI is a binary distribution of the **Kubeshark** client and it is written in [Go](https://go.dev/) language. It is an optional component that offers a lightweight on-demand option to use **Kubeshark** that doesn't leave any permanent footprint.

Once downloaded, simply use the `tap` command to start seeing cluster-wide API traffic:

```shell
kubeshark tap                                       - tap all pods in all namespaces
kubeshark tap -n sock-shop "(catalo*|front-end*)"   - tap only pods that match the regex in a certain namespace
```

## The Dashboard

**Kubeshark**'s dashboard is a [React](https://reactjs.org/) application packaged as a K8s deployment. It operates on the K8s control plane and communicates with the [**Hub**](#hub) via WebSocket, displaying captured traffic in real-time as a scrolling feed.

![Kubeshark UI](/kubeshark-ui.png)

**Service name:** `kubeshark-front`

> **NOTE:** Read more in the [dashboard](/en/ui) section.

## Hub

The **Hub** is a K8 deployment that serves as a gateway to the [**Workers**](#worker). It hosts an HTTP server and fulfills the following functions:

- Accepting WebSocket connections and their accompanying filters.
- Establishing new WebSocket connections to the workers.
- Receiving dissected traffic from the workers.
- Streaming results back to the requester.
- Configuring worker states through HTTP calls.

**Service name:** `kubeshark-hub`

## Worker

The worker is deployed into your cluster as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) to ensure that each node in your cluster is covered by Kubeshark.

This worker encompasses two services: 

1. A network sniffer
2. A kernel tracer

It captures packets from all network interfaces, reassembles TCP streams, and if they are dissectable, stores them as [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) files. The collected traffic is then transmitted to the [**Hub**](#hub) via WebSocket connections.

**Kubeshark** stores raw packets and dissects them on-demand upon [filtering](/en/filtering).

**Name:** `kubeshark-worker-daemon-set-<id>`

### Distributed PCAP-based Storage

Kubeshark uses a distributed PCAP-based storage where each of the Workers store the captured L4 streams in the root file system of the node.

### Low Network Overhead

To reduce potential network overhead, only a fraction of the traffic is sent over the network upon request.