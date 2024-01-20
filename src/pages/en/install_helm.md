---
title: Install with Helm
description: Install and run Kubeshark inside your Kubernetes cluster in seconds.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

While the [CLI](/en/install) is a great option for on-demand usage and running on dev & test clusters, for a more permanent deployment, you can use [Helm](https://helm.sh/) and add **Kubeshark**'s Helm repository:

```shell
helm repo add kubeshark https://helm.kubeshark.co
```
Once the repository was added you can install **Kubeshark**:
```shell 
helm install kubeshark kubeshark/kubeshark
```
> Read the [Helm section](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/README.md) for a detailed description