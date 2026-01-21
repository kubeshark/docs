---
title: Install with Helm
description: Install and run Kubeshark inside your Kubernetes cluster in seconds.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

> Read the [Helm section](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/README.md) for most up-to-date instructions

While the [CLI](/en/install) is a great option for on-demand usage and running on dev & test clusters, for a more permanent deployment, you can use [Helm](https://helm.sh/) and add **Kubeshark**'s Helm repository:

## Official

Add the Helm repo for Kubeshark:

```shell
helm repo add kubeshark https://helm.kubeshark.com
```

then install Kubeshark:

```shell
helm install kubeshark kubeshark/kubeshark
```

## Local

Clone the repo:

```shell
git clone git@github.com:kubeshark/kubeshark.git --depth 1
cd kubeshark/helm-chart
```

Render the templates

```shell
helm template .
```

Install Kubeshark:

```shell
helm install kubeshark .
```

Uninstall Kubeshark:

```shell
helm uninstall kubeshark
```
## Configuration

For complete and up-to-date configuration options, view the repo: https://github.com/kubeshark/kubeshark/tree/master/helm-chart

## Port-forward

Do the port forwarding:

```shell
kubectl port-forward service/kubeshark-front 8899:80
```

Visit [localhost:8899](http://localhost:8899)
