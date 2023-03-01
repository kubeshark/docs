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
**Kubeshark** uses **Slack Incoming Webhook**s to send Slack alerts. You can read more about the procedure [here](https://api.slack.com/messaging/webhooks).
Slack provides an easy way to create a Slack App that enables maximum flexibility and customization.

There are two ways to post messages to Slack:
1. With an incoming Webhook URL
For example:
```bash
vendor.webhook("POST", SLACK_WEBHOOK_URL, JSON.stringify({text: "This is an Alert!"}));
```
2. Using an auth token and a channel ID
For example:
```bash
vendor.slack(SLACK_AUTH_TOKEN, SLACK_CHANNEL_ID, "Server-side Error", JSON.stringify(data), "#ff0000");
```
You may already have the required properties and know how to use them. If not, see below for an explanation how to create a simple Slack App and retrieve these properties.

## Creating the Slack App
There are a couple of ways to create a Slack Apps. It shouldn't take more than 5 minutes.

Start [here](https://api.slack.com/apps) and press the **Create New App** button to create a Slack app (Bot).

![Create Slack App](/slack-create-app.png)

To make it easy we provided short manifest that is sufficient for **Kubeshark** to send messages to a Slack channel.

Choose to create an App from a Manifest.

![From a Manifest](/slack-manifest.png)

Select your workspace

![Select your workspace](/slack-workspace.png)

Copy the manifest from below and paste to the Slack Manifest window. Be sure to choose the YAML tab.

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

Install the App to your workspace.

![Install the App to your workspace](/slack-install-app.png)

The easiest way to get going is to hop over to the **Incoming Webhooks** section and retrieve the **Incoming Webhook URL**.  

![Webhook URL](/slack-webhook.png)

If you choose to use the second method that require the Slack Auth Token and the Channel ID, hop over to the **OAuth & Permissions** section to retrieve your Slack Auth Token.

![Retrieve your Slack Auth Token](/slack-auth-token.png)

To retrieve the Channel ID, go to the channel in your Slack application. Use the down arrow near the channel name to find and copy the Channel ID.
![Channel Details](/slack-channel-details.png)
![Channel ID](/slack-channel-ID.png)

The last operation is to invite **Kubeshark** to the channel by writing `@Kubeshark` in the channel prompt
![Invite to Channel ID](/slack-invite-channel.png)