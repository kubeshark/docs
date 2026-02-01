---
title: Quick Start
description: Get Kubeshark running in your Kubernetes cluster in under 60 seconds.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Get [Kubeshark](https://kubeshark.com) running in your Kubernetes cluster in under 60 seconds.

---

## Prerequisites

Before you begin, ensure you have:

- A running Kubernetes cluster (v1.16+)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) configured to access your cluster
- [Helm](https://helm.sh/docs/intro/install/) v3.0+ installed

---

## Installation

### Step 1: Add the Helm Repository

```bash
helm repo add kubeshark https://helm.kubeshark.com
helm repo update
```

### Step 2: Install Kubeshark

```bash
helm install kubeshark kubeshark/kubeshark
```

<div class="callout callout-tip">

For production deployments, see the [full installation guide](/en/install) for configuration options.

</div>

### Step 3: Access the Dashboard

Forward the dashboard port to your local machine:

```bash
kubectl port-forward svc/kubeshark-front 8899:80
```

Open [http://localhost:8899](http://localhost:8899) in your browser.

---

## Verify Installation

Check that all [Kubeshark](https://kubeshark.com) pods are running:

```bash
kubectl get pods -l app.kubernetes.io/name=kubeshark
```

You should see output similar to:

```
NAME                              READY   STATUS    RESTARTS   AGE
kubeshark-front-xxxxx             1/1     Running   0          1m
kubeshark-hub-xxxxx               1/1     Running   0          1m
kubeshark-worker-xxxxx            1/1     Running   0          1m
```

---

## First Steps in the Dashboard

Once the dashboard loads:

1. **View Live Traffic**: API calls appear in real-time in the traffic stream
2. **Filter Traffic**: Use the search bar to filter by protocol, pod, or content
3. **Inspect Details**: Click any request to see headers, payload, and response
4. **View Service Map**: Click the "Service Map" tab to visualize service dependencies

---

## Common Commands

| Command | Description |
|---------|-------------|
| `helm repo add kubeshark https://helm.kubeshark.com` | Add the Helm repository |
| `helm install kubeshark kubeshark/kubeshark` | Install [Kubeshark](https://kubeshark.com) |
| `helm upgrade kubeshark kubeshark/kubeshark` | Upgrade to latest version |
| `helm uninstall kubeshark` | Remove [Kubeshark](https://kubeshark.com) |
| `kubectl port-forward svc/kubeshark-front 8899:80` | Access dashboard |

---

## What's Next?

- [Dashboard Overview](/en/ui) - Learn the [Kubeshark](https://kubeshark.com) interface
- [Capture Filters](/en/pod_targeting) - Target specific pods and namespaces
- [TLS Decryption](/en/encrypted_traffic) - View encrypted traffic
- [Protocol Support](/en/protocols) - Configure protocol dissectors

---

## Troubleshooting

<div class="callout callout-warning">

If pods are not starting, check for common issues:

</div>

**Pods stuck in Pending state:**
```bash
kubectl describe pod -l app.kubernetes.io/name=kubeshark
```

**Check Kubeshark logs:**
```bash
kubectl logs -l app.kubernetes.io/name=kubeshark-hub
```

For more help, see the [Troubleshooting Guide](/en/troubleshooting).
