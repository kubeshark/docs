---
title: Slack Alerts
description: Kubeshark can send Slack messages to any channel with the purpose of alerting against anomalies in the Kubernetes network traffic.
layout: ../../layouts/MainLayout.astro
---

Real-time Slack alerts can be triggered when suspicious network behaviors occur. Messages can include event information and forensics (e.g. network traces - PCAPs).

<iframe width="560" height="315" src="https://www.youtube.com/embed/2psme48ygzM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The following example uses an L7 hook and the Slack helper to trigger areal-time alert to a Slack channel whenever the HTTP response status code is `500`. The alert includes a brief description and a network trace. You can invite additional team members to the Slack channel to help identify the culprit. 

```js
// Report To a Slack Channel If HTTP Response Status Code is 500 Example

function onItemCaptured(data) {
  // Check if it's an HTTP request and the response status is 500
  if (data.protocol.name === "http" && data.response.status === 500) {
    var files = {};

    // Get the path of the PCAP file that this stream belongs to
    var pcapPath = pcap.path(data.stream);
    files[data.stream + ".pcap"] = pcapPath;

    // Dump the `data` argument into a temporary JSON file
    var dataPath = file.temp("data", "", "json");
    file.write(dataPath, JSON.stringify(data, null, 2));
    files["data.json"] = dataPath;

    // Send a detailed Slack message with 2 attached files
    vendor.slackBot(
      SLACK_AUTH_TOKEN,
      SLACK_CHANNEL_ID,
      "Server-side Error in Kubernetes Cluster",                                    // Pretext
      "An HTTP request resulted with " + data.response.status + " status code:",    // Text
      "#ff0000",                                                                    // Color
      {
        "Service": data.dst.name,
        "Namespace": data.namespace,
        "Node": data.node.name,
        "HTTP method": data.request.method,
        "HTTP path": data.request.path
      },
      files
    );

    // Delete the temporary file
    file.delete(dataPath);
  }
}

```

**Kubeshark** supports two message sending methods:

1. Using an [incoming webhook](https://api.slack.com/messaging/webhooks). See [`vendor.slack`](/en/automation_helpers#vendorslackwebhookurl-string-pretext-string-text-string-color-string) helper.
2. Using an auth token and a channel ID. See [`vendor.slackBot`](/en/automation_helpers#vendorslackbottoken-string-channelid-string-pretext-string-text-string-color-string-fields-object-files-object) helper.

## Creating a Slack App

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
  description: The API Traffic Analyzer for Kubernetes
  background_color: "#1c50d4"
  long_description: Think Wireshark re-invented for K8s, Kubeshark provides deep visibility and real-time monitoring of all traffic going in, out and across containers, pods, namespaces, nodes, and clusters, elevating your ability to debug, troubleshoot, and protect your K8s clusters.
features:
  bot_user:
    display_name: Kubeshark
    always_online: true
oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
      - files:write
      - incoming-webhook
      - remote_files:share
```

Install the App to your workspace:

![Install the App to your workspace](/slack-install-app.png)

### Using an Incoming Webhooks

If you'd like to use the **Incoming Webhooks** method, hop over to the **Incoming Webhooks** section and retrieve the **Incoming Webhook URL**.

![Webhook URL](/slack-webhook.png)

That's it, you can now use the Slack helper [`vendor.slack`](/en/automation_helpers#vendorslackwebhookurl-string-pretext-string-text-string-color-string) like this:

```js
vendor.slack(
  SLACK_WEBHOOK,
  "Server-side Error",
  JSON.stringify(data),
  "#ff0000"
);
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

![Slack Channel Down Arrow](/slack-channel-down-arrow.png)

Now, copy the channel ID at the bottom of the about section.

![Slack Channel About](/slack-channel-about.png)

#### Adding Kubeshark to the Channel

Last required action is to add Kubeshark to the channel. This can be achieved by calling the Bot using `@Kubeshark`

![Slack Channel Add](/slack-adding-to-channel.png)
