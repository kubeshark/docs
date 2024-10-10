---
title: Installation Checklist
description: 
layout: ../../layouts/MainLayout.astro
mascot: Bookworm
---
**Kubeshark**'s default configuration, as provided in the [values.yaml](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/values.yaml) file, is suited for small dev/test clusters.

We recommend starting with a smaller, quieter cluster before moving to larger deployments.

It’s helpful to go through this checklist to ensure everything works correctly in the backend.

It's a good practice to initially allocate more memory than expected, while optimizing various configuration settings.

### Sufficient Memory for the Hub

Check if the Hub is being OOMKilled. On larger clusters, we recommend [increasing the memory allocation](/en/performance#container-memory-and-cpu-limitations).

### Sufficient Memory, CPU, and Storage Resources for Worker DaemonSets

The workers consume resources based on the amount of traffic they process. Check the resource allocations and [increase them as needed](/en/performance#container-memory-and-cpu-limitations). Alternatively, [disable redundant protocol dissectors](/en/protocols#configuring-available-dissectors) or [apply capture filters](/en/pod_targeting).

### Protocol Dissectors

TCP and DNS processing can consume significant CPU, memory, and storage. We recommend [enabling them on demand](/en/protocols#configuring-available-dissectors), especially TCP, which is more resource-intensive than DNS. Disabling unnecessary protocol dissectors can help reduce resource consumption.

### Capture Filters

Applying [capture filters](/en/pod_targeting) will limit the amount of traffic **Kubeshark** processes, reducing the CPU, memory, and storage usage by the Worker DaemonSets.

Many of the above values can be adjusted dynamically. Therefore, we suggest limiting **Kubeshark**'s processing when it's not in use and scaling resources as needed on demand.

### Ensure You’re Capturing the Right Traffic

Especially when using **Kubeshark** for the first time, make sure you’re capturing the traffic you expect.

### Troubleshooting

If you follow the above guidance and **Kubeshark** is still not functioning as expected, consult our [troubleshooting page](/en/troubleshooting).


## Suggested Configuration Values

```yaml
tap:
    disableTlsLog: true
    stopped: false
    resources:
        hub:
            limits:
            memory: 2750Mi
        sniffer:
            limits:
                cpu: 1750m
                memory: 2750Mi
        tracer:
            limits:
                memory: 750Mi
        storageLimit: 10Gi
    ingress:
        enabled: true
        className: nginx
        host: <your-ingress-host>
        annotations:
            cert-manager.io/cluster-issuer: letsencrypt
            kubernetes.io/tls-acme: "true"
```