---
title: Introduction
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

**Discover what's beneath the tip of the iceberg!**

Kubeshark is an **observability tool for** [**Kubernetes**](https://kubernetes.io/). It's a tool to do **dynamic analysis** of your microservices and
**monitor** them against **the anomalies**, ultimately **trigger functions** in case of certains patterns occur in the runtime.

Think Kubeshark as [**Wireshark**](https://www.wireshark.org/), [**BPF Compiler Collection (BCC) tools**](https://github.com/iovisor/bcc) and beyond that are arranged in a fashion that everything is **Kubernetes-aware**.

Kubeshark can sniff the TCP traffic in your cluster, record it into a PCAP file and dissect the application layer protocols:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [Apache Kafka](https://kafka.apache.org/protocol)
- [Redis](https://redis.io/topics/protocol)

Also it can recognize [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html),
[GraphQL over HTTP/1.1](https://graphql.org/learn/serving-over-http/)
and [GraphQL over HTTP/2](https://graphql.org/learn/serving-over-http/).

It can trace function calls in both the kernel space and the user space using something called [extended BPF (eBPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) which is an API that's included into the Linux kernel source tree in version 3.18 and it's being developed by the kernel maintainers
since then.

Kubeshark can sniff the [encrypted traffic (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) in your cluster using
eBPF **without actually doing decryption**. In fact, it hooks into entry and exit points in certain functions inside the
[OpenSSL](https://www.openssl.org/) library and Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package.
