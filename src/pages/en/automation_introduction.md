---
title: Automated Network Analysis
description: Kubeshark's automation can seamlessly analyze vast amounts of data, and send only data of interest for further analysis by people or external systems.
layout: ../../layouts/MainLayout.astro
---
**Kubeshark**'s automation can seamlessly analyze vast amounts of data, and flag only data of interest for further analysis by people or external systems.

Things you can automate with **Kubeshark**:

- **Detection** of suspicious network behaviors
- **Alerts** (e.g. to Slack)
- **Forensics** generation in the form of PCAPs and upload to an immutable datastore (e.g. AWS S3)
- **Telemetry** messages to external systems (e.g. Grafana)

## Scripting

Scripting enables automation and allows maximum flexibility. **Kubeshark** scripting language is based on [Javascript ES5](https://262.ecma-international.org/5.1/). In addition to the rich capabilities a modern programming language has to offer, it can trigger actions based on programable decisions and/or on a schedule.

> Read more about **Kubeshark**'s scripting capabilities [here](/en/automation_scripting).

## Hooks

**Kubeshark**, among other hooks, provides [OSI](https://en.wikipedia.org/wiki/OSI_model) L4 and L7 hooks that enable running functions whenever a packet is captured or a new protocol-level message is dissected.

For example, the following function leverages the OSI L7 hook `onItemCaptured` and will log every dissected protocol message to the console:

```bash
function onItemCaptured(data) {
  console.log("Msg:",JSON.stringify(data));
}
```
> Read more about the available hooks that are supported by **Kubeshark** [here](/en/automation_hooks).

## Jobs

Jobs are functions that are automated to run on a schedule. Jobs fit functions when they don't depend on certain real-time network behaviors

For example, capture all DNS traffic once an hour and upload to an immutable datastore. This Forensics can be helpful incase of an incident or a crash.

Another example would be to send all network telemetry data once an hour to an external telemetry application.

This example schedules the function *exampleJob* to run every 5 minutes:

```bash
jobs.schedule("example-job", "0 */5 * * * *", exampleJob)
```
Jobs can be added and removed on-demand and in real-time based on programable decisions.

> Read more about Jobs [here](/en/automation_jobs).