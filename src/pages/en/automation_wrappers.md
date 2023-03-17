---
title: Wrappers
description: Wrappers are a kind of helpers who wrap a certain piece of JavaScript code for ease of use.
layout: ../../layouts/MainLayout.astro
---

Wrappers are a kind of helpers who wrap a certain piece of JavaScript code for ease of use. They are like bigger functions that perform multiple tasks and hide the complexity of the code behind them. Wrappers start with the `wrapper.*` prefix.

## `wrapper.kflPcapS3`

This wrapper receives a list of KFL queries as input, monitors traffic and generates PCAP repositories that match any of the KFL entries. The compressed PCAP repositories are uploaded to AWS S3 and optionally sends a Slack notification.

Here's an example of how to use the helper:

```js
var KFL_PCAP_S3_KFL_ARR = [
    "http and response.status == 500",
    "dns",
];

function onItemCaptured(data) {
    wrapper.kflPcapS3(data, {
        kflArr:             KFL_PCAP_S3_KFL_ARR,
    });
}
```

- `http and response.status == 500` - HTTP traffic only where response status is 500
- `dns` - all DNS traffic

### The Input Object

The `wrapper.kflPcapS3` expects the following input object:

```go
{
    kflArr:             string[],   // the only mandatory field
    awsRegion:          string,     // default: env.AWS_REGION
    awsAccessKeyId:     string,     // default: env.AWS_ACCESS_KEY_ID
    awsSecretAccessKey: string,     // default: env.AWS_SECRET_ACCESS_KEY
    s3Bucket:           string,     // default: env.S3_BUCKET
    slackWebhook:       string,     // if doesn't exist, no slack message will be sent
    slackAuthToken:     string,     // if doesn't exist, no slack message will be sent
    slackChannelId:     string,     // if doesn't exist, no slack message will be sent
    active:             bool,       // default: true
    verbose:            bool,       // default: false
    maxMinutes:         int,        // default: 60
    maxL4Streams:       int         // default: 100000
}
```

Here's an example of how to use the wrapper with a complete input object, overriding all defaults:

```js
wrapper.kflPcapS3(data, {
  kflArr:             KFL_PCAP_S3_KFL_ARR, // Mandatory
  /* AWS S3 credential must be present, either here or in the config file as env variables */
  awsRegion:          env.AWS_REGION,
  awsAccessKeyId:     env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  s3Bucket:           env.S3_BUCKET,
  /* Optional: A slack message is fired only if these properties are provided. There's no default value */
  slackWebhook:       env.SLACK_WEBHOOK,
  slackAuthToken:     env.SLACK_AUTH_TOKEN,
  slackChannelId:     env.SLACK_CHANNEL_ID,
  /* The rest of the properties are optional */
  active:             true,   // set to false to deactivate this helper
  verbose:            false,  // set to true to see verbose log
  maxMinutes:         60,     // maximum time for a single PCAP file
  maxL4Streams:       10000,  // maximum L4 streams for a single PCAP file
});
```

**Kubeshark** uploads the compressed PCAP repositories to AWS S3, making them available
in your AWS S3 console:

![S3 FIles](/kfl-pcap-s3.png)

### Progress Log File

`wrapper.kflPcapS3` maintains a progress log file in the AWS S3 bucket. Here's the progress log file matching the above example:

```json
[
  {
    "file": "kfl_0_kubeshark_1678808288.tar.gz",
    "kfl_index": 0,
    "kfl_query": "http and response.status == 500",
    "s3_url": "https://kubeshark-helper-test.s3.us-east-2.amazonaws.com/my-cluster_192.168.49.2/kfl_0_kubeshark_1678808288.tar.gz",
    "time": "Tue, 14 Mar 2023 15:38:26 GMT"
  },
  {
    "file": "kfl_1_kubeshark_1678808543.tar.gz",
    "kfl_index": 1,
    "kfl_query": "dns",
    "s3_url": "https://kubeshark-helper-test.s3.us-east-2.amazonaws.com/my-cluster_192.168.49.2/kfl_1_kubeshark_1678808543.tar.gz",
    "time": "Tue, 14 Mar 2023 15:42:53 GMT"
  },
  {
    "file": "kfl_0_kubeshark_1678808758.tar.gz",
    "kfl_index": 0,
    "kfl_query": "http and response.status == 500",
    "s3_url": "https://kubeshark-helper-test.s3.us-east-2.amazonaws.com/my-cluster_192.168.49.2/kfl_0_kubeshark_1678808758.tar.gz",
    "time": "Tue, 14 Mar 2023 15:46:18 GMT"
  },
  {
    "file": "kfl_1_kubeshark_1678808954.tar.gz",
    "kfl_index": 1,
    "kfl_query": "dns",
    "s3_url": "https://kubeshark-helper-test.s3.us-east-2.amazonaws.com/my-cluster_192.168.49.2/kfl_1_kubeshark_1678808954.tar.gz",
    "time": "Tue, 14 Mar 2023 15:49:32 GMT"
  }
]
```

### Optional Slack Alerts

To get Slack alerts upon new PCAP repository available in S3, include Slack credentials as part of the input object. If Slack credentials are not provided, no Slack message will be sent.

### PCAP Repository Content

The PCAP repositories include additional meta-data information that accompanies the PCAP files.

![The content of each repository](/pcap-s3.png)
The repository file name includes the KFL query index and the UNIX timestamp it was generated.

The repository includes a `content.json` file that includes some meta-data about the PCAP file. The meta-data includes:

- KFL query index
- KFL query
- The L4 streams
- The PCAP file name
- The time of creation

It looks something like this:

```json
{
  "kfl_index": 1,
  "kfl_query": "dns",
  "l4_streams": [
    "000000007221_udp.pcap",
    "000000007222_udp.pcap",
    "000000007223_udp.pcap"
  ],
  "pcap_file_name": "1678819560.pcap",
  "time": "Tue, 14 Mar 2023 18:46:13 GMT"
}
```

Next in the repository is the `name_resolution_history.json`. As L4 streams contain only IPs and no identities, this file includes a history log and timing of all the name to IP resolutions made at the node where the PCAP was generated.

The file looks something like this:

```json
{
  "1678818739": {
    "10.103.193.44": {
      "FullAddress": "kubeshark-front.kubeshark",
      "Namespace": "kubeshark"
    },
    "10.103.193.44:80": {
      "FullAddress": "kubeshark-front.kubeshark",
      "Namespace": "kubeshark"
    },
    "10.106.97.98": {
      "FullAddress": "kubeshark-hub.kubeshark",
      "Namespace": "kubeshark"
    }
  }
}
```
You can view the content of the repository using  **Kubeshark** with the `kubeshark tap --pcap <pcap-repo-name>`

> Read more in the [PCAP](/en/pcap#view-the-pcap-snapshot) section
