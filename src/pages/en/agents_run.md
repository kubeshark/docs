---
title: Activating Network Agents
description: This guide explains how to activate **Kubeshark** Network Agents automatically or on demand, using templates, scripts, or the Dashboard.
layout: ../../layouts/MainLayout.astro
---

**Network Agents** can be activated either on demand or automatically in several ways:

1. Using Agent templates
2. Using the [`kubeshark scripts` command](/en/automation_scripts_cmd)
3. Via the **Kubeshark** Dashboard

## Activating Agents Using Agent Templates

**Kubeshark** provides fully functional Agent templates. These can be used as-is to fulfill automation tasks, customized, or used as inspiration to create new agents.

![Automatic activation of the Redact Sensitive Data Agent](/redact_agent.png)

### Activating an Agent Template Automatically

To automatically run one or more Agent templates, add the agent name(s) to the `scripting.active` Helm value.

For example, to activate the `Redact Sensitive Data` agent each time **Kubeshark** starts:

```yaml
scripting:
  active: 
    - Redact Sensitive Data
```

### Activating Agents Automatically

To run agents by default, add their names to the `scripting.active` value.
For example, if the *agent's script* begins with:

```javascript
// script 1
```

Then add the following to your configuration:

```yaml
scripting:
  active:
    - script 1
```

## Running from the UI

You can also run agents directly from the **Kubeshark** UI.
**Note:** Scripts created in the UI are not persistent and will be lost when **Kubeshark** restarts.

To run a script:

1. Start a new script in the UI.
2. Paste the *agent's script* code.
3. Activate the agent.