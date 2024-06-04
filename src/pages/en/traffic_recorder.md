---
title: Traffic Recorder
description: 
layout: ../../layouts/MainLayout.astro
---

## Getting Started Quickly

To quickly and seamlessly start a recording job, follow these steps:
1. Click the recording button located next to the KFL statement box.
![Traffic Recorder Button](/record_button.png)
2. Make sure the `Start Time` is blank. If it's not blank, press the `X` to blank the `Start Time` and cause the recording to start imidiately.
3. Press CREATE.
4. After a few minutes, use `record("<recording-name>")` in the KFL box to see the content of the recording up to that point.

> Kubeshark default configuration is not optimal for using the Traffic Recorder, especially in busy clusters. Read more about it in the [configuration section](/en/traffic_recorder#troubleshooting--configuration-tuning).

The **Traffic Recorder** allows for the execution of multiple individual recording jobs. Each job independently records traffic based on a [KFL](/en/filtering) statement and operates on its own schedule. Any of these recordings can be analyzed using a rich filtering language at the user's discretion.

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

## Behavior-based Recording

KFL statements can identify K8s elements like pods and namespaces but can also describe traffic patterns. For example:
```yaml
(response.status == 500) and 
(request.headers["User-Agent"] == "kube-probe/1.27+") and 
(src.name == "kube-prometheus-stack-prometheus-node-exporter")
```
In this scenario, record L4 streams that include API traffic from a specific service, with certain characteristics and API status code `500`.

> Go next to [Recorded Traffic Offline Analysis](/en/offline_analysis)

## Troubleshooting & Configuration Tuning

Out of the box, Kubeshark is optimally configured to view real-time streaming traffic in small clusters. The default configuration is not optimal for using the Traffic Recorder, especially in busy clusters. Misconfiguration can result in Worker pod eviction and loss of recorded PCAP traffic.

### Signs of Misconfiguration

#### Eviction

The Worker storage limit is set by `tap.storageLimit`, defaulting to `500Mi`. Exceeding this limit triggers pod eviction, purging storage, and restarting the pod. 

PCAP and JSON file storage space on the Workers can quickly fill up and surpass the storage limitation, causing Worker pod eviction. When Worker pods are evicted, all stored data is discarded and the recording content will appear empty. 

#### Missing PCAP Files

In busy clusters, message processing times that include dissection and reassembling can extend. When processing time surpasses either JSON or PCAP TTL, the specific file will be discarded by the time processing completes. This is especially concerning in the case of PCAP TTL, which by default is very short and is set to 10s. This behavior can be identified in the scripting console window. For example:

```shell
[ip-10-0-51-87.ec2.internal-0:ERROR] Tue, 04 Jun 2024 23:06:06 GMT: Failed recording (example) Error: open 
/app/data/ip-10-0-51-87.ec2.internal/pcaps/000000000144_udp.pcap: 
no such file or directory
```
Go to the scripting dashboard to see the console:

![Access the Scripting Console](/scripting-console.jpg)

When the PCAP files are no longer available, the PCAP download button is disabled:

![PCAP disabled button](/pcap-disabled.jpg)

### Suggested Configuration Values

Tuning the configuration and finding the right values is up to the user and largely depends on the available resources and how busy the cluster is.

Here's an example of suggested configuration; however, feel free to provide much larger values or play with different values to find the most efficient configuration for your cluster.

```yaml
--set tap.storageLimit=5Gi --set tap.misc.pcapTTL=30s
```

or

```yaml
tap:
    misc:
        pcapTTL: 30s
    storageLimit: 5Gi
```
