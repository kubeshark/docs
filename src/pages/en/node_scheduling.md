---
title: Node Scheduling
description: When you want to add or remove nodes to Kubeshark
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Node scheduling can be very beneficial when you want to control [Kubeshark](https://kubeshark.com)'s resource consumption and limit its work to certain nodes at certain times.

For example, if you want to have [Kubeshark](https://kubeshark.com) installed and running in the cluster on a single node or on no nodes at all on idle, and unleash its power when nessasery.

We use Kubernetes' [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) as the mechanism and can set the various conditions in the  `nodeSelectorTerms` [Kubeshark](https://kubeshark.com) config property.

## Using the CLI
When we set this example in `~/.kubeshark/config.yaml`:

```shell
tap:
  nodeSelectorTerms:
  - matchExpressions:
      - key: kubeshark-active
        operator: In
        values:
          - 'true'
```

We can use the following `kubectl` sequence to schedule and unschedule certain nodes:
```shell
> kubectl get nodes
NAME                                                    STATUS   ROLES    AGE   
ip-192-168-77-217.us-east-2.compute.internal            Ready    <none>   3d15h   

> kubectl label nodes ip-192-168-77-217.us-east-2.compute.internal kubeshark-active=false --overwrite
> kubectl label nodes ip-192-168-77-217.us-east-2.compute.internal kubeshark-active==true --overwrite
```

In the above example, when a node is labeled with `kubeshark-active=false` the worker's DaemonSet pod will not run and vice versa.

## Using Helm

Use the following option when you install [Kubeshark](https://kubeshark.com) with Helm:

```shell
helm install kubeshark kubeshark/kubeshark  \
--set-json 'tap.nodeSelectorTerms=[{"matchExpressions": [ {"key":"kubeshark-active", "operator": "In", "values": ["true" ] } ] }]'
```

