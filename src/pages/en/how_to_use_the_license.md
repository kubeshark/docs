---
title: Using the License Key  
description: Optimizing resource consumption through pod targeting  
layout: ../../layouts/MainLayout.astro  
mascot: Hello
---

A license key belongs to a named user (the **Licensee**). The license key is an encrypted string that is automatically added to the Licensee's account when they subscribe to a plan. This key includes information related to the Licensee's plan, such as node limit, API call limit, plan expiration date, edition, etc.

## Types of License

### Single-Cluster License

A single-cluster license key can be used only on a single specific cluster that is identified by a unique ID. This license can not be tranfered to a different cluster, without resetting the license. 
THe license will include a node limit that should be higher than the maximum node count of the cluster (considering control plane, auto-scaling, spot instances, etc)

### Multi-Cluster License

An unlimited-cluster license is a single license key that can be used on any cluster, as long as the number of nodes in the cluster doesn't surpass the license node limit.


## Applying a License Key to a Specific Cluster

To use a license key in a cluster, the Licensee should log in to **Kubeshark**'s dashboard on the specific cluster. There is no limit on the number of clusters the Licensee can log in to and apply their license.

This operation can be performed only once. A license key is set in **Kubeshark**'s config map in the specific cluster. The license key will stay there and serve that cluster and all of its users until the license key is explicitly removed from the cluster or **Kubeshark** is restarted in the cluster (cleaning any relics, including the license key).

## Removing a License Key

Licensees can remove their license key from a cluster by performing two steps:
1. Logging in to **Kubeshark**'s dashboard on the specific cluster.
2. Using the `remove license` button in the license dialog box.

![How to remove a license key](/remove_license.png)

> Only the Licensee can remove their license key.

## Setting the License Key Through Configuration

You can avoid having to log in to set your license by setting the license key in the configuration.

You can get your license key by visiting **Kubeshark**'s [Admin Console](https://console.kubeshark.com/). Copy and paste your license key where appropriate:

Use via command line:

```shell
--set license=<your-license>
```

Use via configuration:

```shell
license: <your-license>
```

## An Active Internet Connection is Required

Other than using the ENTERPRISE plan, **Kubeshark** needs an active internet connection, specifically to https://api.kubeshark.com, for **Kubeshark** to work properly. This will not work when there is no internet connection. You can check the Hub's logs to see if there is a problem connecting to the API server. If you don't have an active internet connection, we recommend using our ENTERPRISE plan or at the very least converting your PRO license to an ENTERPRISE one. 

## Troubleshooting

Try one of the following if something goes wrong:

### Log Out and In 

If for any reason, you log in and don't see your up-to-date license, try to log out and log in again.

### Clean Relics of Old Deployments 

Make sure you have cleaned any relics from previous deployments by using either:

```shell
kubeshark clean
```

or 

```shell
helm uninstall kubeshark
```

> Remember that setting a new license requires removing the previous license or restarting Kubeshark.

### Set the License Key in the Configuration or in the Command Line 

As mentioned above.

### Check the Logs 

If there's an issue, it should become apparent in the Hub's logs.

### Well, That Didn't Work

If the above remedies did not work for you, [contact us](https://kubeshark.com/contact-us) and we'll get you started quickly. Worst case scenario, we'll convert your PRO license to an ENTERPRISE license, which doesn't require any internet connection.  
