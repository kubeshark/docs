---

title: Installation
description: Quickly install and run Kubeshark in your Kubernetes cluster using a streamlined CLI option.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

<div class="callout callout-tip">

Looking for MCP installation? See the [MCP integration guide](/en/mcp) for connecting AI agents to Kubeshark.

</div>

Install [Kubeshark](https://kubeshark.com) using one of the following methods:  
- [Helm](#helm): Recommended
- [Homebrew](#homebrew): Use `brew install`
- [Kubernetes Manifest](#k8s-manifest): Use `kubectl apply`
- [Build from source](#build-from-source): For those who prefer to build locally rather than download

## Helm  

```shell  
helm repo add kubeshark https://helm.kubeshark.com  
helm install kubeshark kubeshark/kubeshark  
kubectl port-forward service/kubeshark-front 8899:80  

# cleanup  
helm uninstall kubeshark  
```  

> Read the [Helm section](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/README.md) for the most up-to-date instructions.  

## Homebrew

Installing [Kubeshark](https://kubeshark.com) with [Homebrew](https://formulae.brew.sh/formula/kubeshark) is straightforward:
```shell
brew install kubeshark
kubeshark tap

# cleanup
kubeshark clean
```

## Kubernetes Manifest

Each release includes a complete Kubernetes manifest that can be customized or used as is:
```shell
export TAG=v52.3.92  # as an example
kubectl apply -f https://raw.githubusercontent.com/kubeshark/kubeshark/refs/tags/$TAG/manifests/complete.yaml
kubectl port-forward service/kubeshark-front 8899:80

# cleanup
kubectl delete -f https://raw.githubusercontent.com/kubeshark/kubeshark/refs/tags/$TAG/manifests/complete.yaml
```

You can choose a `tag` from: https://github.com/kubeshark/kubeshark/tags.  

## Build from Source  

Clone the [Kubeshark GitHub repository](https://github.com/kubeshark/kubeshark) and follow the [build instructions in the README](https://github.com/kubeshark/kubeshark#building-from-source):  
```shell  
git clone https://github.com/kubeshark/kubeshark  
cd kubeshark && make  
bin/kubeshark__ tap  

# cleanup  
bin/kubeshark__ clean  
```  

## Proxy CLI Command  

The `kubeshark proxy` command is an alternative to the `kubectl port-forward` command. It can be used, no matter how you've installed [Kubeshark](https://kubeshark.com), to establish and maintain a proxy connection to the dashboard.  

### Ingress Controller  

The most recommended method to connect to the dashboard is using an Ingress Controller. It is stable, performant, and secure.  

> Read more in the [Ingress](/en/ingress) section.  
