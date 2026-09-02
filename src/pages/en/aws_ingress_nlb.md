---
title:  AWS EKS, NLB with TLS Termination
description: This article describes how to self host Kubeshark on EKS behind an AWS Network Load Balancer with TLS termination.
layout: ../../layouts/MainLayout.astro
---

We recommend using AWS [NLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html) on EKS for best results. Classic and Application Load-balancers ([CLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/introduction.html) and [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)) aren't likely to work. Follow these steps to self host [Kubeshark](https://kubeshark.com) on EKS, using an AWS Load Balancer Controller and an Ingress controller with TLS termination.

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
  --attach-policy-arn=arn:aws:iam::<aws-account-id>:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve \
  --region=<aws-region>
```

With the IAM policy and role, you can use Helm to install the AWS Load Balancer Controller:

```shell
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks

helm install kubeshark-ingress eks/aws-load-balancer-controller  -n <aws-loadbalancer-namespace> \
--set clusterName=<eks-cluster-name> \
--set serviceAccount.create=false \
--set serviceAccount.name=aws-load-balancer-controller \
--set region=<aws-region> \
--set vpcId=<eks-cluster-vpc-id> \
--set logLevel=info \
--set replicaCount=1 \
--set cluster.dnsDomain=<fqdn-for-the-ssl-domain>
```
When you're done, verify all was installed correctly:

```shell
kubectl get deployment -n <aws-loadbalancer-namespace> aws-load-balancer-controller
```

Results should resemble this output:

```shell
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   1/1     1            1           40m
```
#### Installing the Nginx Ingress Resource and Controller of Type NLB

This manifest has to be edited before it is applied — it carries placeholder values for your certificate and VPC — so download it first rather than applying it straight from the URL:

```shell
curl -O https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/nlb-with-tls-termination/deploy.yaml
```

Open `deploy.yaml` in an editor and set the following annotations on the controller Service:

```shell
service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:<aws-region>:<aws-account-id>:certificate/<certificate-id>
service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
service.beta.kubernetes.io/aws-load-balancer-type: "external"
service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "instance"
service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
```

The `aws-load-balancer-ssl-cert` value must be the ARN of your own AWS Certificate Manager (ACM) certificate:

```shell
service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:<aws-region>:<aws-account-id>:certificate/<certificate-id>
```

Then find this line in the ConfigMap and replace it with the EKS cluster's VPC CIDR:

```shell
proxy-real-ip-cidr: XXX.XXX.XXX.XXX/XX
```

Deploy the edited manifest:

```shell
kubectl apply -f deploy.yaml
```

Then point Kubeshark's Ingress at the controller — see [Ingress](/en/ingress) for the `tap.ingress.*` values.

#### Troubleshooting

Use [this document](https://repost.aws/knowledge-center/load-balancer-troubleshoot-creating) to troubleshoot.
