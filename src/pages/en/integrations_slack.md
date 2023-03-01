---
title: Slack Alerts
description:  
layout: ../../layouts/MainLayout.astro
---
Slack alerts can be used to notify that a certain action was completed (e.g. PCAP was generated and upload) or to provide a real-time notification of a programmatically identified network behavior.

The following example reports to a Slack Channel whenever the response status code is 500.
```bash
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(SLACK_AUTH_TOKEN, SLACK_CHANNEL_ID, "Server-side Error", JSON.stringify(data), "#ff0000");
}
```
**Kubeshark** uses Slack Incoming Webhook to send Slack alerts. You can read more about the procedure [here](https://api.slack.com/messaging/webhooks).

In general you need two properties:
- SLACK_AUTH_TOKEN
- SLACK_CHANNEL_ID

You may already have these properties and know how to use them. If not, see below for an explanation how to retrieve these properties.

## Getting Slack Auth Token - DRAFT
Start [here](https://api.slack.com/apps) by creating a Slack app (Bot).
![Create Slack App](/slack-create-app.png)
Name your app and choose your workspace.
![Name your Slack App](/slack-name-app.png)
Activate incoming webhooks by pressing the toggle button, in the **incoming-webhooks** section.
![Activate Incoming Webhooks](/slack-incoming-webhooks.png)
In the same section, add a webhook.
![Slack add a webhook](/slack-add-webhook.png)

## Retrieving Channel ID
