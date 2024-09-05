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

## Script Storage

You can develop and manage scripts locally in a folder and use **Kubeshark**'s CLI to watch for any changes in the scripts.

### When Using Helm

**Kubeshark** looks for scripts in the `kubeshark-config-map`. You can use the CLI to watch the scripts folder and update the `kubeshark-config-map` with every change.  
First, ensure the availability of a port-forward connection to **Kubeshark**, then use the CLI to monitor the scripts folder.

```shell
kubectl port-forward svc/kubeshark-front 8899:80
kubeshark scripts --set scripting.source=/absolute/path/to/scripts/folder
```

> We are actively working on simplifying this process.

### When Using the CLI

Develop your scripts locally in your environment (e.g. VS Code, GitHub) and add your scripts folder to the [scripts section](/en/config#scripts) in **Kubeshark**'s configuration file:

```yaml
scripting:
  source: "/path/to/scripts/folder/"
```

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
  source: "/User.."
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

## Script Examples Dropdown

**Kubeshark** comes with numerous script examples for various use cases as part of its dashboard. Use the Examples dropdown list to access the list of script examples.

![Script Examples](/script-examples.png)