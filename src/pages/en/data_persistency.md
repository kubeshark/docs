---
title: Data Persistency 
description: 
layout: ../../layouts/MainLayout.astro
---

### Storage Persistency
By default, **Kubeshark** employs ephemeral storage, as opposed to persistent storage. Consequently, all content will be lost in scenarios such as pod eviction, OOMkilled events, or any other circumstances that lead to pod restart.

While completely optional, to mitigate the risk of data loss, it is advisable to utilize persistent volume claims, thereby ensuring the use of persistent storage:
```yaml
tap:
  persistentStorage: true
  storageClass: <pvc-class>
```
Having said the above, **Kubeshark** will still record traffic the same way without persistent storage.


## Long-Term Immutable Traffic Retention

It is recommended to export recorded traffic to external data stores, such as Google Cloud Storage (GCS) or AWS S3, to store traffic for extended periods in immutable data stores.

> Read more in the [AWS S3](/en/integrations_aws_s3) and [GCS](/en/integrations_gcs) sections.