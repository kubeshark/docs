---
title: L7 API Dissection
description: Reconstructing the API Context by Correlating Information from All Layers

layout: ../../../layouts/MainLayout.astro
mascot:
---

## API Dissection

API dissection goes beyond basic traffic inspection. It reconstructs complete API calls from network data by identifying requests and responses, protocol metadata, and payloads.

This process requires buffering both ingress and egress traffic between two peers, matching requests to responses, detecting the underlying protocol, and parsing payloads according to the protocol specification.

Once API calls are successfully dissected, each call is enriched with workload and application identities. These identities are derived by correlating Kubernetes events from the Kubernetes API server with operating system context collected from distributed nodes via eBPF. The result links each API call to its originating pod, service, namespace, labels, and, when available, the specific process that generated the traffic.

Unlike raw packet data, which lacks higher-level context, API dissection provides structured, semantically meaningful information. 

![API Dissection](/api_dissect.png)