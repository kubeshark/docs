---
title: Actionable Network Detection
description: 
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** uses scripting and network hooks to trigger specific actions when certain network behaviors are detected. Actions can also be triggered as part of a scheduled job.

Each supported integration enables one or a few actions that can be triggered or scheduled.

Actions are divided to three segments:
- Alerts
- Forensics
- Telemetry

## Alerts

You can send a message to Slack, to a console log or use a webhook to send anything anywhere. Alerts can be used to notify that a certain action was completed (e.g. PCAP was generated and upload) or to provide a real-time notification of a programmatically identified network behavior.

## Forensics

Forensics generation can be triggered programmatically using Network Hooks and/or Jobs.

The following forensic types are available:
- PCAPs
- Identity-IP resolution history
- DNS log

For example, if suspicious outbound traffic is detected, capture the past 3 hours of traffic in a certain namespace into a PCAP and upload to AWS S3.

Forensics can be uploaded to an immutable datastores like AWS S3 with an existing S3 helper or using a Webhook.

## Telemetry

You can send user-enriched telemetry to external systems such as InfluxDB, Grafana and Elastic, or otherwise use a webhook to upload anything anywhere.




