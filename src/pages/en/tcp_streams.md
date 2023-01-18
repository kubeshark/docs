---
title: TCP/UDP streams
description: Kubeshark stores the dissected protocols' complete TCP and UDP streams. TCP and UDP streams include all of the request-response pairs throughout the communication between client and server. 
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** stores the dissected protocols' complete TCP and UDP streams. TCP and UDP streams include all of the request-response pairs throughout the communication between client and server. 
> NOTE: Captured TCP or UDP streams that do not belong to a dissected protocols are discarded. 

## TCP/UDP Stream Section

![TCP Stream](/tcp-stream.png)

This section exposes some information:

- The unique identifier of the TCP or UDP stream (internal to Kubeshark)
- The index of the item in the TCP or UDP stream
- The node name or IP.

and buttons:

- To open the [TCP or UDP Replay](#tcpudp-stream-replay) prompt.
- PCAP download (The original PCAP file of this TCP stream)

## TCP/UDP Stream Replay

Use the **Replay** button to replay the TCP or UDP stream. Replaying a TCP or UDP stream establishes a brand new connection to the destination server using the destination IP and port of the item. It only replays the payload of client packets.

![TCP stream Replay](/tcp-replay.png)

### Stress Testing

**Kubeshark** provides an option to replay the TCP or UDP stream concurrently. This capability is intended to provide an easy way to stress test the target server. 

To activate the stress test, put any number in the **replay count** and select the **Replay the TCP/UDP streams concurrently. (load testing)**.

## TCP/UDP Stream Traffic Entries

When you select a traffic entry from the left-pane, all the other traffic entries that belong to the same stream are marked with dashed borders:

![Request-Response](/req-res.png)

To automatically build such a filter that matches to items from a specific TCP or UDP stream, use the green + button by the TCP or UDP stream identifier:

![TCP stream query](/stream-query.png)


