---
title: Protocol Support
description: Complete list of network protocols supported by Kubeshark, including TLS decryption via eBPF.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark supports a comprehensive range of network protocols across multiple layers, from low-level transport protocols to application-layer APIs.

---

## Supported Protocols

### HTTP & Web Protocols

| Protocol | Version | Description |
|----------|---------|-------------|
| [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945) | RFC 1945 | Original HTTP protocol |
| [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616) | RFC 2616 | Persistent connections, chunked transfer |
| [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540) | RFC 7540 | Multiplexed streams, header compression |
| [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) | RFC 6455 | Full-duplex communication over HTTP |
| [GraphQL](https://graphql.org/learn/serving-over-http/) | HTTP/1.1 & HTTP/2 | Query language for APIs |

### Messaging & Streaming

| Protocol | Description |
|----------|-------------|
| [Apache Kafka](https://kafka.apache.org/protocol) | Distributed event streaming platform |
| [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html) | Advanced Message Queuing Protocol (RabbitMQ) |
| [Redis](https://redis.io/topics/protocol) | In-memory data structure store protocol |

### RPC & API Protocols

| Protocol | Description |
|----------|-------------|
| [gRPC](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html) | High-performance RPC over HTTP/2 |

### Authentication Protocols

| Protocol | RFC | Description |
|----------|-----|-------------|
| [LDAP](https://datatracker.ietf.org/doc/html/rfc4511) | RFC 4511 | Lightweight Directory Access Protocol |
| [RADIUS](https://datatracker.ietf.org/doc/html/rfc2865) | RFC 2865 | Remote Authentication Dial-In User Service |
| [DIAMETER](https://datatracker.ietf.org/doc/html/rfc6733) | RFC 6733 | Authentication, Authorization, and Accounting |

### Network & Transport Layer

| Protocol | RFC | Description |
|----------|-----|-------------|
| [TCP](https://datatracker.ietf.org/doc/html/rfc9293) | RFC 9293 | Transmission Control Protocol |
| [UDP](https://datatracker.ietf.org/doc/html/rfc768) | RFC 768 | User Datagram Protocol |
| [SCTP](https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol) | RFC 4960 | Stream Control Transmission Protocol |
| [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml) | RFC 1035 | Domain Name System |
| [ICMP](https://datatracker.ietf.org/doc/html/rfc792) | RFC 792 | Internet Control Message Protocol |

### Security Protocols

| Protocol | Description |
|----------|-------------|
| [TLS](https://datatracker.ietf.org/doc/html/rfc5246) | Transport Layer Security with automatic decryption |

---

## TLS Decryption

Kubeshark captures TLS traffic in clear text by hooking into the cryptographic libraries used by applications — **without requiring access to private keys**. Using eBPF, it intercepts data after decryption (on read) and before encryption (on write), capturing the plain text directly from memory.

### Supported Libraries

| Library | Languages / Runtimes | Requirement |
|---------|---------------------|-------------|
| [OpenSSL](https://www.openssl.org/) | Python, Java, PHP, Ruby, Node.js | Linked as shared library |
| [Go crypto/tls](https://pkg.go.dev/crypto/tls) | Go services | Non-stripped binaries |
| [BoringSSL](https://github.com/google/boringssl) | gRPC, Chrome, Envoy | Linked as shared library |

If your application uses one of these libraries for TLS termination, Kubeshark can display the traffic in clear text.

### How It Works

Kubeshark traces both kernel-space and user-space functions using [eBPF](https://prototype-kernel.readthedocs.io/en/latest/bpf/) — an in-kernel virtual machine that runs programs passed from user space.

- **OpenSSL** — attaches [uprobes](https://docs.kernel.org/trace/uprobetracer.html) to `SSL_read` and `SSL_write`, capturing unencrypted data in any TLS/SSL connection. Covers Python, Java, PHP, Ruby, and Node.js.
- **Go** — probes `crypto/tls.(*Conn).Read` and `crypto/tls.(*Conn).Write`. Supports both **amd64** and **arm64** with ABI0 and ABIInternal. Uses Capstone for binary disassembly and DWARF tables for Goroutine tracking.
- **Kernel** — uses [`kprobes`](https://www.kernel.org/doc/html/latest/trace/kprobes.html) for address resolution and request-response matching.

These methods have minimal performance impact. The Linux kernel limits the number of eBPF instructions allowed for probing, ensuring no significant slowdown.

### Service Mesh Integration

Kubeshark integrates with service mesh solutions, displaying mTLS-encrypted traffic in plaintext:

- [Istio](https://istio.io/)
- [Linkerd](https://linkerd.io/)
- Other Envoy-based service meshes

---

## How Protocol Indexing Works

1. **Capture**: [eBPF](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) and [AF_PACKET](https://manpages.org/af_packet/7) capture Layer 4 traffic (TCP, UDP, SCTP)
2. **Identify**: Protocol identification based on port numbers and payload inspection
3. **Dissect**: Protocol-specific parsing reconstructs application-layer messages
4. **Enrich**: Traffic is enriched with Kubernetes context (pods, services, namespaces)

<div class="callout callout-warning">

If Kubeshark cannot identify the protocol, the traffic is still available at the L4 level with full Kubernetes and network context. Only the API context is missing. See [L4 to L7 & PCAP Viewer](/en/v2/l4_to_l7#when-dissection-fails) for details.

</div>

[Learn about capture filters →](/en/pod_targeting)
