---
title: Upload Files to AWS S3
description:  Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3)
layout: ../../layouts/MainLayout.astro
---
> Use of this integration requires Pro license.
  
**Kubeshark** enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3). The helper that can be used to upload a file to an AWS S3 bucket looks something like this:

```bash
vendor.s3.put(
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      S3_BUCKET,
      tarFile
    );
```
Where the constants holds the required AWS S3 properties.
