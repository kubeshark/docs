---
title: The Dashboard
description: A dashboard to view all Kubernetes network traffic.
layout: ../../layouts/MainLayout.astro
mascot:
---

**Kubeshark** dashboard is made out of a [React](https://reactjs.org/) application and communicates via a websocket with the [Hub](/en/anatomy_of_kubeshark#hub). The dashboard displays the captured traffic in a browser.

![**Kubeshark** UI](/ui-full.png)

## Targeted Pods

![Targeted PODs](/targets.png)

At the top of the screen in a blue top panel, **Kubeshark** lists an up-to-date list of Pods that are being targeted. As **Kubeshark** follows dynamically started and stopped Pods, this list can change in real-time.

## Service Map

Accessible via the **Service Map** button, the [Service Map](/en/service_map) updates in real-time and can analyze dependencies of a system-wide or a subset of traffic.

![Service Map Button](/service-map-button.png)

## Display Filter

The filter input is used to enter the [Kubeshark Filter Language (KFL)](/en/filtering#kfl-syntax-reference) statements. Queries are used to filter in specific elements in traffic or reduce the amount of traffic that is interrogated. For example, to only see HTTP responses starting with the number 4, enter `http and response.status == r"4.*"` and select Apply. Your traffic stream will look like this:

![Kubeshark UI](/ks-filter-applied.png)

You can also filter by timestamp, integer, and even queryable UI elements (below). A syntax cheatsheet is available next to the query box.

> **NOTE:** Read the [filtering](/en/filtering) section to learn more about filtering.

### Queryable UI Elements

When you hover over UI elements and they display a green plus sign, it means this element can be added to your query. Selecting an element with the green plus sign will add this element to the KFL in the query box. Selecting this queryable element...

![Filter UI example](/filter-ui-example.png)

... adds response.status == 201 to your KFL statement, and only displays HTTP 201 responses in the live traffic streaming.

## Dashboard URL

Once you run a query, the query gets added to the dashboard's URL. This is helpful if you'd like to bookmark or store the query for further use.

![Dashboard URL](/web-ui-url.png)

## Streaming Traffic

The left-pane shows the streaming traffic entries captured by the **Workers** and transmitted in real-time through the **Hub** to the dashboard. Each entry includes mostly metadata like: protocol, response code, method, source and destination IPs and Pods.

![Streaming Traffic Entry](/entry.png)

Streaming will continue until either:
- The user selected to stop streaming
- **Kubeshark** presents historical traffic

Here's an example for a query that will show the streaming traffic:

```
timestamp >= now()
```

The above query is the default query when the dashboard is opened.

Here's an example query that matches the HTTP traffic with response status code `500`:

```
http and response.status == 500
```

### Stop

Scrolling up indicates you'd like to view historical traffic entries and therefore streaming will stop. The same operation can be obtained by pressing the pause button at the top of the left-pane.

![Stop Streaming](/stop-streaming.png)

When streaming is stopped it doesn't mean traffic capture is stopped. Traffic capture continues and is stored, until **Kubeshark** is stopped.

### Continue

To continue viewing streaming traffic, press the play button at the top of the right panel.

![Continue Streaming](/play.png)

## Traffic Entry Panel

The right panel shows the complete information related to a selected captured traffic entry.

It includes the metadata related to the protocol, the method, source and destination IPs and Pods, as well as some performance KPIs like request and response sizes and elapsed time.

![Traffic Entry](/traffic-entry.png)

### TCP stream Information

Captured traffic entry belongs to a TCP stream. A TCP stream can include one or more request-response pairs. The TCP stream block includes information about the TCP stream in which the captured traffic entry belongs to. Information includes the request-response pair index, the Node, the Worker and the name of the TCP stream.

![TCP Stream](/tcp-stream.png)

### Traffic Entry Meta Data and Payload

The right panel includes the captured traffic request-response headers and payload and presented in a human readable way.

![Traffic Payload](/traffic-payload.png)
