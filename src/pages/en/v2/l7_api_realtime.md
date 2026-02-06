---
title: Real-time API Dissection
description: Live L7 protocol analysis with instant visibility into API traffic.
layout: ../../../layouts/MainLayout.astro
---

Real-time API Dissection provides instant visibility into L7 traffic as it happens. Requests and responses are parsed, correlated, and displayed immediately in the Dashboard.

---

## Capabilities

| Feature | Description |
|---------|-------------|
| Live traffic view | See API calls as they occur |
| Request/response correlation | Matched pairs with timing |
| Full payload inspection | Headers, body, status codes |
| Kubernetes context | Pod, service, namespace identity |

---

## When to Use

| Scenario | Real-time Dissection |
|----------|---------------------|
| Active debugging | Yes |
| Development/testing | Yes |
| Live incident investigation | Yes |
| Production monitoring (low traffic) | Yes |
| High-volume production | Consider [Delayed Dissection](/en/v2/l7_api_delayed) |

---

## Resource Requirements

Real-time dissection runs on worker nodes and consumes production compute resources:

| Component | Impact |
|-----------|--------|
| CPU | Protocol parsing, state management |
| Memory | Connection tracking, payload buffering |

### Recommendations

**Use [Capture Filters](/en/pod_targeting)** to limit the number of workloads being dissected in real-time. Dissection cost scales directly with traffic volume—targeting only the namespaces or pods you need significantly reduces CPU and memory consumption.

```yaml
tap:
  namespaces:
    - production
  excludedNamespaces:
    - kube-system
    - monitoring
  regex: "api-.*|frontend-.*"
```

If production resource usage is a concern and you can wait for results, use [Delayed Dissection](/en/v2/l7_api_delayed) instead—it processes traffic on non-production compute, leaving worker nodes unaffected.

---

## What's Next

- [API (L7) Dissection](/en/v2/l7_api_dissection) — Protocol support and features
- [Delayed Dissection](/en/v2/l7_api_delayed) — Analyze captured traffic later
- [Dashboard](/en/ui) — View real-time traffic
