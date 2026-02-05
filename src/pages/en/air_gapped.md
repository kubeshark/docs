---
title: Installing in an Air-gapped Environment  
description: Installing in clusters where there's no internet connectivity  
layout: ../../layouts/MainLayout.astro
---

**Air-gapped Environment Support is an Enterprise Feature**

[Kubeshark](https://kubeshark.com) requires a valid ENTERPRISE license to operate in an air-gapped environment. Any environment that does not allow free communication to https://api.kubeshark.co/ is considered an air-gapped environment.

[Contact us](https://kubeshark.co/contact-us) to get an ENTERPRISE license.

> A PRO license requires an active internet connection and cannot function properly in an air-gapped environment.

## Docker Registry

To pull a specific version or the latest of the following Docker images from `docker.io`, visit:
- [kubeshark/worker](https://hub.docker.com/r/kubeshark/worker)
- [kubeshark/hub](https://hub.docker.com/r/kubeshark/hub)
- [kubeshark/front](https://hub.docker.com/r/kubeshark/front)

Then, push these images to your local Docker registry and update the appropriate configuration, including the registry address and, if necessary, the secret for pulling images from your local repository.

## Turn Off Features Requiring Internet Connectivity

To turn off the various features that require internet connectivity, set the `internetConnectivity` helm value to `false`.

```yaml
internetConnectivity: false
```

Or `--set internetConnectivity=false`

## Configuration Example

Below is an example and guidelines for configuring your local Docker registry, disabling the aforementioned features, and managing your license:

```yaml
tap:
  docker:
    registry: <local-registry-address>
    imagePullSecrets: [ <secret> ]
internetConnectivity: false
license: <your-enterprise-license>
```

Alternatively, you can add the following directives to your command line as a second option:
```yaml
--set internetConnectivity=false \
--set license=<your-enterprise-license> \
--set tap.docker.registry=<local-registry-address> \
--set-json 'tap.docker.imagePullSecrets=["<secret>"]'
```