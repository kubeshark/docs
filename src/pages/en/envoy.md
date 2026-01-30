---
title: Istio & Envoy Support
description: Explore the various ways to receive support.
layout: ../../layouts/MainLayout.astro
---
Tracing traffic and connections in an Istio-enabled cluster can be complex due to mTLS. [Kubeshark](https://kubeshark.com) provides full support for Istio/Envoy with one small caveat.

![Istio enabled cluster](/envoy_description.png)

In clusters where Istio is installed, sidecar containers with the Envoy proxy are injected into the targeted pods. These proxies act as network gateways. When mTLS is in STRICT mode, the proxies encrypt egress traffic and decrypt ingress traffic.

For each pod, we have two types of communication:
- The **`service`** <==> `sidecar`: This includes the original service ingress and egress traffic.
- The `sidecar` <==> `sidecar`: This is a duplicate of the original **`service`** <==> `sidecar` communication. This traffic is encrypted when mTLS is in STRICT mode.

## Layers of Traffic Visible in Kubeshark

#### L4 Layer

[Kubeshark](https://kubeshark.com) will show all L4 traffic related to Istio, including encrypted and mTLS traffic.

#### L7 Layer

#### **`container`** <==> `sidecar`: Protocol Support

Protocol messages will be visible, and [Kubeshark](https://kubeshark.com) will show all reassembled API calls based on its protocol support.

#### **`container`** <==> `sidecar`: TLS / HTTPS

[Kubeshark](https://kubeshark.com) will display the **`container`** <==> `sidecar` traffic in clear text (decrypted), which includes the original service ingress and egress traffic, based on [Kubeshark](https://kubeshark.com)'s TLS termination library support.

> Read more about TLS termination library support in the [TLS/HTTPS section](/en/encrypted_traffic).

#### `sidecar` <==> `sidecar`: Unencrypted

When mTLS is not in STRICT mode, this traffic will be visible.

#### `sidecar` <==> `sidecar`: mTLS (Encrypted)

When mTLS is in STRICT mode, the mTLS traffic will show as encrypted, and there will be no attempt to decrypt it, as it is assumed to be a duplicate of the original **`container`** <==> `sidecar` traffic.
