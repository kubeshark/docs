---
title: SAML
description: Configure SAML authentication for corporate identity integration and role-based access control.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

SAML integration provides:
1. Authentication using corporate identities.
2. Role-based feature accessibility (`authorizedActions`).
3. Role-based traffic visibility (KFL filter applied to every query).

The `roles` map and `rolesClaim` are **shared with OIDC** — see the [OIDC page](/en/oidc) for the same configuration applied against an OIDC identity provider.

### SAML Configuration Clause

```yaml
auth:
  enabled: true
  type: saml
  # SAML attribute carrying the user's role memberships.
  # In the example IdP below this is named "users-roles"; it can be any
  # attribute name the IdP exposes.
  rolesClaim: role
  # Optional: name of a role inside `roles` applied when an authenticated
  # user has no matching role in their assertion. Empty = no fallback.
  defaultRole: ""
  # Optional: KFL filter substituted in for any role whose `filter` is
  # empty. Set to "1==0" to opt the deployment into data-level deny-default.
  # Empty string preserves the legacy allow-all-on-blank behaviour.
  defaultFilter: ""
  roles:
    admin:
      filter: ""
      canDownloadPCAP: true
      canUseScripting: true
      scriptingPermissions:
        canSave: true
        canActivate: true
        canDelete: true
      canUpdateTargetedPods: true
      canStopTrafficCapturing: true
      canControlDissection: true
      showAdminConsoleLink: true
  saml:
    idpMetadataUrl: ""
    x509crt: ""
    x509key: ""
```

> **Breaking changes since the unified-roles rollout:** legacy `auth.saml.roles` and `auth.saml.roleAttribute` are no longer read — move their values to the top-level `auth.roles` and `auth.rolesClaim`. Empty/unset `auth.roles` no longer grants all permissions; admins relying on that behaviour must either populate `auth.roles` explicitly or set `auth.defaultRole`.

### X.509 Certificate & Key

```shell
openssl genrsa -out mykey.key 2048
openssl req -new -key mykey.key -out mycsr.csr
openssl x509 -signkey mykey.key -in mycsr.csr -req -days 365 -out mycert.crt
```

- `mycert.crt` — use for `tap.auth.saml.x509crt`.
- `mykey.key` — use for `tap.auth.saml.x509key`.

### IdP Authorization Configuration

`auth.rolesClaim` should match the name of the SAML attribute set in the App Metadata (`app_metadata`) section of the IdP — e.g. `role`, `roles`, or any attribute name the IdP emits. The value can be a single text value or an array of values (multi-role users).

For example, in [Auth0](https://auth0.com/) it looks like this:

![IdP App Metadata](/app_metadata.png)

Each role key inside `auth.roles` is matched against the values returned in this attribute.

### Filter Authorization Rules

Each role can specify a KFL `filter` that limits the traffic visible to users in that role. For example:

```yaml
filter: src.namespace=="ks-load" or dst.namespace=="ks-load"
```

Users assigned to multiple roles see the union of every role's filter (logical OR). A role with `filter: ""` adds no restriction by default; if `auth.defaultFilter` is set, blank filters are substituted with that expression — the canonical opt-in to deny-default scoping.

### Feature Authorization Rules

Each role's flags map to UI / API actions:

| Flag                                          | Gates                                                                   |
|-----------------------------------------------|-------------------------------------------------------------------------|
| `canDownloadPCAP`                             | PCAP download endpoints (`/pcaps/download/...`).                        |
| `canUseScripting`                             | Reading scripts (`GET /scripts`).                                       |
| `scriptingPermissions.canSave`                | `POST` / `PUT /scripts`.                                                |
| `scriptingPermissions.canActivate`            | Activate/deactivate scripts (`/scripts/:index/activate`).               |
| `scriptingPermissions.canDelete`              | Delete scripts (`DELETE /scripts/...`).                                 |
| `canUpdateTargetedPods`                       | Pod targeting endpoints (`/pods/target/...`).                           |
| `canStopTrafficCapturing` / `canControlDissection` | Dissection controls (`POST /settings/dissection`).                  |
| `showAdminConsoleLink`                        | Frontend gate for the admin console link.                               |

### Example

```yaml
auth:
  enabled: true
  type: saml
  rolesClaim: users-roles
  defaultRole: ""
  roles:
    developers:
      filter: src.namespace=="ks-load" or dst.namespace=="ks-load"
      canDownloadPCAP: false
      canUseScripting: false
      scriptingPermissions:
        canSave: false
        canActivate: false
        canDelete: false
      canUpdateTargetedPods: false
    devops:
      filter: src.namespace=="default" or dst.namespace=="default"
      canDownloadPCAP: true
      canUseScripting: true
      scriptingPermissions:
        canSave: true
        canActivate: true
        canDelete: true
      canUpdateTargetedPods: false
    admins:
      filter: ""
      canDownloadPCAP: true
      canUseScripting: true
      scriptingPermissions:
        canSave: true
        canActivate: true
        canDelete: true
      canUpdateTargetedPods: true
      canStopTrafficCapturing: true
      canControlDissection: true
      showAdminConsoleLink: true
  saml:
    idpMetadataUrl: https://dev-....us.auth0.com/samlp/metadata/9K...pO
    x509crt: |
      -----BEGIN CERTIFICATE-----
      MIIDgzCCAmsCFDtG4VpACGCxV9cAsa6Z+9dA3suWMA0GCSqGSIb3DQEBCwUAMH4x
      ...
      -----END CERTIFICATE-----
    x509key: |
      -----BEGIN PRIVATE KEY-----
      MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCW6rSxwgOW5ZvY
      ...
      -----END PRIVATE KEY-----
```

A user with the `app_metadata` below:

```yaml
{
  users-roles: [ "devops", "developers" ]
}
```

…sees traffic in both the `ks-load` and `default` namespaces and gets the `devops` action set (everything except `canUpdateTargetedPods`/dissection control). Only users with the `admins` role can change pod targeting or dissection settings.

### Verifying the active role with `/whoami`

`GET /whoami` returns the authenticated user's identity, resolved `authorizedActions`, and merged `authzFilters`. Useful for diagnosing "why don't I have access to X?" — the response shows exactly which roles the IdP returned (`user.roles`), which keys actually matched `auth.roles` (`user.effectiveRoles`), and the resulting permissions.
