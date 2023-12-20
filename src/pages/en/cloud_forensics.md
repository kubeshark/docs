---
title: Traffic Recording & Offline Analysis
description: Record K8s traffic and perform offline investigations to hunt down performance and security issues with ease
layout: ../../layouts/MainLayout.astro
---

When the culprit doesn't readily reveal itself during observation, you can choose to record traffic based on a schedule or the occurrence of specific events or behaviors.
Traffic is recorded in PCAP format and uploaded to immutable file storage. PCAP files can be retained for extended periods and analyzed offline at the viewer's discretion.

You can record traffic based on specific patterns and make this recorded traffic available for offline analysis.

#### Historic Traffic Snapshot Analysis

**Kubeshark** can retain the captured traffic over a long period of time, enabling **Kubeshark** to present a historic traffic snapshot.

The example below presents traffic captured between two timestamps:

![Historical Traffic](/history1.png)
> Read more about it in the [Traffic Recorder](/en/traffic_recorder) section.