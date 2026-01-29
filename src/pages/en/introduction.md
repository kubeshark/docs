---
title: AI-Powered Network Observability
description: Real-time K8s network visibility and forensics, capturing and monitoring all traffic and payloads going in, out, and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Think [Wireshark](https://www.wireshark.org/)—reimagined for [Kubernetes](https://kubernetes.io/): deployed cluster-wide, continuously capturing and analyzing traffic in real time.

**Kubeshark** delivers cluster-wide, real-time, identity-aware, protocol-level visibility into both L4 and L7 (API) traffic, including **encrypted (TLS)** payloads, as it enters, exits, and flows through containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

## Protocol Support

**Kubeshark** leverages advanced packet capture technologies such as [eBPF](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) and [AF_PACKET](https://manpages.org/af_packet/7) to capture Layer 4 traffic (TCP, UDP, SCTP) across the cluster, reconstructing it into application-layer protocols. Supported protocols include:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)  
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)  
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)  
- [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455)  
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)  
- [Apache Kafka](https://kafka.apache.org/protocol)  
- [Redis](https://redis.io/topics/protocol)  
- [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html)  
- [GraphQL over HTTP/1.1](https://graphql.org/learn/serving-over-http/)  
- [GraphQL over HTTP/2](https://graphql.org/learn/serving-over-http/)  
- [LDAP](https://datatracker.ietf.org/doc/html/rfc4511)  
- [RADIUS](https://datatracker.ietf.org/doc/html/rfc2865)  
- [DIAMETER](https://datatracker.ietf.org/doc/html/rfc6733)  
- [ICMP](https://datatracker.ietf.org/doc/html/rfc792)  
- [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)  
- [UDP](https://datatracker.ietf.org/doc/html/rfc768)  
- [SCTP](https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol)  
- [TLS](https://datatracker.ietf.org/doc/html/rfc5246)  
- [TCP](https://datatracker.ietf.org/doc/html/rfc9293)  

**Kubeshark** can intercept [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)-encrypted traffic inside the cluster **without requiring access to private keys** by hooking into runtime cryptographic libraries such as [OpenSSL](https://www.openssl.org/), Go's [crypto/tls](https://pkg.go.dev/crypto/tls), and [BoringSSL](https://github.com/google/boringssl). This technique captures plaintext data at the application layer before encryption or after decryption.

Kubeshark also integrates seamlessly with service mesh solutions such as [Istio](https://istio.io/), [Linkerd](https://linkerd.io/), and others, displaying mTLS-encrypted traffic in plaintext.

---

## Traffic Recording and Offline Analysis

For issues that are not immediately apparent during live monitoring, you can schedule traffic captures or trigger recording based on specific events. Captured traffic can be analyzed offline and exported to immutable storage solutions (e.g., AWS S3, GCS) for long-term retention and compliance purposes.

---

## L7 API Dissection

**Kubeshark** performs L7 API dissection, enriching captured traffic and payloads with full [Kubernetes](https://kubernetes.io/) context (e.g., workload identities, namespaces, pods, nodes, and services) as well as API context (e.g., request/response correlation, endpoints, status codes, headers, and payloads).