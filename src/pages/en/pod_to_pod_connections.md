---
title: Pod to Pod Connection Analysis
description: Pod-to-pod connection analysis detects and analyzes connections between pods and external services by processing all TCP packets. The `tcp` dissector is disabled by default due to its impact on performance and must be manually enabled. Use with caution, especially in small or targeted clusters. Future updates will improve usability, reduce resource use, and add UDP analysis.
layout: ../../layouts/MainLayout.astro
---

Pod-to-pod connection analysis enables you to detect every connection between pods and external services. It displays all connections and allows the user to search for specific ones. Regardless of the protocol or encryption, as long as it runs over TCP, it will appear in the Kubeshark Dashboard. This feature is also helpful for answering the question: "Why am I not seeing traffic?

For example, the following image illustrates a namespace connectivity map where two external services, `grafana.com` and `gorest.co.in`, are clearly marked with a red rectangle.

![Connectivity map](/connectivity.png)

Building a connectivity map and viewing the raw packet content of pod-to-pod communication becomes possible when enabling the `tcp` dissector, which starts processing all TCP packets. The goal of this functionality is to show connectivity, not necessarily to reassemble the messages. In addition to the connectivity map, you can view and filter all TCP packets.

![TCP log](/tcp_log.png)

## Enabling and Disabling

Due to its performance implications, the `tcp` dissector is disabled by default and should be enabled manually.

To enable this functionality, add the dissector to the list of supported dissectors by editing the `enabledDissectors` section in the `values.yaml` file.

```yaml
tap:
  enabledDissectors:
  #- amqp
  - dns
  - http
  # - icmp
  # - kafka
  # - redis
  # - sctp
  # - syscall
  - tcp # this dissector is disabled by default
  # - ws
```

To disable, remove the dissector from the list.

## How to View Only TCP Messages

To see only TCP messages (packets) and avoid displaying other types, you can use the `tcp` display filter.

## Performance Impact

Using this dissector can cause increased CPU, memory, and storage consumption. We currently recommend using this functionality with caution. For example, we do not recommend using this functionality in busy clusters, targeting all pods in the cluster. Instead, we suggest using this functionality in small clusters or in conjunction with [pod targeting](/en/pod_targeting).

In the following example, we see all the connectivity related to a single pod when setting the proper capture filter:

![Showing only one pod](/one_pod.png)

The following image shows that enabling this functionality increases CPU levels. However, using it in conjunction with a capture filter significantly reduces CPU consumption:

![One pod performance](/one_pod_perf.png)

## What to Expect

Pod-to-pod connection analysis by inspecting all TCP packets is a new feature that we plan to improve in subsequent releases. Our goals include:

1. Making it easier to enable/disable this functionality.
2. Reducing resource consumption to normal levels, allowing this functionality to work in busy production clusters.
3. Enhancing the insights derived from such analysis.
4. Adding UDP to the analysis.

**ETA:** Next few weeks.

> The `dns` dissector can also help in this analysis by showing all DNS traffic, usually indicating an intent to make a connection.
