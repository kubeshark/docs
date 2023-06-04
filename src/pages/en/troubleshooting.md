---
title: Troubleshooting
description: Troubleshooting the problems that you face while using Kubeshark.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** installation should be pretty straight forward, however due to the many K8s versions and configurations, getting started can require some troubleshooting.

## Versions Incompatibility 

Most problems are resolved by simply re-installing the CLI using the following script or by any other means listed in the [installation page](/en/install):
```shell
sh <(curl -Ls https://kubeshark.co/install)
```

## Config File Incompatibility

When you upgrade the CLI, and you're using a config file, you may need to update it. You can generate a fresh config file using the following command:
```shell
kubeshark config -r
```
If you have an existing config file, use the following command to see the new fields and make the relevant adjustments:
```shell
kubeshark config
```

## Ports Range

**Kubeshark**'s default config uses ports 8897-8899. Some K8s distributions like K3s and Microk8s do not allow this port range and require changing these ports. Luckily it's very easy to do.

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
It means your Pro license if out-of-date. Pro edition is free while in Beta. You can simply update it by using: 
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
- Get dedicated and timely support from the project team by [joining our private beta program](https://kubeshark.co/beta).
