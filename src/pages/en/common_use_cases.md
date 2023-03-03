---
title: Common Use Case
description: 
layout: ../../layouts/MainLayout.astro
mascot: Cute
---
**Kubeshark** delivers new K8s related capabilities that until recently were hard to come by. This page includes a short list of most common use-cases.

## Traffic Investigation & Debugging

## Cloud Forensics

## Alerts

## Telemetry

### Logs

### Metrics

#### HTTP Golden Signals metrics

Three key metrics for understanding the health of HTTP (i.e., API layer) connectivity, often referred to as “HTTP Golden Signals,” are: 
- HTTP Request Rate
- HTTP Request Latency
- HTTP Request Response Codes / Errors
Kubeshark is capable of extracting this data without any changes to the application, and aggregates the corresponding metrics not based on IPs (which are meaningless in a Kubernetes environment) but with long-term, meaningful service identity.   

If an application team is experiencing a fault in their application connectivity, these HTTP Golden Signals can clearly highlight whether the root cause is at the API layer (i.e., something the application team needs to deal with themselves) or at a lower layer in the network stack (i.e., something where they need to get the infrastructure team involved). 

**Reducing “signal-vs.-noise problem”**
All metrics are tagged with meaningful service identity that makes it easy for either the platform or application team to use Grafana filtering to ignore the vast amounts of observability information related to other apps and quickly zero in on only the services tagged with their team name, or even a specific service, without having to understand where that containers for this service are or were running.
For example, the Grafana dashboard below shows the error codes for all inbound connections to a specific “core-api” application service in the “tenant-jobs” namespace. We can easily see that it is only being accessed by one other service, “resumes,” and that while connectivity was initially healthy, around 11:55 service connectivity began to experience a partial API-layer issue as indicated by the increase in HTTP 500 error codes. This is a clear indicator of an API-layer issue that must be resolved by the application team operating the specific “core-api” and “resumes” services.  

## Observability

### Identity-aware Service Map

## Visibility

### Protocol-level

### At the Node Level