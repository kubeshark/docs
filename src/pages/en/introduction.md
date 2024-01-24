---
title: The Kubernetes API Traffic Analyzer
description: Real-time K8s network visibility and forensics, capturing and monitoring all traffic and payloads going in, out, and across containers, pods, nodes, and clusters.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**See with your own eyes what's happening in every corner of your K8s cluster!**

Think [Wireshark](https://www.wireshark.org/) re-invented for [Kubernetes](https://kubernetes.io/) (K8s). **Kubeshark** provides SREs and DevOps teams instant and unique insights that were previously unattainable, accelerating the diagnosis process of production incidents and ensuring rapid resolution. 

**Kubeshark** offers real-time, cluster-wide, identity-aware, protocol-level visibility into API traffic, empowering its users to see with their own eyes what's happening in all (hidden) corners of their K8s clusters.

Observe all traffic, including payloads, entering, exiting, and traversing containers, pods, namespaces, nodes, and clusters, with support for REST, GraphQL, gRPC, Redis, Kafka, RabbitMQ (AMQP), DNS, TLS, mTLS, TCP (to diagnose TCP errors) and ICMP.

![Kubeshark UI](/kubeshark-ui.png)

## Kubeshark Use-cases

Visit the following sections to read more about the use-cases Kubeshark can assist with:
- [Deep Network Observability](/en/traffic_investigation)
- [Traffic Recording & Offline Analysis](/en/cloud_forensics)
- [Collaborative Incident Diagnosis](/en/collaborative_incident_diagnosis)
- [Incident Detection & Response](/en/actionable_detection)

## API Traffic Analysis

**Kubeshark** employs various packet [capture technologies (e.g. eBPF, AF_XDP, PF_RING)](/en/performance#packet-processing-library) and leverages [custom kernel modules](https://en.wikipedia.org/wiki/Loadable_kernel_module) to capture cluster-wide L4 (TCP and UDP) traffic, directing it into distributed PCAP storage, and dissecting the following application layer protocols:

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)
- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [Apache Kafka](https://kafka.apache.org/protocol)
- [Redis](https://redis.io/topics/protocol)
- [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)
- [ICMP](https://datatracker.ietf.org/doc/html/rfc792)
- [TCP](https://datatracker.ietf.org/doc/html/rfc9293) (to diagnose TCP errors)

**Kubeshark** recognizes [gRPC over HTTP/2](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html), [GraphQL over HTTP/1.1](https://graphql.org/learn/serving-over-http/), and [GraphQL over HTTP/2](https://graphql.org/learn/serving-over-http/).

Using [extended BPF (eBPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter), **Kubeshark** traces function calls in both the kernel and user spaces.

**Kubeshark** can sniff the [encrypted traffic (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) in your cluster using eBPF **without actually performing decryption**. In essence, it hooks into entry and exit points of certain functions within the [OpenSSL](https://www.openssl.org/) library and Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package.

**Kubeshark** recognizes service mesh solutions like [Istio](https://istio.io/), [Linkerd](https://linkerd.io/), and other service mesh implementations that utilize [Envoy Proxy](https://www.envoyproxy.io/) underneath.

## Actionable Detection Using Scripts & L4/L7 Hooks

With the combination of a [scripting language](/en/automation_scripting), [hooks](/en/automation_hooks), [helpers](/en/automation_helpers), and [jobs](/en/automation_jobs), **Kubeshark** can detect unusual network behaviors and activate actions supported by available integrations such as [Slack](/en/integrations_slack), [AWS S3](/en/integrations_aws_s3), [InfluxDB](/en/integrations_influxdb), [Elasticsearch](/en/integrations_elastic), and more.
