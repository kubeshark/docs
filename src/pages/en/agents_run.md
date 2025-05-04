---
title: Activating Network Agents
description: 
layout: ../../layouts/MainLayout.astro
---

**Network Agents** can be activated either on demand or automatically in several ways:

1. Using Agent templates
2. Using the `kubeshark scripts` command
3. Via the **Kubeshark** Dashboard

## Activating Agents Using Agent Templates

**Kubeshark** provides fully functional Agent templates. These can be used as-is to fulfill automation tasks, customized, or used as inspiration to create new agents.

![Automatic activation of the Redact Sensitive Data Agent](/redact_agent.png)

### Activating an Agent Template Automatically

To automatically run one or more Agent templates, add the Agent name(s) to the `scripting.active` Helm value.

For example, to activate the `Redact Sensitive Data` agent each time **Kubeshark** starts:

```yaml
scripting:
  active: 
    - Redact Sensitive Data
```

## Track Local Agent Scripts

Users can create and manage unlimited agents using local ES5 JavaScript files (the *Agent's script*). These can be tracked and synced with a running **Kubeshark** instance using the CLI.

### Prerequisites

Install the `kubeshark` CLI using a method from the [installation guide](/en/install).

Assume a file named `anomaly-agent.js` is located at:

```
/Users/me/agents/anomaly-agent.js
```

### Track All Files in a Folder

```shell
kubeshark scripts --set scripting.source=/Users/me/agents/
```

### Track Individual Files

```shell
kubeshark scripts --set scripting.sources[0]=/Users/me/agents/anomaly-agent.js 
```

Any change to a tracked file will be synchronized with the running **Kubeshark** instance.

### Determining the Agent Name

The CLI extracts the agent name from the first line of the *Agent's script* (as a comment).
Example name: `API Call Anomaly Detection Script`

![Script Name](/script_name.png)

### Activating Agents Automatically

To run agents by default, add their names to the `scripting.active` value.
For example, if the *Agent's script* begins with:

```javascript
// script 1
```

Then add the following to your configuration:

```yaml
scripting:
  active:
    - script 1
```
Here is the proof-edited version of your text:

---

## Running from the UI

You can also run agents directly from the **Kubeshark** UI.
**Note:** Scripts created in the UI are not persistent and will be lost when **Kubeshark** restarts.

To run a script:

1. Start a new script in the UI.
2. Paste the *agent's script* code.
3. Activate the agent.

## Environment Variables

*Agent scripts* can access environment variables set in the configuration.

Example:

```yaml
scripting:
  env:
    ZAP_SERVER_URL: https://a6a4...-free.app
    ZAP_APIKEY: shshh
    AWS_REGION: us-east-1
    S3_BUCKET: vol-ks...d-demo
    # AWS_ACCESS_KEY_ID: "AK...N"
    # AWS_SECRET_ACCESS_KEY: "xZ...ie"
    KINESIS_STREAM_NAME: "stream1"
    KINESIS_MIN_BATCH_SIZE: "10"
```