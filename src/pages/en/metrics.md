---
title: Prometheus Metrics & Grafana Dashboard
description: Learn how to integrate Kubeshark metrics with Grafana for enhanced monitoring.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark can export pre-existing aas well as custom Prometheus metrics. Almost anything can be experted as a custom metric from Kubeshark. See below a list of available metrics out of the box.

## Custom Metrics

You can use the `prometheus.metric` helper to export custom metrics. See example below:

### Example

In this example, we export a metric named `dns_counter` that counts the number of DNS requests.
We use the [`onItemCaptured` hook](/en/automation_hooks#onitemcaptureddata-object) to increase a counter, that was initially set to zero, whenever a DNS message is intercepted.
We then use [`jobs`](/en/automation_jobs), to schedule a job that expert the metric every 15 seconds.

```js
// DNS request counter as custom Prometheus metric
var counter = 0;

function onItemCaptured(data) {
  // Check if it's a DNS request
  if (data.Protocol.Name === "dns") {
    counter++;
  }
}

function reportToProm (){
  prometheus.metric("dns_counter", "Total number of DNS requests", 1, counter);
  console.log(counter); 
}

// Report to Prometheus every 15 seconds
jobs.schedule("example-job", "*/15 * * * * *", reportToProm)
```

## Configuration

By default, Kubeshark uses port `49100` to expose metrics via service `kubeshark-worker-metrics`.

In case you use [kube-prometheus-stack] (https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) community Helm chart, additional scrape configuration for Kubeshark worker metrics endpoint can be configured with values:

```
prometheus:
  enabled: true
  prometheusSpec:
    additionalScrapeConfigs: |
      - job_name: 'kubeshark-worker-metrics'
        kubernetes_sd_configs:
          - role: endpoints
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_name]
            target_label: pod
          - source_labels: [__meta_kubernetes_pod_node_name]
            target_label: node
          - source_labels: [__meta_kubernetes_endpoint_port_name]
            action: keep
            regex: ^metrics$
          - source_labels: [__address__, __meta_kubernetes_endpoint_port_number]
            action: replace
            regex: ([^:]+)(?::\d+)?
            replacement: $1:49100
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_service_label_(.+)
```


## Existing Metrics

Existing metrics csn be useful to monitor Kubeshark

> For most up-to-date details, visit the [metrics section](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/metrics.md) in the repo.

### Available Metrics

| Name | Type | Description | 
| --- | --- | --- | 
| kubeshark_received_packets_total | Counter | Total number of packets received | 
| kubeshark_dropped_packets_total | Counter | Total number of packets dropped | 
| kubeshark_processed_bytes_total | Counter | Total number of bytes processed |
| kubeshark_tcp_packets_total | Counter | Total number of TCP packets | 
| kubeshark_dns_packets_total | Counter | Total number of DNS packets | 
| kubeshark_icmp_packets_total | Counter | Total number of ICMP packets | 
| kubeshark_reassembled_tcp_payloads_total | Counter | Total number of reassembled TCP payloads |
| kubeshark_matched_pairs_total | Counter | Total number of matched pairs | 
| kubeshark_dropped_tcp_streams_total | Counter | Total number of dropped TCP streams | 
| kubeshark_live_tcp_streams | Gauge | Number of live TCP streams |

## Ready-to-use Dashboard

You can import a ready-to-use dashboard from [Grafana's Dashboards Portal](https://grafana.com/grafana/dashboards/20359-kubeshark-dashboard-v1-0-003/).


## TL;DR

### Install Prometheus Community Version

```yaml
helm upgrade -i prometheus prometheus-community/kube-prometheus-stack \
--namespace prometheus --create-namespace \
-f kube_prometheus_stack.yaml

kubectl port-forward -n prometheus svc/prometheus-grafana 8080:80
```

Example `kube_prometheus_stack.yaml` file:

```yaml
grafana:
  additionalDataSources: []
prometheus:
  prometheusSpec:
    scrapeInterval: 10s
    evaluationInterval: 30s
    additionalScrapeConfigs: |
      - job_name: 'kubeshark-worker-metrics'
        kubernetes_sd_configs:
          - role: endpoints
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_name]
            target_label: pod
          - source_labels: [__meta_kubernetes_pod_node_name]
            target_label: node
          - source_labels: [__meta_kubernetes_endpoint_port_name]
            action: keep
            regex: ^metrics$
          - source_labels: [__address__, __meta_kubernetes_endpoint_port_number]
            action: replace
            regex: ([^:]+)(?::\d+)?
            replacement: $1:49100
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_service_label_(.+)
```
