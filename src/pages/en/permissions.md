---
title: Permissions
description: Required Kubernetes permissions for Kubeshark.
layout: ../../layouts/MainLayout.astro
---

This page contains `Role` and `RoleBinding` which provide permissions required for full and correct operation of **Kubeshark** in your Kubernetes cluster.

## All namespaces

For capturing from all namespaces with `kubeshark tap`:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kubeshark-runner-clusterrole
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["list", "watch", "create"]
- apiGroups: [""]
  resources: ["services"]
  verbs: ["get", "create"]
- apiGroups: ["apps"]
  resources: ["daemonsets"]
  verbs: ["create", "patch"]
- apiGroups: [""]
  resources: ["namespaces"]
  verbs: ["list", "watch", "create", "delete"]
- apiGroups: [""]
  resources: ["services/proxy"]
  verbs: ["get", "create"]
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["create"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kubeshark-runner-clusterrolebindings
subjects:
- kind: User
  name: user-with-clusterwide-access
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: kubeshark-runner-clusterrole
  apiGroup: rbac.authorization.k8s.io
```

## Specific Namespace

For capturing from a specific namespace with `kubeshark tap -n example`:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kubeshark-runner-role
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["list", "watch", "create"]
- apiGroups: [""]
  resources: ["services"]
  verbs: ["get", "create", "delete"]
- apiGroups: ["apps"]
  resources: ["daemonsets"]
  verbs: ["create", "patch", "delete"]
- apiGroups: [""]
  resources: ["services/proxy"]
  verbs: ["get", "create", "delete"]
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["create", "delete"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kubeshark-runner-rolebindings
subjects:
- kind: User
  name: user-with-restricted-access
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: kubeshark-runner-role
  apiGroup: rbac.authorization.k8s.io
```
