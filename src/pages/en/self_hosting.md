---
title: Self Hosting
description: This article describes how to install Kubeshark at the company level and allow others to view its content via the web and without kubectl permissions.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides a method for self-hosting as an authenticated web service that enables team members to access Kubeshark using a web browser with their corporate identity.

 method  to gain access to its dashboard using an ingress controller that is also connected to an identity system. This method delivers certain advantages compared to the inherent proxy/prot-forward solution. An Ingress Controller communicates via HTTP and not by opening a tunnel. THe Ingress method is long lasting as opposed to the proxy one that needs restarting every so often.


## Pre-requisites


### A Pro License
INgress is a Pro feature and require a Pro license. Kubeshark Pro edition is in beta and while in beta, it's free. To upgrade, simply run:
```shell
kubeshark pro
```
And follow the on-screen instructions

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

two methods to gain access to its dashboard:
- K8s proxy
- Ingress controller + authentication (a pro edition option)

When using the CLI, KUbeshark opens a K8s proxy to provide access to its dashboard. That's the quickest way to access the dashboard, however it requires:

Kubeshark offers a way to access its dashboard
Deploy an INgress Controller 

