---
title: Console Log
description:  The easiest way to export telemetry data outside of Kubeshark and then to redirect it elsewhere.
layout: ../../layouts/MainLayout.astro
---
You can export log messages outside of **Kubeshark** by using the `console.log` helper. In conjunction with the `kubeshark console` CLI command, you can access the log messages, read them or redirect them to a file or a logs provider.

**Kubeshark** provides two helpers to send messages to STDOUT and STDERR.
`console.log` sends a message to STDOUT and `console.error` sends a message to STDERR.

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
