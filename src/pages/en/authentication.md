---
title: Authentication
description: Learn how to enable authentication for Kubeshark.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides email and social authentication right out of the box. Authentication is a standalone feature that can be toggled on or off.
![Social and IDP Authentication](/authentication.png)

## SAML

To integrate your organization's SAML provider, begin by signing up on the [License Portal](https://console.kubeshark.com/). Afterward, reach out to us on [Slack](https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA), use our [contact-us](https://kubeshark.com/contact-us) form or send an email to info@kubeshark.com with the following details:

1. Company name (tenant name)
2. Approved corporate domains list
3. The email of the tenant admin who registered on the [License Portal](https://console.kubeshark.com/)

After receiving your details, we'll set you up as a tenant admin and provide you with a link to configure your SAML settings.

## Configuration

For those not using SAML, we offer a two-step process:
1. Authentication - which can be performed via email or through social authentication providers (like Google, Microsoft).
2. Authorization - this involves setting configurations in the **Kubeshark** config file.


```shell
tap:
  auth:
    enabled: true
    approveddomains:
    - kubeshark.com
    - some-other-domain.com
    approvedemails:
    - me@gmail.com
    - they@yahoo.com
```
To enable authentication, set the `tap.auth.enabled` field to `true`. To disable it, set it to `false`.

In the `approveddomains`, list the domains that should be authorized to view the dashboard.

In the `approvedemails`, list the emails that should be authorized to view the dashboard if they are outside the `approveddomains` list.
