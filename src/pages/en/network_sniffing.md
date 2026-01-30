---
title: Network Sniffing
description: Kubeshark can sniff both encrypted and unencrypted traffic in your cluster using various methods and APIs built into the Linux kernel.
layout: ../../layouts/MainLayout.astro
---

[Kubeshark](https://kubeshark.com) can sniff both encrypted and unencrypted traffic in your cluster using various methods and APIs built into [Linux kernel](https://www.kernel.org/).

## Direct Packet Capture

[Kubeshark](https://kubeshark.com)'s [Worker](/en/anatomy_of_kubeshark#worker) works at the Kubernetes Node level and uses direct packet capture to sniff the [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) and [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) traffic in your cluster using one of [libpcap](https://www.tcpdump.org/) or [AF_PACKET](https://man7.org/linux/man-pages/man7/packet.7.html. 

The **Worker** continuously captures TCP and UDP packets and saves locally in a local [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) storage that is limited in size.

Packets are dissected on-demand either by an active [Dashboard](/en/ui) connection or when [scripting](/en/automation_scripting) is used. The stored PCAP files have a very short expiration date, from seconds to a few minutes, depending on the storage limitation governed by the `tap.storagelimit` value.

> For longer retention of traffic and offline analysis, please read the [Traffic Recording & Offline Analysis](/en/cloud_forensics) section.

**Workers** dissect only packets that match one of the supported protocols (e.g. [HTTP](https://datatracker.ietf.org/doc/html/rfc2616), [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html), [Apache Kafka](https://kafka.apache.org/protocol), [Redis](https://redis.io/topics/protocol), [gRPC](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html), [GraphQL](https://graphql.org/learn/serving-over-http/) and [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)). Packets of other protocol will not be dissected and will be discarded, unless recorded by a script.