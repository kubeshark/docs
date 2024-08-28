---
title: Installation Checklist
description: 
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---

**Kubeshark**'s out-of-the-box configuration, as presented in the [values.yaml](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/values.yaml) file, is suitable for small dev/test clusters.

We recomand starting on a smaller, more quiter clsuter, before moving to bigger deploymenets.

It's helpful to go through this checklist to ensure that everything works correctly in the backend.

It is a good practice to initially allocate more memory than intended while the various configuration levers are optimized.

### Sufficient Memory for Hub

Check if the Hub is OOMKilled. On large clusters, we recommend [extending the memory](/en/performance#container-memory-and-cpu-limitations).

### Sufficient Memory, CPU, and Storage Resources for Worker DaemonSets

The workers consume resources based on the amount of traffic they process. Check the resources and [extend them as needed](/en/performance#container-memory-and-cpu-limitations). Alternatively, [disable redundant protocol dissectors](/en/protocols#configuring-available-dissectors) and/or [apply capture filters](/en/pod_targeting).

### Protocol Dissectors

TCP and DNS consume significant amounts of CPU, memory, and storage. We recommend [enabling them on demand](/en/protocols#configuring-available-dissectors), especially TCP, which is more resource-intensive than DNS. Disabling redundant protocol dissectors can reduce resource consumption.

### Capture Filters

Adding [capture filters](/en/pod_targeting) will limit the amount of traffic processed by **Kubeshark**, thereby reducing CPU, memory, and storage consumption by the Worker DaemonSets.

Many of the above values can be changed dynamically. Therefore, we suggest limiting **Kubeshark**'s processing if it is not in use and adjusting as necessary on-demand.

### Make Sure You See The Traffic You're Looking For

Especially he first time you use **Kubeshark**

### Troubleshooting

Consult our [troubleshooting page](/en/troubleshooting) if you follow the above guidance and **Kubeshark** still doesn't function as expected.