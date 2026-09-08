---
title: Kubeshark's Security Context & RBAC
description: This document outlines the necessary Kubernetes permissions for the efficient operation of Kubeshark, a network monitoring tool.
layout: ../../layouts/MainLayout.astro
---

## The Worker DaemonSet

[Kubeshark](https://kubeshark.com)'s Worker DaemonSet is a critical component designed to monitor network traffic within the Kubernetes cluster. To function effectively, it requires specific capabilities that go beyond the standard set. These capabilities are essential for enabling network sniffing and detailed traffic analysis. The security context for the Worker DaemonSet is defined as follows:

#### Capabilities

Below is the list of capabilities assigned to their respective features. If you disable certain features, their corresponding capabilities are not requested:
```yaml
  capabilities:
    networkCapture:
    - NET_RAW
    - NET_ADMIN
    serviceMeshCapture:
    - SYS_ADMIN
    - SYS_PTRACE
    - DAC_OVERRIDE
    - CHECKPOINT_RESTORE
    kernelModule:
    - SYS_MODULE
    ebpfCapture:
    - SYS_ADMIN
    - SYS_PTRACE
    - SYS_RESOURCE
    - CHECKPOINT_RESTORE
```
This configuration can be changed via the `values.yaml`.

## Service Account

[Kubeshark](https://kubeshark.com) utilizes a dedicated Service Account named `kubeshark-service-account` for all its components. This account is specifically configured to provide the necessary access permissions for [Kubeshark](https://kubeshark.com)'s operations within the Kubernetes environment, ensuring secure and efficient performance.

## Cluster Role

The Cluster Role in [Kubeshark](https://kubeshark.com) is designed to grant broad permissions across the entire Kubernetes cluster. This role is crucial for [Kubeshark](https://kubeshark.com) to access and monitor various Kubernetes resources at a cluster-wide level. The Cluster Role Binding, detailed below, outlines these permissions:

```yaml
rules:
  - apiGroups: ["", extensions, apps]
    resources: [nodes, pods, services, endpoints, persistentvolumeclaims]
    verbs: [list, get, watch]
  - apiGroups: [""]
    resources: [namespaces]
    verbs: [get, list, watch]
  - apiGroups: [networking.k8s.io]
    resources: [networkpolicies]
    verbs: [get, list, watch, create, update, delete]
  - apiGroups: [authentication.k8s.io]
    resources: [tokenreviews]
    verbs: [create]
```

The last two rules are there for specific features:

- **`networkpolicies`** backs the network-policy routes, which are off unless `tap.networkPolicies.enabled` is set. The permission is granted regardless; the routes answer `409` when the feature is disabled.
- **`tokenreviews`** lets the Hub verify the ServiceAccount tokens presented by the CLI and by the workers, described below.

## Namespace Specific Role

Within the specific namespace where [Kubeshark](https://kubeshark.com) is deployed, a Role Binding is used to grant targeted permissions for namespace-level resources. This ensures [Kubeshark](https://kubeshark.com)'s access to essential configurations and secrets within its operational namespace:

```yaml
rules:
  - apiGroups:
      - ""           # Core API group
      - v1           # Version 1 of the core API group
    resourceNames:
      - kubeshark-secret      # Specific secret for [Kubeshark](https://kubeshark.com)
      - kubeshark-config-map  # Specific config map for [Kubeshark](https://kubeshark.com)
    resources:
      - secrets       # Access to secrets resource
      - configmaps    # Access to configmaps resource
    verbs:
      - get           # Permission to get resource details
      - watch         # Permission to watch for changes in resources
      - update        # Permission to update resources
```

These permissions are integral for [Kubeshark](https://kubeshark.com)'s self-configuration and adaptive operation within the Kubernetes environment.

## Worker → Hub authentication

Workers call the Hub over HTTP and RPC to seed name resolution and capture targets, and to push delayed-dissection results. Those calls authenticate with a **projected ServiceAccount token**, mounted into the sniffer and tracer containers:

```yaml
volumes:
  - name: hub-internal-token
    projected:
      sources:
        - serviceAccountToken:
            path: token
            audience: kubeshark-hub
            expirationSeconds: 3600
```

The token is mounted at `/var/run/secrets/kubeshark/hub-token/token` and located through the `HUB_INTERNAL_TOKEN_PATH` environment variable. Kubernetes rotates it before expiry; the worker re-reads the file per request rather than caching the value. The Hub verifies it with a TokenReview and checks the `kubeshark-hub` audience, which is why the ClusterRole above needs `create` on `tokenreviews`.

The mount is unconditional — it does not depend on `tap.auth.enabled`. Gating it on the auth setting was the cause of workers receiving `401` from the Hub on deployments where the two disagreed.

Reads of the large resolver endpoints (`/resolver/history`, `/pods/all`, `/pods/targeted`) are conditional: the worker keeps the last `ETag` and sends `If-None-Match`, so an unchanged inventory returns `304 Not Modified` and is served from the worker's own memory instead of re-transferring and re-parsing a multi-megabyte body.

## CLI access to a gated Hub

Setting `tap.auth.cli.enabled: true` provisions the objects the CLI needs to authenticate to a Hub that identifies its callers:

| Object | Name | Purpose |
|--------|------|---------|
| ServiceAccount | `kubeshark-cli` | The identity the CLI presents. Added to the Hub's `AUTH_CLI_SERVICE_ACCOUNTS` allowlist as `<namespace>:kubeshark-cli`. |
| Role | `kubeshark-cli-token-minter` | `create` on `serviceaccounts/token`, restricted by `resourceNames` to `kubeshark-cli`. |
| RoleBinding | `kubeshark-cli-token-minter` | Binds that Role to `tap.auth.cli.subjects`. Created only when the list is non-empty. |

Who may use the CLI against a gated Hub is therefore a Kubernetes RBAC question: whoever the RoleBinding names may mint a token, and nobody else. An empty `tap.auth.cli.subjects` creates the Role but binds it to nobody.

The CLI mints a short-lived token for that ServiceAccount through the TokenRequest API with audience `kubeshark-hub`, and sends it in the `X-Kubeshark-Authorization` header. See [CLI & headless credentials](/en/roles#cli-and-headless-credentials-on-a-gated-hub) for which role the identity resolves to.