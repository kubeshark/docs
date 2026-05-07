---
title: Upgrading & Downgrading
description: Upgrading & Downgrading
layout: ../../layouts/MainLayout.astro
---

## Upgrading to Pro

Subscribe to a Pro plan at the [License Portal](https://console.kubeshark.com/?tab=pro), then download your license key from the portal.

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

> **Note:** Community and Pro licenses require an active internet connection. Telemetry must succeed for the license to remain valid.

## Downgrading

Using the Pro edition requires having a valid license key in the Kubeshark configuration file, that usually resides at ~/.kubeshark/config.yaml.

To downgrade, simply erase the license key and Kubeshark will use the community version.

No need to save the license key. You can always download it again from the [License Portal](https://console.kubeshark.com).




