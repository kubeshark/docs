---
title: License Portal & License Key
description: Manage your Kubeshark license, subscription, and payment methods
layout: ../../layouts/MainLayout.astro
---

The [License Portal](https://console.kubeshark.com) provides a self-service interface for managing your Kubeshark license and subscription.

## Accessing the Portal

Visit [console.kubeshark.com](https://console.kubeshark.com) and log in with your account credentials.

![License Portal Login](/license_portal_login.png)

## License Types

A license key belongs to a named user (the **Licensee**). The license key is an encrypted string that includes information related to the plan, such as node limit, pod limit, expiration date, and edition.

### Single-Cluster License

A single-cluster license key can only be used on a single specific cluster identified by a unique ID. This license cannot be transferred to a different cluster without resetting it first.

The license includes a node limit that should be higher than the maximum node count of the cluster (considering control plane, auto-scaling, spot instances, etc).

### Multi-Cluster License

An unlimited-cluster license is a single license key that can be used on any cluster, as long as the number of nodes in the cluster doesn't surpass the license node limit.

## License Tab

The License tab provides instructions for obtaining and using your license key.

![License Tab](/license_portal_license.png)

### Enterprise Users

Enterprise users can download the license key and configure it for organization-wide access, allowing all team members to use Kubeshark without individual licenses.

**With Helm:**

```shell
helm install kubeshark kubeshark/kubeshark \
  --set license=<your-license-key>
```

**With the CLI:**

```shell
kubeshark tap --set license=<your-license-key>
```

**Via configuration file:**

```yaml
license: <your-license-key>
```

You can also store the license key as a Kubernetes secret for secure deployment.

### Non-Enterprise Users

Non-enterprise licenses are personal and require:

- **Authentication**: Users must log in to access Kubeshark
- **Internet connectivity**: An active connection to https://api.kubeshark.com is required

Non-enterprise users will see instructions on how to log in to obtain their license. The license key cannot be downloaded or set as a Helm value.

## Subscription Tab

The Subscription tab displays your license attributes:

- Edition (Community, Pro, Enterprise)
- Subscription status
- Node limit
- Pod limit
- Cluster type (single or unlimited)
- Cluster IDs

![Subscription Tab](/license_portal_subscription.png)

From this tab you can:

- Upgrade to Pro
- Downgrade to Community
- Manage your Stripe subscription (change payment methods, cancel, modify plan)

## Applying a License Key

To use a license key in a cluster, the Licensee should log in to Kubeshark's dashboard on the specific cluster. There is no limit on the number of clusters the Licensee can log in to and apply their license.

The license key is set in Kubeshark's config map in the specific cluster. It will remain there and serve that cluster and all of its users until explicitly removed or Kubeshark is restarted.

## Removing a License Key

Licensees can remove their license key from a cluster by:

1. Logging in to Kubeshark's dashboard on the specific cluster
2. Using the `remove license` button in the license dialog box

![How to remove a license key](/remove_license.png)

> Only the Licensee can remove their license key.

## Enterprise Features

### Air-Gapped Clusters

Enterprise users can download their license keys directly from the portal for use in air-gapped environments. This allows Kubeshark to operate in clusters without internet connectivity.

### Organization-Wide Dashboard Access

When a license key is configured locally in the cluster, all users within your organization can access the Kubeshark dashboard without requiring individual authentication.

### Optional IDP Authentication

For organizations requiring additional access control, Kubeshark supports authentication through your Identity Provider (IDP):

- Enforce your existing authentication policies
- Manage user access through your organization's IDP
- Maintain audit trails of dashboard access

See [SAML](/en/saml) and [OIDC](/en/oidc) documentation for configuration details.

## Troubleshooting

### Log Out and In

If you log in and don't see your up-to-date license, try logging out and back in.

### Clean Relics of Old Deployments

Make sure you have cleaned any relics from previous deployments:

```shell
kubeshark clean
```

or

```shell
helm uninstall kubeshark
```

> Setting a new license requires removing the previous license or restarting Kubeshark.

### Check the Logs

If there's an issue, it should become apparent in the Hub's logs.

### Contact Support

If the above remedies did not work, [contact us](https://kubeshark.com/contact-us) and we'll get you started quickly.
