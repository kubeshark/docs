---
title: TCP/UDP Connections
description: View and analyze L4 TCP and UDP connections across your Kubernetes cluster.
layout: ../../../layouts/MainLayout.astro
---

**TCP/UDP Connections** provide visibility into L4 network connections across your Kubernetes cluster. Each L7 API message is connected to an L4 connection, and each L4 connection can include one or multiple L7 messages.

## What's in an L4 Connection

An L4 (TCP/UDP) connection holds all data from the beginning of the connection to its end, including:

- **Network metadata** - Source/destination IPs, ports, protocol
- **Kubernetes context** - Labels, workloads, pods, services, namespaces, nodes
- **Operating system info** - Process ID and other eBPF-captured data
- **PCAP data** - Raw packets for the entire connection

## L4 to L7 Mapping

When a connection is dissected, L7 objects (API calls) are created and mapped to the L4 connection. This enables:

- Correlating API calls to their underlying network connection
- Viewing all L7 messages within a single L4 connection
- Accessing raw PCAP data for any API call

