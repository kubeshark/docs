---
title: Protocol Support
description: Configure the list of supported protocol dissectors and remove protocols that are less relevant (e.g., DNS). This reduces noise and resource consumption as the traffic will not be processed. Traffic is captured, but if it belongs to a protocol that isn't supported or is disabled in the configuration, it will not be processed and will be discarded.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Kubeshark** supports a wide variety of modern protocols, with new protocols being added frequently. **Kubeshark** captures all L4 traffic related to the list of targeted pods. This traffic includes TCP and UDP. Traffic from pods that aren't targeted isn't captured.

> See the [Capture Filters section](en/pod_targeting) to learn more about how pods are targeted.

Once traffic is captured, **Kubeshark** attempts to identify the protocol and starts dissecting and reassembling the API call based on the protocol specifications. If **Kubeshark** is unable to identify the protocol, the traffic is discarded and not presented.

> Check out the list of supported protocols in the [introduction section](en/introduction#api-traffic-analysis).

> Read our [TLS (eBPF)](en/encrypted_traffic) documentation to learn how **Kubeshark** deals with encrypted traffic.

## Configuring Available Dissectors

The list of available protocol dissectors can be configured. Removing redundant protocols can serve two purposes:
1. Reducing the level of noise.
2. Improving resource consumption, as **Kubeshark** will process less traffic that may be less relevant (e.g., `dns`).

By editing the `enabledDissectors` section in the `values.yaml` file, you can select which protocol dissectors will be made available. In the example below, only `dns` and `http` are kept as available protocol dissectors, with the rest disabled.

```yaml
tap:
  enabledDissectors:
  #- amqp
  - dns
  - http
  # - icmp
  # - kafka
  # - redis
  # - sctp
  # - syscall
  # - tcp
  # - ws
```

Alternatively, you can use a [Helm](/en/install_helm) command line argument indicating the protocols you'd like to process. In this example, **Kubeshark** will process `http`, `dns` and `tcp` only:

```yaml
--set-json 'tap.enabledDissectors=["http","dns","tcp"]'
```

To disable, remove the dissector from the list.