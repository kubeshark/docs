---
title: Automated Network Analysis
description: Automation can help analyze vast amounts of data, and flag only data of interest for further analysis by people or external systems.
layout: ../../layouts/MainLayout.astro
---
Automation can help analyze vast amounts of data, and flag only data of interest for further analysis by people or external systems.

Things you can automate with **Kubeshark**:

- **Detection** of suspicious network behaviors
- **Alerts** (e.g. to Slack)
- **Forensics** in the form of network snapshots (PCAPs) uploaded to an immutable datastore (e.g. AWS S3)
- **Telemetry** messages to external systems (e.g. Grafana)

![Automated Network Analysis](/automation.png)

## Scripting

**Kubeshark** supports a scripting language that is based on [Javascript ES5](https://262.ecma-international.org/5.1/). 

In addition to its rich capabilities as a modern programming language, **Kubeshark**'s scripting language can trigger actions based on programmatic decisions and/or based on a schedule.

> Read more in the [scripting](/en/automation_scripting) section.

## Hooks

Among other hooks, **Kubeshark** provides [OSI](https://en.wikipedia.org/wiki/OSI_model) L4 and L7 hooks that enable running functions whenever a packet is captured or a new protocol-level message is dissected.

For example, the following function leverages the OSI L7 hook [`onItemCaptured`](/en/automation_hooks#onitemcaptureddata-object) and will log every dissected protocol message to the console:

```bash
function onItemCaptured(data) {
  console.log("Msg:",JSON.stringify(data));
}
```
> Read more in the  [hooks](/en/automation_hooks) section.

## Helpers

Helpers are used to trigger actions that are related to the supported integrations (e.g. Slack, AWS S3).

Below is an example for a helper that uploads an object to a Webhook:

```js
vendor.webhook(
  "POST",
  "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
  JSON.stringify(data)
);
```
> Read more in the [helpers](/en/automation_helpers) section.

## Jobs

Jobs are functions that are automated to run on a schedule. 

This example schedules the function *exampleJob* to run every 5 minutes:

```bash
jobs.schedule("example-job", "0 */5 * * * *", exampleJob)
```
Jobs can be added and removed on-demand and in real-time based on programable decisions.

> Read more in the [jobs](/en/automation_jobs) section.
