---
title: Kubeshark on Openshift
description: 
layout: ../../layouts/MainLayout.astro
---

[Kubeshark](https://kubeshark.com) is designed to run seamlessly on Openshift, but we recommend deploying [Kubeshark](https://kubeshark.com) in its own dedicated namespace. For instance:
```yaml
kubectl create namespace kubeshark
kubeshark tap -s kubeshark
```
## TL;DR - Create an Openshift Cluster on AWS

### Prerequisites:
1. An active Redhat account
2. An active AWS account
3. Have the following CLIs installed and configured: [rosa](https://console.redhat.com/openshift/downloads), [aws](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) and [oc](https://console.redhat.com/openshift/downloads).

If you don't have an Openshift cluster, you can follow the [instructions below](#tldr---create-an-openshift-cluster) to install one.



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
