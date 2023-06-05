---
title: Ingress & Authentication 
description: This article describes how to self host Kubeshark using Ingress and an IDP.
layout: ../../layouts/MainLayout.astro
---

> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

**Kubeshark** provides a method for self-hosting as an authenticated web service that enables team members to access **Kubeshark** using a web browser with their corporate identities.

## Pre-requisites

### A Pro License
Ingress is a Pro feature and requires a Pro license. Kubeshark Pro edition is in beta and while in beta, it's free. To upgrade, simply run:
```shell
kubeshark pro
```
And follow the on-screen instructions.

### Ingress Controller
Your cluster needs to have an ingress controller such as Nginx deployed. If you don't have one already in your cluster, you can install it like this:
```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install kubeshark-ingress ingress-nginx/ingress-nginx --namespace kubeshark-ingress --create-namespace
```
Once installed, you'll need the IP or DNS of the Ingress Controller. You can get it by using `kubectl get services <ingress service name>`. Should look something like this:
```shell
kubectl --namespace kubeshark-ingress get services
NAME                                                   TYPE           CLUSTER-IP      EXTERNAL-IP                                                             PORT(S)                      AGE
kubeshark-ingress-ingress-nginx-controller             LoadBalancer   10.100.80.51    af5dde9619d1a44dfb01109571266776-16181046.us-east-2.elb.amazonaws.com   80:30550/TCP,443:30859/TCP   74m
kubeshark-ingress-ingress-nginx-controller-admission   ClusterIP      10.100.159.17   <none>                                                                  443/TCP                      74m
```
Note down the Ingress Controller external IP, you'll use it soon.

## Required Configuration Block

To activate the Ingress feature, change the following fields in the `ingress` block under the `tap` config:
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