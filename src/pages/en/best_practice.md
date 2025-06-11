---
title: Best Practices
description: This guide outlines best practices for integrating and operating **Kubeshark** across various use cases, including incident management and developer observability. It emphasizes proactive deployment, resource tuning, and the importance of contextual workload testing.
layout: ../../layouts/MainLayout.astro
---

Best practices should align with operational requirements and intended use cases, including:

* Incident Management
* Developer Observability

## Incident Management

**Kubeshark** enhances incident response by providing deep network visibility, enabling faster root cause analysis, and reducing Mean Time to Recovery (MTTR). As part of a comprehensive business continuity strategy, **Kubeshark** should be treated as critical infrastructure—on par with backup systems, disaster recovery solutions, and observability stacks.

Proper integration of **Kubeshark** requires proactive configuration and validation tailored to your cluster’s specific workloads, activity levels, and resource constraints. Simply holding a license without maintaining operational readiness is insufficient. Avoid installing **Kubeshark** reactively after an anomaly or failure has occurred.

It’s important to test **Kubeshark** against workloads that are familiar and under your control, rather than relying on third-party or generic workloads that may lack sufficient context.

We recommend the following practices based on your intended usage:

### Steady-State Operations – Maintain Continuous Readiness

1. **Always Running**: Deploy **Kubeshark** in a [dormant](/en/on_off_switch) state. In this mode, it consumes minimal resources and remains ready for activation.
2. **Monthly Validation**: At least once per month, activate **Kubeshark** in a controlled namespace using known workloads. Validate that visibility and insights are accurate and aligned with expectations.
3. **Report Issues Promptly**: Report any component failures or anomalies to the support team immediately. Timely support response is guaranteed.

> We strongly recommend integrating **Kubeshark** into your organization’s disaster recovery, business continuity, and incident management compliance policies.

### Incident Response

1. **Scope Targeting**: Do not activate **Kubeshark** cluster-wide. Use [capture filters](/en/pod_targeting) to target specific workloads and minimize system impact.
2. **Prioritize Owned Workloads**: Start with workloads your team owns, where you have context and accountability.
3. **Activate**: Exit [dormant](/en/on_off_switch) mode to dynamically capture and analyze traffic. Be aware that CPU and memory usage scales with the volume and activity of targeted workloads. Apply [capture filters](/en/pod_targeting) to reduce consumption and noise.

## Developer Observability

**Kubeshark** provides comprehensive workload visibility by exposing all internal and external communications within the cluster. While on-demand use (e.g., `kubeshark tap`) is possible, we recommend integrating **Kubeshark** into all clusters from the start—including staging and local development clusters such as KinD and Minikube.

**Kubeshark** improves developer observability by mapping real-time service interactions within Kubernetes environments. It uncovers network flows and service dependencies critical for debugging and optimizing performance in distributed systems.

Use the [on/off switch](/en/on_off_switch) to conserve resources during idle periods.

In development clusters, **Kubeshark** typically requires minimal resources—especially when scoped to team-owned workloads.

> We've learned that dev/test clusters are often over-allocated, which may cause issues when running **Kubeshark**

## General Best Practices

* **Test New Releases Before Deployment to Production**: New releases may introduce bugs or behavior changes. Always deploy and test new versions in development or test clusters before promoting them to production.

* **Ensure Proper Operation**: In both production and dev/test environments, verify that no components are being OOMKilled and that CPU usage stays below 80% of the configured limit. Regularly check logs for recurring errors.

* **Set Reasonable CPU and Memory Limits**: The default configuration may lack limits or apply excessively high ones. Since each cluster is different, start by running **Kubeshark** without limits, then adjust based on observed usage. Use [capture filters](/en/pod_targeting) to manage resource consumption effectively.

### For Air-Gapped Environments

Make sure to disable internet connectivity:

```yaml
internetConnectivity: false
```

