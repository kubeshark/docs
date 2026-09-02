---
title: Authentication
description: How Kubeshark identifies callers, and where each identity backend is documented.
layout: ../../layouts/MainLayout.astro
---

Authentication answers **who is calling**. Authorization — what that caller may do — is a separate question, answered by [Roles & Permissions](/en/roles) whether or not authentication is enabled.

## Enabling it

```shell
tap:
  auth:
    enabled: true
    type: saml          # or: oidc, dex, descope, default
```

`tap.auth.enabled` turns identification on. `tap.auth.type` selects the backend, and the chart refuses to render if the backend is missing its configuration — `saml` without `tap.auth.saml.idpMetadataUrl`, or `oidc` / `dex` without an issuer — rather than installing a Hub that authenticates nobody.

| Backend | Value | Documentation |
|---------|-------|---------------|
| SAML | `saml` | [SAML](/en/saml) |
| Generic OIDC — Dex, Okta, Auth0, Keycloak, Azure AD, Google | `oidc` (`dex` is a permanent alias) | [OIDC w/ DEX](/en/oidc) |
| Kubeshark cloud login | `descope`, `default` | [License Portal](/en/license_portal) |

## Without an identity provider

`tap.auth.enabled: false` is the default. Nobody logs in and no caller is identified, but every caller is still resolved to `tap.auth.defaultRole` and held to it. The chart default is `kubeshark-admin`, which is why an installation that never configured anything behaves as it always has.

```shell
tap:
  auth:
    enabled: false
    defaultRole: kubeshark-viewer
```

That yields a read-only deployment — live traffic and snapshots are browsable, nothing can be changed — with no identity provider and no login screen. See [Deployments without an identity provider](/en/roles#deployments-without-an-identity-provider).

## Authorizing users once they are identified

Which role an authenticated user resolves to is driven by `tap.auth.rolesClaim`, `tap.auth.groupMapping` and `tap.auth.defaultRole`, shared by every backend. See [Roles & Permissions](/en/roles) for the built-in roles, the capability vocabulary, custom roles and namespace scope, and the [Helm reference](/en/helm_reference#roles--authorization) for the individual values.

## SAML tenancy

To integrate your organization's SAML provider, begin by signing up on the [License Portal](https://console.kubeshark.com/). Afterward, reach out to us on [Slack](https://join.slack.com/t/kubeshark/shared_invite/zt-3jdcdgxdv-1qNkhBh9c6CFoE7bSPkpBQ), use our [contact-us](https://kubeshark.com/contact-us) form or send an email to info@kubeshark.com with the following details:

1. Company name (tenant name)
2. Approved corporate domains list
3. The email of the tenant admin who registered on the [License Portal](https://console.kubeshark.com/)

After receiving your details, we'll set you up as a tenant admin and provide you with a link to configure your SAML settings.
