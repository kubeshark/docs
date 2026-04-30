---
title: OIDC
description: Configure OpenID Connect authentication and role-based access control. Works with any spec-compliant OIDC issuer — Dex, Okta, Auth0, Keycloak, Azure AD, Google.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

OIDC integration provides:
1. Authentication using corporate identities through any spec-compliant OIDC issuer.
2. Role-based feature accessibility (`authorizedActions`).
3. Role-based traffic visibility (KFL filter applied to every query).

The `roles` map and `rolesClaim` are **shared with SAML** — see the [SAML page](/en/saml) for the same configuration applied against a SAML IdP.

> **Breaking change:** `tap.auth.type=oidc` now routes to the generic OIDC middleware. Earlier releases routed `oidc` to Descope. If you were using `oidc` to mean Descope, switch to `tap.auth.type=descope` (or `default`). The `dex` label remains a permanent alias of `oidc`.

## Prerequisites

If you're integrating with [Dex](https://dexidp.io/), add the following static client configuration to your Dex IdP's `config.yaml`:

```yaml
staticClients:
  - id: kubeshark
    secret: <create your own client password>
    name: Kubeshark
    redirectURIs:
      - https://<your-kubeshark-host>/api/oauth2/callback
```

Replace `<your-kubeshark-host>` with Kubeshark's URL.

For other issuers (Okta, Auth0, Keycloak, Azure AD, Google), register an OIDC application with the same redirect URI. Make sure the application requests the `groups` scope (or whichever claim you set in `rolesClaim` below).

### Kubeshark Configuration

```yaml
# values.yaml

tap:
  auth:
    enabled: true
    type: oidc                # canonical; `dex` is accepted as a permanent alias
    # JWT claim carrying the user's role memberships. `groups` is the
    # de-facto OIDC convention; some providers (e.g. Azure AD) emit a
    # single string when the user has one role — both shapes are accepted.
    rolesClaim: groups
    # Optional: name of a role inside `roles` applied when an authenticated
    # user has no matching role in their token. Empty = no fallback.
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
      payments-viewer:
        filter: src.pod.namespace=="payments" or dst.pod.namespace=="payments"
        canUseScripting: true
    oidc:
      issuer: <insert OIDC issuer URL here>
      clientId: kubeshark
      clientSecret: <your client password>
      refreshTokenLifetime: "3960h" # 165 days
      oauth2StateParamExpiry: "10m"
      bypassSslCaCheck: false
```

> **Breaking changes since the unified-roles rollout:** legacy `auth.saml.roles` and `auth.saml.roleAttribute` are no longer read — move their values to the top-level `auth.roles` and `auth.rolesClaim`. Empty/unset `auth.roles` no longer grants all permissions; admins relying on that behaviour must either populate `auth.roles` explicitly or set `auth.defaultRole`.

---

**Note:**<br/>
Set `tap.auth.oidc.bypassSslCaCheck: true`
to allow Kubeshark to communicate with an issuer presenting an unknown SSL Certificate Authority.

This setting allows you to prevent SSL CA-related errors:<br/>
`tls: failed to verify certificate: x509: certificate signed by unknown authority`

---

After configuring the values file, install Kubeshark:

```bash
helm install kubeshark kubeshark/kubeshark -f ./values.yaml
```

### Try Your OIDC-Enabled Kubeshark

Once OIDC is enabled you'll be redirected to your IdP's login page. The screenshots below show Dex; Okta / Auth0 / Keycloak follow the same flow.

**Example: Dex IdP Login Page**

![Dex IdP - Login Page](/oidc-dex-login-page.png)

1. Choose a login option. Your upstream IdP (Google, Microsoft, etc.) will guide you through authentication.
2. Grant Kubeshark access to your user information when prompted:

   ![Dex IdP - Grant Access](/oidc-dex-grant-access.png)

3. You're logged in. Your email appears in the top-right of the dashboard:

   ![Dex IdP - Successful Login](/oidc-dex-successful-login.png)

4. You're authorized. Use Kubeshark as usual.

### IdP Role Configuration

Kubeshark reads role memberships from the JWT claim named in `auth.rolesClaim` (default `groups`). Configure your IdP to emit the user's group / role memberships in that claim:

- **Dex** — propagates upstream group membership through the configured connector. Some connectors (LDAP, GitHub) require explicit `groups` configuration; check Dex docs for your connector.
- **Okta** — add a groups claim to the OIDC app, scope the filter (e.g. `Starts with: hub-`) to keep unrelated groups out of the token.
- **Auth0** — add a Rule or Action that sets `idToken['groups'] = user.groups`.
- **Keycloak** — enable the "Groups" mapper on the client.
- **Azure AD** — emits group object IDs by default; configure the app registration to emit group display names if you want human-readable role keys.

### Filter Authorization Rules

Each role can specify a KFL `filter` that limits the traffic visible to users in that role:

```yaml
filter: src.pod.namespace=="payments" or dst.pod.namespace=="payments"
```

Users with multiple roles see the union of every role's filter (logical OR). A role with `filter: ""` adds no restriction by default; if `auth.defaultFilter` is set, blank filters are substituted with that expression — the canonical opt-in to deny-default scoping.

### Feature Authorization Rules

Each role's flags map to UI / API actions:

| Flag                                                | Gates                                                              |
|-----------------------------------------------------|--------------------------------------------------------------------|
| `canDownloadPCAP`                                   | PCAP download endpoints (`/pcaps/download/...`).                   |
| `canUseScripting`                                   | Reading scripts (`GET /scripts`).                                  |
| `scriptingPermissions.canSave`                      | `POST` / `PUT /scripts`.                                           |
| `scriptingPermissions.canActivate`                  | Activate/deactivate scripts (`/scripts/:index/activate`).          |
| `scriptingPermissions.canDelete`                    | Delete scripts (`DELETE /scripts/...`).                            |
| `canUpdateTargetedPods`                             | Pod targeting endpoints (`/pods/target/...`).                      |
| `canStopTrafficCapturing` / `canControlDissection`  | Dissection controls (`POST /settings/dissection`).                 |
| `showAdminConsoleLink`                              | Frontend gate for the admin console link.                          |

### Verifying the active role with `/whoami`

`GET /whoami` returns the authenticated user's identity, resolved `authorizedActions`, and merged `authzFilters`. Useful for diagnosing "why don't I have access to X?" — the response shows exactly which roles the token claim returned (`user.roles`), which keys actually matched `auth.roles` (`user.effectiveRoles`), and the resulting permissions.
