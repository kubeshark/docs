---
title: Redaction
description: Redaction
layout: ../../layouts/MainLayout.astro
---

The traffic captured by Kubeshark could contain sensitive information.
Users can configure Kubeshark to hide certain keywords or pieces of data will appear as [REDACTED] in the UI.

Kubeshark comes with out-of-the-box default values to be redacted

## Default Redacted Data

Here is the list of keys Kubeshark will automatically redact by default:

```
"token", "authorization", "authentication", "cookie", "userid", "password", "username",
"user", "key", "passcode", "pass", "auth", "authtoken", "jwt", "bearer", "clientid",
"clientsecret", "redirecturi", "phonenumber", "zip", "zipcode", "address", "country",
"firstname", "lastname", "middlename", "fname", "lname", "birthdate"
```

These fields will be redacted from:

1. URL path
2. Request body
3. Request headers
4. Response body
5. Response headers

> **Note:** This is true for all Kubeshark supported protocols - gRPC, Kafka, RabbitMQ, ActiveMQ, Redis

## Redact sensitive data using regular expressions

You can filter free text from the body of messages with `content-type=text/plain` with `-r`

```shell
kubeshark tap ".*" -r <regex>
```

Use multiple `-r` to simultaneously filter multiple patterns:

```shell
kubeshark tap catalo -r "redact this pattern" -r "and also this (.*) pattern"
```

## Configure your Kubeshark Config File

### Changing the default list of keywords

To remove or add keywords to the default list of redacted keywords,
change the file and build the Kubeshark CLI with the altered file.

The variable `personallyIdentifiableDataFields` is defined
in [this file](https://github.com/kubeshark/kubeshark/blob/main/tap/extensions/http/sensitive_data_cleaner.go)
which contains the default list of keywords.
