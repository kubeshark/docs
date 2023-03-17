---
title: DNS Support
description: Kubeshark provides protocol-level visibility into Kubernetes’ DNS traffic by capturing and dissecting all UDP streams that include DNS traffic
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides protocol-level visibility into [Kubernetes’ DNS traffic](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) by capturing all UDP streams that include DNS traffic. Once captured, DNS traffic is dissected and become available as any other protocol supported by **Kubeshark**.

### DNS Log

Use **Kubeshark** to view a DNS log and export into a PCAP file. To view only DNS entries, use: `dns` in the [KFL](/en/kfl) query box. Use the [export to PCAP button](/en/pcap#manual-pcap-export) to export the DNS traffic to a PCAP file.

![DNS Log](/dns-log.png)

### DNS Investigation

As with any other protocol supported by **Kubeshark**, you can use a KFL query in conjunction with any property in the DNS payload to trace down the root of any incident. 

![DNS Investigation](/dns-investigation.png)

### Service-to-DNS Connectivity Map

Use the **Service Map** in conjunction with a DNS KFL query `dns` to see all the services that are connected all the DNS providers in the cluster (e.g. kube-dns).

![DNS Service Map](/dns-map.png)

### DNS Stress Test

**Kubeshark** stores the UDP stream that includes the DNS traffic. The stream can be used to replay the traffic aimed at the server destination. 

When used with the **load testing** option, it can be used to stress test your DNS provider (e.g. kube-dns) and see where it scales or congests.

![DNS Replay](/dns-replay.png)

To activate the stress test, put any number in the **replay count** and select the **Replay the UDP streams concurrently. (load testing)** option.
