---
title: Targeted Pod List
description: View and manage the list of pods being captured by Kubeshark.
layout: ../../layouts/MainLayout.astro
---

The Targeted Pod List shows all pods currently being captured based on [Capture Filters](/en/pod_targeting). Only traffic from these pods appears in the [L7 API Stream](/en/api_stream).

![Targeted Pods](/targets.png)

---

## How It Works

Kubeshark targets pods based on filter rules defined in [Capture Filters](/en/pod_targeting):

| Filter | Description |
|--------|-------------|
| Pod regex | Pattern matching pod names (e.g., `frontend-.*`) |
| Namespaces | Include only specific namespaces |
| Excluded namespaces | Exclude specific namespaces |
| BPF override | Explicit BPF expression |

The targeted pod list is dynamic—it updates in real-time as:
- New pods start that match the filter criteria
- Existing pods are terminated
- Filter rules are modified

---

## Viewing the List

The targeted pod list appears in the blue dialog at the top of the dashboard. It displays:

| Field | Description |
|-------|-------------|
| Pod name | Full pod name |
| Namespace | Pod's namespace |
| Node | Worker node where pod runs |
| Status | Running, pending, etc. |

---

## Impact on Traffic Capture

Traffic from pods **not** in the targeted list is discarded. This has two important implications:

1. **Resource efficiency** — Limiting targeted pods reduces CPU and memory consumption
2. **Data availability** — Only targeted pod traffic is available for viewing and analysis

If you're not seeing expected traffic, verify the pod appears in the targeted list.

---

## Modifying the List

Change which pods are targeted by updating [Capture Filters](/en/pod_targeting):

### Via Dashboard Settings

Open Settings and modify the capture filter rules. Changes apply immediately.

### Via Helm Configuration

```yaml
tap:
  regex: "frontend-.*|api-.*"
  namespaces:
    - production
    - staging
  excludedNamespaces:
    - kube-system
```

See [Helm Configuration Reference](/en/helm_reference#pod-targeting) for all options.

---

## Cluster-Wide Scope

Capture filters and the targeted pod list are **cluster-wide**:

- All users see the same targeted pod list
- All dashboard sessions are affected
- Changes impact everyone immediately

This differs from [Display Filters](/en/display_filters), which are local to each browser tab.

---

## Best Practices

### Start Narrow

Begin with specific namespaces or pod patterns, then expand as needed:

```yaml
tap:
  namespaces:
    - my-app
```

### Exclude System Namespaces

Reduce noise by excluding infrastructure namespaces:

```yaml
tap:
  excludedNamespaces:
    - kube-system
    - monitoring
    - logging
```

### Use Pod Regex for Precision

Target specific workloads without capturing everything:

```yaml
tap:
  regex: "payment-.*|checkout-.*"
```

---

## What's Next

- [Capture Filters](/en/pod_targeting) — Detailed filter configuration
- [Settings](/en/dashboard_settings) — Dashboard settings panel
- [Helm Configuration](/en/helm_reference) — Full configuration reference
