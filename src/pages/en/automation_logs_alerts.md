---
title: Logs & Alerts
description:  Kubeshark provides ample of ways to send log messages and alerts.
layout: ../../layouts/MainLayout.astro
---
**Kubeshark** provides ample ways to send log messages and alerts, some are inherent and some require integrations:
- Console log and error messages
- Web UI alerts
- Slack alerts
- Send log messages to Elastic and other log stash
- Use a webhook to send anything anywhere

## Console Log & Error Messages

The `console.log` helper enables writing log messages that can be read using the `kubeshark console` CLI command. 
The `console.error` sends a message to STDERR.

This script example calculates and sends telemetry information once per minute.

```js
var packetCount = 0;
var totalKB = 0;

function onPacketCaptured(info) {
  packetCount++;
  totalKB += info.length / 1000;
}

function logPacketCountTotalBytes() {
  console.log("Captured packet count per minute:", packetCount);
  console.error("This is sent using console.error"); // just to demo console.error
  packetCount = 0;
  console.log("Total KB captured per minute:", totalKB);
  totalKB = 0;
}

jobs.schedule("log-packet-count-total-bytes", "0 */1 * * * *", logPacketCountTotalBytes);
```

When used in conjunctions with `kubeshark console` you can expect the following console log output:

![Console Log](/console-log-1.png)

Redirecting the command's output to STDOUT will redirect only rhe results of `console.log` and omit error messages that were sent to STDERR.

The following CLI command redirects the console log output to a file.

```bash
kubeshark console > /tmp/log.txt
```

The content of the file will not include ony of the messages sent to `console.error`:

```bash
[mizu-2] Captured packet count per minute: 5177
[mizu-2] Total KB captured per minute: 1910.2869999999884
[mizu-2] Captured packet count per minute: 4726
[mizu-2] Total KB captured per minute: 2149.2850000000244
[mizu-2] Captured packet count per minute: 61
[mizu-2] Total KB captured per minute: 24.746000000000024
```

## Web UI Alerts

The **Web UI** can show alerts using the `test.pass` and `test.fail` helpers. The `test.pass` will color a traffic entry green, where the `test.fail` helper will color the traffic entry red. You can use these helpers in a script based on a programmatic decision.

Here's an example for a script that uses these helpers:

```js
function onItemQueried(data) {
  if (data.protocol.name == "http")
    return test.pass(data);
  else
    return test.fail(data);
}
```
The results look like this:

![Web UI Alerts](/web-ui-alerts.png)

> Read more about the `test.*` helpers in the [helpers](/en/automation_helpers) section.

## Slack Alerts

Use the Slack helper to send Slack alerts.

> Read more in the [Slack integration](/en/integrations_slack) section. 

## Webhooks

The Webhook helper enables you to send any payload anywhere that supports a webhooks.

> Read more in the [Webhook integration](/en/integration_webhook) section. 
