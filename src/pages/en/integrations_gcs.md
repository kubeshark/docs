---
title: Upload Files to Google Cloud Storage
description: Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. GCS).
layout: ../../layouts/MainLayout.astro
---

The GCS integration provides an immutable datastore option in case you want to export files outside of the Kubernetes cluster.

You can read the [helper](/en/automation_helpers) section to learn more about the available GCS helpers.

The most common helper would be the [`vendor.gcs.put`](/en/automation_helpers#vendorgcsputbucket-string-path-string-sakeyobj-json-string) helper that uploads a file using a service account key JSON content.

## Use Specific Auth Credentials
```js
vendor.gcs.put(
  env.GCS_BUCKET,
  tarFile,
  JSON.parse(env.GCS_SA_KEY_JSON)
);
```

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