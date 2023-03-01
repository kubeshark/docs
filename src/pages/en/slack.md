---
title: Working with Slack
description: Send alerts to Slack
layout: ../../layouts/MainLayout.astro
mascot:
---

Use the [Slack helper](/en/scripting_reference#vendorslacktoken-string-channelid-string-pretext-string-text-string-color-string) to send message to Slack.


### `vendor.slack(token: string, channelID: string, pretext: string, text: string, color: string)`

> (!) This helper requires a Pro license.

Sends a Slack message to the Slack channel in `channelID` argument using the provided access token in `token` argument.
It's especially useful for **alerting** a group of developers about **an issue detected through the network traffic**, such as
*HTTP 500 response status code:*

##### Example:

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(
      SLACK_AUTH_TOKEN,
      SLACK_CHANNEL_ID,
      "Server-side Error",
      JSON.stringify(data),
      "#ff0000"
    );
}
```