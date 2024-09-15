---
title: Use a Webhook
description: A webhook integration enables uploading anything to anywhere as long as webhooks are supported.
layout: ../../layouts/MainLayout.astro
---

The helper [`vendor.webhook`](/en/automation_helpers#vendorwebhookmethod-string-url-string-body-string) enables uploading anything to anywhere as long as webhooks are supported. It does an HTTP request to the webhook (the HTTP endpoint) that’s defined by HTTP method and URL in the url argument with the HTTP body as the string in the body argument.

The following example calls a webhook for each health check:

```js
function onItemCaptured(data) {
  if (data.request.path === "/health")
    response = vendor.webhook(
      "POST",
      "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
      JSON.stringify(data),
      {
        "content-type": "application/json"
      }
    );
}
```

> See [`vendor.webhook`](/en/automation_helpers#vendorwebhookmethod-string-url-string-body-string) for more info.
