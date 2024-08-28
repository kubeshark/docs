---
title: Troubleshooting
description: Troubleshooting the problems that you face while using Kubeshark.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** installation aims to be straightforward, but due to the diverse range of Kubernetes (K8s) versions and configurations, some troubleshooting may be required.

## I Don't See the Traffic I'm Looking For

Use the [`tcp` dissector](/en/pod_to_pod_connections#enabling-and-disabling) to see all TCP traffic. If the traffic isn't visible, **Kubeshark** isn't capturing it for some reason (e.g., capture filters).

## I Don't See HTTP/2 Traffic

HTTP/2 sometimes runs on long-lived connections. **Kubeshark** must start processing the traffic before the long-lived connection is established. It cannot process an existing long-lived connection. This can happen if you start Kubeshark after the long-lived connection has already been established.

To see the raw TCP and possibly the HTTP/2 packets, use the [`tcp` dissector](/en/pod_to_pod_connections#enabling-and-disabling).

## I Don't See HTTPS/TLS Traffic

If you're not seeing the SSL/TLS traffic you expect, there could be two issues:

1. The TLS connection started before the Workers started. **Kubeshark** cannot tap into an ongoing TLS connection; it needs to process the handshake to show (un)encrypted traffic in clear text.
2. The SSL library or method isn't supported. There are numerous SSL/TLS libraries and methods used to encrypt and decrypt traffic. **Kubeshark** uses eBPF with specific method implementations to support the most common ones. You can read more about how **Kubeshark** processes TLS traffic in the [TLS/HTTPS (eBPF)](/en/encrypted_traffic) section.

Even if, for any reason, **Kubeshark** cannot display the (un)encrypted traffic in clear text, you can still view the encrypted traffic within the Kubernetes context. To see the raw TCP and encrypted traffic, use the [`tcp` dissector](/en/pod_to_pod_connections#enabling-and-disabling).

## Workers or Hub Get OOMKilled

Frequent OOMKilled errors indicate that the cluster is overburdened relative to the resources allocated to **Kubeshark**. By default, **Kubeshark** imposes resource limitations suitable for small dev/test clusters. We recommend either utilizing [capture filters](/en/pod_targeting0) or [increasing resource limitations](/en/performance#resource-limitations), or preferably both. Consult our [performance page](/en/performance) for guidance on optimizing resource consumption.

## Worker Pods Get Evicted

On busy clusters, the Worker pods can quickly consume the default 500MB storage limit, leading to pod eviction and restarts. This issue can be exacerbated if you're recording traffic, as more files are stored for longer retention periods.

If storage exceeds its limit, the pod is evicted. The storage limit is controlled by setting the `tap.storageLimit` configuration value. To increase this limit, provide a different value (e.g., setting it to 5GB with `--set tap.storagelimit=50Gi`).

Another aternative is to not store PCAP files, by setting the `pcapTTL` and `pcapErrorTTL` to zero. This can also be useful if the PCAP files are of no interest.

```yaml
--set tap.storageLimit=50Gi
--set tap.misc.pcapTTL=0
--set tap.misc.pcapErrorTTL=0
```

## I Don't See Traffic in the Dashboard, and the Counters are Zero

![Counters stuck at zero](/zero-counters.png)

If everything seems to be working but the dashboard is empty and the bottom counters are stuck at zero, it could mean one of the following:

1. No connection between the Hub and the Workers
2. The Workers are in a crash loop
3. The ports the Workers are listening on are occupied (this is the most common issue)

If the Workers appear to be functioning and are not in a crash loop, it is likely an issue with occupied ports. The Hub's logs should indicate the problem.

![Workers aren't connecting](/workers-not-connecting.png)

This can be resolved by changing the Worker port:

```yaml
tap:
  proxy:
    worker:
      srvPort: 30001
    hub:
      srvPort: 8898
    front:
      port: 8899
    host: 127.0.0.1
```

## Port-Forward is Failing

When deploying **Kubeshark** using the CLI, the port-forward can fail. Such failures should be apparent in the console logs:

![Port-forward is failing](/port-forward-failing.png)

This can be fixed by using the port-forward command manually:

```shell
kubectl port-forward svc/kubeshark-front 8899:80
```

## High Volume of **Kubeshark**-Related Audit Log Events

Some users have reported a surge in audit log events following **Kubeshark** installation, as discussed in [issue #1500](https://github.com/kubeshark/kubeshark/issues/1500). Although this behavior was not replicated in our test environments, it is crucial to address if experienced. Reducing **Kubeshark**-related audit log volumes can be achieved by disabling auditing for specific events as shown below:

```yaml
  - level: None
    userGroups: ["system:serviceaccounts"]
    users: ["system:serviceaccount:default:kubeshark-service-account"]
```

## OpenShift

There have been instances where **Kubeshark** did not operate seamlessly on OpenShift. While ensuring optimal performance on OpenShift is a goal, it remains a work in progress.

## Well, That Didn't Work

If the provided solutions do not resolve your issue, other resources are available to assist you promptly:

- [Report a bug](https://github.com/kubeshark/kubeshark/issues) by creating a GitHub ticket.
- [Join our Slack channel](https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA) for community support. We strive to be responsive and helpful.
- [Contact the project team directly](https://kubeshark.co/contact-us) for dedicated and timely assistance.