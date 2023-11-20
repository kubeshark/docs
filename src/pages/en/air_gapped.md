---
title: Installing in an Air-gapped Environment 
description: 
layout: ../../layouts/MainLayout.astro
---
**Air-gapped environment support is an enterprise feature.** To retrieve your license, log in to the [Admin console](https://console.kubeshark.co/).

Please note, the availability of the following features depends on an open internet connection and should be disabled in air-gapped environments:
- Authentication
- Telemetry
- PF_RING

To disable these features, please set the following configuration values:

```yaml
tap:
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
--set license=<your-enterprise-license>
```

**Notes:**
1. **Disabling the features mentioned above, while recommended, is optional.** Kubeshark will still function in an air-gapped environment even if you don't disable these functions. However, please note that these functions will not work as intended since they depend on open internet connectivity.
2. **We are planning to add support for these functions (especially PF-RING and authentication) in an air-gapped environment in the near future.**
