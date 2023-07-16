---
title: Upload Files to AWS S3
description: Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3).
layout: ../../layouts/MainLayout.astro
---
> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

The AWS S3 integration provides an immutable datastore option in case you want to export files outside of the K8s cluster.

You can read the [helper](/en/automation_helpers) section to learn more about the available AWS S3 helpers.

The most common helper would be the [`vendor.s3.put`](/en/automation_helpers#vendors3putregion-string-keyid-string-accesskey-string-bucket-string-path-string-string) helper that uploads a file using the provided credentials.

## Use Specific Auth Credentials
```js
vendor.s3.put(
  env.S3_BUCKET,
  tarFile,
  env.AWS_REGION,
  env.AWS_ACCESS_KEY_ID,
  env.AWS_SECRET_ACCESS_KEY
);
```

> Read more about the required AWS credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

## Shared Auth 

In cases, when shared authentication is used (e.g. IRSA, kube2iam), S3 helper will use the default authentication and not require specific AWS Auth credentials.

```js
vendor.s3.put(
  env.S3_BUCKET,
  tarFile,
  env.AWS_REGION
);
```
## EKS and IRSA 

***** **IRSA does not work when deploying Kubeshark to the `default` namespace** *****

[IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) is a method for not using specific credentials but rather use a role associated with a service account.
Prerequisite to using this method is completing with the list of steps described in [this article](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html). Specifically having:
1. A role
2. A policy
3. A trust relationship

### Annotating the Kubeshark Service Account
The IRSA method works by providing an annotation to the service account that is associated with the pod that is performing the AWS operations.
**In our case:** (FYI only, nothing to do here)
- Service Account: kubeshark-service-account 
- Pod: Kubeshark Worker 

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
--set "tap.ingress.auth.approveddomains={kubeshark.co}" \
--set tap.release.namespace=kubeshark \
--set tap.resources.worker.limits.memory=2Gi
```

* The above includes optional value that can come handy.

### Using the Scripts and Console Command

Scripts operation require use of the CLI. First get your Pro edition license, by running:
```shell
kubeshark pro
```
Pro edition is in beta and free of charge while in beta.

Use the `scripts` command to monitor a scripting folder and upload scripts to Hub when a change is detected:

One way to upload scripts to Kubeshark when using the Helm command is by using the `scripts` CLI command:
```shell
kubeshark scripts --set scripting.source=/path/to/scripts/folder --set license=<your-license-here> --set tap.release.namespace=kubeshark
```
* The various configuration values aren't nessesary when using a config file.

Use the `console` command to view the logs emmited from the running scripts:

```shell
kubeshark console
```

* At this time, [this bug](https://github.com/kubeshark/kubeshark/issues/1379) is preventing the `console` command from functioning.


