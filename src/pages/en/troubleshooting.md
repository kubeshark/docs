---
title: Troubleshooting
description: Troubleshooting the problems that you face while using Kubeshark.
layout: ../../layouts/MainLayout.astro
---
**Kubeshark** installation aims to be straightforward, yet due to the diverse range of Kubernetes (K8s) versions and configurations, some troubleshooting may be required to get started.

## Versions Incompatibility

### CLI

Most issues encountered with the CLI can often be resolved by reinstalling it. This can be done using the script provided below or through other methods detailed on the [installation page](/en/install):

```shell
sh <(curl -Ls https://kubeshark.co/install)
```

### Helm

To update **Kubeshark**'s Helm repository, utilize the following commands:

```shell
helm uninstall **Kubeshark** -n **Kubeshark**
helm search repo **Kubeshark**
helm repo update
helm search repo **Kubeshark**
helm install **Kubeshark** **Kubeshark**/**Kubeshark** -n **Kubeshark** --create-namespace
```

## Workers OOMKilled

Frequent OOMKilled errors indicate that the cluster is overburdened relative to the resources allocated to **Kubeshark**. Consult our [performance page](/en/performance) for guidance on optimizing resource consumption.

### Use Debug Logs

Running **Kubeshark** in debug mode captures essential KPIs in the logs. Analyzing these logs, or better, sharing them with us, can often elucidate unexpected performance issues.

Enable debug logs with the following methods:
```shell
**Kubeshark** tap -d / --debug
--set tap.debug=true
```

To extract log files, execute:
```shell
**Kubeshark** logs
```

## Ports Range

**Kubeshark** defaults to using ports 30001, 8898, and 8899. Certain Kubernetes distributions, like K3s and Microk8s, restrict this port range, necessitating adjustments. Configuring different ports is straightforward:

If you haven't already configured **Kubeshark**, start with:
```shell
**Kubeshark** config -r
```
This command generates a configuration file at `~/.kubeshark/config.yaml`. Modify this file to adjust the port settings as follows:
```shell
    proxy:
        worker:
            srvport: 30000
        hub:
            port: 30001
            srvport: 30001
        front:
            port: 30002
            srvport: 30002
```
Ensure the new port numbers fall within the permissible range.

## High Volume of **Kubeshark**-Related Audit Log Events

Some users have reported a surge in audit log events following **Kubeshark** installation, as discussed in [issue #1500](https://github.com/kubeshark/kubeshark/issues/1500). Although this behavior was not replicated in our test environments, it's crucial to address if experienced. Reducing **Kubeshark**-related audit log volumes can be achieved by disabling auditing for specific events as shown below:

```yaml
  - level: None
    userGroups: ["system:serviceaccounts"]
    users: ["system:serviceaccount:default:kubeshark-service-account"]
```

## Openshift

There have been instances where **Kubeshark** did not operate seamlessly on Openshift. While ensuring optimal performance on Openshift is a goal, it remains a work in progress.

## Well, That Didn't Work

If the provided solutions do not resolve your issue, other resources are available to assist promptly:

- [Report a bug](https://github.com/kubeshark/kubeshark/issues) by creating a GitHub ticket.
- [Join our Slack channel](https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA) for community support. We strive to be responsive and helpful.
- [Contact the project team directly](https://kubeshark.co/contact-us) for dedicated and timely assistance.