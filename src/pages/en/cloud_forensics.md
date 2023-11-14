---
title: Traffic Recording & Offline Investigation
description: Record K8s traffic and perform offline investigations to hunt down performance and security issues with ease
layout: ../../layouts/MainLayout.astro
---

Traffic is captured continuously, but it is quickly discarded unless actions are taken to preserve it.

For real-time streaming, a PCAP file has a Time-To-Live (TTL) of 10 seconds, and a JSON file containing detailed information has a TTL of 5 minutes.

You can record traffic based on specific patterns and make this recorded traffic available for offline analysis.

> **Disclaimer:** We have found scripting to be an effective way to enhance Kubeshark's functionality in a transparent and flexible manner. If you need help getting started, reach out to us on [Slack](https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA), and we'll assist you promptly.

## Getting Started

You can begin by using one of the scripts from the [DFIR folder](https://github.com/kubeshark/scripts/blob/master/dfir) to start recording traffic.

> Note: While these scripts should work 'out-of-the-box', they are meant as examples.

Follow these steps to use the script:

1. Download the appropriate script to a local directory (e.g., "/path/to/a/local/scripts/folder"), based on your storage preferences (e.g., S3, IRSA, GCS).
2. The script requires several environment variables to be set.

### Example 1 - Using AWS S3 IRSA

For instance, to record traffic that matches `http` or `dns` protocols and store it in AWS S3, specify the following properties in the Kubeshark configuration file:

```shell
scripting:
  env:
    AWS_REGION: us-east-2-this-is-an-example
    S3_BUCKET: give-it-a-name
    RECORDING_KFL: "http or dns" # To deactivated remove this field.
  source: "/path/to/a/local/scripts/folder"
  watchScripts: true
```
### Example 2 - Using AWS S3

To use a full set of IAM credentials, see this example:

```shell
scripting:
  env:
    AWS_REGION: us-east-2-this-is-an-example
    S3_BUCKET: give-it-a-name
    AWS_ACCESS_KEY_ID:       <aws-access-key-id> 
    AWS_SECRET_ACCESS_KEY:   <aws-secret-access-key> 
    RECORDING_KFL: "http or dns" # To deactivated remove this field.
  source: "/path/to/a/local/scripts/folder"
  watchScripts: true
```
### Example 3 - Using Google Cloud Storage

```shell
scripting:
  env:
    GCS_BUCKET: give-it-a-name
    GCS_SA_KEY_JSON : '{
  "type": "service_account",
  "project_id": "cloud..on",
  "private_key_id": "..81",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...VHn\nRvUJH6Yxdzv3rtDAYZxgNB0=\n-----END PRIVATE KEY-----\n",
  "client_email": "k..on.iam.gserviceaccount.com",
  "client_id": "10..2",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ks-..ion.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}'
    RECORDING_KFL: http or dns
  source: "/path/to/a/local/scripts/folder"
  watchScripts: true
```

## On-demand Offline Analysis

To analyze recorded traffic stored in an AWS S3 bucket, use the following command:

```shell
kubeshark tap --pcap s3://my-bucket/
```

This command activates Kubeshark's offline mode, allowing you to investigate the contents of the S3 bucket without requiring direct access to your cluster.

The Kubeshark dashboard facilitates the visualization and exploration of recorded traffic, featuring robust filtering, search, and analysis tools. This intuitive interface streamlines navigation through the data, enhancing efficiency and reducing time and effort.

![Kubeshark Dashboard](/ks-dashboard.png)

## Deactivating Recording

To stop recording, remove the RECORDING_KFL property from the Kubeshark configuration file.


