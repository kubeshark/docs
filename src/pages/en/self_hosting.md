---
title: Ingress & Authentication 
description: This article describes how to self host Kubeshark using Ingress and an IDP.
layout: ../../layouts/MainLayout.astro
---

> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

**Kubeshark** provides a method for self-hosting as an authenticated web service that allows team members to access **Kubeshark** using a web browser with their corporate identities.

## Benefits

### Performance & Stability
Compared to port-forward or Kubernetes proxy, Ingress is much lighter and more stable.

### Security
When self-hosted as a web service, developers and security engineers can access **Kubeshark** remotely using a browser, authenticated with their corporate ID, without requiring kubectl permissions.

## Pre-requisites

### Ingress Controller

Your cluster needs to have an ingress controller such as Nginx deployed. If you don't already have one in your cluster, you can install it by following these steps:

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