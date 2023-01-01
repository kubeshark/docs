---
title: Instant Distributed Visibility
description: Kubeshark, not only saves you time, it gives you access to all traffic wherever it happens and whenever it happens
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

Kubernetes enables unlimited horizontal scalability by enabling the distribution of the application's business logic across hundreds or even thousands of microservices.

## The New Internal API Layer

Compared to the older Monolith, huge portions of the codebase that represent the public interfaces (aka public methods) are replaced by APIs in the Microservice Communication layer. The Microservice Communication layer has several names like Internal APIs or East-West APIs.

**New internal API layer has exponentially more APIs, compared to external APIs.**

![Unlimited Scalability](/internal-api.png)

Due to Kubernetes’ distributed and dynamic nature, new protocols and service mesh technologies, tracking internal APIs is highly challenging, making it harder to troubleshoot and protect.

While anyone can `ssh` into a Pod, use `TCPdump` to capture traffic into a PCAP file, use `kubectl cp` to copy the PCAP file to their machine and use Wireshark to view, Kubernetes makes it more challenging by distributing the traffic across hundreds of such Pods that are dynamically started and stopped.

## All Traffic Wherever and Whenever It Happens

Think of **Kubeshark** as automating the traffic capture process across all Pods and instantly presenting the dissected traffic in a **Web UI** (or PCAP).

**Kubeshark**, does not only save you time, it gives you access to all traffic wherever it happens and whenever it happens.

This can be good news for API troubleshooting, monitoring and protection.