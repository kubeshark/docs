---
title: Use a Webhook
description:  A webhook integration enables uploading anything to anywhere as long as webhooks are supported.
layout: ../../layouts/MainLayout.astro
---
> Use of this integration requires Pro license.

A webhook helper enables uploading anything to anywhere as long as webhooks are supported. It does an HTTP request to the WebHook (the HTTP endpoint) that’s defined by HTTP method and URL in the url argument with the HTTP body as the string in the body argument.

The following example calls a webhook for each health check:
```bash
function onItemCaptured(data) {
  console.log(data.request.path);
  if (data.request.path === "/health")
    vendor.webhook("POST", env.WEBHOOK_URL, data);
}
```

> You can read more about the Webhook helper in the [Scripting API Reference](/en/scripting_api_reference) section.