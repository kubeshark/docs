---
title: Network Sniffing
description: Kubeshark can sniff both encrypted and unencrypted traffic in your cluster using various methods and APIs built into the Linux kernel.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** can sniff both encrypted and unencrypted traffic in your cluster using various methods and APIs built into [Linux kernel](https://www.kernel.org/).

## Direct Packet Capture

**Kubeshark**'s [Worker](/en/anatomy_of_kubeshark#worker) works at the Kubernetes Node level and uses direct packet capture to sniff the [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) and [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) traffic in your cluster using one of [libpcap](https://www.tcpdump.org/), [AF_PACKET](https://man7.org/linux/man-pages/man7/packet.7.html), [AF_XDP](https://www.kernel.org/doc/html/next/networking/af_xdp.html) and [PF_RING](https://www.ntop.org/products/packet-capture/pf_ring/). 

The **Worker** continuously captures TCP and UDP packets into a master [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) file. This file is limited in size, flushes when limit is reached and acts as a buffer to enable on-demand offline dissection.

Packets are dissected on-demand either by an active [Dashboard](/en/ui) connection or when [scripting](/en/automation_scripting) is used. Packets that aren't dissected will be discarded when the master file flushes. 

Packets that are dissected as a result of an active Dashboard connection are retained for as long as the connection is active and aren't impacted by the master file flushing. 

You can retain traffic for longer time periods using scripting. Read more in the [Forensics](/en/cloud_forensics) section.

**Workers** dissect only packets that match one of the supported protocols (e.g. [HTTP](https://datatracker.ietf.org/doc/html/rfc2616), [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html), [Apache Kafka](https://kafka.apache.org/protocol), [Redis](https://redis.io/topics/protocol), [gRPC](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html), [GraphQL](https://graphql.org/learn/serving-over-http/) and [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)). Packets of other protocol will not be dissected and will be discarded.

> If you'd like to retain raw traffic that includes packets that aren't dissected, follow this [feature request](https://github.com/kubeshark/kubeshark/issues/1393).

## The TAP Command

The TAP command of the CLI instructs Kubeshark to deploy the **Hub** and start tapping based on the TAP scope rules.
To see the most up-to-date TAP documentation run:

```shell
kubeshark tap -h
```

### Pods and Namespaces

While capturing all traffic is possible, it is a storage and CPU intensive operation. **Kubeshark** enables you to describe the scope of traffic capture with support for namespaces and PODs.

#### Pods selection

##### Specific Pod:

```shell
kubeshark tap catalogue-b87b45784-sxc8q
```

##### Set of Pods Using a Regex:

You can use a regular expression to indicate several pod names as well as dynamically changing names.

In the example below using the regex `(catalo*|front-end*)` will catch the following three Pods:
* catalogue-868cc5ffd6-p9njn
* catalogue-db-669d5dbf48-8hnrl
* front-end-6db57bf84f-7kss9

```shell
kubeshark tap "(catalo*|front-end*)"
```

![PODS](/pods.png)

#### Namespaces

By default, **Kubeshark** is deployed into the `default` namespace.
To specify a different namespace:

```
kubeshark tap -n sock-shop
```

#### Specify All Namespaces

The default deployment strategy of **Kubeshark** waits for the new Pods
to be created. To simply deploy to all existing namespaces run:

```
kubeshark tap
```