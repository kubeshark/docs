---
title: Scope of Traffic Capture
description: Kubeshark enables you to describe the scope of traffic capture with support for namespaces and PODs
layout: ../../layouts/MainLayout.astro
mascot:
---

While capturing all traffic is possible, it is a storage and CPU intensive operation. [Kubeshark](https://kubeshark.com) enables you to describe the scope of traffic capture with support for namespaces and PODs.

### Pods selection

#### Specific Pod:

```shell
kubeshark tap catalogue-b87b45784-sxc8q
```

#### Set of Pods Using a Regex:

You can use a regular expression to indicate several pod names as well as dynamically changing names.

In the example below using the regex `(catalo*|front-end*)` will catch the following three Pods:
* catalogue-868cc5ffd6-p9njn
* catalogue-db-669d5dbf48-8hnrl
* front-end-6db57bf84f-7kss9

```shell
kubeshark tap "(catalo*|front-end*)"
```

![PODS](/pods.png)

### Namespaces

By default, [Kubeshark](https://kubeshark.com) is deployed into the `default` namespace.
To specify a different namespace:

```
kubeshark tap -n sock-shop
```

### Specify All Namespaces

The default deployment strategy of [Kubeshark](https://kubeshark.com) waits for the new Pods
to be created. To simply deploy to all existing namespaces run:

```
kubeshark tap
```