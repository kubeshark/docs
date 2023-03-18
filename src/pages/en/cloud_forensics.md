---
title: Cloud Forensics
description: Cloud forensics through raw traffic capture and PCAP export from your Kubernetes network.
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

Matching L4 streams will be added into a PCAP repository, compressed and uploaded to AWS S3.

```js
var KFL_PCAP_S3_KFL_ARR = [
  "http and response.status == 500",
  "dns",
];

function onItemCaptured(data) {
  wrapper.kflPcapS3(data, {
      kflArr:             KFL_PCAP_S3_KFL_ARR, // Mandory
  });
}
```

> See [`wrapper.kflPcapS3`](/en/automation_wrappers#wrapperkflpcaps3) for more info.

### Filtering

For example, the KFL statement: `http and response.status == 500` will match a TCP stream that's HTTP in terms of application-layer and at least one response with the status `500`.

> Read more in the [filtering](/en/filtering) section.

### PCAP

In **Kubeshark**, a PCAP file is a combination of L4 streams representing a network snapshot. The snapshot can include different L4 streams from different areas of the K8s cluster.

PCAP example (from Wireshark):

![PCAP example](/pcap.png)
