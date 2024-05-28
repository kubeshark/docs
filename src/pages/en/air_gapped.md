---
title: Installing in an Air-gapped Environment 
description: 
layout: ../../layouts/MainLayout.astro
---

**Air-gapped Environment Support is an Enterprise Feature**

Kubeshark requires a valid ENTERPRISE license to operate in an air-gapped environment.

## Getting a Trial ENTERPRISE License

To get an ENTERPRISE license, you first need an account in the [Admin Console](https://console.kubeshark.co/), which is used to manage licenses. By default, a complimentary PRO license will be provisioned upon sign-up. 

> A PRO license requires an active internet connection and cannot function properly in an air-gapped environment.

Once you have an account, reach out to us using the [contact-us](https://kubeshark.co/contact-us) form and let us know the email used to create the account in the [Admin Console](https://console.kubeshark.co/). We will convert the complimentary PRO license to an ENTERPRISE license and notify you once the license is ready to use.

To retrieve your license, please log in to the [Admin Console](https://console.kubeshark.co/) and follow the instructions to properly set your license.

## Docker Registry

To pull a specific version or the latest of the following Docker images from `docker.io`, visit:
- [kubeshark/worker](https://hub.docker.com/r/kubeshark/worker)
- [kubeshark/hub](https://hub.docker.com/r/kubeshark/hub)
- [kubeshark/front](https://hub.docker.com/r/kubeshark/front)

Then, push these images to your local Docker registry and update the appropriate configuration, including the registry address and, if necessary, the secret for pulling images from your local repository.

## Disabling Internet-Dependent Features
While not mandatory, in air-gapped environments, it is advisable to disable Telemetry.

## Configuration Example

Below is an example and guidelines for configuring your local Docker registry, disabling the aforementioned features, and managing your license:

```yaml
tap:
  docker:
    registry: <local-registry-address>
    imagePullSecrets: [ <secret> ]
  telemetry:
    enabled: false
license: <your-enterprise-license>
```
Alternatively, you can add the following directives to your command line as a second option:
```yaml
--set tap.telemetry.enabled=false \
--set license=<your-enterprise-license> \
--set tap.docker.registry=<local-registry-address> \
--set-json 'tap.docker.imagePullSecrets=["<secret>"]'
```