---
title: Detection Engineering
description: Detecting anomalies and load or suspicious activity inside the Kubernetes network.
layout: ../../layouts/MainLayout.astro
---

## Detection

**Kubeshark** scripting in conjunction with hooks provides mean to programmatically detect suspicious network behaviors. Using helpers can trigger actions as a result and by that reduce the incident response time.

For example:
```js
function onItemCaptured(data) {
  if (data.response.status === 500) {
    // Your code goes here
  } else if (kfl.match(data, 'request.headers["Authorization"] == r"Token.*" and src.ip != "192.168.49.2"')) {
    // Your code goes here
  }
}
```
A few more detection examples:
- Abnormal API throughput
- Suspicious payload matching a regex
- Incoming communication from bad IPs

## Actions

Actions are divided to three segments:
- Alerts
- Forensics
- Telemetry

### Alerts

You can send a message to Slack, to a console log, to the WebUI or use a webhook to send anything anywhere.

Alerts can be used to notify that a certain action was completed (e.g. PCAP was generated and upload) or to provide a real-time notification of a programmatically identified network behavior.

### Forensics

Forensics generation can be triggered programmatically using hooks and/or Jobs.

The following forensic types are available:
- Network snapshots in the form of PCAP files
- Name resolution history
- User-generated files

Forensics can be uploaded to an immutable datastore like AWS S3 with an existing S3 helper or by using a Webhook.

### Telemetry

**Kubeshark** enables you to send metrics and logs to your favorite telemetry or logs provider and enjoy dashboards and alerts.

> Read more in the [InfluxDB & Grafana](/en/integrations_influxdb) and [Elasticsearch](/en/integrations_elastic) sections.
