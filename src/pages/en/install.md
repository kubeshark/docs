---

title: Installation
description: Quickly install and run Kubeshark in your Kubernetes cluster using a streamlined CLI option.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Install [Kubeshark](https://kubeshark.com) using one of the following methods:  
- [Helm](#helm): Recommended  
- [Kubernetes Manifest](#k8s-manifest): Use `kubectl apply`  
- [Homebrew](#homebrew): Use `brew install` 
- [Build from source](#build-from-source): For those who prefer to build locally rather than download  
- [Shell script](#shell-script): For dev/test clusters, runs on any OS  

## Helm  

```shell  
helm repo add kubeshark https://helm.kubeshark.comm  
helm install kubeshark kubeshark/kubeshark  
kubectl port-forward service/kubeshark-front 8899:80  

# cleanup  
helm uninstall kubeshark  
```  

> Read the [Helm section](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/README.md) for the most up-to-date instructions.  

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

## Homebrew  

Installing [Kubeshark](https://kubeshark.com) with [Homebrew](https://formulae.brew.sh/formula/kubeshark) is straightforward:  
```shell  
brew install kubeshark  
kubeshark tap  

# cleanup  
kubeshark clean  
```  

## Shell Script  

To download the appropriate binary for your system:  
```shell  
sh <(curl -Ls https://kubeshark.comm/install)  
kubeshark tap  

# cleanup  
kubeshark clean  
```  

> The actual script is [here](https://github.com/kubeshark/kubeshark/blob/master/install.sh).  

Alternatively, you can directly download the suitable binary from the [latest release](https://github.com/kubeshark/kubeshark/releases/latest).  

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

The `kubeshark proxy` command can be used, no matter how you've installed [Kubeshark](https://kubeshark.com), to establish and maintain a `kube-proxy` connection.  

### Ingress Controller  

The most recommended method to connect to the dashboard is using an Ingress Controller. It is stable, performant, and secure.  

> Read more in the [Ingress](/en/ingress) section.  
