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
| `tap.capture.stopped` | Start with dissection disabled | `false` |
| `tap.capture.stopAfter` | Auto-stop after inactivity | `30s` |
| `tap.capture.raw.enabled` | Enable raw packet capture | `true` |
| `tap.capture.raw.storageSize` | FIFO buffer size per node | `1Gi` |
| `tap.capture.dbMaxSize` | Max dissection database size | `""` |

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
| `tap.storageLimit` | Storage limit for emptyDir/PVC | `5Gi` |

### Persistent Storage

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.persistentStorage` | Use PersistentVolumeClaim | `false` |
| `tap.persistentStorageStatic` | Use static volume provisioning | `false` |
| `tap.persistentStoragePvcVolumeMode` | PVC volume mode | `Filesystem` |
| `tap.storageClass` | Storage class for PVC | `standard` |
| `tap.efsFileSytemIdAndPath` | AWS EFS configuration | `""` |

### Snapshots

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.snapshots.storageClass` | Storage class for snapshots | `""` |
| `tap.snapshots.storageSize` | Snapshot volume size | `10Gi` |

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
| `tap.resources.sniffer.limits.memory` | Memory limit | `3Gi` |
| `tap.resources.sniffer.requests.cpu` | CPU request | `50m` |
| `tap.resources.sniffer.requests.memory` | Memory request | `50Mi` |

### Tracer

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.resources.tracer.limits.cpu` | CPU limit | `""` (unlimited) |
| `tap.resources.tracer.limits.memory` | Memory limit | `3Gi` |
| `tap.resources.tracer.requests.cpu` | CPU request | `50m` |
| `tap.resources.tracer.requests.memory` | Memory request | `50Mi` |

### Traffic Sampling

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.trafficSampleRate` | Percentage of traffic to process (0-100) | `100` |

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
| `tap.dnsConfig.nameservers` | Custom nameservers | `[]` |
| `tap.dnsConfig.searches` | DNS search domains | `[]` |
| `tap.dnsConfig.options` | DNS options | `[]` |

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
| `tap.auth.type` | Auth type (`saml` or `dex`) | `saml` |
| `tap.auth.approvedEmails` | Approved email addresses | `[]` |
| `tap.auth.approvedDomains` | Approved email domains | `[]` |

### SAML

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.auth.saml.idpMetadataUrl` | IDP metadata URL | `""` |
| `tap.auth.saml.x509crt` | X.509 certificate | `""` |
| `tap.auth.saml.x509key` | X.509 private key | `""` |
| `tap.auth.saml.roleAttribute` | Role attribute name | `role` |
| `tap.auth.saml.roles` | Role definitions | Admin with full access |

### OIDC (Dex)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.auth.dexOidc.issuer` | Dex issuer URL | `""` |
| `tap.auth.dexOidc.clientId` | Client ID | `""` |
| `tap.auth.dexOidc.clientSecret` | Client secret | `""` |
| `tap.auth.dexOidc.refreshTokenLifetime` | Refresh token lifetime | `3960h` |
| `tap.auth.dexOidc.oauth2StateParamExpiry` | OAuth2 state expiry | `10m` |
| `tap.auth.dexOidc.bypassSslCaCheck` | Bypass SSL CA check | `false` |

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
| `tap.probes.hub.initialDelaySeconds` | Initial delay | `15` |
| `tap.probes.hub.periodSeconds` | Check period | `10` |
| `tap.probes.hub.successThreshold` | Success threshold | `1` |
| `tap.probes.hub.failureThreshold` | Failure threshold | `3` |

### Sniffer

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.probes.sniffer.initialDelaySeconds` | Initial delay | `15` |
| `tap.probes.sniffer.periodSeconds` | Check period | `10` |
| `tap.probes.sniffer.successThreshold` | Success threshold | `1` |
| `tap.probes.sniffer.failureThreshold` | Failure threshold | `3` |

---

## Monitoring

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tap.metrics.port` | Prometheus metrics port | `49100` |
| `tap.telemetry.enabled` | Usage statistics | `true` |
| `tap.sentry.enabled` | Sentry error logging | `true` |
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
| `license` | Pro/Enterprise license key | `""` |
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
| `tap.release.repo` | Helm chart repository | `https://helm.kubeshark.co` |
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
    stopped: false
    stopAfter: 0              # Never auto-stop
    raw:
      enabled: true
      storageSize: 5Gi

  # Snapshots
  snapshots:
    storageClass: gp2
    storageSize: 100Gi

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
- [Capture Filters](/en/pod_targeting) — Pod targeting details
- [Ingress](/en/ingress) — Ingress setup guide
- [SAML](/en/saml) — SAML authentication
- [OIDC with DEX](/en/oidc) — OIDC authentication
- [Node Scheduling](/en/node_scheduling) — Node selection details
