---
title: Scripting
description: Custom-logic scripts use hooks and helpers to trigger actions, supported by the available integrations, and based on programmatic decisions and/or on a schedule. 
layout: ../../layouts/MainLayout.astro
---

Custom-logic scripts use [hooks](/en/automation_hooks) and [helpers](/en/automation_helpers) to trigger actions, supported by the available integrations, and based on programmatic decisions and/or on a schedule. 

**Kubeshark** scripting language is based on [Javascript ES5](https://262.ecma-international.org/5.1/).

The following script example calculates the number of packets and overall traffic processed per minute using an L4 network hook ([`onPacketCaptured`](/en/automation_hooks#onpacketcapturedinfo-object)), some helpers and a job.

```js
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

## Scripts Development

Develope your scripts locally in your environment (e.g. VS Code, GitHub) and simply add your scripts folder to the [scripts section](/en/config#scripts) in **Kubeshark**'s configuration file .

```bash
scripting:
    source: "/path/to/scripts/folder/"
```

## Scripts Run-time

All scripts are transmitted to the **Hub** and executed inside the K8s cluster at the node level.

![Local Scripts Folder](/local-scripts-folder.png)

**Kubeshark** provides the option to view and make temporary changes to the scripts currently executed by the **Hub**.

You can edit, add, delete scripts directly in the **Hub**. Any changes you make are **not** persistent and will apply for as long **Kubeshark** is running.

![Scripting Editor](/script-editor.png)

To access the **WebUI**'s script editor and edit the scripts in the **Hub**, press the scrips button located at the top right corner.
![Scripting Button](/scripting-button.png)

The **CLI** monitors the scripts folder by default and updates the **Hub** on any changes. You can use the `kubeshark scripts` command to explicitly monitor the folder for changes, especially if you don't use the **CLI**.

The following command wil transmit the content of any folder to the **Hub**:

```bash
kubeshark scripts --set scripting.source="/path/to/scripts/folder/"
```


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

To use any of the env variables in a script, use the prefix: `env.`. For example:

```js
  var my-var = env.INFLUXDB_TOKEN;
```

## Scopes

**Kubeshark** scripts supports the following scopes:
- **Function:** When variables and functions are declared within a function.
- **Script:** When variables and functions are declared outside functions , at the specific script level and can maintain a state across the specific script's functions.
- **Global** When you use the object `this` you can decares scrips and function at the global level accessible by all scripts.

## Script Examples Dropdown

**Kubeshark** comes with numerous script examples representing certain use-cases as part of the **Web UI**. Use the Examples dropdown list to access the list of script examples.

![Script Examples](/script-examples.png)
