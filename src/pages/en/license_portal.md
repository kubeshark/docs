---
title: License Portal
description: Manage your Kubeshark license, subscription, and payment methods
layout: ../../layouts/MainLayout.astro
---

The [License Portal](https://console.kubeshark.com) provides a self-service interface for managing your Kubeshark license and subscription.

## Accessing the Portal

Visit [console.kubeshark.com](https://console.kubeshark.com) and log in with your account credentials.

![License Portal Login](/license_portal_login.png)

## Features

### View License Details

The portal displays your current license attributes including:

- License key
- Plan type (Community, Micro, Enterprise)
- Node limit
- Expiration date
- Cluster assignment (single or multi-cluster)

### Manage Your License Key

From the portal you can:

- Copy your license key for use in Kubeshark deployments
- View license usage across clusters
- Reset cluster assignments (for single-cluster licenses)

### Upgrade or Downgrade Plan

Change your subscription tier based on your needs:

- Upgrade to access additional features or increase node limits
- Downgrade to a lower tier if your requirements change

Plan changes take effect immediately, with billing adjusted accordingly.

### Cancel Subscription

You can cancel your subscription at any time through the portal. Upon cancellation:

- Your license remains active until the end of the current billing period
- After expiration, Kubeshark will revert to Community edition functionality

### Manage Payment Methods

Update your billing information:

- Add or remove credit cards
- Change your default payment method
- View billing history and invoices

## Enterprise Features

### Downloadable License Keys for Air-Gapped Clusters

Enterprise users can download their license keys directly from the portal for use in air-gapped environments. This allows Kubeshark to operate in clusters without internet connectivity.

### Organization-Wide Dashboard Access

When a license key is configured locally in the cluster, all users within your organization can access the Kubeshark dashboard without requiring individual authentication. This simplifies access management for teams.

### Optional IDP Authentication

For organizations requiring additional access control, Kubeshark supports authentication through your Identity Provider (IDP). This allows you to:

- Enforce your existing authentication policies
- Manage user access through your organization's IDP
- Maintain audit trails of dashboard access

See [SAML](/en/saml) and [OIDC](/en/oidc) documentation for configuration details.
