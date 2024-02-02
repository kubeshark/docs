---
title: Secure Collaborative Incident Diagnosis
description: Empower developers to participate in the production incident diagnosis process by granting them a secure, front-row view of live API traffic. 
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Provide developers with secure and direct access to live API traffic, enabling them to engage in real-time diagnosis of production incidents. This access facilitates the replication of production issues in development and testing environments, thus streamlining the process.

This approach reduces the burden on DevOps teams to replicate evidence of bugs and instances of suboptimal performance.

## Secure 

Provide a secure gateway for users to access Kubeshark via their web browsers. This is authenticated through their corporate IDP, without requiring kubectl access. Authorization is managed to allow visibility of only those namespaces they are permitted to see, with sensitive data appropriately redacted.

## Traffic Investigation Developer Portal

Allow developers to troubleshoot issues in KUbernetes, via the web and without having to have `kubectl` access.

## SSO or Social Authentication

Authenticate users through with your corporate Identity Provider (IDP) using Security Assertion Markup Language (SAML).

## Namespace-based Authorization

Implement namespace-based authorization rules and sensitive data redaction to ensure users only access permissible content.

