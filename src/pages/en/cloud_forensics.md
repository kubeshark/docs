---
title: Cloud Forensics
description: Record K8s traffic and perform offline investigations to hunt down performance and security culprits with ease
layout: ../../layouts/MainLayout.astro
---

Cloud forensics can be extremely useful for incident investigation, both for security and infrastructure professionals.

Traffic includes information that can be useful to find the root cause of a problem or a breach.

K8s network traffic is massive and simply too big to store and process. **Kubeshark** enables programmatic forensics generation that focuses only on areas and events of interest.

## Continuous, Query-based Forensics Generation

Continuous, query-based forensics generation is a process that runs in the background that tests [OSI](https://en.wikipedia.org/wiki/OSI_model) L4 streams against a set of queries, exports the L4 streams that match to PCAP and uploads to an immutable datastore.

![](/kfl-pcap-s3-3.png)

Here's an example of a script that continuously monitors traffic, matching the traffic against two KFL queries:

- `http and response.status == 500` - HTTP traffic with `500` response code
- `dns` - DNS traffic


## Getting Started

You can start recording traffic, and store in AWS S3, by providing the following properties in Kubeshark's config file:

```shell
license: FT7YKAYBAEDUY2LD.. your license here .. 65JQRQMNSYWAA=
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

The recorded traffic holds valuable insights that can be analyzed over time to uncover hidden patterns and recurring issues. 

## On-demand Offline Investigation

The true power of recording K8s traffic lies in the ability to conduct offline investigations on-demand.  

Use the following command, to investigate the recorded traffic that is stored and retained in the AWS S3
bucket:

```shell
kubeshark tap --pcap s3://my-bucket/
```

The above command initiates Kubeshark's offline mode, enabling you to explore the contents of the S3 bucket without the need for direct access to your cluster. 

The convenience of offline investigation empowers professionals to dig deeper into the recorded traffic, perform comprehensive analysis, and unveil valuable insights for resolving complex issues.

Kubeshark's dashboard allows you to visualize and explore the recorded traffic using powerful filtering, searching, and analytical capabilities. With this user-friendly interface, you can navigate through the recorded data more efficiently, saving precious time and effort.

![Kubeshark Dashboard](/ks-dashboard.png)

## Deactivating Recording

Remove the `RECORDING_KFL` property from Kubeshark's config file to deactivate the recording.

## Conclusion

DevOps, SREs, Platform Engineers, and Developers can leverage the ability to record K8s traffic and perform offline investigations to hunt down performance and security culprits with ease. 

Traffic recording and offline investigation can lead to faster issue resolution, improved performance, and enhanced security, unraveling the intricate web of interactions within K8s.

Happy investigating!