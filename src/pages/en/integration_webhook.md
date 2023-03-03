---
title: Use a Webhook
description:  A webhook integration enables uploading anything to anywhere as long as webhooks are supported.
layout: ../../layouts/MainLayout.astro
---
> Use of this integration requires Pro license.

A webhook integration enables uploading anything to anywhere as long as webhooks are supported.

The following example calls a webhook for each health check:
```bash
    function onItemCaptured(data) {
  console.log(data.request.path);
  if (data.request.path === "/health")
    vendor.webhook("POST", WEBHOOK_URL, data);
}
```