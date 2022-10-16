---
title: Clean Up
description: Clean Up
layout: ../../layouts/MainLayout.astro
mascot: Holiday
mascotSize: 110
---

To clean up a Kubeshark deployment from your cluster, simply run:

```shell
kubeshark clean
```

## Only A Certain Namespace

By default, Kubeshark the `clean` command removes the any Kubershark deployments
cluster-wide. To clean up only a certain namespace:

```
kubeshark clean -n sock-shop
```
