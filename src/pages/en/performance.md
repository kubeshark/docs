---
title: Performance & Scale
description: AF_PACKET, AF_XDP, PF-RING.
layout: ../../layouts/MainLayout.astro
---

## Topics
- [Resource Consumption](#resource-consumption)
- [Kubeshark Operations](#kubeshark-operations)
- [Resource Limitations: Container Memory and CPU Limitations](#container-memory-and-cpu-limitations)
- [Resource Limitations: Worker Storage Limitation](#worker-storage-limitation)
- [Predictable Consumption: Pod Targeting](#pod-targeting)
- [Predictable Consumption: Traffic Sampling](#traffic-sampling)
- [Tracer](#tracer)
- [PF-RING](#af-packet-and-pf-ring)
- [The Browser](#the-browser)

## Resource Consumption

Kubeshark's resource consumption largely depends on the cluster workload and the amount of dissection required. Most resource-consuming operations are performed by the Worker at the node level.

## Kubeshark Operations

Kubeshark captures and stores all traffic in memory. It then filters traffic based on pod targeting rules, which include pod regex and a list of namespaces. Traffic filtered out by these rules is discarded. Traffic filtered in is dissected. Among all Kubeshark operations—traffic capturing, storing, filtering, and dissection—dissection is the most resource-intensive and is performed on-demand when a client requests it (e.g., the dashboard, a recording, a running script).

## Resource Limitations

While resource consumption can increase based on the amount of traffic targeted for dissection, it can be limited by setting configuration values.

### Container Memory and CPU Limitations

Container resources are limited by default. However, allocations can be adjusted in the configuration:

```yaml
tap:
  resources:
    hub:
      limits:
        cpu: 750m
        memory: 1Gi
      requests:
        cpu: 50m
        memory: 50Mi
    sniffer:
      limits:
        cpu: 750m
        memory: 1Gi
      requests:
        cpu: 50m
        memory: 50Mi
    tracer:
      limits:
        cpu: 750m
        memory: 1Gi
      requests:
        cpu: 50m
        memory: 50Mi
```


### Worker Storage Limitation

Traffic is recorded and stored by the Worker at the Kubernetes node level. Kubeshark generates a PCAP file per L4 stream and a JSON file per API message. Files are deleted based on a TTL:
- PCAP - 10s TTL
- JSON - 5m TTL

If storage exceeds its limit, the pod is evicted. The storage limit is controlled by setting the `tap.storagelimit` configuration value. To increase this limit, provide a different value (e.g., setting it to 5GB with `--set tap.storagelimit=5Gi`).

### OOMKilled and Evictions

Whenever a container surpasses its memory limit, it will get OOMKilled. If Worker storage surpasses its limitation, the pod will get evicted.

## Predictable Consumption

While limitations ensure Kubeshark does not consume resources above set limits, it is insufficient to ensure proper operation if the available resources aren't adequate for the amount of traffic Kubeshark must process.

To consume fewer resources and not surpass limitations, Kubeshark offers two methods to control the amount of processed traffic:

### Pod Targeting

Kubeshark allows targeting specific pods using pod regex and a list of namespaces. This ensures only traffic related to targeted pods is processed, and the rest is discarded.

For example, the following config will cause Kubeshark to process only traffic coming from or to pods matching the regex `catal.*` and belonging to either `ks-load` or `sock-shop` namespaces:

```yaml
tap:
  regex: catal.*
  namespaces:
  - ks-load
  - sock-shop
```

The rest of the traffic will be discarded.

### Traffic Sampling

`TrafficSampleRate` is a number representing a percentage between 0 and 100. This number causes Kubeshark to randomly select L4 streams, not exceeding the set percentage.

For example, this configuration will cause Kubeshark to process only 20% of traffic, discarding the rest:


```yaml
tap:
  trafficSampleRate: 20
```


## Tracer

The Tracer is responsible for TLS interception. As it consumes significant CPU and memory, it should be disabled if no TLS traffic is present in the cluster or if there is no interest in processing TLS traffic.

## AF-PACKET and PF-RING

AF-PACKET relies on the Linux kernel to receive network packets. When the kernel becomes busy, an increasing number of packets are dropped, leading to significant memory consumption and potentially causing Worker pods to be OOMKilled.

PF-RING, a popular kernel extension, provides access to network packets without going through the kernel. As it is more efficient, the likelihood of packet drops reduces, thereby mitigating the risk of elevated memory consumption.

## The Browser

Be aware that your browser can consume a significant amount of CPU when displaying a substantial amount of traffic.

## Load Tests

Below are the results of various load tests conducted on an EKS cluster with three m5.large instances and default resource limitations, running Kubeshark with TLS disabled.

### Resource Consumption in a Mostly Idle Cluster Without Dissection

| Pod    | Memory | CPU   |
| ------ | ------ | ----- |
| Hub    | ~14MB  | ~0.01 |
| Front  | ~2MB   | ~0.01 |
| Worker | ~100MB | ~0.05 |

### Resource Consumption in a Mostly Idle Cluster With Dissection

| Pod    | Memory | CPU   |
| ------ | ------ | ----- |
| Hub    | ~14MB  | ~0.05 |
| Front  | ~3MB   | ~0.01 |
| Worker | ~100MB | ~0.2  |

### Small Load (288 Requests/Second on a Single Node)

#### The Load Test

Using a K6-based load test (link provided) with the following parameters:

```yaml
     ✗ image upload status was 200
       ↳  99% — ✓ 92622 / ✗ 4

      checks..........................: 99.99% ✓ 92622     ✗ 4
      data_received...................: 116 MB 361 kB/s
      data_sent.......................: 110 MB 344 kB/s
      http_req_blocked................: avg=17.83µs min=0s med=3.15µs max=46.39ms p(90)=4.63µs p(95)=6.63µs
      http_req_connecting.............: avg=9.22µs min=0s med=0s max=35.08ms p(90)=0s p(95)=0s
      http_req_duration...............: avg=3.46ms min=0s med=1.11ms max=88.85ms p(90)=9.22ms p(95)=14.32ms
        { expected_response:true }....: avg=3.46ms min=179.14µs med=1.11ms max=88.85ms p(90)=9.22ms p(95)=14.32ms
      http_req_failed.................: 0.00% ✓ 4 ✗ 92622
      http_req_receiving..............: avg=79.07µs min=0s med=30.7µs max=36.15ms p(90)=54.33µs p(95)=133.29µs
      http_req_sending................: avg=82.47µs min=0s med=14.84µs max=63.4ms p(90)=53.85µs p(95)=230.19µs
      http_req_tls_handshaking........: avg=0s min=0s med=0s max=0s p(90)=0s p(95)=0s
      http_req_waiting................: avg=3.29ms min=0s med=1.01ms max=88.79ms p(90)=8.9ms p(95)=13.92ms
      http_reqs.......................: 92626 288.56091/s
      iteration_duration..............: avg=1s min=1s med=1s max=1.1s p(90)=1.01s p(95)=1.02s
      iterations......................: 92626 288.56091/s
      vus.............................: 16 min=14 max=300
      vus_max.........................: 300 min=300 max=300
```
#### Worker Resource Consumption

| Metric | Value |
| --- | --- |
| Max CPU | 0.6 |
| Max Memory | 127MB |
| Disk IOs | 1 io/s |