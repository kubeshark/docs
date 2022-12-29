---
title: TCP streams
description: Docs intro
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark stores complete TCP streams that include all of the request-response pairs that were included in a communication between two endpoints from when a connection was established until the connection was closed.

## Export to PCAP

Use the PCAP button to export the TCP stream content to a PCAP file.

## Replay

Use the Replay button to replay the TCP stream. Replaying a TCP stream opens a connection to the server using the server IP and port, and sends only the requests packets. 

![TCP stream Replay](/tcp-replay.png)

## Information

The TCP stream information includes the following properties:

![TCP Stream](/tcp-stream.png)

Where:
A - Worker IP
B - Worker Port
C - TCP Stream (file) name
D - Request Response Pair Index
E - Node IP

## Request Response Pairs 

When filtering by TCP stream, you can see the request-response pairs that belong to the TCP stream.

![Request-Response](/req-res.png)

To automatically propagate the query field with the necessary information required to filter by a specific TCP stream, use the green + button by the TCP stream.

![TCP stream query](/stream-query.png)


