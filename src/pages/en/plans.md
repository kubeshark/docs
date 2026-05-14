---
title: Community vs Pro vs Enterprise
description: Overview of the available Kubeshark editions—Community, Pro, and Enterprise.
layout: ../../layouts/MainLayout.astro
---

## Community (Free)

The Community edition is designed for small workloads:

- Up to **3 nodes** or **60 pods**
- Download a license key from the [License Portal](https://console.kubeshark.com) and set it as a Helm value
- Requires internet connectivity
- Community support

## Pro (Starting at $190/month)

The Pro edition offers volume-based pricing for any cluster size. Choose a tier based on your usage needs:

| Tier | Monthly Price | Daily API Capacity | Monthly Capacity |
|------|---------------|-------------------|------------------|
| Pro 190 | $190 | 100K API calls | ~3M API calls |
| Pro 380 | $380 | 500K API calls | ~15M API calls |
| Pro 760 | $760 | 2M API calls | ~60M API calls |

> The $760 tier provides 20x the capacity of the $190 tier at 4x the price.

**Key features:**
- **Unlimited** cluster size and pods on all tiers
- **Cluster-wide license** — download a license key from the [License Portal](https://console.kubeshark.com) and all users in the cluster can access Kubeshark without individual authentication
- Use across **any number of clusters**
- No cloud login required — license key based
- Requires active internet connectivity (telemetry must succeed)
- Community support

**On-demand capacity:** Additional capacity can be purchased at **$50 per 100K API calls** when you exceed your daily limit.

> API capacity is measured in dissected API calls that appear in the dashboard.

Subscribe to the Pro edition at the [License Portal](https://console.kubeshark.com/?tab=pro)

## Enterprise

The Enterprise edition includes the complete feature set:

- **Unlimited** cluster size and pods
- **Unlimited** consumption
- **Unlimited** users across organization
- **Air-gapped** cluster support (no internet required)
- AI-powered root cause analysis
- Dedicated support (Slack, Zoom, premium onboarding)

[Contact us](https://kubeshark.com/contact-us) to request a suitable license.

## Feature Comparison

| Feature | Community | Pro | Enterprise |
|---------|-----------|-----|------------|
| Real-time protocol visibility | Yes | Yes | Yes |
| TLS decryption | Yes | Yes | Yes |
| Traffic recording & offline analysis | Yes | Yes | Yes |
| License key download | Yes | Yes | Yes |
| Cloud login required | No | No | No |
| Internet required | Yes | Yes | No (air-gapped OK) |
| Multi-user access | Yes | Yes | Yes |
| Air-gapped support | No | No | Yes |
| AI root cause analysis | No | No | Yes |
| Dedicated support | No | No | Yes |