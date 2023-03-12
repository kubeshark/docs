---
title: Kubernetes Network Observability
description: Real-time K8s network visibility and forensics, capturing and monitoring all traffic and payloads going in, out and across containers, pods, nodes and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Through Scalable & Secure Traffic Capture**

**Kubeshark** is an API Traffic Analyzer for [Kubernetes](https://kubernetes.io/) providing real-time, protocol-level visibility into Kubernetes’ internal network, capturing, dissecting and monitoring all traffic and payloads going in, out and across containers, pods, nodes and clusters.

![Kubeshark UI](/kubeshark-ui.png)

Think [TCPDump](https://en.wikipedia.org/wiki/Tcpdump) and [Wireshark](https://www.wireshark.org/) re-invented for Kubernetes.

Kubeshark can sniff parts or all TCP traffic in your cluster, record it into a PCAP file and dissect the following application layer protocols:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [Apache Kafka](https://kafka.apache.org/protocol)
- [Redis](https://redis.io/topics/protocol)
- [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)

Kubeshark recognizes [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html),
[GraphQL over HTTP/1.1](https://graphql.org/learn/serving-over-http/)
and [GraphQL over HTTP/2](https://graphql.org/learn/serving-over-http/).

Kubeshark uses [extended BPF (eBPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) to trace function calls in both the kernel space and the user space.

Kubeshark can sniff the [encrypted traffic (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) in your cluster using
eBPF **without actually doing decryption**. In fact, it hooks into entry and exit points in certain functions inside the
[OpenSSL](https://www.openssl.org/) library and Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package.

Kubeshark can recognize service mesh solutions like [Istio](https://istio.io/), [Linkerd](https://linkerd.io/) and other service mesh solutions that use [Envoy Proxy](https://www.envoyproxy.io/) under the hood.

With a combination of a scripting language, hooks, helpers and jobs, **Kubeshark** can detect suspicious network behaviors and trigger actions supported by the available integrations (e.g Slack, AWS S3, InfluxDB and more).
