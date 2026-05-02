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

### Database Protocols

| Protocol | Description |
|----------|-------------|
| [MySQL](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_basics.html) | MySQL wire protocol (COM_QUERY, COM_STMT_PREPARE, COM_INIT_DB) |
| [PostgreSQL](https://www.postgresql.org/docs/current/protocol.html) | PostgreSQL wire protocol (Simple Query and Extended Query) |

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

Kubeshark decrypts TLS in-place by hooking the cryptographic library inside each workload with eBPF — no private keys, no certificates, no sidecars. Support is image-specific, and service-mesh mTLS (Istio, Cilium, Consul, Envoy-based meshes) is captured in plaintext with no additional setup.

**→ [TLS Decryption: supported libraries, images, and how it works](/en/encrypted_traffic)**

---

[Learn about capture filters →](/en/pod_targeting)
