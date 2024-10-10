---
title: Scripting
description: Custom-logic scripts use hooks and helpers to trigger actions, supported by the available integrations, and based on programmatic decisions and/or on a schedule.
layout: ../../layouts/MainLayout.astro
---

Custom-logic scripts use [hooks](/en/automation_hooks) and [helpers](/en/automation_helpers) to trigger actions, supported by available integrations, based on programmatic decisions and/or a schedule.

**Kubeshark**'s scripting language is based on [JavaScript ES5](https://262.ecma-international.org/5.1/).

The following script example calculates the number of packets and overall traffic processed per minute using an L4 network hook ([`onPacketCaptured`](/en/automation_hooks#onpacketcapturedinfo-object)), some helpers, and a job.

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

## Scripts Storage

Scripts are stored in `kubeshark-config-map`. You can develop and manage scripts locally in a folder and use the `kubeshark scripts` command to synchronize files to the config map and watch for any changes in the scripts.

> Scripts code should be compliant with [JavaScript ES5](https://262.ecma-international.org/5.1/) and each file should have a `.js`` suffix

Example:

``` shell
 kubeshark scripts --set scripting.source=/path/to/your/local/folder
```

## Viewing and Editing Scripts in the Dashboard

While the scripts are stored in `kubeshark-config-map`, they can be viewed and edited in the Dashboard by accessing the Scripting section:

![Accessing the Scripting Dashboard](/scripting_menu.png)

### Script Examples Dropdown

**Kubeshark** comes with numerous script examples for various use cases as part of its dashboard. Use the Examples dropdown list to access the list of script examples.

![Script Examples](/script-examples.png)

## Environment Variables

You can use the `env` configuration directive to provide environment variables for your scripts.

```yaml
scripting:
  env:
    SLACK_AUTH_TOKEN: "xo.."
    SLACK_CHANNEL_ID: "C0.."
    WEBHOOK_URL: "https://webh.."
    INFLUXDB_URL: "https://us-e.."
    INFLUXDB_TOKEN: "_9r.."
    INFLUXDB_MEASUREMENT: "st.."
    INFLUXDB_ORGANIZATION: "a.."
    INFLUXDB_BUCKET: "al.."
```

To use any of the environment variables in a script, use the prefix: `env.*`. For example:

```js
vendor.influxdb(
  env.INFLUXDB_URL,
  env.INFLUXDB_TOKEN,
  env.INFLUXDB_ORGANIZATION,
  env.INFLUXDB_BUCKET,
  "Example Measurement",        // Measurement
  data,                         // Payload
  {"example":"tag"}
);
```

## Scopes

**Kubeshark** scripts support the following scopes:

- **Function:** When variables and functions are declared within a function.
- **Script:** When variables and functions are declared outside functions, at the script level, and can maintain a state across the specific script's functions.
- **Global:** When using the object `this`, scripts and functions are declared at the global level, accessible by all scripts.