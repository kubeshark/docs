---
title: Logs & Alerts
description:  Kubeshark provides ample of ways to send log messages and alerts.
layout: ../../layouts/MainLayout.astro
---
**Kubeshark** provides ample ways to send log messages and alerts, some are inherent and some require integrations:
- Console log and error messages
- Web UI alerts
- Slack alerts
- Send log messages to Elasticsearch
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

## Send logs to Elasticsearch

Use the Elasticsearch helper to send schema-free JSON documents to Elasticsearch.

> Read more in the [Elastic integration](/en/integrations_elastic) section. 

## Webhooks

The Webhook helper enables you to send any payload anywhere that supports a webhooks.

> Read more in the [Webhook integration](/en/integrations_webhook) section. 
