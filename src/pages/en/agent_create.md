---
title: Creating Network Agents
description: A guide for creating, editing, and managing custom network agents in **Kubeshark**, using templates, local scripts, and the GenAI-powered assistant.
layout: ../../layouts/MainLayout.astro
---

You can use an existing agent template, extend a template, or build a new one using our Custom GPT.

Each **Network Agent** has its own logic, defined by a [JavaScript script](/en/automation_scripting), which you can inspect, approve, or customize.

**Network Agents** observe traffic using [hooks](/en/automation_hooks) and can trigger actions via [helpers](/en/automation_helpers).

## New Agent Creation

### Using an Agent Template

**Kubeshark** provides fully functional Agent templates. These can be used as-is, customized to suit your needs, or used as inspiration for creating new agents.

![Automatic activation of the Redact Sensitive Data Agent](/redact_agent.png)

### Using Custom GPT

While there are multiple ways to create new Agents, the easiest method involves using our trained [OpenAI-based custom GPT](https://chatgpt.com/g/g-6815c948b00c81918f1157b5a3cc87b2-kubeshark-network-agent).

> This GPT is not connected to your running instance of **Kubeshark** and has no awareness of your identity or usage history. It is a pure code-generation assistant actively trained by the **Kubeshark** team.

### Persistency

Any Agent created in the dashboard will persist for the lifetime of the **Kubeshark** deployment. When **Kubeshark** is uninstalled, any Agent logic will be erased from memory.

To ensure Agent logic persistency, save locally in JS files and use the [`kubeshark scripts` command](/en/automation_scripts_cmd) to synchronize those with any running deployment of **Kubeshark**.

## Post-Creation Agent Logic Modification

Agent logic scripts can be modified after creation using different methods based on your use case.

### Via the Dashboard

#### Manual Editing

The fastest route to feedback is to change the script directly in the dashboard. The dashboard includes a full-fledged VS Code–like code editor.

#### Via GenAI Assistant

You can use our GenAI agent to change the script based on a prompt. The benefit here is that a single prompt can handle complex code changes that are returned ready to execute.

You can always use the same functionality to fix any code changes you've introduced (just use the prompt: `fix`).

Simply highlight the code you want to have inspected or changed, and use our inline code assistant.

![In line code assistant](/code_asst.png)

### Local File Editing

If you keep your files locally and use the [`kubeshark scripts` command](/en/automation_scripts_cmd) to synchronize them with your running deployment of **Kubeshark**, any changes to the local file will be reflected in **Kubeshark**.

### Autonomous Agent Logic Modification

The Agent can also modify its own logic, assuming you've explicitly enabled it to do so.