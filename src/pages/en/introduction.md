---
title: Network Observability for Kubernetes
description: Real-time K8s network visibility and forensics, capturing and monitoring all traffic and payloads going in, out, and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Gain unparalleled insight into every aspect of your Kubernetes (K8s) cluster!**

**Kubeshark** equips SREs, DevOps, and security teams with:

- Cluster-wide API traffic visibility
- Zero-touch, comprehensive distributed tracing
- Unlimited GenAI-assisted network insights

Think [Wireshark](https://www.wireshark.org/) re-invented for [Kubernetes](https://kubernetes.io/), deployed everywhere, continuously capturing and analyzing traffic at all times.

## Cluster-wide Visibility

**Kubeshark** provides real-time, identity-aware, protocol-level visibility into API traffic, enabling users to observe firsthand the activities within every (even hidden) segment of their K8s clusters.

Monitor all traffic, including **encrypted (TLS)** data and payloads, as they enter, exit, and move through containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

### Protocol Support

**Kubeshark** utilizes various packet capture technologies (e.g., [eBPF](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter), [AF_PACKET](https://manpages.org/af_packet/7)) to capture cluster-wide Layer 4 (TCP, UDP, SCTP) traffic, dissecting and reassembling it into application-layer protocols. Supported protocols include:

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
- [ICMP](https://datatracker.ietf.org/doc/html/rfc792)
- [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)
- [UDP](https://datatracker.ietf.org/doc/html/rfc768)
- [SCTP](https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol)
- [TLS](https://datatracker.ietf.org/doc/html/rfc5246)
- [TCP](https://datatracker.ietf.org/doc/html/rfc9293)

**Kubeshark** can intercept [encrypted (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) traffic within your cluster **without decryption**. It hooks into specific functions in libraries such as [OpenSSL](https://www.openssl.org/), Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package, and Google's [BoringSSL](https://github.com/google/boringssl).

**Kubeshark** integrates seamlessly with service mesh solutions like [Istio](https://istio.io/), [Linkerd](https://linkerd.io/), and others, presenting mTLS traffic in plain text.

## Traffic Recording & Offline Analysis

When issues aren't immediately apparent during observation, you can schedule traffic recording or trigger it based on specific events. This data is available for offline analysis and can be uploaded to immutable storage solutions (e.g., AWS S3, GCS) for extended retention.

## Automatic Distributed Tracing

**Kubeshark** allows you to inspect all aspects of each API call, including latency, throughput, and bandwidth, in addition to inspecting its complete payload. You can further evaluate complete traces and create a mix of spans within the traces using a rich query language. Each span or trace is enriched with information related to:

1. **Network context:** Examine entire payloads—including encrypted ones—not just headers.  
2. **Kubernetes context:** Understand spans and traces within the Kubernetes environment, including identities, labels, namespaces, and more.  
3. **Linux operating system context:** Access details such as process IDs, names, paths, and socket information.  

![Automatic Distributed Tracing](/spans.png)

**Kubeshark** operates without requiring code instrumentation, CNI or CNI chaining, sidecars, proxies, service meshes, or any architectural changes.

## GenAI-Assisted Network Insights

**Kubeshark** continuously monitors all traffic. It leverages advancements in Generative AI to create custom metrics, reports, and automations based on specific logic and network information.

### Network Processors

**Network processors** utilize a [scripts](/en/automation_scripting) that combine [hooks](/en/automation_hooks) for real-time traffic processing and [helpers](/en/automation_helpers) to initiate actions. These network processors can generate custom reports, metrics, and various automations.

**Kubeshark** can run multiple network processors concurrently, each analyzing all traffic to serve a specific purpose (e.g., creating custom metrics for Prometheus or exporting traffic to API security scanning tools).

### Custom Reports & Automations

Here are examples of custom reports and automations, many available out-of-the-box within the dashboard:

##### Cost Optimization

- Report: Top 5 DNS consumers as well as the most requested DNS endpoints to avoid DNS rate limiting
- Report: Inactive pods

##### Security

- Report & Automation: Identify (and block) pods and processes with suspicious external communication
- Automation: Export traffic for API security scanning

##### Reliability, Performance & Troubleshooting

- Report: Theoretical impact of network policies on live pods
- Report: API latency anomalies
- Automation: Store the last 5 minutes of traffic from crashed pods