---
title: Helm Configuration Reference
description: Complete reference for all Kubeshark Helm configuration values.
layout: ../../layouts/MainLayout.astro
---

Complete reference for Kubeshark Helm configuration values.

---

## Traffic Capture

### Pod Targeting

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.regex` | Pod name regex pattern | `.*` |
| `tap.namespaces` | Target specific namespaces | `[]` |
| `tap.excludedNamespaces` | Exclude specific namespaces | `[]` |
| `tap.bpfOverride` | BPF expression (overrides above) | `[]` |

### Capture Control

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.capture.dissection.enabled` | Enable L7 traffic indexing at startup | `true` |
| `tap.capture.dissection.stopAfter` | Auto-stop indexing after inactivity | `5m` |
| `tap.capture.captureSelf` | Include Kubeshark's own traffic | `false` |
| `tap.capture.raw.enabled` | Enable raw packet capture | `true` |
| `tap.capture.raw.storageSize` | FIFO buffer size per node | `1Gi` |
| `tap.capture.dbMaxSize` | Max indexing database size | `500Mi` |

### Dashboard

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.dashboard.streamingType` | Dashboard streaming protocol | `connect-rpc` |
| `tap.dashboard.completeStreamingEnabled` | Enable complete streaming | `true` |
| `tap.dashboard.clusterWideMapEnabled` | Enable L4 cluster-wide connectivity map (experimental) | `false` |

### Delayed Indexing

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.delayedDissection.cpu` | CPU allocation for delayed indexing jobs | `1` |
| `tap.delayedDissection.memory` | Memory allocation for delayed indexing jobs | `4Gi` |

### Protocol & TLS

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.tls` | Capture encrypted/TLS traffic | `true` |
| `tap.disableTlsLog` | Suppress TLS/eBPF logging | `true` |
| `tap.serviceMesh` | Capture service mesh traffic (Istio, Linkerd) | `true` |
| `tap.enabledDissectors` | Enabled protocol dissectors | All except UDP/TCP |

### Filters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.defaultFilter` | Default dashboard KFL filter | `""` |
| `tap.globalFilter` | Global KFL filter for all views | `""` |

---

## Storage

### Ephemeral Storage

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.storageLimit` | Storage limit for emptyDir/PVC | `10Gi` |

### Persistent Storage

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.persistentStorage` | Use PersistentVolumeClaim | `false` |
| `tap.persistentStorageStatic` | Use static volume provisioning | `false` |
| `tap.persistentStoragePvcVolumeMode` | PVC volume mode | `Filesystem` |
| `tap.storageClass` | Storage class for PVC | `standard` |
| `tap.efsFileSytemIdAndPath` | AWS EFS configuration | `""` |

### Snapshots — Local Storage

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.snapshots.local.storageClass` | Storage class for local snapshots volume. When empty, uses `emptyDir`. When set, creates a PVC with this storage class | `""` |
| `tap.snapshots.local.storageSize` | Storage size for local snapshots volume | `20Gi` |

### Snapshots — Cloud Storage

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.snapshots.cloud.provider` | Cloud storage provider: `s3` or `azblob`. Empty string disables cloud storage. See [Cloud Storage for Snapshots](/en/snapshots_cloud_storage). | `""` |
| `tap.snapshots.cloud.prefix` | Key prefix in the bucket/container (e.g. `snapshots/`) | `""` |
| `tap.snapshots.cloud.configMaps` | Names of pre-existing ConfigMaps with cloud storage env vars. Alternative to inline `s3`/`azblob` values below. | `[]` |
| `tap.snapshots.cloud.secrets` | Names of pre-existing Secrets with cloud storage credentials. Alternative to inline `s3`/`azblob` values below. | `[]` |
| `tap.snapshots.cloud.s3.bucket` | S3 bucket name. Auto-creates a ConfigMap with `SNAPSHOT_AWS_BUCKET`. | `""` |
| `tap.snapshots.cloud.s3.region` | AWS region for the S3 bucket | `""` |
| `tap.snapshots.cloud.s3.accessKey` | AWS access key ID. Auto-creates a Secret with `SNAPSHOT_AWS_ACCESS_KEY`. | `""` |
| `tap.snapshots.cloud.s3.secretKey` | AWS secret access key. Auto-creates a Secret with `SNAPSHOT_AWS_SECRET_KEY`. | `""` |
| `tap.snapshots.cloud.s3.roleArn` | IAM role ARN to assume via STS for cross-account S3 access | `""` |
| `tap.snapshots.cloud.s3.externalId` | External ID for the STS AssumeRole call | `""` |
| `tap.snapshots.cloud.azblob.storageAccount` | Azure storage account name. Auto-creates a ConfigMap with `SNAPSHOT_AZBLOB_STORAGE_ACCOUNT`. | `""` |
| `tap.snapshots.cloud.azblob.container` | Azure blob container name | `""` |
| `tap.snapshots.cloud.azblob.storageKey` | Azure storage account access key. Auto-creates a Secret with `SNAPSHOT_AZBLOB_STORAGE_KEY`. | `""` |

