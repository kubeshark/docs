---
title: Upgrading & Downgrading
description: Upgrading & Downgrading
layout: ../../layouts/MainLayout.astro
---

## Applying a License

Request an Enterprise license at [get started](https://kubeshark.com/get-started). Offerings are compared on the [pricing page](https://kubeshark.com/pricing). Download your license key from the [License Portal](https://console.kubeshark.com/), then apply it using one of the following methods:

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

> **Note:** A Community license requires an active internet connection. Telemetry must succeed for the license to remain valid. Enterprise licenses operate air-gapped (no internet connectivity required).

## Downgrading

An Enterprise license is a license key in the Kubeshark configuration file, which usually resides at `~/.kubeshark/config.yaml`.

To downgrade, erase the license key and Kubeshark falls back to the Community edition — up to 3 nodes or 60 pods.

No need to save the license key. You can always download it again from the [License Portal](https://console.kubeshark.com).
