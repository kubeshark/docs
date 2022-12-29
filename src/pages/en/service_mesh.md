---
title: Service Mesh
description: Service Mesh
layout: ../../layouts/MainLayout.astro
mascot: 
---

Kubeshark automatically detects and includes any [Envoy Proxy](https://www.envoyproxy.io/) to its list of TCP packet capture sources.

Envoy Proxy is widely used by service meshe solutions like Istio.

Even though the service meshes known for encrypting the traffic between regional nodes, we capture
the unencrypted traffic simply by detecting their network interfaces and without doing any kernel tracing.