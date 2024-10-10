---
title: Running Kubeshark Headless
description: 
layout: ../../layouts/MainLayout.astro
---


**Kubeshark** can run headless as well as serve a rich GUI dashboard. When running headless (no dashboard), the following functionalities can still remain active:
1. Monitoring traffic using scripting.
2. Continuous PCAP recording.

## Monitoring Traffic Using Scripting

Using [scripting](/en/automation_scripting), **Kubeshark** can be employed for monitoring purposes and triggering actions when certain network behaviors are detected.

> Read more in the [scripting section](/en/automation_scripting).

## Continuous PCAP Recording

Additionally, running **Kubeshark** headless allows all captured traffic to be recorded in PCAP files, which can be exported on demand. Recorded traffic will include everything captured by **Kubeshark**, considering the [capture filters](/en/pod_targeting), and will also include [TLS traffic](/en/encrypted_traffic), as well as traffic from Envoy or Istio.

> Read more in the [PCAP Dumper section](/en/pcapdump).

## Low Resource Consumption

When running headless, **Kubeshark** consumes significantly fewer resources than when there is an active dashboard connection.

## Opening Dashboards On-Demand

You can still open any number of dashboards, even when **Kubeshark** is running headless. The dashboard operation is independent of the services provided by the **Kubeshark** backend (e.g., scripts and recording).

## Important Configuration Values

It's important to consider the following configuration values when planning to run headless:

```yaml
tap:
    stopped: false              # Ensure Kubeshark is not stopped and is actively capturing traffic | default is `true`
    # Capture filters instruct Kubeshark on what traffic to capture
    regex: catal.*              # Only traffic from pods matching the regex will be captured        | default is `.*`
    namespaces:                 # Capture from these namespaces                                     | default is ALL
    - ns1
    - ns2
    excludeNamespaces:          # Exclude these namespaces                                          | default is none
    - ns3
  bpfOverride: net 10.10.0.0/16 # Or simply use an override BPF filter                              | default is none
pcapdump:                       # Ensure traffic is recorded at all times (optional, as this is the default)
    enabled: true               # Store captured traffic in PCAP files      (optional, as this is the default)
    maxTime: 1h                 # Discard files older than 1 hour             (optional, as this is the default)
    maxSize: 500MB              # Discard old files if storage exceeds 500MB (optional, as this is the default)

scripting:                      # If you're using scripts
    env:
        VAR1: <var1-data>
```