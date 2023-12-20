---
title: Half & Erroneous Connection Analysis
description: Recordings Management
layout: ../../layouts/MainLayout.astro
mascot: Hello
---
Kubeshark effectively displays both successful and erroneous communications.

## Successfully Paired Request-Response Pairs

Successfully paired request-response pairs are indicative of API transactions where valid requests and responses are both present.

![Successful API Transaction](/successful.png)

## Half Connections & Protocol Parser Errors

Half connections are indicative of incomplete transactions where either a request or a response is missing.

![Half Connections](/half_connections.png)

Kubeshark also identifies and reports errors from the protocol parser, which may be related to protocol issues, such as an unexpected EOF.

## ICMP & TCP Errors

Kubeshark provides insights into errors at lower protocol levels, such as TCP and ICMP, and displays these errors when detected.

![ICMP errors](/icmp.png)

![TCP errors](/tcp.png)

## Error Filter

Utilize KFL to selectively display or filter out various errors. For instance:

```yaml
!error      # Filters out any half-connections
!icmp       # Filters out any ICMP entries
!tcp        # Filters out any TCP level errors
```