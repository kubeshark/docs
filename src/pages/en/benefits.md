---
title: Exponentially More APIs
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

Kubernetes enables unlimited horizontal scalability by enabling the distribution of the application's business logic across hundreds or even thousands of microservices. 

## The New Internal API Layer

Comparing to the older Monolith, huge portions of the codebase that represent the public interfaces (aka public methods) are replaced by the Microservice Communication layer. The Microservice Communication layer has several names like Internal APIs or East-West APIs.

The new internal API layer has exponentially more APIs, compared to external APIs.

Due to Kuberentes’ distributed and dynamic nature, new protocols and service mesh technologies, tracking internal APIs is highly challenging, making it harder to troubleshoot and protect.

![Unlimited Scalability](/benefits.png)

While anyone can ssh into a pod, use `TCPdump` to  capture traffic, then use `kubectl cp` to copy the PCAP to their machine and then use Wireshark to view the PCAP, Kubernetes makes it more challanging by distributing the traffic across hundreds of such pods that are dynamically started and stopped. 

## Instant Distributed Visibility

Think of Kubeshark as instantely automating the process across all pods and presenting the traffic in a Web UI (or PCAP). Kubeshark, can not only save you significant time, it now gives you access to all traffic whereever it is whenever it is. 

This can be good news for API troublshooting, monitoring and protection.
