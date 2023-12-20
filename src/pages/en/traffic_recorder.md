---
title: Traffic Recorder
description: 
layout: ../../layouts/MainLayout.astro
---

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

## Behavior-based Recording

KFL statements can identify K8s elements like pods and namespaces but can also describe traffic patterns. For example:
```yaml
(response.status == 500) and 
(request.headers["User-Agent"] == "kube-probe/1.27+") and 
(src.name == "kube-prometheus-stack-prometheus-node-exporter")
```
In this scenario, record L4 streams that include API traffic from a specific service, with certain characteristics and API status code `500`.

