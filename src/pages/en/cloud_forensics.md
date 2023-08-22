---
title: Traffic Recording & Offline Investigation
description: Record K8s traffic and perform offline investigations to hunt down performance and security culprits with ease
layout: ../../layouts/MainLayout.astro
---
Continuous, query-based traffic recording is a process that runs in the background that tests [OSI](https://en.wikipedia.org/wiki/OSI_model) L4 streams against a set of queries, exports the L4 streams that match to PCAP and uploads to an immutable datastore.

![](/kfl-pcap-s3-3.png)

## Getting Started

You can start recording traffic matching either `http` or `dns` traffic, and store in AWS S3, by providing the following properties in Kubeshark's config file:

```shell
scripting:
  env:
    AWS_REGION: us-east-2-this-is-an-example
    S3_BUCKET: give-it-a-name
    RECORDING_KFL: "http or dns" # To deactivated remove this field.
  source: "/path/to/a/local/scripts/folder"
  watchScripts: true
```
Get the script and more detailed instructions from [here](https://github.com/kubeshark/scripts/tree/master/dfir).

## Long Term Retention

The recorded traffic is securely uploaded to an AWS S3 bucket dedicated to long-term retention. This ensures that the recorded data remains accessible and available for thorough analysis even after significant time has passed.

![AWS S3 for DFIR ](/dfir-s3.png)

## On-demand Offline Investigation

Use the following command, to investigate the recorded traffic that is stored and retained in the AWS S3 bucket:

```shell
kubeshark tap --pcap s3://my-bucket/
```

The above command initiates Kubeshark's offline mode, enabling you to explore the contents of the S3 bucket without the need for direct access to your cluster. 

Kubeshark's dashboard allows you to visualize and explore the recorded traffic using powerful filtering, searching, and analytical capabilities. With this user-friendly interface, you can navigate through the recorded data more efficiently, saving precious time and effort.

![Kubeshark Dashboard](/ks-dashboard.png)

## Deactivating Recording

Remove the `RECORDING_KFL` property from Kubeshark's config file to deactivate the recording.

## Conclusion

DevOps, SREs, Platform Engineers, and Developers can leverage the ability to record K8s traffic and perform offline investigations to hunt down performance and security culprits with ease. 

Traffic recording and offline investigation can lead to faster issue resolution, improved performance, and enhanced security, unraveling the intricate web of interactions within K8s.

Happy investigating!