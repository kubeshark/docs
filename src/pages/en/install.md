---
title: Install
description: kubeshark tap -n sock-shop "(catalo*|front-end*)"
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Getting started with **Kubeshark** is easy. You only need to download the [CLI](/en/anatomy_of_kubeshark#cli) and run it. 

The **CLI** communicates directly with [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy the right containers at the right place at the right time.

We recommend choosing the right binary to download directly from [the latest release](https://github.com/kubeshark/kubeshark/releases/latest).

Alternatively you can use a shell script to download the right binary for your operating system and CPU architecture:

```shell
sh <(curl -Ls https://kubeshark.co/install)
```

### Homebrew

[Homebrew](https://brew.sh/) users can add **Kubeshark** formulae with:

```shell
brew tap kubeshark/kubeshark
```

and install **Kubeshark** CLI with:

```shell
brew install kubeshark
```

## Run

Here are a few examples how you can use the **Kubeshark** **CLI** to start capturing traffic in your Kubernetes cluster:

```shell
kubeshark tap
```
```
kubeshark tap -A
```
```
kubeshark tap -n sock-shop "(catalo*|front-end*)"
```

For more options on how to use the CLI, refer to the [Pods & Namespaces](/en/scope) page.

Once you run the CLI, a browser window will open at **localhost:8899** by default.


![Kubeshark UI](/kubeshark-ui.png)

## Clean Up

To clean up a Kubeshark deployment from your cluster, simply run:

```shell
kubeshark clean
```

### Only A Certain Namespace

By default, Kubeshark the `clean` command removes the any Kubeshark deployments
cluster-wide. To clean up only a certain namespace:

```
kubeshark clean -n sock-shop
```

