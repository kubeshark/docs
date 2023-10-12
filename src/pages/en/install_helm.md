---
title: Install with Helm
description: Install and run Kubeshark inside your Kubernetes cluster in seconds.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

While the [CLI](/en/install) is a great option for on-demand usage and running on dev & test clusters, for a more permanent deployment, you can use [Helm](https://helm.sh/) and add **Kubeshark**'s Helm repository:

```shell
helm repo add kubeshark https://helm.kubeshark.co
```
Once the repository was added you can install **Kubeshark**:
```shell 
helm install kubeshark kubeshark/kubeshark
```

An example for a somewhat complicated Helm command:

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

Another popular option:

```shell
helm install kubeshark kubeshark/kubeshark -n kubeshark -f ~/.kubeshark/config.yaml
```

## Uninstall

To uninstall the Helm chart:
```shell
helm uninstall kubeshark -n <release-namespace>
```

## Change the Default Deployment Namespace

By default **Kubeshark** installs in the `default` namespace. Use the following methods to change:

```shell
helm install kubeshark kubeshark/kubeshark -n <unique-name-space> --create-namespace \
--set tap.release.namespace=<unique-name-space>
```

To uninstall:
```shell
helm uninstall kubeshark -n <release-space>
kubectl delete namespace <release-space>
```

## Accessing the Dashboard

There are multiple ways to access the dashboard when installed via Helm:

### Port-forward

```shell
kubectl port-forward service/kubeshark-front 8899:80 -n <release-space>
```

### The CLI

```shell
kubectl proxy -s <release-space>
```

### Ingress
> Read more in the [Ingress](/en/ingress) section.

