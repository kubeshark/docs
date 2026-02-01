---
title: Traffic Troubleshooting
description: Troubleshoot traffic across all nodes in your Kubernetes cluster
layout: ../../layouts/MainLayout.astro
---

To help network engineers troubleshoot traffic, [Kubeshark](https://kubeshark.com) added two interesting tools that can help learn more  about specific traffic.
Traffic is huge and it's impossible to track all traffic at all times.
Kubesahrk provides tools to segment the traffic and learn as much as possible and as a result address questions one can have about said traffic.

## AF_PACKET

When using the AF_PACKET library, Kubesahrk by default taps to the `any` interface which is the sum of all interfaces. 

In a Linux system, the any interface is a special network interface that is used to capture traffic from all available network interfaces. Unlike standard network interfaces such as eth0 or wlan0, the any interface is not associated with a specific hardware device. Instead, it is a virtual interface that allows tools like packet sniffers to capture network traffic across all interfaces simultaneously.



## eBPF

Traffic Targeting
Explicitely seeting a BPF expression will override any logic imposed by pod targeting rules
BPF Pipes

Listeinign to a single interface
Tapping a virtual interface
no problems with any.
