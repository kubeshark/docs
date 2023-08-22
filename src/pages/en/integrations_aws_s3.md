---
title: Upload Files to AWS S3
description: Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3).
layout: ../../layouts/MainLayout.astro
---

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

> Read more about [IRSA](/en/irsa) in this article.
