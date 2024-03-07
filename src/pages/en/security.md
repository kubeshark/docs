---

title: Security & Compliance
description: The document details Kubeshark Enterprise Edition's security measures, emphasizing its self-hosted, on-premises design that prevents data exposure. It covers container security, code transparency, sensitive data redaction, traffic segmentation, and viewer authorization. Authentication is managed via SAML, with options for encrypted dashboard access. Kubeshark aims for ISO 27001 and SOC2 certifications, underscoring its commitment to high security and compliance standards.
layout: ../../layouts/MainLayout.astro
---

All security and compliance-related topics listed in this document pertain to Kubeshark Enterprise Edition.

## Terms Used in This Document

- **Vendor** - KubeHQ (developer of Kubeshark) and its employees.
- **Customer** - The company and the employees that use Kubeshark on the company's premises.
- **Viewer** - An employee of the Customer using Kubeshark to inspect traffic.
- **Admin** - An employee of the Customer responsible for deploying, running, and maintaining Kubeshark within the Customer's premises.
- **Data** - Data appearing in traffic that is processed by Kubeshark.
- **Sensitive Data** - Data that can be perceived as sensitive and appear from time to time as part of Data.

## No Data Leaves the Premises

**Kubeshark** is self-hosted and operates 100% on-premises. Designed to run in air-gapped environments, it does not require any internet connection, and absolutely no Data leaves the premises. As such, the Vendor is not exposed to the Data in any way.

## Local Container Registry

All containers comprising **Kubeshark** are stored in a local container repository and can be scanned for vulnerabilities based on the organization's security policies. The containers can be downloaded or built locally if necessary.

## Code Transparency

Customers requesting access to **Kubeshark**'s codebase are added to the **Kubeshark** GitHub organization and gain complete access to the entire codebase, including the above-mentioned containers.

## Sensitive Data Redaction

Sensitive Data can be redacted at the source, making it unavailable to Viewers.

> Learn more about sensitive data redaction [here](/en/redaction).

## Traffic Segmentation

**Kubeshark** can be configured to process Data from specific namespaces and pods using pod targeting rules. Only traffic from allowed namespaces and pods is processed. Kubeshark ignores traffic not matching the pod targeting rules.

> Learn more about Pod Targeting [here](/en/pod_targeting).

## Viewer / Data Authorization

Viewer access can be restricted using specific authorization rules, enabling users to view only the Data they are permitted to see. For instance, developers can have access to certain namespaces, while DevOps may access different ones.

## Authentication

To prevent unauthorized access, **Kubeshark** employs SAML to authenticate users using their corporate identities.

> Learn about SAML capabilities [here](/en/saml).

## Dashboard Encryption

The dashboard can be made available using Ingress with TLS encryption if necessary.

## ISO 27001 & SOC2

Kubeshark is in the process of attaining both ISO 27001 and SOC2 certifications.