---
title: Network Sniffing
description: Network Sniffing
layout: ../../layouts/MainLayout.astro
---

Kubeshark can sniff both encrypted and unencrypted traffic in your cluster using
various methods and APIs built into [Linux kernel](https://www.kernel.org/).

## Direct Packet Capture

Direct packet capture sniffs the [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
traffic in your cluster using [libpcap](https://www.tcpdump.org/),
[AF_PACKET](https://man7.org/linux/man-pages/man7/packet.7.html) and
[PF_RING](https://www.ntop.org/products/packet-capture/pf_ring/) and
records it into a [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) file.
The TCP packets that are stored in the PCAP file being dissected on demand
upon [querying](/en/querying) for the folowwing application layer protocols:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [Apache Kafka](https://kafka.apache.org/protocol)
- [Redis](https://redis.io/topics/protocol)

Also, it can recognize [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html),
[GraphQL over HTTP/1.1](https://graphql.org/learn/serving-over-http/)
and [GraphQL over HTTP/2](https://graphql.org/learn/serving-over-http/).

### Service Meshes

Kubeshark automatically detects
and includes any [Envoy Proxy](https://www.envoyproxy.io/) to its list of TCP packet capture sources.
Envoy Proxy is widely used by the service meshes like Istio.

Even though the service meshes known for encrypting the traffic between regional nodes, we capture
the unencrypted traffic simply by detecting their network interfaces and without doing any kernel tracing.

## eBPF Based Packet Capture

eBPF based packet capture sniffs the [encrypted traffic (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) in your cluster using
eBPF **without actually doing decryption**. In fact, it hooks into entry and exit points in certain functions inside the
[OpenSSL](https://www.openssl.org/) library and Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package.

See [Kernel Tracing](/en/kernel_tracing) for more info.
