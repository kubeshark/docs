---
title: Installing in an Air-gapped Environment 
description: 
layout: ../../layouts/MainLayout.astro
---
**Air-gapped Environment Support is an Enterprise Feature**  
To retrieve your license, please log in to the [Admin Console](https://console.kubeshark.co/).

## Docker Registry

To pull a specific version or the latest of the following Docker images from `docker.io`, visit:
- [kubeshark/worker](https://hub.docker.com/r/kubeshark/worker)
- [kubeshark/hub](https://hub.docker.com/r/kubeshark/hub)
- [kubeshark/front](https://hub.docker.com/r/kubeshark/front)

You can then push these images to your local Docker registry and update the proper configuration including the registry address and, if needed, the secret for pulling images from your local repository.

## Helm Chart

To use the appropriate helm templates, pull the latest **Kubeshark** repository. Please do not use the development version.

```yaml
git clone git@github.com:kubeshark/kubeshark.git --depth 1
git checkout <tag>  # run `git tags` to see available tags 
cd kubeshark/helm-chart
helm install kubeshark .
```

## Disabling Internet-Dependent Features
Be aware that the availability of certain features relies on an active internet connection. In air-gapped environments, it's advisable to disable these features:
- Authentication
- Telemetry
- PF_RING

## Configuration Example

Below is an example and guidelines for configuring your local Docker registry, disabling the aforementioned features, and managing your license:


```yaml
tap:
  docker:
    registry: <local-registry-address>
    imagePullSecrets: [ <secret> ]
  auth:
    enabled: false
  telemetry:
    enabled: false
  noKernelModule: true
license: <your-enterprise-license>
```

Alternatively, you can add the following directives to your command line as a second option:
```yaml
--set tap.auth.enabled=false \
--set tap.telemetry.enabled=false \
--set tap.noKernelModule=true \
--set license=<your-enterprise-license> \
--set tap.docker.registry=<local-registry-address> \
--set-json 'tap.docker.imagePullSecrets=["<secret>"]'
```

**Notes:**
1. **Disabling the features mentioned above, while recommended, is optional.** Kubeshark will still function in an air-gapped environment even if you don't disable these functions. However, please note that these functions will not work as intended since they depend on open internet connectivity.
2. **We are planning to add support for these functions (especially PF-RING and authentication) in an air-gapped environment in the near future.**
