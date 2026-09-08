---
title: Upgrading & Downgrading
description: Upgrading & Downgrading
layout: ../../layouts/MainLayout.astro
---

## Applying a License

Subscribe to a plan at the [License Portal](https://console.kubeshark.com/), then download your license key from the portal. See [Getting-Started Packages](/en/plans) for what the packages cover.

Apply the license key using one of the following methods:

**With Helm:**

```shell
helm install kubeshark kubeshark/kubeshark \
  --set license=<your-license-key>
```

**With the CLI:**

```shell
kubeshark tap --set license=<your-license-key>
```

**Via configuration file** (~/.kubeshark/config.yaml):

```yaml
license: <your-license-key>
```

Once the license key is set, all users in the cluster can access Kubeshark without individual authentication.

> **Note:** Community and paid licenses alike require an active internet connection. Telemetry must succeed for the license to remain valid. Enterprise licenses operate air-gapped.

## Downgrading

A paid plan requires a valid license key in the Kubeshark configuration file, which usually resides at `~/.kubeshark/config.yaml`.

To downgrade, erase the license key and Kubeshark falls back to the Community edition — 3 nodes and 60 pods.

No need to save the license key. You can always download it again from the [License Portal](https://console.kubeshark.com).




