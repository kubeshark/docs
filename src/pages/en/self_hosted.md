---
title: Self Hosting with Ingress, TLS and Auth
description: This article describes how to self host Kubeshark using Ingress and an IDP.
layout: ../../layouts/MainLayout.astro
---

> Self-hosted feature is part of the [Pro edition](https://kubeshark.co/pricing).

**Kubeshark** provides a method for self-hosting as a secure, authenticated web service that allows team members to access **Kubeshark** using a web browser with their corporate identities from remote. The self-hosted service includes Ingress, TLS termination and Authentication.

## Benefits

### Security

When self-hosted as a web service, developers and security engineers can access **Kubeshark** remotely using a browser, authenticated with their corporate ID, without requiring RBAC / kubectl permissions.

### Performance & Stability

Compared to [port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) or Kubernetes proxy, [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is much lighter and more stable.

## Pre-requisites

### Ingress Controller

Your cluster needs to have an ingress controller such as [Nginx](https://www.nginx.com/products/nginx-ingress-controller/) deployed. If you don't already have one in your cluster, you can install it by following one of the examples at the end of this article.

## Kubeshark Ingress Configuration

### Ingress Config Values

```shell
tap:
  ingress:
    enabled: false
    classname: kubeshark-ingress-class
    controller: k8s.io/ingress-nginx
    host: ks.svc.cluster.local
    tls: []
    auth:
      approveddomains: 
      - '<corporate domain name>'
    certmanager: letsencrypt-prod
```

- To enable ingress set `tap.ingress.enabled` to `true`.
- Use the `tap.ingress.classname` and `tap.ingress.controller` when necessary for a more granular control.
- **host:** the IP/LB of the Ingress. You made a note earlier for that.
- **approveddomains:** a list of approved domain names for email address to log in to Kubeshark. For example, if you use: `gmail.com` only gmail addresses will be able to log in. We recommend using this option as a temporary mean until you integrate SSO/SAML.

#### Approved Domains

You can set the approved domains in Kubeshark's config file. Any login email with a domain that is not in the approved domains list will be rejected.

#### Examples

Here's an example of a cluster I'm using:
```shell
  ingress:
    enabled: true
    host: demo.kubeshark.co
    auth:
      approveddomains: 
      - 'kubeshark.co'
```
When using a Helm chart, the following values should be used during installation:
```shell
--set tap.ingress.enabled=true \
--set tap.ingress.host=<Ingress IP/LB> \
--set "tap.ingress.auth.approveddomains={<corporate domain name>}" \
```

### SAML / SSO
You can connect **Kubeshark** to your corporate IDP. Please reach out to us to configure **Kubeshark** to use your corporate IDP.

## TL;DR - Deploying Ingress Examples

### Nginx Ingress On Kubernetes, No TLS

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

### AWS EKS with TLS Termination

We recommend using AWS [NLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html) on EKS for best results. Classic and Application Load-balancers ([CLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/introduction.html) and [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)) aren't likely to work. Follow these steps to self host Kubeshark on EKS, using and AWS Load Balancer, Ingress Controller with TLS termination.

1. Install the AWS LoadBalancer Controller Add-on
2. Install the Nginx Ingress resource and controller of type NLB

#### Installing the AWS LoadBalancer Controller Add-on

1. Create an IAM policy
2. Create an IAM role.
3. Install the AWS Load Balancer Controller.
4. Check everything was installed correctly.

Follow the steps in this [article](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) to install the AWS LB Controller add-on.

Download an IAM policy for the AWS Load Balancer Controller that allows it to make calls to AWS APIs on your behalf. Once downloaded, use the AWS CLI to create an IAM policy:

```shell
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.7/docs/install/iam_policy.json

aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
```

Now use `eksctl` to create an IAM role:

```shell
eksctl create iamserviceaccount \
  --cluster=<eks-cluster-name> \
  --namespace=<aws-loadbalancer-namespace> \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::78......10:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve \
  --region us-east-2-this-is-an-example
```

With the IAM policy and role, you can use Helm to install the AWS Load Balancer Controller:

```shell
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks

helm install kubeshark-ingress eks/aws-load-balancer-controller  -n <aws-loadbalancer-namespace> \
--set clusterName=<eks-cluster-name> \
--set serviceAccount.create=false \
--set serviceAccount.name=aws-load-balancer-controller \
--set region=us-east-2-this-is-an-example \
--set vpcId=<eks-cluster-vpx-id \
--set logLevel=info \
--set replicaCount=1 \
--set cluster.dnsDomain=<fqdn for the SSL domain>
```
When you're done, verify all was installed correctly:

```shell
kubectl get deployment -n <aws-loadbalancer-namespace> aws-load-balancer-controller
```

Results should resemble this output:

```shell
NAME                                             READY   UP-TO-DATE   AVAILABLE   AGE
<aws-loadbalancer-namespace>-aws-load-balancer-controller   1/1     1            1           40m
```
#### Installing the Nginx Ingress Resource and Controller of Type NLB

Firstly, add the Ingress resource:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/nlb-with-tls-termination/deploy.yaml
```

Now download the file:

```shell
curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/nlb-with-tls-termination/deploy.yaml
```

Once downloaded, open in an editor and replace the following annotations:

```shell
service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-2:71.......90:certificate/73......7
service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
service.beta.kubernetes.io/aws-load-balancer-type: "external"
service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "instance"
service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
```

Make sure you change the AWS Certificate Manager (ACM) ID as well:

```shell
service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-2:71.......90:certificate/73......7
```

Find this line and replace with the EKS cluster's VPC CIDR:

```shell
proxy-real-ip-cidr: XXX.XXX.XXX/XX
```

Deploy the edited manifest:

```shell
kubectl apply -f deploy.yaml
```

#### Troubleshooting

Use [this document](https://repost.aws/knowledge-center/load-balancer-troubleshoot-creating) to troubleshoot.
