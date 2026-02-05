---
title: L4 to L7 & PCAP Viewer
description: Map L4 connections to L7 API calls and inspect raw packet data with the integrated PCAP viewer.
layout: ../../../layouts/MainLayout.astro
mascot: Hello
---

## L4 (TCP or UDP) Connection

Each dissected API call now includes a reference to its corresponding L4 connection, which contains the raw packets of the traffic.

An L4 connection represents a stream of traffic between a source (identified by an IP) and a destination (identified by an IP and port).
Each connection has a defined start and end, and a state: OPEN, CLOSED, or IN-PROGRESS.
Connections include both ingress and egress raw packets, which can be downloaded as a PCAP file or viewed directly in [Kubeshark](https://kubeshark.com)'s new online PCAP viewer.

## Online PCAP Viewer

While you can download the raw packets of any L4 connection as a PCAP file for inspection in Wireshark, [Kubeshark](https://kubeshark.com) also provides a built-in online PCAP Viewer for quick and easy packet analysis.

![Online PCAP Viewer](/pcapviewer.png)

## L4 to L7 Mapping

You can now view the relationship between all L7 API calls dissected from a specific L4 connection.

![L4 to L7 Mapping](/l4_l7_map.png)

In the example above, all dissected Kafka API calls are associated with the first listed TCP connection.
This functionality is accessible by clicking the L4 to L7 mapping icon:

![L4 to L7 Mapping](/l4_l7_map_cta.png)
