---
title: Auth Options - SSO, OIDC, SAML
description: 
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

If you are looking to add an authentication layer for our Kubeshark users, please consider our available options.

<br/>

## Installing with OIDC enabled (Dex IdP)

Choose this option, if **you already have a running instance** of Dex IdP in your cluster &
you want to set up OIDC authentication (using Dex IdP) for Kubeshark users.

Kubeshark supports authentication using [**Dex - A Federated OpenID Connect Provider**](https://dexidp.io/).
Dex is an abstraction layer designed for integrating a wide variety of Identity Providers.

**Requirement:**
Your Dex IdP must have a publicly accessible URL.

### Pre-requisites

**1. If you configured [**Ingress**](/en/ingress) for Kubeshark:**

OAuth2 callback URL is: <br/>
`https://<kubeshark-ingress-hostname>/api/oauth2/callback`

**2. If you did not configure Ingress for Kubeshark:**

OAuth2 callback URL is: <br/>
`http://0.0.0.0:8899/api/oauth2/callback`

Use chosen OAuth2 callback URL to replace `<your-kubeshark-host>` in Step 3.

**3. Add this static client to your Dex IdP instance configuration (`config.yaml`):**
```yaml
staticClients:
   - id: kubeshark
     secret: create your own client password
     name: Kubeshark
     redirectURIs:
     - https://<your-kubeshark-host>/api/oauth2/callback
```

### Configuration (helm values)

Add these helm values to set up OIDC authentication powered by your Dex IdP:

```yaml
# values.yaml

tap: 
  auth:
    enabled: true
    type: dex
    dexOidc:
      issuer: <put Dex IdP issuer URL here>
      clientId: kubeshark
      clientSecret: create your own client password
      refreshTokenLifetime: "3960h" # 165 days
      oauth2StateParamExpiry: "10m"
```

Once you run `helm install kubeshark kubeshark/kubeshark -f ./values.yaml`, Kubeshark will be installed with (Dex) OIDC authentication enabled.

### Try your OIDC-configured Kubeshark

1. Open your Kubeshark dashboard <br/>(available by accessing your [**Ingress**](/en/ingress) host or `http://0.0.0.0:8899`)
2. You will be directed to a Dex IdP login page.

**Note**:
The number of available login options depends on a Dex IdP instance configuration.

Example of a Dex IdP login page:

![Dex IdP - Login Page](/oidc-dex-login-page.png)

2. Choose a login option & click on it. Your upstream IdP (Google / Microsoft / etc.) will guide you through the authentication process.

3. Once you finish auth process in the chosen upstream IdP - you will be directed to this page to grant Kubeshark access to your user information:

![Dex IdP - Grant Access](/oidc-dex-grant-access.png)

4. You are logged in! You should see your email displayed in the top-right corner of Kubeshark dashboard:

![Dex IdP - Grant Access](/oidc-dex-successful-login.png)

5. You are authorized! Feel free to use Kubeshark just as usual.

---

<br/>

## Installing with SAML enabled

SAML integration provides the following benefits:
1. Authentication using corporate identities
2. Role-based traffic visibility authorization
3. Role-based feature accessibility

### SAML Configuration Clause

```yaml
auth:
    enabled: false
    type: saml
    saml:
      idpMetadataUrl: ""
      x509crt: ""
      x509key: ""
      roleAttribute: role   # See: IDP Authorization Configuration
      roles:
        admin:
          filter: ""
          canReplayTraffic: true
          canDownloadPCAP: true
          canUseScripting: true
          canUpdateTargetedPods: true
```

### X.509 Certificate & Key
**How to:**

```yaml
openssl genrsa -out mykey.key 2048
openssl req -new -key mykey.key -out mycsr.csr
openssl x509 -signkey mykey.key -in mycsr.csr -req -days 365 -out mycert.crt
```

**What You Get:**
- `mycert.crt` - Use this for `AUTH_SAML_X509_CRT`
- `mykey.key` - Use this for `AUTH_SAML_X509_KEY`


### IDP Authorization Configuration

The `roleAttribute` should match the name of the `key` set in the App Metadata (app_metadata) section of the IDP. It can be `role`, `roles`, or any other word. The content can be a single text value or an array of text values (to indicate multiple roles apply to the user).

For example, in [Auth0](https://auth0.com/), it looks like this:

![IDP App Metadata](/app_metadata.png)

Each `role` is assigned a set of rules that govern the users feature accessibility and traffic visibility.

### Filter Authorization Rules

Each `role` is assigned a KFL-based (filter) authorization rule. This rule allows any traffic seen by a specific user to be filtered and limited.

For example, a filter like this:

```yaml
src.namespace=="ks-load" or dst.namespace=="ks-load"
```
This filter will limit the viewer to seeing incoming and outgoing traffic to a specific namespace named: `ks-load`.

Users can be assigned multiple `roles` and be authorized to view the sum of what is authorized by all rules.


### Feature Authorization Rules

These rules also dictate what features users can use. For example, replaying traffic, downloading PCAPs, changing pod targeting rules, using scripts.

### Example

Assume this configuration clause:


```yaml
 auth:
    enabled: true
    type: saml
    saml:
      idpMetadataUrl: https://dev-....us.auth0.com/samlp/metadata/9K...pO
      x509crt: |
        -----BEGIN CERTIFICATE-----
        MIIDgzCCAmsCFDtG4VpACGCxV9cAsa6Z+9dA3suWMA0GCSqGSIb3DQEBCwUAMH4x
        CzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRIwEAYDVQQHDAlQYWxv
        ...
        0tPlMoliIEacOfzyfNW/PZ/rQ36nXC5awg/ByrfkzazikZr0lv2Wnqb2K5Lns2nv
        uR7kK02ruXgW5qfuGPBHZy5Lu+vVM++XV7kOLjWf4Bfp/Y01wYfq
        -----END CERTIFICATE-----
      x509key: |
        -----BEGIN PRIVATE KEY-----
        MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCW6rSxwgOW5ZvY
        ...
        jUxLqUsvrErsjl+VpUfHCloPeYpn7zC+0V/Kyk20IjckPArAfeUaqWnjLtfj7QfR
        b6N0fptN0RJjxQIv67RVPxI=
        -----END PRIVATE KEY-----  
      roleAttribute: users-roles    
      roles:
        developers:
          filter: src.namespace=="ks-load" or dst.namespace=="ks-load"
          canReplayTraffic: false
          canDownloadPCAP: false
          canUseScripting: false
          canUpdateTargetedPods: false
        devops:
          filter: src.namespace=="default" or dst.namespace=="default"
          canReplayTraffic: true
          canDownloadPCAP: true
          canUseScripting: true
          canUpdateTargetedPods: false
        admins:
          filter: ""
          canReplayTraffic: true
          canDownloadPCAP: true
          canUseScripting: true
          canUpdateTargetedPods: true
```

Assume a user has the following `app_metadata` in the IDP:

```yaml
{
    users-roles: [ 
        "devops", 
        "developer" 
    ] 
} 
```

The user will see all traffic in both the `ks-load` and `default` namespaces. In terms of features, they can do anything except change Pod Targeting rules. Only users with the `admins` permission can use the Pod Targeting dialog box.
