---
title: Deploy
description: Deploy
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Once you have the Kubeshark CLI installed on your system.
Run the command below to deploy Kubeshark Agent into your Kubernetes cluster.

> Kubeshark images are hosted on Docker Hub. Make sure you have access to https://hub.docker.com/

> Make sure `kubeshark` executable in your `PATH`.

```shell
kubeshark deploy
```

## Select Pods

To monitor a specific pod:

```shell
kubeshark deploy catalogue-b87b45784-sxc8q
```

Regex match to pods:

```shell
kubeshark deploy "(catalo*|front-end*)"
```

## Specify The Namespace

By default, Kubeshark is deployed into the `default` namespace.
To specify a different namespace:

```
kubeshark deploy -n sock-shop
```
