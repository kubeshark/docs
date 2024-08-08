---
title: ON/OFF Switch (Dormant Feature)  
description: The dynamic on/off switch, if set to on, Kubeshark will function as expected, and if set to off, Kubeshark will lay dormant and consume almost no resources. This is especially useful if you want to have Kubeshark installed but not actually processing traffic and consuming resources, yet ready to start on command (manual or automated).  
layout: ../../layouts/MainLayout.astro  
---

**Availability**: v52.3.75

Resource consumption (e.g., CPU and memory) is key in Kubernetes. **Kubeshark**'s resource consumption is linearly dependent on the amount of traffic it processes. There are many ways to control resource consumption, and this ON/OFF switch is one of them.

Stopping and starting traffic capturing enables controlling **Kubeshark**'s resource consumption. When traffic capture is stopped, **Kubeshark** is dormant in your cluster, processing no traffic and consuming almost no resources.

**Kubeshark**'s Helm template supports a Helm value named `tap.stopped`, which controls whether **Kubeshark** is in a `stopped` state or not.

## Changing the Value Dynamically via the Dashboard

This value can be changed dynamically via the dashboard by pressing the `Enable Traffic Capture` button. You can also see an indication of the state of traffic capturing at the top fold.

![The On/Off button](/on-off.png)

## Using a Helm Value

By setting `--set tap.stopped=true`, you're instructing **Kubeshark** not to process any traffic, making it dormant in your cluster, ready to start once this value changes to `false`.

## Default Configuration

The `tap.stopped` Helm value is set to `true` by default; however, you can change this by adding this value to your `values.yaml` file or by adding it to the CLI when running either Helm or the `kubeshark` CLI. As long as it is set to `false`, **Kubeshark** will start processing traffic from the get-go.

