---
title: Slack Alerts
description:  
layout: ../../layouts/MainLayout.astro
---
> Use of this integration requires Pro license.

Slack alerts can be used to notify that a certain action was completed (e.g. PCAP was generated and upload) or to provide a real-time notification of a programmatically identified network behavior.

The following example reports to a Slack Channel whenever the HTTP response status code is `500`.
```bash
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(SLACK_WEBHOOK, "Server-side Error", JSON.stringify(data), "#ff0000");
}
```
**Kubeshark** uses **Slack Incoming Webhooks** to send messages to your desired Slack. You can read more about the procedure [here](https://api.slack.com/messaging/webhooks).

Slack provides an easy way to create a Slack App that enables maximum flexibility and customization.

## Creating the Slack App

Creating a Slack App shouldn't take more than 5 minutes.

Start [here](https://api.slack.com/apps) and press the **Create New App** button to create a Slack app (Bot):

![Create Slack App](/slack-create-app.png)

To make it easy we provided short manifest that is sufficient for **Kubeshark** to send messages to a Slack channel.

Choose to create an app from a manifest:

![From a Manifest](/slack-manifest.png)

Select your workspace:

![Select your workspace](/slack-workspace.png)

Copy the manifest from below and paste to the Slack Manifest window. Be sure to choose the YAML tab:

```bash
display_information:
  name: Kubeshark
features:
  bot_user:
    display_name: Kubeshark
oauth_config:
  scopes:
    bot:
      - incoming-webhook
      - chat:write
```

Install the App to your workspace:

![Install the App to your workspace](/slack-install-app.png)

Hop over to the **Incoming Webhooks** section and retrieve the **Incoming Webhook URL**.

![Webhook URL](/slack-webhook.png)

That's it, you can now use the Slack helper like this:

```bash
vendor.slack(SLACK_WEBHOOK, "Server-side Error", JSON.stringify(data), "#ff0000");
```