---
title:  AWS EKS, ALB with TLS Termination
description: This article describes how to self host Kubeshark using Ingress and an IDP.
layout: ../../layouts/MainLayout.astro
---

If you're using an AWS Application Load Balancer (ALB) as the Ingress Controller, there are specific considerations and adjustments you need to make in your environment and configuration. Below, I'll outline the key steps:

## Install and Configure AWS ALB Ingress Controller

1. Ensure you have a Kubernetes cluster running on AWS.

2. Install the AWS ALB Ingress Controller by following the instructions provided in the [official documentation](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html).

**2.1.** Another useful documentation can be found in [ArtifactHub](https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller).

3. Verify that the ALB controller is up and running and connected to your cluster.

## Adjust Ingress Configuration

1. Set the ingress class for the AWS ALB. In your configuration file, change the ingress class configuration to point to the ALB controller:

```yaml
tap:
  ingress:
    annotations: {}
    classname: "alb"
```

Some annotations should be required to properly make the ingress available. Should be something like this:

```yaml
tap:
  ingress:
    annotations:
      alb.ingress.kubernetes.io/target-type: ip
      alb.ingress.kubernetes.io/scheme: internet-facing
```

## TLS Termination on AWS ALB

1. To enable TLS using an AWS-managed certificate, you can configure the TLS section in your configuration file. Ensure that the domain configured in the `hosts` matches the domain associated with your ALB in AWS:

```yaml
tap:
  ingress:
    tls:
      - secretName: kubeshark-tls-secret
        hosts:
          - kubeshark.local
```

Another way to do so is to include the certificate's ARN in the ingress' annotation, so the certificate will be injected by the load balancer automatically:

```yaml
tap:
  ingress:
    annotations:
      alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:<region>:<acc>:certificate/XXXXXXXXXXXXXXX
    classname: "alb"
```

## Install Kubeshark with Adjusted Configuration

1. Install [Kubeshark](https://kubeshark.com) using the adjusted Helm Chart for the AWS ALB. Use the following command:

```bash
helm install kubeshark kubeshark/kubeshark -f <path-to-custom-values.yaml>
```

Be sure to adjust `<path-to-custom-values.yaml>` to the actual path of your custom configuration file.

## DNS and Security Group Considerations

1. Ensure the domain you're using in the ingress (e.g., `kubeshark.local`) is pointing to the ALB's DNS in AWS.

2. Review the ALB's Security Group settings to ensure the required ports are open for the appropriate traffic.

Remember to refer to the official AWS ALB Ingress Controller documentation and AWS documentation for more detailed and up-to-date guidance, as details may change based on current versions and features.

## Further notes

When using the AWS ALB Ingress Controller, you typically don't need to add annotations directly to your Ingress resources for basic functionality. However, there are scenarios where you might want to use annotations to configure specific behaviors or features related to the ALB. Here are some common scenarios where annotations might be useful:

1. **SSL Policy**: You can use the `alb.ingress.kubernetes.io/ssl-policy` annotation to specify the SSL policy for your ALB listener. This can control the supported SSL/TLS protocols and ciphers.

2. **Target Group Attributes**: Annotations like `alb.ingress.kubernetes.io/target-group-attributes` can be used to define specific target group attributes, like stickiness or slow start settings.

3. **Health Checks**: Annotations like `alb.ingress.kubernetes.io/healthcheck-*` can be used to configure health checks for your target groups.

4. **Authentication**: For scenarios requiring AWS Cognito or other authentication mechanisms, you might need to use annotations to set up authentication.

5. **Rules Priority**: If you have multiple Ingress resources and you want to control the priority of the rules, you can use `alb.ingress.kubernetes.io/conditions` annotation.

Remember that annotations are controller-specific, and their usage might change with different versions of the ALB Ingress Controller. Always consult the official documentation for the most up-to-date information regarding annotations and their usage with the AWS ALB Ingress Controller.