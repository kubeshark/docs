---
title: Pro vs. Enterprise vs. Community
description: The difference between Pro Edition and Community Edition
layout: ../../layouts/MainLayout.astro
---

## Pro Vs. Community

While the Community version suffices for a single cluster of up to 10 nodes, you can obtain a license necessary to run **Kubeshark** in clusters larger than 10 nodes. 
Obtain a pro license by running `kubeshark pro` if you're running the CLI or directly from: https://console.kubeshark.co/.

## Enterprise

The Enterprise version of **Kubeshark** is tailored for high-throughput computing environments. By leveraging PF_RING and AF_XDP, **Kubeshark** enhances its capability to process significantly larger volumes of traffic at faster speeds, approaching wire speed.

The utilization of PF_RING involves the deployment of a custom kernel module tailored to the architecture of your Worker nodes. Upon initiation, the Worker will endeavor to identify an appropriate pre-built custom kernel module that aligns with its architecture. When a compatible version is located, it will be downloaded and integrated into the kernel memory. In cases where a suitable kernel module is not found, Kubeshark will default to utilizing AF_PACKET.

If the utilization of high-performance libraries like PF_RING or AF_XDP is important for your operations, and in the event that no matching custom kernel module is available, feel free to get in touch with us. We will build a custom kernel module tailored to your architecture, enabling you to harness the benefits of these modules.