---
title: OIDC with DEX
description: 
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Choose this option if **you already have a running instance** of [**Dex – A Federated OpenID Connect Provider**](https://dexidp.io/) (IdP) in your cluster **and** want to enable OIDC authentication using the Dex IdP.

## Prerequisites

Add the following static client configuration to your Dex IdP's `config.yaml`:

```yaml
staticClients:
  - id: kubeshark
    secret: <create your own client password>
    name: [Kubeshark](https://kubeshark.com)
    redirectURIs:
      - https://<your-kubeshark-host>/api/oauth2/callback
```

Replace `<your-kubeshark-host>` with **Kubeshark’s** URL.

### Kubeshark Configuration

Add the following Helm values to enable OIDC authentication using your Dex IdP:

```yaml
# values.yaml

tap: 
  auth:
    enabled: true
    type: dex
    dexOidc:
      issuer: <insert Dex IdP issuer URL here>
      clientId: kubeshark
      clientSecret: <your client password>
      refreshTokenLifetime: "3960h" # 165 days
      oauth2StateParamExpiry: "10m"
      bypassSslCaCheck: false
```

---

**Note:**<br/>
Set `tap.auth.dexOidc.bypassSslCaCheck: true` 
to allow [Kubeshark](https://kubeshark.com) communication with Dex IdP having an unknown SSL Certificate Authority.

This setting allows you to prevent such SSL CA-related errors:<br/>
`tls: failed to verify certificate: x509: certificate signed by unknown authority`

---

After configuring the values file, install [Kubeshark](https://kubeshark.com) with the following command:

```bash
helm install kubeshark kubeshark/kubeshark -f ./values.yaml
```

[Kubeshark](https://kubeshark.com) will now be installed with Dex-based OIDC authentication enabled.

### Try Your OIDC-Enabled Kubeshark

Once OIDC is enabled, you'll be redirected to the Dex IdP login page.

**Example: Dex IdP Login Page**

![Dex IdP - Login Page](/oidc-dex-login-page.png)

1. Choose a login option and click it. Your upstream IdP (Google, Microsoft, etc.) will guide you through the authentication process.
2. After successful authentication, you’ll be directed to a page where you can grant [Kubeshark](https://kubeshark.com) access to your user information:

   ![Dex IdP - Grant Access](/oidc-dex-grant-access.png)

3. You’re logged in! Your email should appear in the top-right corner of the [Kubeshark](https://kubeshark.com) dashboard:

   ![Dex IdP - Successful Login](/oidc-dex-successful-login.png)

4. You’re authorized! You can now use [Kubeshark](https://kubeshark.com) as usual.