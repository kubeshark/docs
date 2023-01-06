---
title: Instant Distributed Visibility
description: Kubeshark, not only saves you time, it gives you access to all traffic wherever it happens and whenever it happens
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubernetes introduces a new internal network that is mostly used to carry Kubernetes-internal service-to-service API communication (aka Internal APIs or East-West APIs) as well as communication between internal services to external services. 

Due to Kubernetes’ distributed and highly dynamic nature, tracking service-to-service communication and communication to external service is highly challenging, making it harder to troubleshoot and protect.

![Unlimited Scalability](/internal-api.png)

While anyone can `ssh` into a Pod, use `TCPdump` to capture traffic into a PCAP file, use `kubectl cp` to copy the PCAP file to their machine and use Wireshark to view, Kubernetes makes it more challenging by distributing the traffic across hundreds of such Pods that are dynamically started and stopped.

## All Traffic Wherever and Whenever It Happens

Think of **Kubeshark** as automating the traffic capture process across all Pods and instantly presenting the dissected traffic in a **Web UI** (or PCAP).

**Kubeshark**, does not only save you time, it gives you access to all traffic wherever it happens and whenever it happens.

This can be good news for API troubleshooting, monitoring and protection.