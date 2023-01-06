---
title: TCP streams
description: Kubeshark stores TCP streams that include all of the request-response pairs throughout the communication between client and server.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** stores TCP streams that include all of the request-response pairs throughout the communication between client and server.

## TCP Stream Section

![TCP Stream](/tcp-stream.png)

This section exposes some information:

- The unique identifier of the TCP stream (internal to Kubeshark)
- The index of the item in the TCP stream
- The node name or IP.

and buttons:

- To open the [TCP Replay](#tcp-replay) prompt.
- PCAP download (The original PCAP file of this TCP stream)

## TCP Replay

Use the **Replay** button to replay a TCP stream. Replaying a TCP stream establishes a brand new TCP connection to the TCP server using the destination IP and port of the item. It only replays the payload of client packets.

![TCP stream Replay](/tcp-replay.png)

## The Items Belong To The Same TCP Stream

When you select an item from the left-pane, all the other items that belong to the same TCP stream are marked with dashed borders:

![Request-Response](/req-res.png)

To automatically build such a filter that matches to items from a specific TCP stream, use the green + button by the TCP stream identifier:

![TCP stream query](/stream-query.png)


