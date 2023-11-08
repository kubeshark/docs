---
title: Pro vs. Enterprise vs. Community
description: The difference between Pro Edition and Community Edition
layout: ../../layouts/MainLayout.astro
---

We recognize that the demands of a startup differ from those of an enterprise, and that the requirements for a dev & test cluster are not the same as those for a production cluster.

To accommodate these varied needs, **Kubeshark** is available in three editions, each designed to support multiple use-cases and types of companies.

## Community

The Community Edition is free of charge and an excellent choice for getting started and deriving immediate value. While it supports all basic features, it lacks more advanced capabilities, such as customization and enterprise-level features, and is primarily tailored for smaller, low-throughput clusters.

The Community Edition is available for on-demand use without the need for a license.

> To get started with the Community Edition, simply [install](/en/install) Kubeshark

## Pro

The Pro Edition is designed for low-throughput clusters, offering all the basic features of the Community Edition with no limitation on the number of nodes.

> Upgrade to the Pro Edition by running `kubeshark pro` in the terminal, or by signing up on the [Admin Console](https://console.kubeshark.co) to get your Pro license

## Enterprise

The Enterprise Edition of **Kubeshark** is specifically designed for larger organizations and environments, with multiple either manged or self-manged clusters. It includes features that are suited to these more demanding environments, such as:
- High-speed/high-throughput capabilities
- Compatibility with air-gapped environments
- SAML/SSO integration
- Enhanced TLS interception support

Users of the Enterprise Edition also benefit from dedicated support, ensuring prompt responses via Slack, on-demand Zoom calls, premium onboarding, and a guarantee of smooth operations across all clusters.

### SAML/SSO/Authorization

In the Enterprise Edition, developers are granted access to Kubeshark without the need for `kubectl` privileges, authenticating instead through their corporate Identity Provider (IDP). Authorization is determined by their affiliation with certain groups or organizations. Users within these specific groups or organizations are authorized to view network traffic, with visibility controlled by namespaces and pod regex rules that correspond to their respective group or organizational roles.

### Air-gapped Support

The Enterprise Edition enables users to utilize the full set of features without needing to disable them due to the lack of Internet connectivity. This includes storing Docker images, scripts, and kernel modules locally.

### TLS Interception

A key advanced feature is the enhanced TLS interception capability. Interception of TLS traffic using eBPF can be challenging because of the diverse languages, library versions, and variations encountered. Since there is no universal solution, custom configurations may be required.

### Dedicated Support

With dedicated support, Enterprise Edition users receive prompt responses via Slack, access to on-demand Zoom calls, premium onboarding experiences, and a commitment to ensuring smooth operations across all clusters.

### High-speed Networks

The Enterprise Edition offers high-speed packet capture and processing capabilities, significantly reducing the overhead associated with traditional packet handling in the kernel.


> [Contact us](https://kubeshark.co/contact-us) to learn more about the Enterprise Edition
