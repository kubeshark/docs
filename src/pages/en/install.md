---
title: Install
description: Install and run Kubeshark inside your Kubernetes cluster in seconds.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

You can get started in < 60 seconds by downloading the **Kubeshark** CLI [latest release](https://github.com/kubeshark/kubeshark/releases/latest), running `kubeshark tap` and pointing your browser to `localhost:8899`. 

![Kubeshark UI](/kubeshark-ui.png)

Based on your use-case, see below additional installation methods like [Helm](/en/install#helm), [Homebrew](/en/install#homebrew) and more:

## CLI
The [CLI](/en/anatomy_of_kubeshark#cli) offers a lightweight on-demand option to use **Kubeshark** that doesn't leave any permanent footprint. It communicates directly with [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy the right containers at the right place at the right time. It's a perfect solution for development environments or when and where you'd like to investigate traffic asap with minimum preparations.

Install the CLI using one of these methods:
### Run a Shell Script

The quickest way to get started is to use a shell script that downloads the right binary for your operating system and CPU architecture:
```shell
sh <(curl -Ls https://kubeshark.co/install)
```
Alternatively, you can download the right binary directly from [the latest release](https://github.com/kubeshark/kubeshark/releases/latest).

### Homebrew

Install using Homebrew:
```shell
brew tap kubeshark/kubeshark
brew install kubeshark
```

### Build from the Source

You can clone the [Kubeshark GitHub](https://github.com/kubeshark/kubeshark) repository and follow the [instructions in the README file](https://github.com/kubeshark/kubeshark#building-from-source) to build the CLI from the source:
```shell
git clone kubeshark/kubeshark
cd kubeshark & make
```
### Run

To run the CLI, use the `tap` command. For example:
```shell
kubeshark tap --proxy-host 0.0.0.0
```
> Read more `tap` command options in the [`tap` section](/en/network_sniffing#the-tap-command)

### Clean

To clean all relics of Kubeshark from your cluster when using the CLI:
```shell
kubeshark clean
```

## Helm

For a more permanent deployment, add **Kubeshark**'s Helm repository:
```shell
helm repo add kubeshark https://helm.kubeshark.co
```
Once the repository was added you can install **Kubeshark**:
```shell 
helm install kubeshark kubeshark/kubeshark
```

Use the `--set` Helm flag to override default Helm values. Here's a useful Helm command that overrides the default `proxy.host` IP which is `localhost`, and set it to `0.0.0.0`:
```shell
helm install kubeshark kubeshark/kubeshark --set tap.proxy.host=0.0.0.0 
```

### Uninstall

To uninstall the Helm chart:
```shell
helm uninstall kubeshark
```

## Ingress Controller

Kubeshark offers an Ingress controller option. You can read more about this option in the [self-hosting section](/en/self_hosting).