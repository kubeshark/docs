---
title: Install
description: Install and run Kubeshark inside your Kubernetes cluster in seconds.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

You can install Kubeshark using two main methods:
1. [CLI](#cli)
2. [Helm](#helm)

The quickest way to get started would be to download the **Kubeshark** CLI [latest release](https://github.com/kubeshark/kubeshark/releases/latest), running `kubeshark tap` and pointing your browser to `localhost:8899`. 

![Kubeshark UI](/kubeshark-ui.png)

Based on your use-case, see below additional installation methods like [Helm](/en/install#helm), [Homebrew](/en/install#homebrew) and more:

## CLI
> Read more in the [CLI](/en/anatomy_of_kubeshark#cli) section.

### Run a Shell Script

You can use a shell script to download the right binary for your operating system and CPU architecture:
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
While this option is there, due to demand we invest more in the shell script and the Helm options. For this reason, we do not recommend using Homebrew. 

### Build from the Source

You can clone the [Kubeshark GitHub](https://github.com/kubeshark/kubeshark) repository and follow the [instructions in the README file](https://github.com/kubeshark/kubeshark#building-from-source) to build the CLI from the source:
```shell
git clone kubeshark/kubeshark
cd kubeshark & make
```
### Run (Tap)

To run the CLI, use the `tap` command. For example:
```shell
kubeshark tap
```
> Read more `tap` command options in the [`tap` section](/en/network_sniffing#the-tap-command)

### Proxy

When Kubeshark starts, to expose the dashboard port, it automatically starts a kube-proxy. If kube-proxy creation fails, it defaults to port-forward. Both kube-proxy and port-forward solutions can break after some time. You can always use: 
```shell
kubeshark proxy
```
To re-establish a kube-proxy (or port-forward).

You can also, safely exit (use ^C) Kubeshark. It will continue to run in the background. Here again, you can use the `kubehsark proxy` command to re-establish a kube-proxy (or port-forward).

### Clean

To clean all relics of Kubeshark from your cluster when using the CLI:
```shell
kubeshark clean
```

Exiting Kubeshark using ^C only breaks the kube-proxy / port-forward connection and does not remove Kubeshark from the cluster. Only `clean` command does.

> Pro tip: use `kubeshark tap; kubeshark clean' when you run Kubeshark for the CLI.

## Helm

For a more permanent deployment, add **Kubeshark**'s Helm repository:
```shell
helm repo add kubeshark https://helm.kubeshark.co
```
Once the repository was added you can install **Kubeshark**:
```shell 
helm install kubeshark kubeshark/kubeshark
```

A typical Helm command:
```shell
helm install kubeshark kubeshark/kubeshark -n kubeshark --create-namespace \
--set license=FT7YKA .. 4VGK5EASXETJD2XCWIUVNYAILCJPNNSWX6MSI6V4L5E66XQCJ4SANN3BLGAA= \
--set-json 'scripting.env={"AWS_ACCESS_KEY_ID":"AKI..5YF", "AWS_SECRET_ACCESS_KEY": "mbio..gtJuf", "AWS_REGION":"us-east-2", "S3_BUCKET":"demo-kubeshark-co"}' \
--set-json 'tap.annotations={"eks.amazonaws.com/role-arn":"arn:aws:iam::74..50:role/s3-role", "alb.ingress.kubernetes.io/scheme":"internet-facing", "alb.ingress.kubernetes.io/target-type":"ip"}' \
--set tap.ingress.enabled=true \
--set tap.ingress.host=demo.kubehq.org \
--set "tap.ingress.auth.approveddomains={kubeshark.co}" \
--set tap.release.namespace=kubeshark \
--set tap.resources.worker.limits.memory=2Gi \
--set-json 'tap.nodeselectorterms=[{"matchExpressions": [ { "key": "kubeshark" , "operator": "In", "values": [ "true" ] } ] }]'
```

### Uninstall

To uninstall the Helm chart:
```shell
helm uninstall kubeshark
```

## Change the Default Deployment Namespace

By default Kubeshark installs in the `default` namespace. Use the following methods based on your installation method.

### CLI

The following commands will create a new namespace named: `<unique-name-space>`, and install Kubeshark in it, instead of the `default` namespace.

```shell
kubectl create namespace <unique-name-space>
kubeshark tap --set tap.release.namespace=<unique-name-space>
```

The following will clean all relics:

```shell
kubeshark clean --set tap.release.namespace=<unique-name-space>
kubectl delete namespace <unique-name-space>
```

You can avoid setting the `tap.release.namespace` every time by setting it in the `config.yaml` file.
```shell
tap:
  release:
    repo: https://helm.kubeshark.co
    name: kubeshark
    namespace: <unique-name-space>
```
### Helm

```shell
helm install kubeshark kubeshark/kubeshark -n <unique-name-space> --create-namespace \
--set tap.release.namespace=<unique-name-space>
```

To uninstall:
```shell
helm uninstall kubeshark -n unique-name-space>
kubectl delete namespace unique-name-space>
```