---

## Resources

### Hub

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.resources.hub.limits.cpu` | CPU limit | `""` (unlimited) |
| `tap.resources.hub.limits.memory` | Memory limit | `5Gi` |
| `tap.resources.hub.requests.cpu` | CPU request | `50m` |
| `tap.resources.hub.requests.memory` | Memory request | `50Mi` |

### Sniffer (Worker)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.resources.sniffer.limits.cpu` | CPU limit | `""` (unlimited) |
| `tap.resources.sniffer.limits.memory` | Memory limit | `5Gi` |
| `tap.resources.sniffer.requests.cpu` | CPU request | `50m` |
| `tap.resources.sniffer.requests.memory` | Memory request | `50Mi` |

### Tracer

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.resources.tracer.limits.cpu` | CPU limit | `""` (unlimited) |
| `tap.resources.tracer.limits.memory` | Memory limit | `5Gi` |
| `tap.resources.tracer.requests.cpu` | CPU request | `50m` |
| `tap.resources.tracer.requests.memory` | Memory request | `50Mi` |

### Traffic Sampling

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.packetCapture` | Packet capture backend: `best`, `af_packet`, or `pf_ring` | `best` |
| `tap.misc.trafficSampleRate` | Percentage of traffic to process (0-100) | `100` |
| `tap.misc.tcpStreamChannelTimeoutMs` | Timeout in milliseconds for TCP stream channel | `10000` |

---

## Networking

### Ports

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.proxy.hub.srvPort` | Hub server port | `8898` |
| `tap.proxy.worker.srvPort` | Worker server port | `48999` |
| `tap.proxy.front.port` | Front-end port | `8899` |
| `tap.proxy.host` | Proxy host address | `127.0.0.1` |

### Network Settings

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.ipv6` | Enable IPv6 support | `true` |
| `tap.hostNetwork` | Enable host network for workers | `true` |

### DNS

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.dns.nameservers` | Custom nameservers | `[]` |
| `tap.dns.searches` | DNS search domains | `[]` |
| `tap.dns.options` | DNS options | `[]` |

---

## Ingress

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.ingress.enabled` | Enable Ingress | `false` |
| `tap.ingress.className` | Ingress class name | `""` |
| `tap.ingress.host` | Ingress hostname | `ks.svc.cluster.local` |
| `tap.ingress.tls` | TLS configuration | `[]` |
| `tap.ingress.annotations` | Ingress annotations | `{}` |

### Routing

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.routing.front.basePath` | Base path for front-end | `""` |

---

## Authentication

### General

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.auth.enabled` | Enable authentication | `false` |
| `tap.auth.type` | Auth backend: `saml`, `oidc` (generic OIDC — Dex, Okta, Auth0, Keycloak, Azure AD, Google), `dex` (permanent alias of `oidc`), `descope`, `default` (also Descope) | `saml` |
| `tap.auth.approvedEmails` | Approved email addresses | `[]` |
| `tap.auth.approvedDomains` | Approved email domains | `[]` |

### Roles & Authorization

