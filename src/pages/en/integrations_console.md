---
title: Console Log
description:  The easiest way to export telemetry data outside of Kubeshark and then to redirect it elsewhere.
layout: ../../layouts/MainLayout.astro
---
The easiest way to export telemetry data outside of **Kubeshark** and then to redirect it elsewhere is by using the `console.log` command in a script in conjunction with the `kubeshark console` CLI command. 

This script example calculates and sends telemetry information once per minute.
```bash
var packetCount = 0;
var totalKB = 0;

function onPacketCaptured(info) {
  packetCount++;
  totalKB += info.length / 1000;
}

function logPacketCountTotalBytes() {
  console.log("Captured packet count per minute:", packetCount);
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

The following CLI command redirects the Console Log output to a file.

```bash
kubeshark console 2> /tmp/log.txt
```