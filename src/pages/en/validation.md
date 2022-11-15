---
title: Validation
description: Validation
layout: ../../layouts/MainLayout.astro
---

Kubeshark has a traffic validation feature that can be used in conjunction with the network sniffer functionality.
While the traffic is captured, requests are checked against the rules listed in the `enforce-policy.yaml`
file and errors are listed in the **Filter** tab of the Kubeshark UI.

Use `--traffic-validation-file` option to specify a policy for your deployment:


```shell
kubeshark tap {pod name} --traffic-validation-file enforce-policy.yaml
```

## Enforce-Policy

The `enforce-policy.yaml` file establishes a set of rules for Kubeshark to validate.
For example, this `holy-in-name-property` rule checks that if there is a JSON with a name, its value should be "Holy".


```yaml
rules:
    - name: holy-in-name-property
      type: json
      key: "$.name"
      value: "Holy"
```

Rules can also check response time on specific services. This rule checks that responses from the `catalogue`
service are 10 milliseconds or less.

```yaml
rules:
    - name: Catalogue-Latency-SLO
      type: latency
      path: /catalogue
      latency: 10
      service: "catalogue.*"
```

Rules can use regular expressions to check content length or characters.

```yaml
- name: content-length-header
  type: header
  key: "Content-Le.*"
  value: "(\\d+(?:\\.\\d+)?)"
```

### Testing Rules

If we deploy to pods in the [WeaveSocks Microservices Demo](https://microservices-demo.github.io/) with `enforce-policy.yaml`,
we will see some of the traffic validation features in action.

First, let's deliberately misspell the value in our `holy-in-name-property` rule in the `enforce-policy.yaml` file:

```yaml
rules:
    - name: holy-in-name-property
      type: json
      key: "$.name"
      value: "Holy1234"
```

Then, capture the traffic of the front-end pods of the sock shop with traffic validation:

```shell
kubeshark tap "(catalo*|front-end*)" -n sock-shop --traffic-validation-file enforce-policy.yaml
```

In the Kubeshark UI at [https://localhost:8899](https://localhost:8899),
we will see that the requests and responses worked with a `200 OK`,
but if we check the Filters tab, we will see errors in the `holy-in-name-property` rule,
because the JSON name in the request didn't match the value `Holy1234`.

### Testing Response Time

We can do a similar test with response time. If we change the `latency` value to `2` in `enforce-policy.yaml`,
Kubeshark traffic validation will display an error if responses from the `catalogue` service are not 2 ms or less.

```yaml
rules:
    - name: Catalogue-Latency-SLO
      type: latency
      path: /catalogue
      latency: 2
      service: "catalogue.*"
```

In the **Rules** tab in the Kubeshark UI, we will see errors in the `Catalogue-Latency-SLO` rule,
because the catalogue service latency was 2 ms, and the value must be less than 2.

## Conclusion

When a pod is targetted with `--traffic-validation-file`, all requests and
responses are checked against the rules listed in the `enforce-policy.yaml` file,
and errors are listed in the **Rules** tab of the Kubeshark UI.
Engineers can customize their `enforce-policy.yaml` file,
enabling faster troubleshooting in tumultuous microservices environments.

## YAML

The corresponding YAML is attached for your convenience. Try it out!

```yaml
rules:
    - name: Catalogue-Latency-SLO #catalogue's service "/catalogue" response time < 300
      type: latency
      path: /catalogue
      latency: 300
      service: "catalogue.*"

    - name: FECatalogue-Latency-SLO #front-end's service "/catalogue" response time < 600m
      type: latency
      path: /catalogue
      latency: 600
      service: "front-end.*"

    - name: General-SLO #all APIs should respond within 1000ms
      type: latency
      path: /*
      service: ".*"
      latency: 1000

    - name: holy-in-name-property #JSON scheme validation: If there is a Name it should be Holy
      type: json
      key: "$.name"
      value: "Holy"

    - name: price-is-numeric #JSON scheme validation: Price type is a Float
      type: json
      key: "$.price"
      value: "(\\d+(?:\\.\\d+)?)"

    - name: content-length-header #Header Validation: Content-length is valid
      type: header
      key: "Content-Le.*"
      value: "(\\d+(?:\\.\\d+)?)"
```