The `roles` map is shared by both SAML and OIDC backends — admins maintain a single role definition and switch backends without rewriting it.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.auth.roles` | Role-name → permission map. Each role carries action flags plus `namespaces` (comma list controlling traffic visibility — `""` deny, `"*"` allow-all, `"foo"` literal, `"foo,bar"` OR, `"foo-*"` glob expansion against the cluster's watched namespaces). See [SAML](/en/saml) or [OIDC](/en/oidc) for the full per-role schema. | `{}` |
| `tap.auth.rolesClaim` | JWT claim name (OIDC) or SAML attribute name carrying the user's role memberships | `role` (SAML) / `groups` (OIDC) |
| `tap.auth.defaultRole` | Name of a role inside `tap.auth.roles` applied when an authenticated user has no matching role in their token/assertion. Empty string means no fallback (authenticated but no elevated permissions). | `""` |

> **Breaking changes since the unified rollout:**
> - Empty/unset `tap.auth.roles` no longer grants all permissions — it grants none. Set `tap.auth.defaultRole` to keep a "every authenticated user gets X" baseline.
> - Per-role `filter` (raw KFL string) was replaced with `namespaces` (comma list). Configs carrying `filter:` are silently ignored; migrate.
> - `tap.auth.defaultFilter` is removed; `namespaces: ""` is the explicit per-role deny-default.
> - Legacy `tap.auth.saml.roles` and `tap.auth.saml.roleAttribute` are no longer read; migrate to the top-level keys above.

### SAML

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.auth.saml.idpMetadataUrl` | IdP metadata URL | `""` |
| `tap.auth.saml.x509crt` | X.509 certificate | `""` |
| `tap.auth.saml.x509key` | X.509 private key | `""` |

### OIDC

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.auth.oidc.issuer` | OIDC issuer URL (Dex, Okta, Auth0, Keycloak, Azure AD, Google, …) | `""` |
| `tap.auth.oidc.clientId` | Client ID | `""` |
| `tap.auth.oidc.clientSecret` | Client secret | `""` |
| `tap.auth.oidc.refreshTokenLifetime` | Refresh token lifetime | `3960h` |
| `tap.auth.oidc.oauth2StateParamExpiry` | OAuth2 `state` param expiry | `10m` |
| `tap.auth.oidc.bypassSslCaCheck` | Bypass SSL CA check on the issuer | `false` |

> **Breaking change:** `tap.auth.type=oidc` now routes to the generic OIDC middleware. Earlier releases routed `oidc` to Descope. If you were using `oidc` to mean Descope, switch to `tap.auth.type=descope` (or `default`). The `dex` label remains a permanent alias of `oidc`.

---

## Scheduling

### Node Selection

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.nodeSelectorTerms.workers` | Worker node selectors | Linux only |
| `tap.nodeSelectorTerms.hub` | Hub node selectors | Linux only |
| `tap.nodeSelectorTerms.front` | Front-end node selectors | Linux only |

### Tolerations

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.tolerations.workers` | Worker tolerations | `[{"operator": "Exists", "effect": "NoExecute"}]` |
| `tap.tolerations.hub` | Hub tolerations | `[]` |
| `tap.tolerations.front` | Front-end tolerations | `[]` |

### Other

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.priorityClass` | Priority class name | `""` |

---

## Docker Registry

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.docker.registry` | Docker registry | `docker.io/kubeshark` |
| `tap.docker.tag` | Image tag | `latest` |
| `tap.docker.tagLocked` | Lock tags (prevent upgrades) | `true` |
| `tap.docker.imagePullPolicy` | Pull policy | `Always` |
| `tap.docker.imagePullSecrets` | Pull secrets | `[]` |
| `tap.docker.overrideImage` | Override image names | `""` |
| `tap.docker.overrideTag` | Override image tags | `""` |

---

## Health Probes

### Hub

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.probes.hub.initialDelaySeconds` | Initial delay | `5` |
| `tap.probes.hub.periodSeconds` | Check period | `5` |
| `tap.probes.hub.successThreshold` | Success threshold | `1` |
| `tap.probes.hub.failureThreshold` | Failure threshold | `3` |

### Sniffer

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.probes.sniffer.initialDelaySeconds` | Initial delay | `5` |
| `tap.probes.sniffer.periodSeconds` | Check period | `5` |
| `tap.probes.sniffer.successThreshold` | Success threshold | `1` |
| `tap.probes.sniffer.failureThreshold` | Failure threshold | `3` |

---

## Monitoring

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.metrics.port` | Prometheus metrics port | `49100` |
| `tap.telemetry.enabled` | Usage statistics | `true` |
| `tap.sentry.enabled` | Sentry error logging | `false` |
| `tap.sentry.environment` | Sentry environment | `production` |

