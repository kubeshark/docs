---
title: Send JSON Documents (Logs) to Elasticsearch
description: Kubeshark can be integrated with Elasticsearch to permanently store and search traffic logs.
layout: ../../layouts/MainLayout.astro
---

> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

**Kubeshark** enables you to send schema-free JSON documents directly to any [Elasticsearch](https://en.wikipedia.org/wiki/Elasticsearch) local instance or cloud-hosted solution using the Elastic helper.

The following example utilizes the [`onItemCaptured`](/en/automation_hooks#onitemcaptureddata-object) hook and calls [`vendor.elastic`](/en/automation_helpers#vendorelasticurl-string-index-string-data-object-username-string-password-string-cloudid-string-apikey-string-servicetoken-string-certificatefingerprint-string) helper to send a JSON document information related to the dissected protocol message whenever a 500 response code is returned.

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.elastic(
        "",                     // URL is ignored for Elastic Cloud
        "my-index-name",
        data,                   // Payload
        "",                     // Username is ignored for Elastic Cloud
        "",                     // Password is ignored for Elastic Cloud
        env.ELASTIC_CLOUD_ID,
        env.ELASTIC_API_KEY
    );
}
```

The data is inserted into the index `my-index-name` and can be seen in the Elastic Cloud dashboard:

![Elastic](/elastic.png)

