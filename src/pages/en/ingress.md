---
title: Ingress
description: This article describes how to self host Kubeshark using Ingress.
layout: ../../layouts/MainLayout.astro
---

Compared to [port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) or Kubernetes proxy, [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is much lighter and more stable.

## Pre-requisites

It's important to understand that [Kubeshark](https://kubeshark.com) uses a WebSocket connection, that isn't supported out of the box for some load balancers.

Ingress can be enabled by setting the `tap.ingress.enabled` to `true`.

For example:

```bash
helm upgrade -i kubeshark kubeshark/kubeshark --set tap.ingress.enabled=true 
```
To disable ingress, execute the following command:

```bash
helm upgrade -i kubeshark kubeshark/kubeshark --set tap.ingress.enabled=false
```

## Setting Up TLS Using Cert-manager

1. Ensure that cert-manager is installed in your Kubernetes cluster. If not, follow the cert-manager installation instructions for your environment. You are going to need an Issuer or Cluster Issuer in your cluster.

2. Open your customized `values.yaml` file and locate the `tap.ingress.tls` section.

3. Add the configuration to enable TLS and set the name of the secret that will contain the TLS certificate, along with the necessary annotations:

```yaml
tap:
  ingress:
    annotations:
      cert-manager.io/issuer: "your-issuer-here"
      cert-manager.io/cluster-issuer: "your-cluster-issuer-here"
    tls:
      - secretName: kubeshark-tls-secret
        hosts:
          - kubeshark.local
```

Replace `"your-issuer-here"` with the name of the cert-manager Issuer or ClusterIssuer you want to use to issue the TLS certificate.

3.1. If you are using ALB with certificates, include the annotation `alb.ingress.kubernetes.io/certificate-arn` with the relative certificate to be used by the ingress.

4. Ensure that the host `kubeshark.local` is properly configured to point to your cluster's IP.

5. After saving the changes, execute the following command to apply the settings:

```bash
helm upgrade kubeshark kubeshark/kubeshark -f <path-to-custom-values.yaml>
```

## Using a Different IngressClass

1. In your customized `values.yaml` file, locate the `tap.ingress.classname` section.

2. Replace the empty value with the name of the ingress class you want to use, for example:

```yaml
tap:
  ingress:
    classname: "ingress-controller-custom"
```

3. Execute the command to apply the settings:

```bash
helm upgrade kubeshark kubeshark/kubeshark -f <path-to-custom-values.yaml>
```

Now you have successfully enabled ingress for [Kubeshark](https://kubeshark.com) via CLI, set up TLS using cert-manager, and defined a custom ingress class.

Make sure to adjust the commands and configurations according to your environment and the path to your customized `values.yaml` file.

## AWS, EKS, ALB, Ingress & TLS
> Read more how to how to use on AWS infra [here](/en/aws_ingress_auth)