---
title: Collaborative Incident Diagnosis
description: Empower developers to participate in the production incident diagnosis process by granting them a secure, front-row view of live API traffic. 
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Enhance DevOps productivity by providing a solution that alleviates the need for DevOps teams to generate bug reports or evidence of suboptimal performance.

Empower developers with the ability to actively participate in diagnosing production incidents by offering them secure, direct access to live API traffic.

Facilitate developers in replicating production issues within development and testing environments, thereby streamlining the debugging process for their APIs.

## Self-hosted

Enable web access to Kubeshark by facilitating its self-hosting through Ingress.

## SSO or Social Authentication

Authenticate users through social login platforms or integrate with your corporate Identity Provider (IDP) using either OpenID Connect (OIDC) or Security Assertion Markup Language (SAML).

## Namespace-based Authorization

Implement namespace-based authorization rules and sensitive data redaction to ensure users only access permissible content.

## Secure

Provide a secure gateway for users to access Kubeshark via their web browsers. This is authenticated through their corporate IDP, without requiring kubectl access. Authorization is managed to allow visibility of only those namespaces they are permitted to see, with sensitive data appropriately redacted.
