---
title: Performance & Scale
description: AF_PACKET, AF_XDP, PF-RING.
layout: ../../layouts/MainLayout.astro
---

## CPU and Memory Consumption

When you initially launch **Kubeshark**, it captures all traffic. However, dissecting the traffic—a process that can be resource-intensive—is executed on-demand. Hence, when evaluating performance, it's essential to consider three distinct scenarios:

1. **Idle State:** Minimal activity on the cluster.
2. **Loaded State without Dashboard:** The cluster is under significant load, but the **Kubeshark** dashboard is not open, implying no dissection of traffic.
3. **Loaded State with Dashboard:** Not only is the cluster under heavy load, but the **Kubeshark** dashboard is also active, showcasing real-time traffic.

Below, you'll find a performance demonstration for a two-node cluster powered by `m5.large` instances:

![Memory consumption](/memory.png)
![CPU consumption](/cpu.png)

The graph illustrates the memory usage of the system over time. Here's a breakdown of key observations:

- The 1st Scenario (indicated by "1"): This represents the memory usage when the system is idle.
- The 2nd Scenario (indicated by "2"): Shows the memory spike when the cluster is under significant load, but the **Kubeshark** dashboard remains closed.
- The 3rd Scenario (indicated by "3"): Portrays the memory consumption when the cluster is loaded and the **Kubeshark** dashboard is open, actively displaying real-time traffic.

In summary, the performance metrics indicate how **Kubeshark**'s operations can influence the CPU and memory resources of a Kubernetes cluster. Making informed decisions about resource allocation can ensure optimal performance while using **Kubeshark**.

**Idle time with minimal load on the cluster**

| Pod | Memory | CPU |
| --- | --- | --- |
| Hub | < 15MB | <10% |
| Front | < 5MB | <10% |
| Worker | ~110MB | <10% |

**Significant load, yet no dashboard is open (no dissection)**

| Pod | Memory | CPU |
| --- | --- | --- |
| Hub | < 20MB | <10% |
| Front | < 5MB | <10% |
| Worker | ~160MB | <10% |

**Significant load and Kubeshark dashboard is used to view real time traffic.**

| Pod | Memory | CPU |
| --- | --- | --- |
| Hub | < 20MB | <10% |
| Front | < 5MB | <10% |
| Worker | ~300MB | <10% |

## CPU, Memory, and Storage Limitations

Resources are limited by default. However, allocation can be set as configuration values:
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
  storagelimit: 500Mi
```

Traffic is recorded and stored by the Worker at the K8s node level. Storage is monitored and purged once limit is reached. The Worker pod is evicted (and storage purged) if storage usage exceeds the limit. The limit is controlled by setting the `tap.storagelimit` configuration value. To increase this limit, simply provide a different value (e.g., setting it to 1GB with `--set tap.storagelimit=1Gi`).

## Packet Processing Library

AF_PACKET, AF_XDP, and PF_RING are all different technologies related to packet processing and networking in Linux systems. Each serves specific purposes and has its own advantages and use cases. Let's explore each of them:

### In The Context of Kubeshark

While AF_PACKET is readily available for most common architectures, the availability of AF_XDP and PF_RING depends on various factors like your worker nodes' architecture and MTU. Kubeshark will first try to use PF_RING, as it is the most performant packet capture library, and if not possible, will downgrade to AF_XDP and then to AF_PACKET.

### AF_PACKET (Packet Socket)

AF_PACKET is a socket type in the Linux socket API that provides direct access to network packets at the link-layer level. It allows applications to receive and send raw packets, including Ethernet headers. This is useful for applications that require low-level access to network traffic, such as network analyzers, packet capture tools (like Wireshark), and custom networking utilities.

### AF_XDP (Express Data Path)

AF_XDP is a newer socket type introduced in the Linux kernel that enables high-performance packet processing directly in the kernel space. It leverages the [eBPF (extended Berkeley Packet Filter)](https://ebpf.io/) technology to execute code in a safe and controlled manner within the kernel. AF_XDP is designed for applications that require fast packet filtering, forwarding, and other network functions.

### PF_RING

PF_RING is a high-speed packet capture and processing framework that provides APIs and tools for dealing with network traffic efficiently. It supports various packet capture methods, including kernel bypass techniques. PF_RING aims to overcome the limitations of the traditional Linux networking stack, offering acceleration mechanisms for high-speed packet capture and analysis. It is frequently used in high-performance scenarios, such as intrusion detection systems and network monitoring appliances.

### In Summary

AF_PACKET provides raw access to network packets at the link-layer level, suitable for packet capturing and analysis.

AF_XDP offers high-performance packet processing in the kernel space using eBPF, making it a good choice for tasks like packet filtering and forwarding.

PF_RING is an efficient framework for high-speed packet capture and processing, especially with kernel bypass techniques, suitable for high-performance network analysis.

## Comparison 

| Library                     | AF_PACKET                                                                                            | AF_XDP                                                                                                                   | PF_RING                                                                                                                |
|-----------------------------|------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Use Case                    | Used for packet capture, monitoring, and analysis. Provides raw access to network packets.            | Designed for high-performance packet processing within the kernel. Useful for packet filtering, load balancing, etc.      | Geared towards high-speed packet capture and processing, especially for network monitoring and intrusion detection.     |
| Performance                 | Good for packet capture but may require more user-space processing for specific tasks.                | High performance due to kernel-space processing with eBPF. Reduces context switches and increases efficiency.            | Offers high-speed packet capture and processing, minimizing overhead of traditional packet handling in the kernel.       |
| Flexibility                 | Allows raw access to packets, but more user-space code may be required for specific tasks.            | Provides flexibility through dynamically loadable eBPF programs, enabling efficient packet processing within the kernel. | Offers APIs and tools for advanced packet capture and processing. Supports both user-space and kernel-bypass approaches. |
| Ease of Use and Development | Requires manual packet parsing in user space. More effort needed for complex tasks.                   | Requires familiarity with eBPF and kernel programming. Streamlines packet processing in the kernel.                      | Offers simplified packet capture APIs but might need more setup for specific tasks.                                     |
| Integration with Ecosystem  | Part of the standard Linux socket API. Widely supported but may be less performant for some use cases.| Integrates well with the eBPF ecosystem.                                                                                  | Requires separate integration into applications. Provides enhanced performance for specific scenarios.                   |
| Community and Support       | Well-established and documented API within the Linux networking stack.                                | Growing community support, especially within the eBPF ecosystem.      |Well-maintained project with a community and commercial support, often used in specialized network monitoring applications.|

In conclusion, each technology serves different purposes in the realm of packet processing and networking. AF_PACKET is suitable for packet capture and analysis, AF_XDP excels in high-performance packet processing in the kernel, and PF_RING offers a framework for high-speed packet capture and analysis, particularly with kernel bypass capabilities. The choice depends on the specific requirements and trade-offs of your application.

