---
title: Anatomy of Kubeshark
description: The distributed architecture of Kubeshark that enables scalable network traffic capture, explained with diagrams.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Distributed packet capture with minimal footprint, built for large scale production clusters.

![Anatomy of **Kubeshark**](/diagram.png)

**Kubeshark** consists of four software components that work together harmoniously:

## CLI

The CLI is a binary distribution of the **Kubeshark** client and it is written in [Go](https://go.dev/) language. It is an optional component that offers a lightweight on-demand option to use **Kubeshark** that doesn't leave any permanent footprint. It communicates directly with [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy the right containers at the right place at the right time.

Here are a few examples how you can use the **Kubeshark** **CLI** to start capturing traffic in your K8s cluster:

**kubeshark tap**
```shell
kubeshark tap                                       - tap all pods in the default namespace
kubeshark tap -A                                    - tap all pods in all namespaces
kubeshark tap -n sock-shop "(catalo*|front-end*)"   - tap only pods that match the regex in a certain namespace
```

For more options on how to use the `tap` command, refer to the [`tap` command](/en/network_sniffing#the-tap-command) section.

**Additional kubeshark commands**
```shell
kubeshark proxy                                       - re-establish a connection to the dashboard
kubeshark clean                                       - clean all kubeshark resources
```

**Source code:** [`kubeshark/kubeshark`](https://github.com/kubeshark/kubeshark)

## The Dashboard

**Kubeshark**'s dashboard is a [React](https://reactjs.org/) app that communicates with the [**Hub**](#hub) via WebSocket and displays the captured traffic in a scrolling feed.

![Kubeshark UI](/kubeshark-ui.png)

**Source code:** [`kubeshark/front`](https://github.com/kubeshark/front)

**Pod name:** `kubeshark-front`

> **NOTE:** Read more in the [dashboard](/en/ui) section.

## Hub

The **Hub** is a pod that acts as a gateway to the [**Workers**](#worker). It hosts an HTTP server and serves to these purposes:

- Accepts WebSocket connections and accompanying filter.
- Establishes new WebSocket connections to the workers.
- Receives the dissected traffic from the workers.
- Streams the results back to the requester.
- Configure worker states through HTTP calls.

**Source code:** [`kubeshark/hub`](https://github.com/kubeshark/hub)

**Pod name:** `kubeshark-hub`

## Worker

It's deployed into your cluster as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
to ensure each node in your cluster are covered by Kubeshark.

The worker contains the implementations of network sniffer and kernel tracer.
It captures the packets from all network interfaces, reassembles the TCP streams and if they are dissectable then stores them as [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) files.
Workers transmit the collected traffic to [**Hub**](#hub) via WebSocket connections.

Kubeshark stores raw packets and dissects them on demand upon [filtering](/en/filtering).

The worker by itself can be used as a network sniffer on your computer without requiring a [Kubernetes](https://kubernetes.io/) cluster.

**Source code:** [`kubeshark/worker`](https://github.com/kubeshark/worker)

**Pod name:** `kubeshark-worker-daemon-set-<id>`

### Distributed Protocol Dissectors

The dissection of application layer protocols are distributed throughout the cluster by the nature of DaemonSet configuration.

### Distributed PCAP-based Storage

Kubeshark uses a distributed PCAP-based storage where each of the workers store the captured TCP streams in the root file system of the node.

Kubeshark's configuration includes a storage limit that is set to 200MB by default. That limit can be changed through CLI options.

> **NOTE:** See [Worker Storage Limit](/en/config#worker-storage-limit) section for more info.

### Low Network Overhead

To reduce potential network overhead, only a fraction of the traffic is sent over the network upon request.