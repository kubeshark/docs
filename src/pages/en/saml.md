---
title: SSO, SAML, Authorization
description: 
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

SAML integration provides the following benefits:
1. Authentication using corporate identities
2. Role-based traffic visibility authorization
3. Role-based feature accessability

## SAML Configuration Clause

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

##### X.509 Certificate & Key
**How to:**

```yaml
openssl genrsa -out mykey.key 2048
openssl req -new -key mykey.key -out mycsr.csr
openssl x509 -signkey mykey.key -in mycsr.csr -req -days 365 -out mycert.crt
```

**What You Get:**
- `mycert.crt` - Use this for `AUTH_SAML_X509_CRT`
- `mykey.key` - Use this for `AUTH_SAML_X509_KEY`


## IDP Authorization Configuration

The `roleAttribute` should match the name of the `key` set in the App Metadata (app_metadata) section of the IDP. It can be `role`, `roles`, or any other word. The content can be a single text value or an array of text values (to indicate multiple roles apply to the user).

For example, in [Auth0](https://auth0.com/), it looks like this:

![IDP App Metadata](/app_metadata.png)

Each `role` is assigned a set of rules that govern the users feature accessability and traffic visibility.

## Filter Authorization Rules

Each `role` is assigned a KFL-based (filter) authorization rule. This rule allows any traffic seen by a specific user to be filtered and limited.

For example, a filter like this:

```yaml
src.namespace=="ks-load" or dst.namespace=="ks-load"
```
This filter will limit the viewer to seeing incoming and outgoing traffic to a specific namespace named: `ks-load`.

Users can be assigned multiple `roles` and be authorized to view the sum of what is authorized by all rules.


## Feature Authorization Rules

These rules also dictate what features users can use. For example, replaying traffic, downloading PCAPs, changing pod targeting rules, using scripts.

## Example

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
