---
title: Settings
description: Configure dashboard behavior and Kubeshark options.
layout: ../../layouts/MainLayout.astro
---

The Settings panel provides access to dashboard configuration and Kubeshark operational controls.

![Settings Panel](/settings.png)

---

## Targeted Pods

View and modify the pods being captured by [Capture Filters](/en/pod_targeting). The targeted pod list shows all pods currently matched by the filter rules.

![Targeted Pods](/targets.png)

The list updates in real-time as pods start and stop. Only traffic from targeted pods is captured and available for viewing.

### Modifying Capture Filters

From the Settings panel, you can adjust:

| Filter | Description |
|--------|-------------|
| Pod regex | Pattern matching pod names |
| Namespaces | Include specific namespaces |
| Excluded namespaces | Exclude specific namespaces |
| BPF override | Explicit BPF expression |

> **Note:** Changes made via the Settings panel are temporary and apply only until Kubeshark is restarted. For persistent configuration, use [Helm values](/en/helm_reference#pod-targeting).

> **Note:** Capture filters differ from [Display Filters](/en/display_filters). Capture filters control what traffic is captured; display filters control what is shown in your browser tab.

---

## What's Next

- [Capture Filters](/en/pod_targeting) — Detailed filter configuration
- [Enabling / Disabling Dissection](/en/on_off_switch) — Dissection control options
- [Helm Configuration](/en/helm_reference) — Full configuration reference
