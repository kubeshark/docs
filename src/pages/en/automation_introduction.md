---
title: Actionable Network Insights
description: Automation can help analyze vast amounts of data, and flag only data of interest for further analysis by people or external systems.
layout: ../../layouts/MainLayout.astro
---
## With Network Agents

Users can create and use an unlimited number of **Network Agents**, each designed to perform a specific network-related automation task.

Agents can detect anomalies and threats, generate reports, export metrics, traces, and logs, enforce network policies, record traffic, and more.

### Creating an Agent

You can use an existing agent template, extend a template, or build a new one using our GenAI assistant.

![Script Templates](/templates.png)

Each **Network Agent** has its own logic, defined by a [JavaScript script](/en/automation_scripting), which you can inspect, approve, or customize.  
**Network Agents** observe traffic using [hooks](/en/automation_hooks) and can trigger actions via [helpers](/en/automation_helpers).

### Active Connection to an LLM

Connecting to an external LLM is optional and can be fully disabled to support air-gapped environments.  
If enabled, each **Network Agent** maintains a persistent connection with an LLM. This connection allows:

1. Continuous, bidirectional communication—typically sending data objects (JSON maps) over time and receiving actionable insights.  
   **Example use case:** detect anomalies across a time range.
2. Ongoing improvement of the agent’s logic based on LLM feedback.

## How to Disable Access to External LLM

If you prefer **Kubeshark** not to access an external LLM, you can configure either or both of the following settings:

```yaml
aiAssistantEnabled: false     # Disables the connection to the external LLM.
internetConnectivity: false   # Blocks any cluster-external connectivity (for air-gapped environments).
```