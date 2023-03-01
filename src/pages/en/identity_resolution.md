---
title: Identity Resolution Log
description: Kubeshark keeps a log of all identity/IP resolution over time.
layout: ../../layouts/MainLayout.astro
mascot:
---
K8s identities (e.g. services) are assigned IPs by K8s network logic, resulting in identities being assigned different IPs over time. 

Identity/IP resolution is critical to understand anything that goes on inside K8s. Kubeshark maintains an IP - Identity resolution log and makes it available for various purposes. 

![Identity-resolution file](/name-resolution.png)

The JSON file includes an entry per timestamp with the various identity/IP assignment.

## Available as part of any PCAP export

When the manual PCAP export function is invoked, the file is added automatically into the PCAP container that is downloaded.
