---
title: Anatomy of Kubeshark
description: Anatomy of Kubeshark
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubeshark consists of three different software that works together harmoniously; **CLI**, **Hub** and **Worker**.

![Anatomy of Kubeshark](/diagram.png)

## CLI

It's a binary distribution of the client that communicates with your cluster through
[K8s API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/).
Which you're going to use it to deploy the [**hub**](#hub).

Written in [Go](https://go.dev/) language and it is the program which you need to [install](/en/install)
into your computer.

**Source code:** [`kubeshark/kubeshark`](https://github.com/kubeshark/kubeshark)

## Hub

It's a [Docker](https://www.docker.com/) image which is deployed into your cluster as a normal pod. It orchestrates the **worker** deployments,
receives sniffed and dissected directed from each **worker** and collects into a central place.
It also serves a web interface to display the collected traffic on your web browser.

Written in Go, serves a [React](https://reactjs.org/) app which is used to display the traffic
on your web browser. It communicates with the [**workers**](#worker)
through [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) connections.

It's the software which you [deploy](/en/install#deploy) into your cluster using `kubeshark deploy` command.

**Source code:** [`kubeshark/hub`](https://github.com/kubeshark/hub)

## Worker

It's a Docker image which is deployed into your cluster as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
to ensure each node in your cluster are covered by Kubeshark.
The worker contains the implementations of network sniffer, kernel tracing and more.
Workers transmit the collected traffic to [**hub**](#hub) via WebSocket.

The worker by itself can be used as a network sniffer on your computer without requiring a [Kubernetes](https://kubernetes.io/) cluster.

**Source code:** [`kubeshark/worker`](https://github.com/kubeshark/worker)
