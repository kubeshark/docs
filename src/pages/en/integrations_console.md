---
title: Console Log
description:  The easiest way to export telemetry data outside of Kubeshark and then to redirect it elsewhere.
layout: ../../layouts/MainLayout.astro
---
The easiest way to export telemetry data outside of **Kubeshark** and then to redirect it elsewhere is by using the [`console.log`](/en/scripting_api_reference#consolelogparams-string) command in a script in conjunction with the `kubeshark console` CLI command.

**Kubeshark** provides two helpers to send messages to STDOUT and STDERR.
[`console.log`](/en/scripting_api_reference#consolelogparams-string) send a message to STDOUT and [`console.error`](/en/scripting_api_reference#consoleerrorparams-string) will send a message to STDERR.

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

When used in conjunctions with

```bash
kubeshark console
```

you can expect the following console log output:
![Console Log](/console-log-1.png)

Redirecting the command's output to STDOUT will redirect only rhe results of [`console.log`](/en/scripting_api_reference#consolelogparams-string) and omit any error message that was sent to STDERR.

The following CLI command redirects the Console Log output to a file.

```bash
kubeshark console > /tmp/log.txt
```

The content of the file will not include ony of the messages sent to [`console.error`](/en/scripting_api_reference#consoleerrorparams-string):

```bash
[mizu-2] Captured packet count per minute: 5177
[mizu-2] Total KB captured per minute: 1910.2869999999884
[mizu-2] Captured packet count per minute: 4726
[mizu-2] Total KB captured per minute: 2149.2850000000244
[mizu-2] Captured packet count per minute: 61
[mizu-2] Total KB captured per minute: 24.746000000000024
```

You can run the `kubeshark console` command as many times as you'd like to process console logs and export to different external systems.
