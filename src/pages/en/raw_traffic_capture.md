---
title: PCAP Dumper (Capturing Raw Traffic)
description: The PCAP Dumper dumps the raw traffic into a named pipe directly from the node at a stage before any processing is done. This capability is particularly useful for debugging traffic when it isn't visible in the dashboard and some debugging is required. 
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

> The PCAP Dumper is a debug tool that aids in troubleshooting situations when traffic doesn't appear in the dashboard.

The PCAP Dumper is akin to running `tcpdump` on the node. It dumps the raw traffic into a named pipe directly from the node at a stage before any processing is done. This capability is particularly useful for debugging traffic when it isn't visible in the dashboard and some debugging is required.

Traffic capture occurs after a BPF expression is applied, if such an expression exists. This expression can be set if one of the [traffic targeting rules was applied](/en/pod_targeting). 

Raw traffic is piped on-demand and can be viewed in tools such as [Wireshark](https://www.wireshark.org/) or [Tshark](https://www.wireshark.org/docs/man-pages/tshark.html). Seeing the raw traffic can help identify any reasons why the traffic isn't visible in the dashboard.

## How to View Raw Traffic

Each node has a named pipe named `ksdump.pcap` located in the `data/<node-name>` folder in the `sniffer` container of the Worker DaemonSet.

To view the raw traffic of a certain node, you can use the following command:

```shell
kubectl exec <kubeshark-worker-pod-name> -c sniffer -- cat data/<node-name>/ksdump.pcap
```

Or

```shell
kubectl exec <kubeshark-worker-pod-name> -c sniffer -- tshark -i data/<node-name>/ksdump.pcap -w traffic.pcap
```

---

This version corrects the typos and improves the clarity of the instructions.