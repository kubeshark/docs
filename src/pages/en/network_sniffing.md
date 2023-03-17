---
title: Network Sniffing
description: Kubeshark can sniff both encrypted and unencrypted traffic in your cluster using various methods and APIs built into the Linux kernel
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** can sniff both encrypted and unencrypted traffic in your cluster using various methods and APIs built into [Linux kernel](https://www.kernel.org/).

## Direct Packet Capture

**Kubeshark**'s [Worker](/en/anatomy_of_kubeshark#worker) uses direct packet capture to sniff the [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) and [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) traffic in your cluster using [libpcap](https://www.tcpdump.org/), [AF_PACKET](https://man7.org/linux/man-pages/man7/packet.7.html) and [PF_RING](https://www.ntop.org/products/packet-capture/pf_ring/). The TCP and UDP packets that are stored in a [PCAP](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html) file and the packets are dissected on demand when a [query](/en/kfl) is received. The **Worker** works at the Kubernetes Node level.

The **Worker** dissects the TCP or UDP traffic on demand when a [query](/en/kfl) is received with support for popular application layer protocols like: [HTTP](https://datatracker.ietf.org/doc/html/rfc2616), [AMQP](https://www.rabbitmq.com/amqp-0-9-1-reference.html), [Apache Kafka](https://kafka.apache.org/protocol), [Redis](https://redis.io/topics/protocol), [gRPC](https://grpc.github.io/grpc/core/md_doc__p_r_o_t_o_c_o_l-_h_t_t_p2.html), [GraphQL](https://graphql.org/learn/serving-over-http/) and [DNS](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).

## The TAP Command

The TAP command of the CLI instructs Kubeshark to deploy the **Hub** and start tapping based on the TAP scope rules. 
> Learn more about the TAP scop rules in the [Pods & Namespaces](/en/scope) page.

TAP documentation can change. To see the most up-to-date TAP documentation run:

```shell
kubeshark tap -h
```

```shell
Usage:
  kubeshark tap [POD REGEX] [flags]

Flags:
  -A, --allnamespaces             Tap all namespaces.
  -r, --docker-registry string    The Docker registry that's hosting the images. (default "docker.io/kubeshark")
  -t, --docker-tag string         The tag of the Docker images that are going to be pulled. (default "latest")
      --dryrun                    Preview of all pods matching the regex, without tapping them.
  -h, --help                      help for tap
  -n, --namespaces strings        Namespaces selector.
  -p, --pcap string               Capture from a PCAP snapshot of Kubeshark (.tar.gz) using your Docker Daemon instead of Kubernetes.
      --proxy-front-port uint16   Provide a custom port for the front-end proxy/port-forward. (default 8899)
      --proxy-host string         Provide a custom host for the proxy/port-forward. (default "127.0.0.1")
      --proxy-hub-port uint16     Provide a custom port for the Hub proxy/port-forward. (default 8898)
      --servicemesh               Capture the encrypted traffic if the cluster is configured with a service mesh and with mTLS. (default true)
      --storagelimit string       Override the default storage limit. (per node) (default "200MB")
      --tls                       Capture the traffic that's encrypted with OpenSSL or Go crypto/tls libraries. (default true)

Global Flags:
      --config-path string   Override config file path using --config-path (default "$HOME/.kubeshark/config.yaml")
  -d, --debug                Enable debug mode.
      --set strings          Override values using --set
```
