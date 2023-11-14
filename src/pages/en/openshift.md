---
title: Kubeshark on Openshift
description: 
layout: ../../layouts/MainLayout.astro
---

Prerequisites:
1. An active Redhat account
2. An active AWS account
3. Have the following CLIs installed and configured: [rosa](https://console.redhat.com/openshift/downloads), [aws](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) and [oc](https://console.redhat.com/openshift/downloads).

If you don't have an Openshift cluster, you can follow the [instructions below](#tldr---create-an-openshift-cluster) to install one.

## Adding Constraints 

Kubeshark requires adding the following [SCCs](https://docs.openshift.com/enterprise/3.0/admin_guide/manage_scc.html): `privileged` and `anyuid` to the following service accounts: `default` and `kubeshark-service-account` in the namespace Kubeshark is about to run in (e.g. `default`).

```shell
oc adm policy add-scc-to-user privileged -z default -n default
oc adm policy add-scc-to-user anyuid -z default -n default
oc adm policy add-scc-to-user privileged -z kubeshark-service-account -n default
oc adm policy add-scc-to-user anyuid -z kubeshark-service-account -n default
```

## Install Kubeshark

You can now install Kubeshark:
```shell
sh <(curl -Ls https://kubeshark.co/install)
```

## Change the Workers Pods

Running Kubeshark requires some configuration changes, disabling properties that are still not fully supported:

```shell
kubeshark tap --set tap.proxy.worker.srvPort=30001 --set tap.tls=false
```

That's it, your good to go!

## TL;DR - Create an Openshift Cluster

Get `rosa` token from [here](https://console.redhat.com/openshift/token/rosa).

Login to Openshift:
```shell
rosa login --token="eyJh..."
```

Ensure AWS CLI is installed and configure:
```shell
aws configure
```
> Read more about how to install AWS CLI [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html).

Create the require roles in AWS for an Openshift Cluster
```shell
rosa create account-roles --mode auto
```

![ROSA account roles](/rosa-account-roles.png)

Create an Openshift cluster
```shell
rosa create cluster --cluster-name <cluster-name> --sts --mode auto
```

Choose `ManagedOpenShift-Installer-Role` when asked:

![Select role](/select-role.png)

You can track the cluster creation progress with:
```shell
rosa logs install -c <cluster-name> --watch
```

Once the cluster is created, create a `cluster-admin` user:
```shell
rosa create admin --cluster=<cluster-name>
```
Follow the on-screen instruction to log in to the actual cluster.
Something like:
```shell
oc login https://api.kubeshark.ABC1.p1.openshiftapps.com:6443 --username cluster-admin --password <super_long_pwd>
```

Verify all nodes are in  `Ready` status:
```shell
oc get nodes
``` 
