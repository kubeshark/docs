---
title: Protocol Support
description: Complete list of supported protocols and how to configure protocol dissectors in Kubeshark.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

[Kubeshark](https://kubeshark.com) supports a comprehensive range of network protocols across multiple layers, from low-level transport protocols to application-layer APIs.

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

<div class="callout callout-tip">

[Kubeshark](https://kubeshark.com) can intercept TLS-encrypted traffic **without requiring access to private keys**.

</div>

[Kubeshark](https://kubeshark.com) hooks into runtime cryptographic libraries to capture plaintext data at the application layer before encryption or after decryption:

| Library | Language/Platform |
|---------|-------------------|
| [OpenSSL](https://www.openssl.org/) | C/C++, Python, Ruby, PHP, etc. |
| [crypto/tls](https://pkg.go.dev/crypto/tls) | Go applications |
| [BoringSSL](https://github.com/google/boringssl) | Chrome, Android, etc. |

### Service Mesh Integration

[Kubeshark](https://kubeshark.com) integrates seamlessly with service mesh solutions, displaying mTLS-encrypted traffic in plaintext:

- [Istio](https://istio.io/)
- [Linkerd](https://linkerd.io/)
- Other Envoy-based service meshes

[Learn more about TLS decryption →](/en/encrypted_traffic)

---

## How Protocol Dissection Works

[Kubeshark](https://kubeshark.com) uses advanced packet capture technologies:

1. **Capture**: [eBPF](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) and [AF_PACKET](https://manpages.org/af_packet/7) capture Layer 4 traffic (TCP, UDP, SCTP)
2. **Identify**: Protocol identification based on port numbers and payload inspection
3. **Dissect**: Protocol-specific parsing reconstructs application-layer messages
4. **Enrich**: Traffic is enriched with Kubernetes context (pods, services, namespaces)

<div class="callout callout-warning">

If [Kubeshark](https://kubeshark.com) cannot identify the protocol, the traffic is discarded and not displayed. Only traffic from targeted pods is captured.

</div>

[Learn about capture filters →](/en/pod_targeting)

---

## Configuring Protocol Dissectors

You can enable or disable protocol dissectors to:
- **Reduce noise** by filtering out less relevant protocols (e.g., DNS)
- **Improve performance** by processing less traffic

<div class="callout callout-info">

Some dissectors, like TCP, consume significant CPU, memory, and storage. Use them for debugging purposes only.

</div>

### Dashboard Configuration

The dashboard provides dynamic control over protocol dissectors:

![Protocol Dissectors Button](/dissectors_cta.png)

Click the button to open the dissector configuration dialog:

![Protocol Dissectors Window](/dissectors_dialog.png)

### Helm Configuration

Configure dissectors in your `values.yaml`:

```yaml
tap:
  enabledDissectors:
    - amqp
    - dns
    - http
    - icmp
    - kafka
    - redis
    - sctp
    # - syscall  # Disabled
    # - tcp      # Disabled - high resource usage
    - ws
```

Or use command-line arguments:

```bash
helm install kubeshark kubeshark/kubeshark \
  --set-json 'tap.enabledDissectors=["http","dns","kafka"]'
```

### Available Dissector Keys

| Key | Protocol |
|-----|----------|
| `amqp` | AMQP (RabbitMQ) |
| `dns` | DNS |
| `http` | HTTP/1.x, HTTP/2, gRPC, GraphQL |
| `icmp` | ICMP |
| `kafka` | Apache Kafka |
| `redis` | Redis |
| `sctp` | SCTP |
| `syscall` | System calls (high overhead) |
| `tcp` | Raw TCP (high overhead) |
| `ws` | WebSocket |

---

## Performance Considerations

| Dissector | CPU Impact | Memory Impact | Recommendation |
|-----------|------------|---------------|----------------|
| `http` | Low | Low | Always enabled |
| `dns` | Low | Low | Enable if needed |
| `kafka` | Medium | Medium | Enable for Kafka debugging |
| `tcp` | High | High | Debugging only |
| `syscall` | High | High | Debugging only |

<div class="callout callout-tip">

Start with minimal dissectors and enable more as needed for specific debugging sessions.

</div>
