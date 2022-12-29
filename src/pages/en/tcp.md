---
title: TCP streams
description: Docs intro
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark stores complete TCP streams that include all of the request-response pairs that were included in a communication between two endpoints from when a connection was established until the connection was closed.

### TCP Stream Operations

With TCP streams, Kubeshark enables replaying the TCP streams, exporting them to PCAP and viewing their request-response pairs.

#### TCP Stream Information

The TCP stream information includes the following properties:

![TCP Stream](/tcp-stream.png)

Where:
A - Worker IP
B - Worker Port
C - TCP Stream (file) name
D - Request Response Pair Index
E - Node IP

#### TCP Stream Filter: Request Response Pairs 

When filtering by TCP stream, you can see the request-response pairs that belong to the TCP stream.

![Request-Response](/req-res.png)

To automatically propagate the query field with the necessary information required to filter by a specific TCP stream, use the green + button by the TCP stream.

![TCP stream query](/stream-query.png)


