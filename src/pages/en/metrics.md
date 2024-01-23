---
title: Prometheus Metrics & Grafana Dashboard
description: Learn how to integrate Kubeshark metrics with Grafana for enhanced monitoring.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark exports a range of proprietary metrics such as:
- kubeshark_received_packets_total
- kubeshark_dropped_packets_total
- kubeshark_processed_bytes_total
- and more

We plan to introduce additional metrics in the near future.

> For more details, visit the [metrics section](https://github.com/kubeshark/kubeshark/blob/master/helm-chart/metrics.md) in the repo.

You can also import a ready-to-use Grafana dashboard from [here](https://github.com/kubeshark/scripts/blob/master/grafana/metrics.json).

### Kubeshark Specific Grafana Dashboard

To monitor Kubeshark on your local Grafana dashboard, incorporating proprietary metrics, as well as CPU and memory KPIs, you can import the [Kubeshark-specific Grafana dashboard](https://github.com/kubeshark/scripts/blob/master/grafana/metrics.json). It's customizable to suit your needs.

![Kubeshark specific Grafana Dashboard](/grafana-metrics.png)

## TL;DR

### Install Prometheus Community Version

```yaml
helm upgrade -i prometheus prometheus-community/kube-prometheus-stack \
--namespace prometheus \
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
### Import Kubeshark Specific Dashboard into Grafana

Navigate to the dashboards section in Grafana and import a new dashboard by pasting the JSON content from [here](https://github.com/kubeshark/scripts/blob/master/grafana/metrics.json).
![Import New Dashboard](/grafana_new_dashboard.png)
