---
title: Kubeshark's UI
description: Docs intro
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

The Web UI is made out a [React](https://reactjs.org/) application and communicates via a websocket with the **Hub**. The Web UI displays the captured traffic in a browser.

![Kubeshark UI](/ui-full.png)

## Targeted Pods (Pods that are Tapped)

![Targeted PODs](/targets.png)

At the top of the screen in a blue top panel, Kubeshark lists an up-to-date list of Pods that are being tapped.

## The Query Box

The query box is used to enter the Kubeshark Filter Syntax statement. Queries are used to find specific elements in traffic or reduce the amount of traffic that is interrogated.

The Kubeshark filter syntax field (aka Query Box) applies filtering to your traffic viewer. For example, to only see HTTP responses starting with the number 4, enter http and response.status == r"4.*" and select Apply. Your traffic stream will look like this:

![Kubeshark UI](/ks-filter-applied.png)

You can also query by timestamp, integer, and even queryable UI elements (below). A syntax cheatsheet is available next to the filter syntax field.

NOTE: Read the [Filter Syntax](/en/querying) section to learn more about Kubeshark's Filter SYntax.

### Queryable UI Elements

When you hover over UI elements and they display a green plus sign, it means this element can be added to your query. Selecting an element with the green plus sign will add this element to the Mizu Filter Syntax. Selecting this queryable element...

![Filter UI example](/filter-ui-example.png)

... adds response.status == 201 to your Mizu filter, and only displays HTTP 201 responses in the live traffic streaming.

## The Web UI URL

Once you run a query, the query gets added to the Web UI URL. This is helpful if you'd like to bookmark or store the query for further use.

![Web UI URL](/web-ui-url.png)

## Streaming Traffic Entries Panel

The left panel shows the streaming traffic entries captured by the **Workers** and transmitted in real time through the **Hub** to the Web UI. Each entry includes mostely meta data like: protocol, response code, method, source and destination IPs and Pods.

![Streaming Traffic Entry](/entry.png)

Streaming will continue until either:
- The user selected to stop streaming
- Kubeshark presents historical traffic

Here's an example for a query that will show the streaming traffic:

`timestamp >= now()` 

The above query is the default query when the Web UI is opened.

Here's an example for a query that will show the only historical traffic and not new traffic:

`timestamp <= now()` 

#### Stop Streaming

Scrolling up indicates you'd like to view historical traffic entries and therefore streaming will stop. The same operation can be obtained by pressing the pause button at the top of the left panel.

When streaming is stopped it doesn't mean traffic capture is stopped. Traffic capture continues and stored, until Kubeshark is stopped. 

![](/stop-streaming.png)

#### Continue Streaming

To continue viewing streaming traffic, press the down arrow at the bottom of the right panel, or the play button at the top of the right panel.

## The Traffic Entry Panel

The right panel shows the complete information related to a selected captured traffic entry. It includes the meta data related to the protocol, the method, source and destination IPs and Pods, as well as some performance KPIs like request and response sizes and elappsed time. 

### TCP stream Information

Captured traffic entry belongs to a TCP stream. A TCP stream can include one or more request-response pairs. The TCP stream block includes information about the TCP stream in which the captured traffic entry belongs to. Information includes the request-response pair index, the Node, the Worker and the name of the TCP stream.

### Traffic Entry Meta Data and Payload

The right panel includes the captured traffic request-response headers and payload and presented in a human readable way. 

