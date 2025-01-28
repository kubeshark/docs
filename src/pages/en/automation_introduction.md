---
title: GenAI-Assisted Network Insights
description: Automation can help analyze vast amounts of data, and flag only data of interest for further analysis by people or external systems.
layout: ../../layouts/MainLayout.astro
---

## High-Level Overview

The Kubernetes network is a critical source of insights, carrying APIs and data that define the business logic of the application.

GenAI-Assisted Network Insights leverages the latest advancements in Generative AI and a purpose-trained custom LLM, enabling users to ask questions, create custom automations, generate reports, and define metrics—all based on the data available within the network.

Users can interact with a GenAI assistant to ask and refine questions, as well as create custom automations using natural language. The assistant generates ready-to-run code that is fully compatible with Kubeshark, a tool for network observability. Once executed, this code processes network data in real time, producing custom reports or triggering specific actions.

![GenAI-Assisted Network Observability](/networkprocessor.png)

> See a quick, very limited, demo [here](https://chatgpt.com/g/g-675613a0221c8191beb0fae0f5967d15-ask-kubeshark-anything-demo).

#### Examples of Questions: 
- Identify the top 5 DNS consumers.
- Report the theoretical impact of network policies on live pods.
- Show pods and processes with external connections.
- Highlight pods with no network activity (likely candidates for cost optimization).
- Report API latency anomalies.

#### Examples of Automations:
- Export traffic for API security scanning.
- Record traffic and upload it to an immutable datastore. 

#### Custom Report Templates

Some examples are already available and ready to use in the **Kubeshark** dashboard.

![Script Templates](/templates.png)

---

## Scripts

A script includes ES5 JavaScript code that comprises:
1. **Hooks** - Triggered upon the occurrence of certain events.
2. **Helpers** - Invoke integrations and specific **Kubeshark** functions. 
3. **General code** - Used for calculations and storing information in memory.

Scripts are used to process network traffic, perform calculations, and trigger actions that may result in creating custom metrics, exporting logs, generating reports, or building automations.

---

## Hooks

`Hooks` are functions designed to process traffic. They are called when specific events occur and provide a way to invoke user-created JavaScript code from **Kubeshark**'s Go backend. 

The simplest example is the `onItemCaptured` hook, which is triggered every time a new API call is processed and reassembled. The example below prints the metadata for every API call:

```js
function onItemCaptured(data) {
  // Prints the API call metadata
  console.log("Msg:", JSON.stringify(data));
}
```

Hooks operate continuously in the backend, regardless of the dashboard state (whether open or closed).

### Hook Examples

Below is a list of some `hooks` and their descriptions.

| Hook            | Event                                   | Runnable on    | Description                                                                                                                                                 | 
|------------------|-----------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| onItemCaptured   | API call reassembly                    | Workers        | Invoked for every emitted item representing a reassembled message. This hook works inline and should include quick actions like calculations or assignments. |
| onHubAction      | `hub.action(action, object)` is invoked | Hub            | Used for moving objects from Workers to the Hub for further processing, consolidating map objects, or offloading computations to the Hub.                  |
| onPodEvent       | On every pod event (e.g., restart)     | Hub and Workers | Triggered on pod events, enabling custom functionality, such as capturing a snapshot of pod traffic before a crash.                                         |

---

## Helpers

`Helpers` are used to trigger actions related to supported integrations (e.g., Slack, AWS S3). They provide a way to invoke **Kubeshark**'s Go backend from user-created JavaScript code.

Below is an example of a helper that uploads an object to a webhook:

```js
vendor.webhook(
  "POST",
  "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
  JSON.stringify(data)
);
```

### Helper Examples

Below is a list of some `helpers` and their descriptions.

| Helper               | Usage                         | Runnable on     | Description                                                                                                                        | 
|-----------------------|-------------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------|
| console.log           | Print text to the Console     | Hub and Workers | A commonly used `helper` to print log messages or create custom reports.                                                          |
| jobs.schedule         | Schedule jobs                | Hub and Workers | Schedules a function to run at specified intervals using a cron expression. Suitable for handling complex or time-consuming tasks. |
| vendor.kinesis.put    | Export traffic to AWS Kinesis | Hub and Workers | Exports data to a Kinesis stream, enabling external systems to process it for tasks like security or API scanning.                 |

## GenAI Availability

The Kubernetes network is a critical source of insights, as it carries APIs and data that define the business logic of the application.
