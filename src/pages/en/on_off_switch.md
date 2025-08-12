---
title: ON/OFF Switch (Dormant Feature)
description: Enables precise control over **Kubeshark**’s activity to manage resource consumption by toggling traffic capture on or off. When off, **Kubeshark** remains installed but dormant, consuming minimal resources until reactivated manually or automatically.
layout: ../../layouts/MainLayout.astro
---

Resource consumption, especially CPU and memory, is critical in Kubernetes environments. **Kubeshark**’s usage scales linearly with the volume of network traffic it processes. While there are multiple ways to manage this, the ON/OFF switch provides a straightforward and effective option.

Enabling or disabling traffic capture directly controls **Kubeshark**’s resource usage. When capture is stopped, **Kubeshark** remains in a dormant state within the cluster—processing no traffic and consuming minimal resources.

**Kubeshark**’s Helm template includes a Helm value, `tap.capture.stopped`, that determines whether **Kubeshark** starts in a `stopped` state.

## Changing the Value Dynamically via the Dashboard

This setting can be updated in real-time through the dashboard by clicking the `Enable Traffic Capture` button. The current capture state is also displayed prominently at the top of the dashboard.

![The On/Off button](/on-off.png)

## Using a Helm Value

Setting `--set tap.capture.stopped=true` ensures **Kubeshark** starts in a dormant state, ready to process traffic once the value is changed to `false`.
To have **Kubeshark** capture traffic continuously, set the flag to `false` either via command line:
`--set tap.capture.stopped=false`
or in the `values.yaml` file:

```yaml
tap:
    capture:
        stopped: false
```

## Inactivity Timeout

An additional Helm value automatically transitions **Kubeshark** into dormant mode when no activity is detected. Activity is defined as one of the following:

* At least one dashboard session open with streaming enabled
* An active traffic recording
* An active Network Agent

If none of these conditions are met, **Kubeshark** will enter dormant mode after the period defined by the `tap.capture.stopAfter` Helm value. By default, this timeout is 5 minutes.

To disable inactivity-based dormancy, set:
`tap.capture.stopAfter=0`