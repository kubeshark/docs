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

**Kubeshark** does not require any prerequisites such as CNI, service mesh, or coding. It functions without the need for a proxy or sidecar, and does not necessitate any changes to existing architecture.

**Kubeshark** is comprised of four software components that integrate seamlessly:

## CLI

The CLI, a binary distribution of the Kubeshark client, is written in the [Go](https://go.dev/) language. It is an optional component that offers a lightweight on-demand option to use **Kubeshark** that doesn't leave any permanent footprint.

Once downloaded, you can simply use the `tap` command to begin monitoring cluster-wide API traffic:

```shell
kubeshark tap                                       - tap all pods in all namespaces
kubeshark tap -n sock-shop "(catalo*|front-end*)"   - tap only pods that match the regex in a certain namespace
```

## Cluster Architecture

![Full Architecture](/full-architecture.png)

Workers are deployed, one per node, at the node level, to sniff traffic and listen to requests on port `30001` on each node.

The Hub is a single container deployed at the Control Plane level. It consolidates information received from all the Workers and listens to requests on port `8898`.

The Front is a single container deployed at the Control Plane level. It communicates with the Hub to receive consolidated information and serves the dashboard. It listens to requests on port `8899`.

> All ports are configurable.

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

Each Worker pod is deployed into your cluster at the node level as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

Each Worker pod includes two services:

1. Sniffer: A network packet sniffer.
2. Tracer: An optional kernel tracer.

![Worker's Architecture](/worker-architecture.png)

### Sniffer

The Sniffer is the main container in the Worker pod responsible for capturing packets by one of the available means.

#### AF_PACKET

AF_PACKET is a socket type in the Linux socket API that provides direct access to network packets at the link-layer level.

Kubeshark uses this library to request packets from the Linux kernel. Availability of this library is very common among Linux kernels.

#### PF_RING

PF_RING is a high-speed packet capture and processing framework. It supports various packet capture methods, including kernel bypass techniques. PF_RING aims to overcome the limitations of the traditional Linux networking stack, offering acceleration mechanisms for high-speed packet capture and analysis. It is frequently used in high-performance scenarios.

PF_RING knows when it is available via a kernel module.

### Tracer

Kubeshark can sniff [encrypted traffic (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) in your cluster using eBPF **without actually doing decryption**. It hooks into entry and exit points in certain functions inside the [OpenSSL](https://www.openssl.org/) library and Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package.

Kubeshark offers tracing of kernel-space and user-space functions using [eBPF](https://prototype-kernel.readthedocs.io/en/latest/bpf/) (Extended Berkeley Packet Filter). eBPF is an in-kernel virtual machine running programs passed from user space, first introduced into the Linux kernel with version 4.4 and has matured since then.

This functionality is performed by the Tracer container. Tracer deployment is optional and can be enabled and disabled using the `tap.tls` configuration value. When set to `false`, Tracer won't get deployed.

> Read more about TLS/eBPF capabilities in the [eBPF & Encryption](/en/encrypted_traffic) section.

### Distributed PCAP-based Storage

Kubeshark employs distributed PCAP-based storage, with each Worker storing captured Layer 4 (L4) streams in the root file system of its node.

Each Worker Pod captures packets from all network interfaces, reassembles TCP streams, and, if dissectable, temporarily stores them as [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) files. The traffic collected is then transmitted to the [**Hub**](#hub) via WebSocket.

**Kubeshark** temporarily stores raw packets and dissects them on-demand based on [filtering criteria](/en/filtering). Storage is controlled by the `tap.storageLimit` property. This property indirectly controls the time-window the packet is available for viewing.

**Service Name**: `kubeshark-worker-daemon-set-<id>`

### Low Network Overhead

To minimize potential network overhead, only a selected portion of the traffic is sent over the network upon request.
