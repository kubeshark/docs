---
title: Self-hosted
description: This article describes how to self host Kubeshark using Ingress and an IDP.
layout: ../../layouts/MainLayout.astro
---

> Self-hosted feature is part of the [Pro edition](https://kubeshark.co/pricing).

**Kubeshark** provides a method for self-hosting as an authenticated web service that allows team members to access **Kubeshark** using a web browser with their corporate identities from remote.

## Benefits

### Security
When self-hosted as a web service, developers and security engineers can access **Kubeshark** remotely using a browser, authenticated with their corporate ID, without requiring RBAC / kubectl permissions.

### Performance & Stability
Compared to [port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) or Kubernetes proxy, [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is much lighter and more stable.

## Pre-requisites

### Ingress Controller

Your cluster needs to have an ingress controller such as [Nginx](https://www.nginx.com/products/nginx-ingress-controller/) deployed. If you don't already have one in your cluster, you can install it by following these steps:

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
Make a note of the Ingress Controller's external IP; you'll need it shortly.

## SAML / SSO
You can connect **Kubeshark** to your corporate IDP. Please reach out to us to configure **Kubeshark** to use your corporate IDP.

## Approved Domains

As a temporary solution, you can set the approved domains in Kubeshark's config file. Any login email with a domain that is not in the approved domains list will be rejected.

## Required Configuration Block
To activate the Ingress feature, modify the following fields in the `ingress` block under the `tap` config:

```shell
  ingress:
    enabled: true
    host: <Ingress IP/LB>
    auth:
      approvedDomains: 
      - '<corporate domain name>'
```
- **host:** the IP/LB of the Ingress. You made a note earlier for that.
- **approvedDomains:** a list of approved domain names for email address to log in to Kubeshark. For example, if you use: `gmail.com` only gmail addresses will be able to log in. We recommend using this option as a temporary mean until you integrate SSO/SAML.

Here's an example of a cluster I'm using:
```shell
  ingress:
    enabled: true
    host: demo.kubeshark.co
    auth:
      approvedDomains: 
      - 'kubeshark.co'
```
When using a Helm chart, the following values should be used during installation:
```shell
--set tap.ingress.enabled=true \
--set tap.ingress.host=<Ingress IP/LB> \
--set "tap.ingress.auth.approvedDomains={<corporate domain name>}" \
```