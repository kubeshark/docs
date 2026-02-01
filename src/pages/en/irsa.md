---
title: IRSA
description: Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3).
layout: ../../layouts/MainLayout.astro
---

## EKS and IRSA 

***** **IRSA does not work when deploying [Kubeshark](https://kubeshark.com) to the `default` namespace** *****

[IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) is a method for not using specific credentials but rather use a role associated with a service account.
Prerequisite to using this method is completing with the list of steps described in [this article](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html). Specifically having:
1. A role
2. A policy
3. A trust relationship

### Annotating the Kubeshark Service Account
The IRSA method works by providing an annotation to the service account that is associated with the pod that is performing the AWS operations.
**In our case:** (FYI only, nothing to do here)
- Service Account: kubeshark-service-account 
- Pod: [Kubeshark](https://kubeshark.com) Worker 

To use IRSA, you'd need to:
1. Provide annotation of the IAM role
2. Use shared configuration

To provide the annotation, append the following line to either the CLI's `tap` or the Helm command:

```shell
--set-json 'tap.annotations={"eks.amazonaws.com/role-arn":"arn:aws:iam::7456....3350:role/s3-role"}'
```
You can also populate the config element in `~/.kubeshark/config.yaml` when using the CLI.

### Helm Command

```shell
helm install kubeshark kubeshark/kubeshark -n kubeshark --create-namespace \
--create-namespace \
--set license=<your-license-here> \
--set-json 'scripting.env={"AWS_ACCESS_KEY_ID":"<key-id-if-you-have-one>", "AWS_SECRET_ACCESS_KEY": "<key-if-you-have-one>", "AWS_REGION":"us-east-2", "S3_BUCKET":"demo-kubeshark-b"}' \
--set-json 'tap.annotations={"eks.amazonaws.com/role-arn":"arn:aws:iam::74.....50:role/s3-role"}' \
--set tap.ingress.enabled=true \
--set tap.ingress.host=demo.kubeshark.io \
--set "tap.ingress.auth.approveddomains={kubeshark.comm}" \
--set tap.release.namespace=kubeshark \
--set tap.resources.worker.limits.memory=2Gi
```

* The above includes optional value that can come handy.
