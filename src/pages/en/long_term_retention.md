---
title: Long-Term Retention
description: 
layout: ../../layouts/MainLayout.astro
---
Recordings' content can be automatically uploaded to an immutable data store for long-term retention. Data may be stored in either Amazon S3 or Google Cloud Storage (GCS). Uploads can be triggered automatically at the end of a recording or on-demand at the user's discretion.

To enable either automatic or on-demand uploads, simply add the appropriate credentials. Once the proper credentials are in place, the recording content will be uploaded either when the recording ends or at the end of each recording window.

## Triggering an Upload On-demand
Users can utilize the Jobs dashboard to initiate an on-demand upload of the tar files. Simply press the `Run All Jobs` button to tar and upload all accumulated content.
![Run All Jobs](/s3-jobs.jpg)

## Hourly Upload
By default, content is uploaded hourly and at the end of the recording window.

## Content in the Bucket

Within the bucket, you can expect a folder per node, where each folder contains a tar file for each recording upload, following this pattern:

`<node>/<recording-name>_kubeshark_<timestamp>.gz.tar`

For example:
![image](/s3-nodes.jpg)
![image](/s3-gzs.jpg)

## Use Specific Auth Credentials

- **S3_BUCKET**: The name of the S3 bucket
- **AWS_REGION**: The region where the bucket resides
- **AWS_ACCESS_KEY_ID**: AWS Access Key
- **AWS_SECRET_ACCESS_KEY**: AWS Secret Access Key

> Learn more about the required AWS credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

### Configuration Example

```shell
scripting:
  env:
    S3_BUCKET:               <bucket-name>
    AWS_REGION:              <bucket-region>
    AWS_ACCESS_KEY_ID:       AK..4Z
    AWS_SECRET_ACCESS_KEY:   K..r
```

## AWS S3 IRSA or Kube2IAM

In scenarios using shared authentication (e.g., IRSA, kube2iam), the S3 helper will utilize the default authentication method and will not require specific AWS Auth credentials. In these cases, the required credentials include:

- **S3_BUCKET**: The name of the S3 bucket
- **AWS_REGION**: The region where the bucket resides

> Read more about [IRSA](/en/irsa) in this article.

## GCS

- **GCS_BUCKET**: GCS Bucket
- **GCS_SA_KEY_JSON**: GCS Key JSON

### Configuration Example

In either `config.yaml` or `values.yaml`, the environment variable should look something like this:
```shell
scripting:
  env:
    GCS_BUCKET: <bucket-name>
    GCS_SA_KEY_JSON : '{
  "type": "service_account",
  "project_id": <project-id>,
  "private_key_id": "14a....81",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0.....HBJsfVHn\nRvUJH6Yxdzv3rtDAYZxgNB0=\n-----END PRIVATE KEY-----\n",
  "client_email": "k..om",
  "client_id": "104..72",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/k...nt.com",
  "universe_domain": "googleapis.com"
}'
```