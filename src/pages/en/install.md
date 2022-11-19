---
title: Install
description: Install
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Installing Kubeshark can't be any easier. Either choose the right binary, download and use directly from [Kubeshark's Github repository](https://github.com/kubeshark/kubeshark/releases/), or use a shell script to download the right binary for your operating system and CPU architecture:

```shell
sh <(curl -Ls https://kubeshark.co/install)
```

## Deploy

Once you have the Kubeshark CLI installed on your system, run the command below to deploy the Kubeshark container into your Kubernetes cluster.

```shell
kubeshark tap
```
### Troubleshooting Installation
If something doesn't work or simply to play it safe prior to installing, make sure that:

> Kubeshark images are hosted on Docker Hub. Make sure you have access to https://hub.docker.com/

> Make sure `kubeshark` executable in your `PATH`.

### Select Pods

#### Monitoring a Specific Pod:

```shell
kubeshark tap catalogue-b87b45784-sxc8q
```

#### Monitoring a Set of Pods Using Regex:

```shell
kubeshark tap "(catalo*|front-end*)"
```

### Specify the Namespace

By default, Kubeshark is deployed into the `default` namespace.
To specify a different namespace:

```
kubeshark tap -n sock-shop
```

### Specify All Namespaces

The default deployment strategy of Kubeshark waits for the new pods
to be created. To simply deploy to all existing namespaces run:

```
kubeshark tap -A
```
