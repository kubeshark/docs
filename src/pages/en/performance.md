---
title: Performance & Scale
description: AF_PACKET, AF_XDP, PF-RING.
layout: ../../layouts/MainLayout.astro
---

## CPU and Memory Requirements

Resource consumption depends on your cluster's throughput.

While normal operations of Kubeshark require very little resource utilization, running the dashboard might cause a peak in CPU and memory utilization within the allocated resources for Kubeshark.

## Resource Limitation

In any event resource allocation is limited and can be set as a configuration variable.
```js
tap:
  resources:
    worker:
      limits:
        cpu: 750m
        memory: 1Gi
      requests:
        cpu: 50m
        memory: 50Mi
    hub:
      limits:
        cpu: 750m
        memory: 1Gi
      requests:
        cpu: 50m
        memory: 50Mi
```

## Packet Processing Library

AF_PACKET, AF_XDP, and PF_RING are all different technologies related to packet processing and networking in Linux systems. Each of them serves specific purposes and has its own advantages and use cases. Let's explore each of them:

### In The Context of Kubeshark

While AF_PACKET is readily available for most common architectures, AF_XDP and PF_RING availability depends on various topics like your worker nodes' architecture and MTU. Kubeshark will try first to use PF_RING, as it is the most performant packet capture library, nad if not possible will downgrade to AF_XDP and then again to AF_PACKET.

### AF_PACKET (Packet Socket)

AF_PACKET is a socket type in the Linux socket API that provides direct access to network packets at the link-layer level. It allows applications to receive and send raw packets, including Ethernet headers. This is useful for applications that require low-level access to network traffic, such as network analyzers, packet capture tools (like Wireshark), and custom networking utilities.

### AF_XDP (Express Data Path)

AF_XDP is a newer socket type introduced in the Linux kernel that enables high-performance packet processing directly in the kernel space. It leverages the [eBPF (extended Berkeley Packet Filter)](https://ebpf.io/) technology to execute code in a safe and controlled manner within the kernel. AF_XDP is designed to offload packet processing tasks from user space to the kernel, resulting in reduced latency and improved efficiency. It's commonly used for applications that require fast packet filtering, forwarding, and other network functions.

### PF_RING

PF_RING is a high-speed packet capture and processing framework that provides APIs and tools for dealing with network traffic efficiently. It includes support for various packet capture methods, including kernel bypass techniques to offload packet processing from the kernel to user space. PF_RING aims to address the limitations of the traditional networking stack in Linux and offers acceleration mechanisms for high-speed packet capture and analysis. It is often used in scenarios that demand high-performance packet processing, such as intrusion detection systems (IDS) and network monitoring appliances.

### In Summary

AF_PACKET provides raw access to network packets at the link-layer level and is useful for packet capturing and analysis.

AF_XDP allows high-performance packet processing in the kernel space using eBPF, suitable for tasks like packet filtering and forwarding.

PF_RING is a framework that offers efficient packet capture and processing, often with kernel bypass techniques, for applications requiring high-speed network analysis.

The choice between these technologies depends on the specific requirements of your application, the level of control and performance needed, and whether you want to perform packet processing in user space or kernel space.

## Comparison 

| Library | AF_PACKET | AF_XDP | PF_RING |
| --- | --- | --- | --- |
| Use Case | Primarily used for packet capture, monitoring, and analysis in user space. It provides raw access to network packets. | Designed for high-performance packet processing within the kernel space. It's used for tasks like packet filtering, load balancing, and network functions offloading. | Geared towards high-speed packet capture and processing, often with kernel bypass, suitable for network monitoring, intrusion detection, and high-throughput applications. |
| Performance | Generally good performance for packet capture but requires user-space processing. | Offers high performance due to kernel-space processing with eBPF, reducing context switches and improving efficiency. | Provides mechanisms for high-speed packet capture and processing, aiming to minimize overhead associated with traditional packet handling in the kernel. |
| Flexibility | Provides raw access to packets, allowing for various processing, but may require more user-space code to implement specific tasks. | Offers flexibility through eBPF programs that can be loaded dynamically. This allows for customizable and efficient packet processing within the kernel. | Provides APIs and tools for advanced packet capture and processing, supporting user-space and kernel-bypass approaches.  |
|Ease of Use and Development | Requires manual packet parsing and handling in user space. More effort is needed for complex processing tasks. | Requires familiarity with eBPF and kernel programming but simplifies packet processing by executing code directly in the kernel. | Provides APIs to simplify packet capture but might involve more complexity when implementing specific processing tasks. |
|Integration with Ecosystem|Part of the standard Linux socket API, widely supported, but may not offer the same level of performance as AF_XDP or PF_RING for certain use cases.|Utilizes eBPF, a powerful technology for custom packet processing in the kernel, and integrates well with the broader eBPF ecosystem.|A separate framework that needs to be integrated into the application. Provides enhanced performance for specific use cases but requires more setup.|
|Community and Support|Established part of the Linux networking stack with a well-documented API.|Emerging technology with growing community support, especially within the eBPF ecosystem.|Well-maintained project with a community and commercial support, often used in specialized network monitoring applications.|

In conclusion, each technology serves different purposes in the realm of packet processing and networking. AF_PACKET is suitable for packet capture and analysis, AF_XDP excels in high-performance packet processing in the kernel, and PF_RING offers a framework for high-speed packet capture and analysis, particularly with kernel bypass capabilities. The choice depends on the specific requirements and trade-offs of your application.