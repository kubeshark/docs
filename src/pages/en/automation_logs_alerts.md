---
title: Logs & Alerts
description: Kubeshark provides ample of ways to send log messages and alerts.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides ample ways to send log messages and alerts, some are inherent and some require integrations:

- Console log and error messages
- Dashboard alerts
- Slack alerts
- Send log messages to Elasticsearch
- Use a webhook to send anything anywhere

## Console Log & Error Messages

The [`console.log`](/en/automation_helpers#consolelogargs-string) helper enables writing log messages that can be read using the `kubeshark console` CLI command.
The [`console.error`](/en/automation_helpers#consoleerrorargs-string) sends a message to [`stderr`](https://linux.die.net/man/3/stderr).

This script example calculates and sends telemetry information once per minute.

```js
var packetCount = 0;
var totalKB = 0;

function onPacketCaptured(info) {
  packetCount++;
  totalKB += info.length / 1000;
}

function logPacketCountTotalBytes() {
  if (packetCount === 0) {
    console.error("Received no packets.");
  }

  console.log("Captured packet count per minute:", packetCount);
  packetCount = 0;
  console.log("Total KB captured per minute:", totalKB);
  totalKB = 0;
}

jobs.schedule("log-packet-count-total-bytes", "0 */1 * * * *", logPacketCountTotalBytes);
```

When used in conjunctions with `kubeshark console` you can expect the following console log output:

![Console Log](/console-log-1.png)

Redirecting the command's output to STDOUT will redirect only the results of [`console.log`](/en/automation_helpers#consolelogargs-string) and omit error messages that were sent to [`stderr`](https://linux.die.net/man/3/stderr).

The following CLI command redirects the console log output to a file.

```shell
kubeshark console > /tmp/log.txt
```

## Dashboard Alerts

The **Kubeshark** dashboard can show alerts using the [`test.pass`](/en/automation_helpers#testpassdata-object-object) and [`test.fail`](/en/automation_helpers#testfaildata-object-object) helpers. The [`test.pass`](/en/automation_helpers#testpassdata-object-object) will color a traffic entry **green**, where the [`test.fail`](/en/automation_helpers#testfaildata-object-object) helper will color the traffic entry **red**. You can for example; call these helpers through a JavaScript conditional statements that acts as the test criteria:

```js
function onItemQueried(data) {
  if (data.protocol.name == "http")
    return test.pass(data);
  else
    return test.fail(data);
}
```
The results look like this:

![Dashboard Alerts](/web-ui-alerts.png)

> Read more about the `test.*` helpers in the [helpers](/en/automation_helpers) section.

## Slack Alerts

Use the Slack helper to send Slack alerts.

> Read more in the [Slack integration](/en/integrations_slack) section.

## Send Logs to Elasticsearch

Use the Elasticsearch helper to send schema-free JSON documents to Elasticsearch.

> Read more in the [Elastic integration](/en/integrations_elastic) section.

## Webhooks

The Webhook helper enables you to send any payload anywhere that supports a webhooks.

> Read more in the [Webhook integration](/en/integrations_webhook) section.
