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
  env.AWS_SECRET_ACCESS_KEY,
);
```

## Shared Auth

```js
vendor.s3.put(
  env.S3_BUCKET,
  tarFile,
  env.AWS_REGION
);
```
## IRSA or kube2iam

#### Using IRSA or kube2iam 

[IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) is a method for not using specific credentials but rather use a role associated with a service account.
To use IRSA, you'd need to:
1. Provide annotation of the IAM role
2. Use shared configuration

For example, when using help (or CLI), add the following property:

```shell
--set-json 'tap.annotations={"eks.amazonaws.com/role-arn":"arn:aws:iam::7456....3350:role/s3-role"}'
```

> Read more about the required AWS credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

> See [`wrapper.kflPcapS3`](/en/automation_wrappers#wrapperkflpcaps3) for more info.
