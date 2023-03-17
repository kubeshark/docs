---
title: Service Mesh
description: About the service mesh support like Istio or Linkerd.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** can recognize service mesh solutions like [Istio](https://istio.io/), [Linkerd](https://linkerd.io/) and other service mesh solutions that use [Envoy Proxy](https://www.envoyproxy.io/) under the hood.

Even though the service mesh solutions known for encrypting the traffic between regional nodes, we capture
the unencrypted traffic simply by detecting their network interfaces and without doing any kernel tracing.
