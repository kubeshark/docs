---
title: Recorded Traffic Offline Analysis
description: 
layout: ../../layouts/MainLayout.astro
---

Each recording's content is stored in a dedicated folder. Access this content at any time, provided the folder hasn't been erased (intentionally or unintentionally).

To view the traffic, use the `record` KFL helper. This helper, when used with the job name as part of a KFL statement, applies the KFL statement exclusively to the recording content.

![Recording Helper](/record_helper.png)

## Analyzing Multiple Recordings and Real-Time Traffic

Assuming you have multiple recording jobs running, both currently and in the past, you can analyze the traffic of both jobs in conjunction with real-time traffic simultaneously. 
For example, if you have recordings named `recording_1` and `recording_2`, you can use the dashboard to analyze traffic across both recordings as well as real-time traffic:

![Multiple Recording and TLS Traffic](/recording_tls.png)

This example filters TLS traffic from both recordings and real-time TLS traffic.


## Long-Term Immutable Traffic Retention

It is recommended to export recorded traffic to external data stores, such as Google Cloud Storage (GCS) or AWS S3, to store traffic for extended periods in immutable data stores.

> Read more in the [AWS S3](http://localhost:3000/en/integrations_aws_s3) and [GCS](http://localhost:3000/en/integrations_gcs) sections.

> Go next to [Recordings Management](/en/recordings_management)