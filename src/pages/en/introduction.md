---
title: Introduction
description: Docs intro
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Discover what's beneath the tip of the iceberg!**

Kubeshark is an **observability and monitoring tool for** [**Kubernetes**](https://kubernetes.io/), enabling **dynamic analysis** of the microservices, detecting **anomalies** and **triggering functions** when certain patterns appear in runtime.

Think of Kubeshark as a **Kubernetes-aware** combination of [**Wireshark**](https://www.wireshark.org/), [**BPF Compiler Collection (BCC) tools**](https://github.com/iovisor/bcc) and beyond.

Kubeshark can sniff parts or all TCP traffic in your cluster, record it into a PCAP file and dissect the following application layer protocols:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [Apache Kafka](https://kafka.apache.org/protocol)
- [Redis](https://redis.io/topics/protocol)

Kubeshark recognizes [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html),
[GraphQL over HTTP/1.1](https://graphql.org/learn/serving-over-http/)
and [GraphQL over HTTP/2](https://graphql.org/learn/serving-over-http/).

Kubeshark uses [extended BPF (eBPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) to trace function calls in both the kernel space and the user space.

Kubeshark can sniff the [encrypted traffic (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) in your cluster using
eBPF **without actually doing decryption**. In fact, it hooks into entry and exit points in certain functions inside the
[OpenSSL](https://www.openssl.org/) library and Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package.

Kubeshark can recognize service mesh solutions like [Istio](https://istio.io/) and [Linkerd](https://linkerd.io/)
that are used in your Kubernetes cluster.

Service meshe solutions use [Envoy Proxy](https://www.envoyproxy.io/) under the hood to encrypt the traffic.
Therefore Kubeshark automatically detects
and includes any Envoy Proxy to its list of TCP packet capture sources.
