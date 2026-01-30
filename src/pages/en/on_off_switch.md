---
title: Enabling / Disabling L7 API Dissection
description: Enables precise control over **Kubeshark**'s compute resource consumption by toggling L7 API dissection on or off. When off, **Kubeshark** remains installed but dormant, consuming minimal compute resources until reactivated manually or automatically.
layout: ../../layouts/MainLayout.astro
---

Compute resource consumption, especially CPU and memory, is critical in Kubernetes environments. **Kubeshark**'s L7 API dissection consumes significant compute resources as it processes and analyzes network traffic. There are two primary ways to manage resource consumption:

1. **Enable/Disable API Dissection** - Toggle dissection on or off entirely (described on this page)
2. **[Capture Filters](/en/pod_targeting)** - Reduce the number of workloads being dissected to lower resource usage

Enabling or disabling API dissection directly controls **Kubeshark**'s compute resource usage. When dissection is paused, **Kubeshark** remains in a dormant state within the cluster—not processing traffic and consuming minimal compute resources.

**Kubeshark**'s Helm template includes a Helm value, `tap.capture.stopped`, that determines whether **Kubeshark** starts in a `stopped` state.

## Changing the Value Dynamically via the Dashboard

This setting can be updated in real-time through the dashboard by clicking the API Dissection button in the top-left corner. The button has two states:

**When API dissection is paused** - A green play button labeled "Resume API Dissection" is displayed:

![Resume API Dissection](/dissection-off.png)

**When API dissection is active** - A red stop button labeled "Pause API Dissection" is displayed:

![Pause API Dissection](/dissection-on.png)

## Using a Helm Value

Setting `--set tap.capture.stopped=true` ensures **Kubeshark** starts in a dormant state, ready to begin API dissection once the value is changed to `false`.
To have **Kubeshark** perform API dissection continuously, set the flag to `false` either via command line:
`--set tap.capture.stopped=false`
or in the `values.yaml` file:

```yaml
tap:
  capture:
    stopped: false
    stopAfter: 5m
```

## Inactivity Timeout

The `tap.capture.stopAfter` Helm value automatically pauses API dissection and transitions **Kubeshark** into dormant mode when no activity is detected. By default, this timeout is `5m` (5 minutes).

Activity is defined as one of the following:

* At least one dashboard session open with streaming enabled
* An active traffic recording
* An active Network Agent

If none of these conditions are met, **Kubeshark** will enter dormant mode after the specified period.

> **Important:** If you want API dissection to run continuously without automatic timeout, set `tap.capture.stopAfter: 0`. Otherwise, API dissection will automatically pause 5 minutes after the last dashboard disconnects.

To disable inactivity-based dormancy:

```yaml
tap:
  capture:
    stopAfter: 0
```