---
title: Authentication
description: This article describes how to enable authentication.
layout: ../../layouts/MainLayout.astro
---
**Kubeshark** comes with email and social authentication out of the box. Authentication is an independent option that can be enabled or disabled.
![Social and IDP Authentication](/authentication.png)


## SAML

If you'd like to connect your organization's SAML provider, first sign up to [Kubeshark's console](https://console.kubeshark.co/) and then [drop us a note](https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA) (or send an email to: info@kubeshark.co) with the following properties:
1. Company name (tenant name)
2. List of approved corporate domains
3. The email of the tenant admin who sign up to [Kubeshark's console](https://console.kubeshark.co/)

Once we get a chance to configure you as your tenant admin, we will send you a SAML link where you can configure your SAML details.

## Configuration

If you don't use SAML, we introduce two steps that includes:
1. Authentication
2. Authorization

Authentication will be conducted via email or Social authentication vendors (e.g. Googl, Microsoft).
Authorization requires setting configuration in the **Kubeshark** config file:

```shell
tap:
  auth:
    enabled: true
    approveddomains:
    - kubeshark.co
    - some-other-domain.com
    approvedemails:
    - me@gmail.com
    - they@yahoo.com
```

To enable authentication change the `tap.auth.enabled` field to `true`. To disable it, change it to `false`. 

In the `approveddomains`, list the domains that should be authorized to view the dashboard. 

In the `approvedemails`, list the emails that should be authorized to view the dashboard if they are outside the `approvddomain` list.
