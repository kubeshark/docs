---
title: Ingress
description: This article describes how to self host Kubeshark using Ingress.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides an option for self-hosting as a secure, authenticated web service that allows team members to access **Kubeshark** using a web browser with their corporate identities from remote.

## Benefits

Deploying Ingress is superior to using `port-forward` or `kubernetes proxy`.

### Security

When self-hosted as a web service, developers and security engineers can access **Kubeshark** remotely using a browser, authenticated with their corporate ID, without requiring RBAC / kubectl permissions.

### Performance & Stability

Compared to [port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) or Kubernetes proxy, [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is much lighter and more stable.

## Ingress Configuration

Your cluster needs to have an ingress controller such as [Nginx](https://www.nginx.com/products/nginx-ingress-controller/) deployed. If you don't already have one in your cluster, you can install it by following one of the examples at the end of this article.

### Ingress Config Values

```shell
tap:
  ingress:
    enabled: false
    classname: kubeshark-ingress-class
    controller: k8s.io/ingress-nginx
    host: ks.svc.cluster.local
    tls: []
    certmanager: letsencrypt-prod
```

- To enable ingress set `tap.ingress.enabled` to `true`.
- Use the `tap.ingress.classname` and `tap.ingress.controller` when necessary for a more granular control.
- **host:** the IP/LB of the Ingress. You made a note earlier for that.


## Install Ingress

```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install kubeshark-ingress ingress-nginx/ingress-nginx --namespace kubeshark-ingress --create-namespace
```
Once installed, you'll need the IP or DNS of the Ingress Controller. You can retrieve it by running `kubectl get services <ingress service name>`. It should look something like this:

```shell
kubectl --namespace kubeshark-ingress get services
NAME                                                   TYPE           CLUSTER-IP      EXTERNAL-IP                                                             PORT(S)                      AGE
kubeshark-ingress-ingress-nginx-controller             LoadBalancer   10.100.80.51    af5dde9619d1a44dfb01109571266776-16181046.us-east-2.elb.amazonaws.com   80:30550/TCP,443:30859/TCP   74m
kubeshark-ingress-ingress-nginx-controller-admission   ClusterIP      10.100.159.17   <none>                                                                  443/TCP                      74m
```

Copy the Ingress' external IP and use it in the `tap.ingress.host` field.