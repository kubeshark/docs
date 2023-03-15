---
title: Anatomy of Kubeshark
description: With a distributed architecture that promises a very low CPU and network overheads and capable of processing significant amounts of traffic, Kubeshark is built to run on large scale production clusters.
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Distributed packet capture with minimal footprint, built to run on large scale production clusters.

![Anatomy of **Kubeshark**](/diagram.png)

**Kubeshark** consists of four software components that work together harmoniously:

## CLI

The binary distribution of the **Kubeshark** client and it is written in [Go](https://go.dev/) language.

It communicates with your cluster through [K8s API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy the **Hub** and **Worker** pods.

**Source code:** [`kubeshark/kubeshark`](https://github.com/kubeshark/kubeshark)

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

Kubeshark stores raw packets and dissects them on demand.

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

## Front-end

The front-end is a [React](https://reactjs.org/) app that communicates with the [**Hub**](#hub) via WebSocket and displays the captured traffic in a scrolling feed.

![Kubeshark UI](/kubeshark-ui.png)

**Source code:** [`kubeshark/front`](https://github.com/kubeshark/front)

**Pod name:** `kubeshark-front`

> **NOTE:** Read more in the [Web UI](/en/ui) section.

## Scripting and Actionable Detection

Scripting facilitates automation and actionable detection. **Kubeshark** scripting language is based on [Javascript ES5](https://262.ecma-international.org/5.1/). 

Working in conjunction with [hooks](/en/automation_hooks) and [helpers](/en/automation_helpers), scripts can trigger [actions](/en/integration_actions) based on programmatic decisions and/or on a schedule.

> Read more in the [scripting](/en/automation_scripting) section.
