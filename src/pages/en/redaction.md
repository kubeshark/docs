---
title: Sensitive Data Redaction
description:
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Sensitive data can be redacted to maintain privacy and security.

Utilize the `tap.globalFilter` to implement redaction patterns, ensuring sensitive information is redacted prior to appearing on the dashboard.

Example configuration:
```yaml
tap:
  globalFilter: redact("..Authorization", "..['Proxy-Authorization']", "..Cookie", "..['Set-Cookie']", "..['X-CSRF-Token']", "..['X-XSRF-Token']", "..['X-Goog-Authenticated-User-Email']", "..['X-Aws-Ec2-Metadata-Token']") 
```

## TL;DR

### Redact Helper

The `redact` helper automates data redaction by searching for specified patterns in data traffic and replacing them with `[REDACTED]`.

This function alters records by accepting one or more string arguments representing dot-notation paths. Each identified path's value is replaced with `[REDACTED]`. The `json()` and `xml()` helpers are compatible within the `redact` helper's arguments.

For instance, applying `redact("..Authorization")` would display the following in the dashboard:
![Redaction](/redaction.png)

Further information is available in the [KFL Helpers](/en/filtering#helpers) section.

### globalFilter Configuration

Filters specified in `globalFilter` are applied at the source (Worker level), ensuring data deemed sensitive does not reach the dashboard.

|Pattern Example|Description|
|---------------|-----------|
| ..Authorization | Matches any field named Authorization, e.g., `request.headers['Authorization']`|
| ..['Proxy-Authorization'] | Syntax with [' '] accommodates names containing dashes (-)|
| response.content.text.json()..apiKey | Matches any field named `apiKey` at any level in the JSON response body|