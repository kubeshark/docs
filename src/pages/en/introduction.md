---
title: Actionable Network Observability
description: Real-time K8s network visibility and forensics, capturing and monitoring all traffic and payloads going in, out, and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Gain deep visibility into every aspect of your Kubernetes (K8s) cluster.**

**Kubeshark** empowers SREs, DevOps, and security teams with:

- Cluster-wide API traffic visibility  
- Zero-touch, comprehensive distributed tracing  
- Actionable network insights  

Whether you're responding to a production incident, troubleshooting anomalies, or preparing for future issues, **Kubeshark** makes the root cause instantly visible.

Think [Wireshark](https://www.wireshark.org/)—reimagined for [Kubernetes](https://kubernetes.io/), deployed everywhere, continuously capturing and analyzing traffic in real time.

---

## Cluster-wide Visibility

**Kubeshark** delivers real-time, identity-aware, protocol-level visibility into API traffic, enabling users to observe activity within every segment of their K8s clusters—even hidden ones.

Monitor all traffic, including **encrypted (TLS)** payloads, as it enters, exits, and flows through containers, pods, namespaces, nodes, and clusters.

![Kubeshark UI](/kubeshark-ui.png)

### Protocol Support

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

**Kubeshark** can intercept [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) traffic inside the cluster **without decryption** by hooking into runtime libraries such as [OpenSSL](https://www.openssl.org/), Go’s [crypto/tls](https://pkg.go.dev/crypto/tls), and [BoringSSL](https://github.com/google/boringssl).

It also integrates seamlessly with service mesh solutions like [Istio](https://istio.io/), [Linkerd](https://linkerd.io/), and others, displaying mTLS traffic in clear text.

---

## Traffic Recording & Offline Analysis

When issues aren't immediately detectable during live observation, you can schedule or trigger traffic recording based on specific events. Recorded traffic can be analyzed offline and uploaded to immutable storage systems (e.g., AWS S3, GCS) for long-term retention.

---

## Automatic Distributed Tracing

**Kubeshark** provides full visibility into every API call—latency, throughput, bandwidth, and payload included. You can view complete traces and define custom spans using a powerful query language. Every trace is enriched with:

1. **Network context** – Access full payloads, including encrypted ones—not just headers.  
2. **Kubernetes context** – Understand each span's placement within namespaces, pods, and identity metadata.  
3. **Linux OS context** – Inspect process IDs, paths, socket info, and more.  

![Automatic Distributed Tracing](/spans.png)

**Kubeshark** requires no code instrumentation, CNI changes, sidecars, service meshes, or architectural adjustments.

---

## Actionable Network Insights with Network Agents

Users can create and run unlimited **Network Agents**, each handling a specific network automation task.

Agents can detect anomalies, enforce policies, export metrics and logs, generate reports, or record traffic on demand.

### Creating an Agent

Start with a template or build from scratch using our GenAI assistant.  
Each agent is powered by a customizable [JavaScript script](/en/automation_scripting).  
Agents observe traffic via [hooks](/en/automation_hooks) and trigger actions using [helpers](/en/automation_helpers).

### Optional LLM Connection

Connecting to an external LLM is optional and can be fully disabled for air-gapped environments.  
If enabled, each **Network Agent** maintains a persistent LLM connection to:

1. Send JSON data over time and receive actionable insights (e.g., anomaly detection).  
2. Continuously refine and improve the agent’s logic.