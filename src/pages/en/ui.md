---
title: Dashboard Overview
description: A dashboard to view all Kubernetes network traffic.
layout: ../../layouts/MainLayout.astro
mascot:
---

The Kubeshark Dashboard provides a centralized interface for viewing, filtering, and analyzing Kubernetes network traffic. It displays real-time API streams, workload relationships, and traffic snapshots—all enriched with full Kubernetes context.

![Kubeshark Dashboard](/ui-full.png)

---

## API Stream

The [L7 API Stream](/en/api_stream) displays cluster-wide API calls in real-time, or when viewing delayed dissected snapshots. Each call includes full Kubernetes context, operating system context, API metadata, and network payload.

![Streaming Traffic Entry](/entry.png)

The stream will be empty if [API Dissection is disabled](/en/on_off_switch).

See [L7 API Stream](/en/api_stream) for details on stream entries, filtering, and entry details.

---

## Display Filters / KFL

[Display Filters](/en/display_filters) use **KFL2 (Kubeshark Filter Language 2)** to control what traffic appears in the API stream. Filter by protocol, status code, Kubernetes identity, headers, and more.

```
# HTTP errors
http && status_code >= 400

# Traffic to production
dst.pod.namespace == "production"
```

Display filters affect only the current browser tab. Multiple tabs can show different filtered views of the same cluster.

See [Display Filters / KFL](/en/display_filters) for usage details and [KFL2 Reference](/en/v2/kfl2) for complete syntax.

---

## Workload Maps

The [L4/L7 Workload Map](/en/v2/service_map) provides a real-time visualization of traffic dependencies within the cluster.

![Service Dependency Graph](/new-service-map.png)

The map updates live and can be filtered to show specific namespaces, services, or traffic patterns.

---

## Snapshots

Access and manage [Traffic Snapshots](/en/dashboard_snapshots) from the dashboard. Create new snapshots, browse existing ones, and run [Delayed Dissection](/en/v2/l7_api_delayed) on captured traffic.

See [Snapshots](/en/dashboard_snapshots) for details.

---

## Targeted Pod List

The [Targeted Pod List](/en/targeted_pods) shows all pods currently being captured based on [Capture Filters](/en/pod_targeting). Only traffic from these pods appears in the API stream.

![Targeted Pods](/targets.png)

See [Targeted Pod List](/en/targeted_pods) for details.

---

## Settings

The [Settings](/en/dashboard_settings) panel provides access to dashboard configuration, capture filter controls, and display options.

See [Settings](/en/dashboard_settings) for details.

---

## Ingress

Configure external access to the dashboard. See [Ingress](/en/ingress) for detailed setup instructions including:

- Kubernetes Ingress resources
- TLS configuration
- Authentication integration

---

## What's Next

- [Display Filters (KFL2)](/en/v2/kfl2) — Filter syntax reference
- [L4/L7 Workload Map](/en/v2/service_map) — Dependency visualization
- [Traffic Snapshots](/en/v2/traffic_snapshots) — Capture historical traffic
