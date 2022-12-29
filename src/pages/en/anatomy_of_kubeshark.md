---
title: Anatomy of Kubeshark
description: Anatomy of Kubeshark
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

**Built to Run on Large Scale Production Clusters**

With a distributed architecture that promises a very low CPU and network overheads and capable of processing significantly amounts of traffic, Kubeshark is built to run on large scale production clusters. 

Kubeshark consists of four software components that work together harmoniously:
- **CLI**
- **Hub**
- **Worker**
- **Web UI**

![Anatomy of Kubeshark](/diagram.png)

**NOTE:** Some of the protocols and integrations illustrated in the diagram (e.g. DNS, FTP) are not yet supported and represent future roadmap items. The [Protocols](/en/protocol) section includes the complete list of supported protocol implementations.

## CLI

The **CLI** (Command Line Interface) is a binary distribution of the Kubeshark client and it is written in [Go](https://go.dev/) language. 

The **CLI** communicates with the [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy of the **Hub** in the cluster.

**NOTE:** Read more in the [CLI](/en/cli) section.

## Hub

The **Hub** is a [Docker](https://www.docker.com/) image which is deployed into the Kubernetes cluster as a normal pod. The **Hub** has several functions:
- Orchestrates the **Workers** deployments and communicates with them through [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- Receives the dissected traffic from the **Workers**
- Serves the **Web UI**

**FUTURE:** The **Hub** will be [deployed](/en/install#deploy) directly into the cluster using the `kubeshark deploy` command or a Helm chart not requiering the **CLI**.

**Source code:** [`kubeshark/hub`](https://github.com/kubeshark/hub)

## Worker

**Workers** are responsible for capturing traffic, storing the captured traffic locally at the Kubernetes Cluster’s Node level and dissecting the traffic upon request. 

The **Worker** is a Docker image which is deployed into your cluster as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) to ensure Kubeshark can capture traffic at the Node level.

The **Worker** contains the implementations of network sniffer, kernel tracing and more.
**Workers** transmit the disected traffic to the **Hub** via a WebSocket.

### CPU Intensive Operations Distribution

CPU intensive operations of traffic dissection are distributed and occur on-demand by the **Workers** at the Node level.

### Distributed Storage

Kubeshark **Workers** store the captured traffic locally at the Node level with no limit other than the limit of the volumes attached to the Nodes.

The bigger the attached volume, the more storage there is to store traffic. Kubeshark provides a [configuration option](/en/config#worker-storage-limit) to control the storage limit.

### Low Network Overhead

To reduce potential network overhead, only a fraction of the traffic is sent over the network upon request.

**Source code:** [`kubeshark/worker`](https://github.com/kubeshark/worker)

## The Web UI

The **Web UI** is made out a [React](https://reactjs.org/) application and communicates via a websocket with the **Hub**. The **Web UI** displays the captured traffic in a browser.

![Kubeshark UI](/kubeshark-ui.png)
