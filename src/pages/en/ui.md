---
title: The Dashboard
description: A dashboard to view all Kubernetes network traffic.
layout: ../../layouts/MainLayout.astro
mascot:
---

The dashboard's main purpose is to display real-time traffic streams based on backend and display filters.

![**Kubeshark** UI](/ui-full.png)

## Backend Filters & List of Targeted Pods

The backend filters generate a list of pods that **Kubeshark** targets. Traffic from pods not targeted by the backend filters is discarded.

![Targeted Pods](/targets.png)

The list of targeted pods is generated through [backend filtering](/en/pod_targeting). Since **Kubeshark** dynamically follows pods that are started or stopped, this list can change in real-time.

## Display Filters & KFL

Display filters help filter traffic based on a KFL statement. The dashboard does not show traffic filtered out by the display filters. Each query is specific to a browser tab, allowing you to open multiple tabs, each with a different display filter. Additionally, users can open different browser windows with different display filters to view distinct perspectives of the same cluster.

> **Note:** Backend filters apply across all clients, dashboards, users, and browser windows.

The display filter input accepts [Kubeshark Filter Language (KFL)](/en/filtering#kfl-syntax-reference) statements. These queries help focus on specific traffic elements or reduce the volume of traffic being interrogated. For instance, to view only HTTP responses with status codes starting with `4`, use the query `http and response.status == r"4.*"` and select "Apply." Your traffic stream will then appear like this:

![Kubeshark UI](/ks-filter-applied.png)

You can also filter by timestamp, integers, and queryable UI elements. A syntax cheatsheet is available next to the query box.

> **Note:** Refer to the [filtering](/en/filtering) section for more details.

### Queryable UI Elements

Hovering over UI elements with a green plus sign indicates that the element can be added to your query. Selecting these queryable elements appends them to the KFL statement in the query box. For example:

![Filter UI example](/filter-ui-example.png)

...adds `response.status == 201` to your KFL statement, displaying only HTTP 201 responses in the live traffic stream.

### Dashboard URL

Once you run a query, the query gets added to the dashboard's URL. This feature allows you to bookmark or share queries for future use.

![Dashboard URL](/web-ui-url.png)

The browser URL includes the display filter and serves as a reference. You can share the URL with colleagues to provide them with the same view.

## Service Map in the Context of Kubernetes

The [Service Map](/en/service_map) updates in real-time and analyzes system-wide or subset traffic dependencies.

![Service Dependency Graph](/new-service-map.png)

## Streaming Traffic

The left pane displays streaming traffic entries captured by the **Workers** and transmitted in real-time through the **Hub** to the dashboard. Each entry includes metadata such as the protocol, response code, method, source and destination IPs, and pods.

![Streaming Traffic Entry](/entry.png)

Streaming continues until:
- The user opts to stop streaming.
- **Kubeshark** transitions to presenting historical traffic.

Here’s an example query to display streaming traffic:

```
timestamp >= now()
```

This is the default query when the dashboard is opened.

Example query to match HTTP traffic with response status code `500`:

```
http and response.status == 500
```

### Stop

Scrolling up indicates that you wish to view historical traffic entries, which stops streaming. Alternatively, you can stop streaming by pressing the pause button at the top of the left pane.

![Stop Streaming](/stop-streaming.png)

Stopping streaming does not halt traffic capture. Traffic continues to be captured and stored until **Kubeshark** is stopped.

### Continue

To resume streaming traffic, press the play button at the top of the right pane.

![Continue Streaming](/play.png)

## Traffic Entry Panel

The right pane displays detailed information about a selected traffic entry. This includes metadata related to the protocol, method, source and destination IPs, and pods. Performance KPIs such as request and response sizes and elapsed time are also shown.

![Traffic Entry](/traffic-entry.png)

### TCP Stream Information

Each captured traffic entry belongs to a TCP stream, which may include multiple request-response pairs. The TCP stream block provides details such as the request-response pair index, node, worker, and TCP stream name.

![TCP Stream](/tcp-stream.png)

### Traffic Entry Metadata and Payload

The right pane also includes the request-response headers and payload for the captured traffic, presented in a human-readable format.

![Traffic Payload](/traffic-payload.png)