---

## Metadata

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.labels` | Labels for all resources | `{}` |
| `tap.annotations` | Annotations for resources | `{}` |

---

## Scripting

| Parameter | Description | Default |
|-----------|-------------|---------|
| `scripting.env` | Environment variables | `{}` |
| `scripting.source` | Script source directory | `""` |
| `scripting.watchScripts` | Watch mode for scripts | `true` |

---

## PCAP Recording

| Parameter | Description | Default |
|-----------|-------------|---------|
| `pcapdump.enabled` | Enable PCAP recording | `false` |
| `pcapdump.maxTime` | Time window for stored traffic | `2h` |
| `pcapdump.maxSize` | Max PCAP storage | `500MB` |

---

## General

| Parameter | Description | Default |
|-----------|-------------|---------|
| `license` | License key (Community, Pro, or Enterprise) | `""` |
| `timezone` | IANA time zone | `""` (local) |
| `headless` | Headless mode | `false` |
| `internetConnectivity` | Allow internet requests | `true` |
| `supportChatEnabled` | Intercom support chat | `false` |

### Kubernetes

| Parameter | Description | Default |
|-----------|-------------|---------|
| `kube.configPath` | Path to kubeconfig | `""` |
| `kube.context` | Kubernetes context | `""` |

### Logging

| Parameter | Description | Default |
|-----------|-------------|---------|
| `logs.file` | Log file path | `""` |
| `dumpLogs` | Enable log dumping | `false` |

### Debug

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.dryRun` | Preview pods without tapping | `false` |
| `tap.debug` | Debug mode | `false` |
| `tap.mountBpf` | Mount BPF filesystem | `true` |

---

## Advanced

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.resourceGuard.enabled` | Resource usage monitoring | `false` |
| `tap.liveConfigMapChangesDisabled` | Disable dynamic ConfigMap changes | `false` |
| `tap.gitops.enabled` | GitOps functionality | `false` |
| `tap.secrets` | Secrets for env variables | `[]` |

### Release

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.release.repo` | Helm chart repository | `https://helm.kubeshark.com` |
| `tap.release.name` | Helm release name | `kubeshark` |
| `tap.release.namespace` | Helm release namespace | `default` |

---

## Installation Examples

### Basic Installation

```bash
helm install kubeshark kubeshark/kubeshark
```

### With Values File

```bash
helm install kubeshark kubeshark/kubeshark -f values.yaml
```

### Common Options

```bash
helm install kubeshark kubeshark/kubeshark \
  --set tap.capture.raw.enabled=true \
  --set tap.capture.raw.storageSize=2Gi \
  --set tap.namespaces="{default,production}" \
  --set tap.ingress.enabled=true
```

### Production Example

```yaml
tap:
  # Target specific namespaces
  namespaces:
    - production
  excludedNamespaces:
    - kube-system
    - monitoring

  # Capture settings
  capture:
    dissection:
      enabled: true
      stopAfter: 0            # Never auto-stop
    raw:
      enabled: true
      storageSize: 5Gi

  # Snapshots
  snapshots:
    local:
      storageClass: gp2
      storageSize: 100Gi
    cloud:
      provider: "s3"
      s3:
        bucket: my-kubeshark-snapshots
        region: us-east-1

  # Resources
  resources:
    hub:
      limits:
        memory: 4Gi
    sniffer:
      limits:
        memory: 2Gi

  # Ingress
  ingress:
    enabled: true
    className: nginx
    host: kubeshark.example.com
    tls:
      - secretName: kubeshark-tls
        hosts:
          - kubeshark.example.com
```

---

## Related Documentation

- [Raw Capture & Snapshots](/en/v2/raw_capture_config) — Detailed capture configuration
- [Cloud Storage for Snapshots](/en/snapshots_cloud_storage) — S3 and Azure Blob Storage setup
- [Capture Filters](/en/pod_targeting) — Pod targeting details
- [Ingress](/en/ingress) — Ingress setup guide
- [SAML](/en/saml) — SAML authentication
- [OIDC with DEX](/en/oidc) — OIDC authentication
- [Node Scheduling](/en/node_scheduling) — Node selection details
