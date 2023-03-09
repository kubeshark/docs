---
title: Script Development
description: Kubeshark scripting language is based on Javascript ES5. In addition to rich capabilities a modern programming language offers, it can trigger actions based on programable decisions and/or on a schedule.
layout: ../../layouts/MainLayout.astro
---

Scripting enables automation and allows maximum flexibility. **Kubeshark** scripting language is based on [Javascript ES5](https://262.ecma-international.org/5.1/). In addition to the rich capabilities a modern programming language has to offer, it can trigger actions based on programable decisions and/or on a schedule.

The following is an example of a script that logs the total captured packet and KB every minute.

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

## The Scripts Folder

**Kubeshark** reads scripts from a local script folder using the **CLI**. The local scripts folder is indicated in the configuration file.

```bash
scripting:
    source: "/path/to/scripts/folder/"
```

When started, the **CLI** will read all scripts from the local scripts folder. If the folder exists and is pre-populated with scripts, all of the scripts will be transmitted to the **Hub** and executed inside the K8s cluster where **Kubeshark** is deployed.

![Local Scripts Folder](/local-scripts-folder.png)

## Scripts Folder Monitoring 

The **CLI** reads the scrips once, when started. It will **not** monitor the folder or address changes unless instructed by the `kubeshark scripts` command.

The `kubeshark scripts` command monitors the local scripting folder for changes and transmit these changes with immediate effect to the **Hub**.

If you didn't provide a scripting folder in the configuration file and would like to transmit new script to the **Hub**:

```bash
kubeshark scripts --set scripting.source="/path/to/scripts/folder/"
```

## Develop in your IDE

Develop the scripts locally in your favorite IDE (e.g. Visual Studio Code). You can further maintain the scripts in version control (e.g. GitHub) in the same way you'd do with any code you write.

## Online Script Editor

**Kubeshark** provides the option to view and make temporary changes to the scripts currently running inside your K8s cluster and executed by the **Hub**.

You can also add new scripts to or delete existing scripts from the **Hub**. Any changes you make will apply for as long **Kubeshark** is running.

![Scripting Editor](/script-editor.png)

If you'd like script changes to be persistent, you's need to change the actual scripts in the local scripts folder where the **CLI** is running.

One of the major benefits for editing scripts directly inside the **Hub** is the ability to do it from anywhere using the **WebUI**.

To access the **WebUI**'s script editor and edit the scripts in the **Hub**, press the scrips button located at the top right corner.
![Scripting Button](/scripting-button.png)

## Environment Variables

You can use the `env` configuration directive to provide environment variables for your scripts to use.

```bash
scripting:
    env:
      SLACK_AUTH_TOKEN: "xo..
      SLACK_CHANNEL_ID: "C0..
      WEBHOOK_URL: "https://webh..
      INFLUXDB_URL: "https://us-e..
      INFLUXDB_TOKEN: "_9r..
      INFLUXDB_MEASUREMENT: "st..
      INFLUXDB_ORGANIZATION: "a..
      INFLUXDB_BUCKET: "al..
    source: "/User..
```

## Script Global Scope

When you'd like to set state that will be persistent across the script execution you can use variables that are defined outside of the functions.

For example, the following function will calculate the number of packets and overall traffic processed per minute using an L4 network hook ([`onPacketCaptured`](/en/automation_hooks#onpacketcapturedinfo-object)), a few Javascript commands and a job.

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

## Script Examples

**Kubeshark** comes with numerous script examples representing certain use-cases as part of the **Web UI**. Use the Examples dropdown list to access the list of script examples.

![Script Examples](/script-examples.png)

## Scripting Helpers

**Kubeshark** provides helpers to enable easy access the the various integrations (e.g. Files, PCAPs, Alerts, Console log, Integrations, etc)

> For a complete list of Helpers visit the [Scripting API Reference](en/scripting_api_reference) page
