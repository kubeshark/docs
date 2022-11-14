---
title: Install
description: Install
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Install Kubeshark CLI using a shell script that simply downloads the right binary for your operating system
and CPU architecture and places inside your path:


```shell
sh <(curl -s https://kubeshark.co/install)
```

## Deploy

Once you have the Kubeshark CLI installed on your system.
Run the command below to deploy Kubeshark Agent into your Kubernetes cluster.

> Kubeshark images are hosted on Docker Hub. Make sure you have access to https://hub.docker.com/

> Make sure `kubeshark` executable in your `PATH`.

```shell
kubeshark tap
```

### Select Pods

To monitor a specific pod:

```shell
kubeshark tap catalogue-b87b45784-sxc8q
```

Regex match to pods:

```shell
kubeshark tap "(catalo*|front-end*)"
```

### Specify The Namespace

By default, Kubeshark is deployed into the `default` namespace.
To specify a different namespace:

```
kubeshark tap -n sock-shop
```

### To All Namespaces

The default deployment strategy of Kubeshark waits for the new pods
to be created. To simply deploy to all existing namespaces run:

```
kubeshark tap -A
```
