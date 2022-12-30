---
title: Protocol Support
description: Docs intro
layout: ../../layouts/MainLayout.astro
mascot: 
---

Kubeshark can sniff parts or all TCP traffic in your cluster, record it into a PCAP file and dissect the following application layer protocols:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [Apache Kafka](https://kafka.apache.org/protocol)
- [Redis](https://redis.io/topics/protocol)
- [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html)
- [GraphQL over HTTP/1.1 and HTTP/2](https://graphql.org/learn/serving-over-http/)

Kubeshark presents the protocol name on the left side of the traffic entry box.

![Protocols](/protocols.png)