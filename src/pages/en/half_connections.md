---
title: Half & Erroneous Connection Analysis
description: Recordings Management
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark effectively displays full, half, and erroneous connections.

## Full Connections

Full connections entail successfully paired request-response pairs. These are indicative of API transactions where valid requests and responses are both present.

![Successful API Transaction](/successful.png)

## Half Connections

Half connections represent incomplete transactions where either a request or a response is missing.

![Half Connection Example](/half_connections.png)

Kubeshark endeavors to identify the reason for these incomplete transactions.

## Protocol Parser & Connection Errors

Kubeshark identifies and reports errors from the protocol parser, which may be related to issues such as unexpected EOFs.

It provides further insight into errors at lower protocol levels, like TCP and ICMP, displaying these errors when detected.

![ICMP Errors](/icmp.png)

![TCP Errors](/tcp.png)

## Error Filter

Utilize the Kubeshark Filter Language (KFL) to selectively display or filter out various errors. For example:

```yaml
!error      # Filters out any half-connections
!icmp       # Filters out any ICMP entries
!tcp        # Filters out any TCP level errors
```

## Tip: Error Dashboard
Enter the following KFL in the KFL box:
`response.status > 400 or error or icmp or tcp`, apply, copy and enter to favorite.
The link should look like this:
```yaml
http://<kubeshark-domain>:<port>/?q=response.status%20%3E%20400%20or%20error%20or%20icmp%20or%20tcp
```
It will look even better on a 60" screen.