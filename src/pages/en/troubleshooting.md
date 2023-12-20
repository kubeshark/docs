---
title: Troubleshooting
description: Troubleshooting the problems that you face while using Kubeshark.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** installation should be pretty straight forward, however due to the many K8s versions and configurations, getting started can require some troubleshooting.

## Versions Incompatibility 

### CLI

When using the CLI, most problems can be resolved by simply re-installing the CLI using the following script or by any other means listed in the [installation page](/en/install):

```shell
sh <(curl -Ls https://kubeshark.co/install)
```

### Helm

Use the following commands to update KUbeshark's Helm repo:

```shell
helm uninstall kubeshark -n kubeshark
helm search repo kubeshark
helm repo update
helm search repo kubeshark
helm install kubeshark kubeshark/kubeshark -n kubeshark --create-namespace
```

## Config File Incompatibility

It is highly recommended to upgrade the config file, if used, every time you upgrade the CLI. The following command will upgrade the config file and merge any existing properties into the new config file structure:

```shell
kubeshark config -r
```

## Workers OOMKilled

Getting frequent OOMKilled is frustrating!

At this time we don't have memory and CPU guardrails, causing Workers (and sometime the Hub) to get OOMKilled due to inefficient use of resources and or high traffic load. 

While this section will provide a few remedies, know that we are committed to helping you get started even at high loads. If you're unable to find the proper configuration that enables smooth running, contact us and we'll get you there fast!

Workers' performance is a function of the **traffic throughput**, **memory** and **CPU**. If you get this triangle right, in all likelihood everything will function well.

If you see memory **or CPU** levels reach maximum capacity, consider allocating more resources. If you can't, consider reducing the traffic throughput by using the Pods filter.

**CLI Pods Filter**:

```shell
kubeshark tap "(pod1.*|pod2.*)"
```

**Config File Pod Filter**:

```shell
tap:
    regex: "(pod1.*|pod2.*)"
```

**Helm Value**:

```shell
--set tap.regex="(pod1.*|pod2.*)"
```

### Use Debug Logs 

When run in debug mode, Kubeshark will store all relevant KPIs in the logs. Viewing this log information or better yet, send it to us, will likely show the reason for any weird performance behavior.

Various ways to enable logs:
```shell
kubeshark tap -d / --debug
--set tap.debug=true
```

To dump the log files, run:
```shell
kubeshark logs
```

## Ports Range

**Kubeshark**'s default config uses ports 30001,8898 and 8899. Some K8s distributions like K3s and Microk8s do not allow this port range and require changing these ports. Luckily it's very easy to do.

If you aren't using a config file already, please use the following command:
```shell
kubeshark config -r
```
The above command will create a config file located here: `~/.kubeshark/config.yaml`.
Edit the file and change the port ranges like this:
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
Change the port numbers to any numbers you choose as long as they are in the allowed range.

## Browser Not Installed Or Found

Running the CLI results in launching the locally installed browser. When such a browser isn't installed or can't be found by **Kubeshark**, like in the case of a fresh Ubuntu installation, it may make sense to run **Kubeshark** headless, like this:
```shell
kubeshark tap --set headless=true
```
> Read more options to set the headless config [here](/en/config#run-kubeshark-headless).

## Fragile Proxy Connection

K8s proxy creates a tunnel. This solution, while common can break often. If the proxy connection breaks, a message will appear in the console log with instructions how to restart the proxy connection:
```shell
kubeshark proxy
```

## Proxy Host

When using the CLI, the tap command creates a K8s proxy to the front-end container. For security reasons, the default proxy host IP is 127.0.0.1. That might not work for some configurations. For example if you have two NICs or if you're using a headless VM. In any event you can set the correct IP by changing the proxy host config. For example using this line:

```shell
kubeshark tap --proxy-host 0.0.0.0
```

## Got Response With Status Code: 418

If you get something like this in your console log:
```shell
2023-06-04T11:05:34+03:00 WRN hub.go:215 > Failed creating 
script Hub: error="got response with status code: 418, 
body: {\"EnabledFeatures\":[\"Ingress\"]}"
```
It means your Pro license if out-of-date. You can simply update it by using: 
```shell
kubeshark pro
```

## CNI and K8s Version Incompatibility

There were some reports on incompatibility between certain versions of Kubernetes and Calico. We don't have enough information to suggest a course of action.

## Openshift

There were some reports where Kubeshark wasn't running out of the box on Openshift. We plan to make sure it runs flawlessly on Openshift, but we haven't gotten to that yet.

## Well That Didn't Work

If you were unable to find a solution to your problem, there're other means to enable you to get going in no time.

- [Report a bug](https://github.com/kubeshark/kubeshark/issues) by opening a ticket on GitHub.
- [Join our Slack channel](https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA) and seek support from the community. We're usually there and try to be first to respond.
- [Get dedicated and timely support from the project team](https://kubeshark.co/contact-us).
