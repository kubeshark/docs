---
title: Pod-to-pod Connection Analysis
description: Pod-to-pod connection analysis detects and analyzes connections between pods and external services by processing all TCP packets. The `tcp` dissector is disabled by default due to its impact on performance and must be manually enabled. Use with caution, especially in small or targeted clusters. Future updates will improve usability, reduce resource use, and add UDP analysis.
layout: ../../layouts/MainLayout.astro
---

This functionality is particularly useful for answering the following questions:

1. Which pod is attempting to connect to a specific external IP or service?
2. Why is a certain pod-to-service connection failing?
3. Why am I not seeing certain traffic?

> Use the following [Helm](/en/install_helm) value `--set-json 'tap.enabledDissectors=["http","dns","tcp","icmp"]'` to enable the `tcp` dissector together with `dns`, `icmp` and `http` (as an example).

Pod-to-pod connection analysis enables you to detect every connection between pods and external services. It displays all connections and allows the user to search for specific ones. Regardless of the protocol or encryption, as long as it runs over TCP, it will appear in the **Kubeshark** Dashboard.

For example, the following image illustrates a namespace connectivity map, showing the connection between namespaces in the cluster and connection to external services. In this case, two external services, `grafana.com` and `gorest.co.in`, are clearly marked with a red rectangle.

![Connectivity map](/connectivity.png)

Building a connectivity map and viewing the raw packet content of pod-to-pod communication becomes possible when enabling the `tcp` dissector, which starts processing all TCP packets. In addition to the connectivity map, you can view and filter all TCP packets.

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
  - icmp
  # - kafka
  # - redis
  # - sctp
  # - syscall
  - tcp # this dissector is disabled by default
  # - ws
```
Alternatively, you can use a [Helm](/en/install_helm) command line argument indicating the protocols you'd like to process. In this example, **Kubeshark** will process `http`, `dns`, `icmp` and `tcp` only:

```yaml
--set-json 'tap.enabledDissectors=["http","dns","icmp","tcp"]'
```

To disable, remove the dissector from the list.

## Viewing the TCP Connection and Messages

This functionality is controlled via the `tcp` dissector keyword, which needs to be added to the list of `enabledDissectors` (mentioned above) and the [KFL](/en/filtering) alias: `tcp`, which can be used as a display filter. Using `tcp` as a display filter will show all TCP messages. Using `!tcp` will explicitly exclude TCP messages.

## Performance Impact

> Performance impact is expected to improve significantly in the near future.
 
Using this dissector can cause elevated CPU, memory, and storage consumption levels. We currently recommend using this functionality with caution. For example, we do not recommend using this functionality in busy clusters, targeting all pods in the cluster. Instead, we suggest using this functionality in conjunction with [pod targeting](/en/pod_targeting).

In the following example, we see all the connectivity related to a single pod when setting the proper capture filter:

![Showing only one pod](/one_pod.png)

The following image shows that enabling this functionality increases CPU levels. However, using it in conjunction with a [capture filter](/en/pod_targeting) significantly reduces CPU consumption:

![One pod performance](/one_pod_perf.png)

## Useful Display Filter Queries

- Show all cluster=>external traffic: `dst.namespace==""`
- Show all traffic between two namespaces (e.g. ns1<=>n2): `(src.namespace=="ns1" and dst.namespace=="ns2") or (src.namespace=="ns2" and dst.namespace=="ns1")`
- Show traffic going to an external domain: `dst.name=="www.domain.com"`

> You can experience this functionality in our [live demo portal]((https://demo.kubeshark.co/) by entering `tcp` in the display filter.

## What to Expect

Pod-to-pod connection analysis by inspecting all TCP packets is a new feature that we plan to improve in subsequent releases. Our goals include:

1. Making it easier to enable/disable this functionality.
2. Reducing resource consumption to normal levels, allowing this functionality to work in busy production clusters.
3. adding significant insights derived from such analysis.
4. Adding UDP to the analysis.

> The `dns` and `icmp` dissector can also help in this analysis, usually indicating an intent to make a connection or an issue in the network.
