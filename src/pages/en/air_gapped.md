---
title: Installing in an Air-gapped Environment 
description: 
layout: ../../layouts/MainLayout.astro
---

**Air-gapped Environment Support is an Enterprise Feature**

Kubeshark requires a valid Enterprise license to operate in an air-gapped environment.

To retrieve your license, please log in to the [Admin Console](https://console.kubeshark.co/) and follow the instructions to properly set your license.

Please [contact us](https://kubeshark.co/contact-us) if you would like to receive a complimentary trial license.

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
## Notes:

- For instructions on using PF-RING in an air-gapped environment, please [contact us](https://kubeshark.co/contact-us).