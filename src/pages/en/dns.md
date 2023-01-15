---
title: DNS Support
description: Kubeshark provides protocol-level visibility into Kubernetes’ DNS traffic by capturing and dissecting all UDP streams that include DNS traffic
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides protocol-level visibility into [Kubernetes’ DNS traffic](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) by capturing all UDP streams that include DNS traffic. Once captured, DNS traffic is dissected and become available as any other protocol supported by **Kubeshark**.

### DNS Log

Use **Kubeshark** to view a DNS log and export into a PCAP file. To view only DNS entries, use: `dns` in the [KFL](/en/filtering) query box. Use the [export to PCAP button](en/pcap_export_import#export-a-pcap-snapshot) to export the DNS traffic to a PCAP file.

![DNS Log](/dns-log.png)

### DNS Investigation

As with any other protocol supported by **Kubeshark**, you can use a KFL query in conjunction with any property in the DNS payload to trace down the root of any incident. 

![DNS Investigation](/dns-investigation.png)

### Service-to-DNS Connectivity Map

Use the **Service Map** in conjunction with a DNS KFL query `dns` to see all the services that are connected all the DNS providers in the cluster (e.g. kube-dns).

![DNS Service Map](/dns-map.png)

### DNS Payload Replay

Use **Kubeshark** stores the UDP traffic stream that includes the DNS traffic, it can be used to replay the traffic at the server destination. 

![DNS Replay](/dns-replay.png)
