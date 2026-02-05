---
title: API (L7) Dissection
description: How Kubeshark reconstructs complete API calls from network traffic with full Kubernetes context.
layout: ../../../layouts/MainLayout.astro
mascot: Hello
---

[Kubeshark](https://kubeshark.com) performs L7/API dissection to enrich captured traffic and payloads with full [Kubernetes](https://kubernetes.io/) context (e.g., workload identities, node, namespace, pod, and service names) and API context (e.g., request/response matching, endpoint and status codes, headers, and payloads).

![API Dissection](/api_context.png)

## The API Context (L7)

**The problem**: [Kubernetes](https://kubernetes.io/) is distributed and multilayered, with critical information scattered across the network, the nodes’ operating systems, and the control plane.

![Fragment Kubernetes and API contexts](/fragmented2.png)

Fragmentation is most pronounced at the API layer, where much of the API context resides within the network and is distributed across multiple L4 streams. The network is large, highly distributed, and less accessible than other parts of the infrastructure, making it difficult to reconstruct the complete API context without correlating data across layers and focusing analysis at the network level.

## API (L7) Dissection

API dissection goes beyond basic traffic inspection. It reconstructs complete API calls from network data by identifying requests and responses, protocol metadata, and payloads.

This process requires buffering both ingress and egress traffic between two peers, matching requests to responses, detecting the underlying protocol, and parsing payloads according to the protocol specification.

Once API calls are successfully dissected, each call is enriched with workload and application identities. These identities are derived by correlating Kubernetes events from the Kubernetes API server with operating system context collected from distributed nodes via eBPF. The result links each API call to its originating pod, service, namespace, labels, and, when available, the specific process that generated the traffic.

Unlike raw packet data, which lacks higher-level context, API dissection provides structured, semantically meaningful information.

### Raw TCP and UDP Packets
Raw traffic includes IPs, ports, and raw packets. It lacks the API context, and IPs and ports alone aren't sufficient for establishing communication identities.
![See raw packet information in Wireshark](/wireshark.png)

### Workload Identities

[Kubernetes](https://kubernetes.io/) orchestrates workload identities (e.g., service, pod, namespace). It's impossible to establish workload identities by inspecting raw packets alone. To establish workload identities, [Kubeshark](https://kubeshark.com) maintains a name-to-IP resolution table that enables correlating IP addresses to workload identities.

For each peer (e.g., source or destination), the following information is presented:
- Service name
- Pod name
- Namespace
- Node

This comes in addition to:
- IP
- Port
- Protocol

### API Components
API components are parsed according to protocol specifications. For example, in HTTP, the following information is parsed:
- Request
- Matched response
- API endpoint
- Headers
- Payload
- Response status code

![API Payload](/api_payload.png)
