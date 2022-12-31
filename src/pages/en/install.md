---
title: Install
description: kubeshark tap -n sock-shop "(catalo*|front-end*)"
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Getting started with **Kubeshark** is easy. You only need to download the [CLI](/en/cli) and run it. 

The **CLI** communicates directly with [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy the right containers at the right place at the right time.

We recommend choosing the right binary to download directly from [the latest release](https://github.com/kubeshark/kubeshark/releases/latest).

Alternatively you can use a shell script to download the right binary for your operating system and CPU architecture:

```shell
sh <(curl -Ls https://kubeshark.co/install)
```

> **FUTURE:** We plan to enable installation through package managers like Homebrew and Apt

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

For more options on how to use the CLI, refer to the [Scope](/en/scope) page.

Once you run the CLI, a browser window will open at **localhost:8899** by default.


![Kubeshark UI](/kubeshark-ui.png)
