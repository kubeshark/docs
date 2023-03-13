---
title: Upload Files to AWS S3
description:  Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3)
layout: ../../layouts/MainLayout.astro
---
> This integration is part of the [Pro edition](https://kubeshark.co/pricing).

**Kubeshark** enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3). 

You can read the [helper](/en/automation/helpers) section to learn more about the available AWS S3 helpers.

The most common helper would be the `vendor.s3.put` helper that uploads a file using the provided credentials.

```js
vendor.s3.put(
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET,
  tarFile
);
```

> Read more about the required AWS credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

## Upload a Network Snapshot to S3

The following wrapper conditionally generates PCAP files based on two KFL queries:
- `http and (response.status==500)` - HTTP traffic only where response status is 500
- `dns` - all DNS traffic

PCAP files are uploaded to AWS S3.

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
WHen a file is uploaded, a Slack message is triggered:

![PCAP Slack Alert](/pcap-slack-alert.png)


