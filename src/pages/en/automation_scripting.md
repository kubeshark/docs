---
title: Scripting
description: Custom-logic scripts use hooks and helpers to trigger actions, supported by the available integrations, and based on programmatic decisions and/or on a schedule.
layout: ../../layouts/MainLayout.astro
---

**Custom-logic scripts** leverage hooks and helpers to trigger actions, supported by available integrations, and are executed based on programmatic decisions or scheduled tasks.

**Kubeshark**'s scripting language is based on [JavaScript ES5](https://262.ecma-international.org/5.1/). A script comprises the following components:

1. **Hooks** - Triggered by specific events.
2. **Helpers** - Used to call integrations and specific **Kubeshark** functions.
3. **General code** - Performs calculations and stores information in memory.

Scripts process network traffic, perform calculations, and trigger actions to create custom metrics, export logs, generate reports, or automate workflows.

## Hooks

`Hooks` are functions that process network traffic when specific events occur. They allow the execution of user-defined JavaScript code within **Kubeshark**'s Golang backend.

One of the simplest hooks is `onItemCaptured`, which is triggered every time an API call is processed and reassembled. The example below prints the metadata of every API call:

```js
function onItemCaptured(data) {
  // Prints the API call metadata
  console.log("Msg:", data);
}
```

Hooks run continuously in the background, independent of the dashboard’s state (open or closed).

### Hook Examples

The table below shows common `hooks` and their descriptions:

| Hook              | Event                                    | Runnable on     | Description                                                                                   |
|------------------|------------------------------------------|-----------------|-----------------------------------------------------------------------------------------------|
| onItemCaptured    | API call reassembly                     | Workers         | Triggered for each reassembled message. Suitable for quick actions like calculations or data assignments. |
| onHubAction       | `hub.action(action, object)` invocation | Hub             | Used for moving objects from workers to the Hub, consolidating objects, or offloading tasks.  |
| onPodEvent        | Pod events (e.g., restarts)             | Hub and Workers | Triggered by pod events, allowing actions such as capturing snapshots before crashes.         |

---

## Helpers

`Helpers` trigger actions related to integrations, such as Slack or AWS services, and provide a mechanism to interact with **Kubeshark**'s Golang backend.

Below is an example of using a helper to send an object to a webhook:

```js
vendor.webhook(
  "POST",
  "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
  JSON.stringify(data)
);
```

### Helper Examples

The table below provides common `helpers` and their descriptions:

| Helper               | Usage                            | Runnable on     | Description                                                                                   |
|---------------------|----------------------------------|-----------------|-----------------------------------------------------------------------------------------------|
| console.log          | Print text to the console        | Hub and Workers | Used for logging messages or generating custom reports.                                       |
| jobs.schedule        | Schedule jobs                    | Hub and Workers | Schedules a function using a cron expression, suitable for time-consuming tasks.              |
| vendor.kinesis.put   | Export traffic to AWS Kinesis    | Hub and Workers | Sends data to a Kinesis stream for external analysis, such as security monitoring or API scanning. |

## Complete Script Example

The example below calculates the number of packets and total traffic processed per minute using an L4 network hook (`onPacketCaptured`), helpers, and a scheduled job:

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

Scripts are stored in `kubeshark-config-map`. They can be developed and managed locally and synced using the `kubeshark scripts` command, which automatically detects changes.

> Ensure the script code complies with [JavaScript ES5](https://262.ecma-international.org/5.1/) and that script files have a `.js` suffix.

**Example:**
```shell
kubeshark scripts --set scripting.source=/path/to/your/local/folder
```

## Viewing and Editing Scripts in the Dashboard

Scripts stored in `kubeshark-config-map` can be viewed and edited directly in the **Kubeshark** dashboard under the Scripting section:

![Accessing the Scripting Dashboard](/scripting_menu.png)

### Script Examples

**Kubeshark** provides a variety of script examples within its dashboard. These examples can be accessed via the Examples dropdown list:

![Script Examples](/script-examples.png)

## Environment Variables

Use the `env` configuration to define environment variables for scripts.

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

To reference these variables in scripts, use the `env.*` prefix.

**Example:**
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

**Kubeshark** scripts support the following variable scopes:

- **Function Scope:** Variables and functions declared within a function.
- **Script Scope:** Variables and functions declared outside functions and accessible within the same script.
- **Global Scope:** Variables and functions declared using `this` are accessible globally by all scripts.