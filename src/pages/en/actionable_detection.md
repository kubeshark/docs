---
title: Actionable Detection
description:  
layout: ../../layouts/MainLayout.astro
---
K8s network is likely to include significant information that can help not only understand the reasons for a problem, but potentially avoid the problem altogether by detecting and reacting quickly to its symptoms.

Kubernetes network is massive. It makes absolutely no sense to process it all in order to find culprits. 



## Detection

**Kubeshark** scripting in conjunction with hooks provides mean to programmatically detect suspicious network behaviors. Using helpers can trigger actions as a result and by that reduce the incident response time.

For example:
```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    // ... add action code
  if (kfl.match(data, 'request.headers["Authorization"] == r"Token.*" and src.ip != "192.168.49.2"'))
    // .. add action code
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

You can send user-enriched telemetry to external systems such as InfluxDB, Grafana and Elastic, or otherwise use a webhook to upload anything anywhere.