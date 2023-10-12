---
title: Install with CLI
description: Install and run Kubeshark inside your Kubernetes cluster in seconds using a lightweight CLI option.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

You can install **Kubeshark** using two main methods:
1. [CLI](#cli)
2. [Helm](/en/install_helm)

The quickest way to get started would be to download the **Kubeshark** CLI [latest release](https://github.com/kubeshark/kubeshark/releases/latest), running `kubeshark tap` and pointing your browser to `localhost:8899`. 

![Kubeshark UI](/kubeshark-ui.png)

Based on your use-case, see below additional installation methods like [Helm](/en/install_helm), [Homebrew](/en/install#homebrew) and more:

## Shell Script

You can use a shell script to download the right binary for your operating system and CPU architecture:
```shell
sh <(curl -Ls https://kubeshark.co/install)
```
Alternatively, you can download the right binary directly from [the latest release](https://github.com/kubeshark/kubeshark/releases/latest).

## Homebrew

Install using Homebrew:
```shell
brew tap kubeshark/kubeshark
brew install kubeshark
```
While this option is there, due to demand we invest more in the shell script and the Helm options. For this reason, we do not recommend using Homebrew. 

## Build from the Source

You can clone the [Kubeshark GitHub](https://github.com/kubeshark/kubeshark) repository and follow the [instructions in the README file](https://github.com/kubeshark/kubeshark#building-from-source) to build the CLI from the source:
```shell
git clone kubeshark/kubeshark
cd kubeshark & make
```
## Run (Tap)

To run the CLI, use the `tap` command. For example:
```shell
kubeshark tap
```
## Proxy

When **Kubeshark** starts, to expose the dashboard port, it automatically starts a kube-proxy. If kube-proxy creation fails, it defaults to port-forward. Both kube-proxy and port-forward solutions can break after some time. You can always use: 
```shell
kubeshark proxy
```
To re-establish a kube-proxy (or port-forward).

You can also, safely exit (use ^C) **Kubeshark**. It will continue to run in the background. Here again, you can use the `kubehsark proxy` command to re-establish a kube-proxy (or port-forward).

## Clean

To clean all relics of **Kubeshark** from your cluster when using the CLI:
```shell
kubeshark clean
```

Exiting **Kubeshark** using ^C only breaks the kube-proxy / port-forward connection and does not remove **Kubeshark** from the cluster. Only `clean` command does.

> Pro tip: use `kubeshark tap; kubeshark clean' when you run **Kubeshark** for the CLI.

## Filtering Based on Pods and Namespaces

While capturing all traffic is possible, it is a storage and CPU intensive operation. **Kubeshark** enables you to describe the scope of traffic capture with support for namespaces and PODs.

### Specific Pod:

```shell
kubeshark tap catalogue-b87b45784-sxc8q
```

### Set of Pods Using a Regex:

You can use a regular expression to indicate several pod names as well as dynamically changing names.

In the example below using the regex `(catalo*|front-end*)` will catch the following three Pods:
* catalogue-868cc5ffd6-p9njn
* catalogue-db-669d5dbf48-8hnrl
* front-end-6db57bf84f-7kss9

```shell
kubeshark tap "(catalo*|front-end*)"
```

![PODS](/pods.png)

### Namespaces

By default, **Kubeshark** is deployed into the `default` namespace.
To specify a different namespace:

```
kubeshark tap -n sock-shop
```

### Specify All Namespaces

The default deployment strategy of **Kubeshark** waits for the new Pods
to be created. To simply deploy to all existing namespaces run:

```
kubeshark tap
```