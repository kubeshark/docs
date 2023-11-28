---
title: Traffic Recorder
description: 
layout: ../../layouts/MainLayout.astro
---
> This feature will be available in the upcoming patch release.

The Traffic Recorder allows for the execution of multiple individual recording jobs. Each job independently records traffic based on a [KFL](/en/filtering) statement and operates on its own schedule. Any of these recordings can be analyzed using a rich filtering language at the user's discretion.

## Start a Recording Job
To initiate a recording job, click the recording button located next to the KFL statement box.
![Traffic Recorder Button](/record_button.png)

### Recording Job Properties
Configure the recording job properties through the recording job dialog window by setting the following parameters:

| Property | Value Examples | Description |
| --- | --- | --- |
| KFL Statement | `http or dns` | The pattern used to filter and record traffic. |
| Name | `my_recording_no_15` | The job's name, which also serves as the recording folder's name. This name can later be used to access the recorded content. |
| Start Time | `08:45 UTC` <br /> `<leave-empty>` | The scheduled start time of the job, in UTC timezone. Leave blank to start immediately. |
| Daily Iterations | 0 - forever<br />1 - once<br />n - days | Set to `1` for a single run, or enter a number to run for that many days. To run indefinitely, set to `0`. |
| Duration | `60` <br /> `1440` | The length of time, in minutes, traffic will be recorded once the job starts. |
| Expiration | `1440` <br /> `4320` | To conserve storage space, this setting allows the traffic folder to expire and be deleted after a specified time. |

![Traffic Recorder Dialog](/recording_dialog.png)

## Recorded Traffic Offline Analysis
Each recording's content is stored in a dedicated folder. Access this content at any time, provided the folder hasn't been erased (intentionally or unintentionally).

To view the traffic, use the `record` KFL helper. This helper, when used with the job name as part of a KFL statement, applies the KFL statement exclusively to the recording content.

![Recording Helper](/record_helper.png)

## Analyzing Multiple Recordings and Real-Time Traffic

Assuming you have multiple recording jobs running, both currently and in the past, you can analyze the traffic of both jobs in conjunction with real-time traffic simultaneously. 
For example, if you have recordings named `recording_1` and `recording_2`, you can use the dashboard to analyze traffic across both recordings as well as real-time traffic:

![Multiple Recording and TLS Traffic](/recording_tls.png)

This example filters TLS traffic from both recordings and real-time TLS traffic.

## Behavior-based Recording

KFL statements can identify K8s elements like pods and namespaces but can also describe traffic patterns. For example:
```yaml
(response.status == 500) and 
(request.headers["User-Agent"] == "kube-probe/1.27+") and 
(src.name == "kube-prometheus-stack-prometheus-node-exporter")
```
In this scenario, record L4 streams that include API traffic from a specific service, with certain characteristics and API status code `500`.


## Deleting a Recording Job

Each recording job operates using a script for scheduling and operation. Users have the option to customize or delete these scripts by navigating to the scripts section.

![Scripts](/scripting.png)

In this section, users can either delete or modify the relevant scripts as needed.

![Deleting Scripts](/delete_scripts.png)

## Why Recording is Necessary

In **Kubeshark**, due to the massive size of traffic data, it is continuously captured but quickly discarded unless specific measures are taken to preserve it. In the context of real-time streaming, a PCAP file has a Time-To-Live (TTL) of 10 seconds, while a JSON file containing detailed information has a TTL of 5 minutes.

## Long-Term Immutable Traffic Retention

It is recommended to export recorded traffic to external data stores, such as Google Cloud Storage (GCS) or AWS S3, to store traffic for extended periods in immutable data stores.

> Read more in the [AWS S3](http://localhost:3000/en/integrations_aws_s3) and [GCS](http://localhost:3000/en/integrations_gcs) sections.

## DevOps Considerations

### Disk Storage
The Traffic Recorder relies on the Worker's storage, which is constrained by the `tap.storagelimit` configuration value. To enhance storage capacity and ensure adequate storage space, this value can be adjusted. For example, it can be set to 5GB using `--set tap.storagelimit=5Gi`.

Should the storage limit be exceeded, the Worker pod faces the risk of eviction. It is incumbent upon the user to allocate sufficient storage to avert such eviction.

### Storage Persistency
By default, **Kubeshark** employs ephemeral storage, as opposed to persistent storage. Consequently, all content will be lost in scenarios such as pod eviction, OOMkilled events, or any other circumstances that lead to pod restart.

While completely optional, to mitigate the risk of data loss, it is advisable to utilize persistent volume claims, thereby ensuring the use of persistent storage:
```yaml
tap:
  persistentStorage: true
  storageClass: <pvc-class>
```
Having said the above, **Kubeshark** will still record traffic the same way without persistent storage.