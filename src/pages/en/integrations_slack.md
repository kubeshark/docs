---
title: Slack Alerts
description:
layout: ../../layouts/MainLayout.astro
---
> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

Slack alerts can be used to notify that a certain action was completed (e.g. PCAP was generated and upload) or to provide a real-time notification of a programmatically identified network behavior.

The following example reports to a Slack Channel whenever the HTTP response status code is `500`.

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(SLACK_WEBHOOK, "Server-side Error", JSON.stringify(data), "#ff0000");
}
```

**Kubeshark** supports two message sending methods:
1. Using an `incoming webhooks`.
2. Using an auth token and a channel ID.

You can read more about the sending a Slack message using an Incoming Webhook [here](https://api.slack.com/messaging/webhooks).

## Creating the Slack App

Slack provides an easy way to create a Slack App that enables maximum flexibility and customization. This step is required for both methods.

Creating a Slack App shouldn't take more than 5 minutes.

Start [here](https://api.slack.com/apps) and press the **Create New App** button to create a Slack app (Bot):

![Create Slack App](/slack-create-app.png)

To make it easy we provided short manifest that is sufficient for **Kubeshark** to send messages to a Slack channel.

Choose to create an app from a manifest:

![From a Manifest](/slack-manifest.png)

Select your workspace:

![Select your workspace](/slack-workspace.png)

Copy the manifest from below and paste to the Slack Manifest window. Be sure to choose the YAML tab:

```yaml
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

### Using an Incoming Webhooks

If you'd like to use the **Incoming Webhooks** method, hop over to the **Incoming Webhooks** section and retrieve the **Incoming Webhook URL**.

![Webhook URL](/slack-webhook.png)

That's it, you can now use the Slack helper [`vendor.slack`](/en/scripting_api_reference#vendorslackwebhookurl-string-pretext-string-text-string-color-string) like this:

```js
vendor.slack(SLACK_WEBHOOK, "Server-side Error", JSON.stringify(data), "#ff0000");
```
As the Webhook is a confidential piece of information, we highly recommend to keep it in the **Kubeshark** configuration file.

### Using an Auth Token and a Channel ID

An alternative way to send messages requires obtaining an OAuth Token and a Channel ID which are also very easy to get.

#### Obtaining the Auth Token

To obtain the OAuth Token, go to the new Slack App page and hop over to the `OAuth & Permissions` section and copy the OAuth Token.

![Slack OAuth Token](/slack-oauth.png)

We suggest keeping the OAuth token as an [environment variables](/en/config#scripts) in the **Kubeshark** configuration file.

#### Obtaining the Channel ID 

When you have a certain channel you'd like to send message to, you can obtain its Channel ID by pressing the down arrow that is adjacent to the channel name.

![Slack Chanel Down Arrow](/slack-channel-down-arrow.png)

Now, copy the channel ID at the bottom of the about section.

![Slack Chanel About](/slack-channel-about.png)

#### Adding Kubeshark to the Channel

Last required action is to add Kubeshark to the channel. This can be achieved by calling the Bot using `@Kubeshark`

![Slack Chanel Add](/slack-adding-to-channel.png)