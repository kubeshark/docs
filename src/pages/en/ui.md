---
title: The Dashboard
description: A dashboard to view all Kubernetes network traffic.
layout: ../../layouts/MainLayout.astro
mascot:
---

## Dashboard Overview

The primary purpose of the dashboard is to display real-time traffic streams using backend and display filters.

![[Kubeshark](https://kubeshark.com) UI](/ui-full.png)

---

## Targeted Pods

[Kubeshark](https://kubeshark.com) targets specific pods based on their attributes. [Backend filters](/en/pod_targeting) define the criteria used to generate the list of targeted pods. This list can include future pods (e.g., pods that haven’t started yet but match the filter criteria). Since [Kubeshark](https://kubeshark.com) dynamically tracks pod lifecycle events, the targeted pod list updates in real time.

Traffic from non-targeted pods is discarded.

The active list of targeted pods appears in the blue dialog window at the top of the dashboard.

![Targeted Pods](/targets.png)

---

## Display Filters (KFL2)

Display filters differ significantly from backend filters. While backend filters affect all of [Kubeshark](https://kubeshark.com), display filters only impact a specific dashboard tab.

Display filters use **[KFL2 (Kubeshark Filter Language 2)](/en/v2/kfl2)** to control what traffic is shown in the UI. KFL2 uses CEL (Common Expression Language) syntax. Each query is local to the browser tab where it's applied, allowing multiple tabs (or even browser windows) to show different filtered views of the same cluster.

> **Note:** Backend filters apply globally across all users, dashboards, and browser sessions.

KFL2 queries help narrow the traffic scope or focus on specific elements. For example, to display only HTTP responses with 4xx status codes, use:

```
http && status_code >= 400 && status_code < 500
```

Click **Apply**, and the filtered traffic stream will appear as shown:

![Kubeshark UI](/ks-filter-applied.png)

You can also filter by timestamp, numeric values, and UI-based query elements.

> Learn more in the [Display Filters (KFL2)](/en/v2/kfl2) section.

---

### Queryable UI Elements

Hovering over UI elements with a green plus sign indicates that they are **queryable**. Clicking them appends a corresponding filter to the KFL2 statement.

For example:

![Filter UI Example](/filter-ui-example.png)

...adds `response.status == 201` to your current query, filtering the stream to only include HTTP 201 responses.

---

### Dashboard URL

When a query is run, it is automatically embedded into the browser’s URL. This enables bookmarking or sharing the exact filtered view.

![Dashboard URL](/web-ui-url.png)

You can copy and share the URL with colleagues to give them the same real-time filtered view of the traffic.

---

## Workload Map

The [Workload Map](/en/v2/service_map) updates live and provides a real-time visual of traffic dependencies within the cluster or a filtered subset.

![Service Dependency Graph](/new-service-map.png)

---

## Streaming Traffic

The **left pane** shows real-time traffic entries captured by **Workers** and streamed through the **Hub** to the dashboard. Each entry includes metadata such as protocol, status code, HTTP method, source/destination IPs, and pod information.

![Streaming Traffic Entry](/entry.png)

Streaming continues until:
- You manually stop it.
- [Kubeshark](https://kubeshark.com) automatically switches to showing historical traffic.

Example to view only live traffic:

```
timestamp >= now()
```

This is the default query when opening the dashboard.

Example to show HTTP traffic with status code `500`:

```
http and response.status == 500
```

---

### Pause API Dissection

You can pause L7 API dissection directly from the dashboard by clicking the API Dissection button in the top-left corner. When dissection is active, a red stop button labeled "Pause API Dissection" is displayed:

![Pause API Dissection](/dissection-on.png)

> Pausing API dissection does **not** stop [Raw Capture](/en/v2/raw_capture). L4 traffic continues to be captured while dissection is paused.

---

### Resume API Dissection

When API dissection is paused, a green play button labeled "Resume API Dissection" is displayed. Click it to resume dissection:

![Resume API Dissection](/dissection-off.png)

> Learn more about managing API dissection in [Enabling / Disabling L7 API Dissection](/en/on_off_switch).

---

## Traffic Entry Panel

The **right pane** displays full details for a selected traffic entry, including metadata such as protocol, source/destination, method, pod names, and performance KPIs like latency and request/response size.

![Traffic Entry](/traffic-entry.png)

---

### TCP Stream Information

Each traffic entry is part of a TCP stream, which may contain multiple request-response pairs. The TCP stream panel provides contextual information such as:

- Request-response pair index  
- Node and worker handling the stream  
- TCP stream identifier  

![TCP Stream](/tcp-stream.png)

---

### Request/Response Metadata & Payload

The right pane also displays the full headers and payload of each request and response in a human-readable format.

![Traffic Payload](/traffic-payload.png)