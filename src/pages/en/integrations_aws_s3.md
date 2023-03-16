---
title: Upload Files to AWS S3
description:  Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3)
layout: ../../layouts/MainLayout.astro
---
> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

The AWS S3 integration provides an immutable datastore option in case you want to export files outside of the K8s cluster.

You can read the [helper](/en/automation/helpers) section to learn more about the available AWS S3 helpers.

The most common helper would be the `vendor.s3.put` helper that uploads a file using the provided credentials.

```js
vendor.s3.put(
  env.AWS_REGION,
  env.AWS_ACCESS_KEY_ID,
  env.AWS_SECRET_ACCESS_KEY,
  env.S3_BUCKET,
  tarFile
);
```

> Read more about the required AWS credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

## Upload a Network Snapshot to S3

The `wrapper.kflPcapS3` wrapper conditionally generates PCAP repositories based on KFL queries.

PCAP repositories are uploaded to AWS S3 and a Slack notification is sent upon completion.

```js
var KFL_PCAP_S3_KFL_ARR =[
    "http and (response.status==500)",
    "dns",
];

function onItemCaptured(data) {
    wrapper.kflPcapS3(data, { 
        kflArr:             KFL_PCAP_S3_KFL_ARR,   
    });
}
```
The above examples shows the script required to monitor traffic and match against two KFL queries:
- `http and (response.status==500)` - HTTP traffic only where response status is 500
- `dns` - all DNS traffic

All matching L4 streams will be added to a PCAP repository and uploaded to S3. An optional Slack message will be sent when a new file is uploaded:

![PCAP Slack Alert](/pcap-slack-alert.png)

> Read more about the KFL-PCAP-S3 wrapper [here](/en/automation_wrappers#wrapperkflpcaps3).
