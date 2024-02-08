---
title: PF_RING
description: 
layout: ../../layouts/MainLayout.astro
---

[AF_PACKET](https://man7.org/linux/man-pages/man7/packet.7.html) and [PF-RING](https://www.ntop.org/products/packet-capture/pf_ring/) are two traffic processing libraries. While AF_PACKET is available by default on Linux systems, PF_RING requires the installation of a kernel module.

## Why Install PF-RING
**AF_PACKET Heavy Load Packet Drop**    

The kernel has a buffer for holding these packets before they are processed or handed off to user space (where AF_PACKET operates). If this buffer becomes full, which can happen if the system is under heavy load or if packet arrival rate is very high, new incoming packets will be dropped. This is because the kernel can't process and clear the buffer fast enough to make room for new packets.

The risk of packet loss is particularly high in high-throughput or high-bandwidth scenarios, where the volume of incoming packets is large.

When the operating system (OS) is busy (e.g., high CPU usage, performing other resource-intensive tasks), the efficiency of the kernel in processing these packets decreases.
This increased load can slow down the packet processing, leading to buffer overflows and subsequent packet loss.

### Significant Memory Consumption
As packet drop number grows so does the Worker memory consumption and the likelihood of the Worker pod getting OOM killed.

## Kernel Version Specific Kernel Module Files
All popular kernel module files are stored in this [Docker image](https://docker.io/kubeshark/pf-ring-module:all).

When the kernel module configuration option is enabled, this image is pulled and if the version specific Kernel MOdule file is available, it will be loaded and used by all Workers.

`tap:
  kernelModule:
    enabled: true
    unloadOnDestroy: true
`

## Air-Gapped Environment  

To use PF-RING in an air-gapped environment, the image 

## Building the Kernel Module from Scratch



Permissions

How