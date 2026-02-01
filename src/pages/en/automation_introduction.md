---
title: Actionable Network Insights
description: Users can automate network tasks with unlimited agents that detect threats, export data, and optionally connect to an LLM for continuous insight and logic refinement.
layout: ../../layouts/MainLayout.astro
---

## With Network Agents

Users can create and use an unlimited number of **Network Agents**, each designed to perform a specific network-related automation task.

Agents can detect anomalies and threats, generate reports, export metrics, traces, and logs, enforce network policies, record traffic, and more.

### Optional Connection to a Custom LLM

Connecting to an external LLM is **optional** and can be fully disabled to support air-gapped environments.

Agent will run and you can still get help creating new Agents without any connection between [Kubeshark](https://kubeshark.com) and an external LLM.

If enabled, each **Network Agent** will maintain a persistent connection with a custom LLM. This connection will allow:

1. Continuous, bidirectional communication—typically sending data objects (JSON maps) over time and receiving actionable insights.
   **Example use case:** detect anomalies across a time range.
2. Ongoing improvement of the agent’s logic based on LLM feedback.

## How to Disable Access to External LLM

If you prefer [Kubeshark](https://kubeshark.com) not to access an external LLM, you can configure either or both of the following settings:

```yaml
aiAssistantEnabled: false     # Disables the connection to the external LLM.
internetConnectivity: false   # Blocks any cluster-external connectivity (for air-gapped environments).
```