---
title: Traffic Recorder
description: 
layout: ../../layouts/MainLayout.astro
---
> This feature will become available in the next patch release.

With the Traffic Recording feature, you can execute multiple recording jobs where each job independently records traffic based on a [KFL statement](/en/filtering) and operates on its own schedule. The recorded content can be viewed and analyzed using a comprehensive filtering language at the user's discretion.

## Start a Recording Job
To initiate a recording job, click the recording button located next to the KFL statement box.
![Traffic Recorder Button](/record_button.png)

### Recording Job Properties
Configure the recording job properties via the recording job dialog window by setting the following parameters:
- **KFL Statement**: The pattern used to filter and record traffic.
- **Name**: The job's name, which also serves as the recording folder's name. This name can later be used to access the recorded content.
- **Start Time**: The scheduled start time of the job, in UTC timezone. Leave blank to start immediately.
- **Daily Iterations**: Set to `1` for a single run, or enter a number to run for that many days. To run indefinitely, set to `0`.
- **Duration**: The length of time traffic will be recorded once the job starts.
- **Expiration**: To conserve storage space, this setting allows the traffic folder to expire and be deleted after a specified time.

![Traffic Recorder Dialog](/recording_dialog.png)

## View Recorded Traffic
Each Traffic Recording Job's content is stored in a dedicated folder. You can access this content at any time, provided the folder hasn't been erased (intentionally or unintentionally).

To view the traffic, use the `record` KFL helper. This helper, when used in conjunction with the job name as part of a KFL statement, applies the KFL statement exclusively to the recording content.

![Recording Helper](/record_helper.png)

## Why Recording is Necessary

In **Kubeshark**, as traffic size can be massive, it is captured continuously, but it is quickly discarded unless actions are taken to preserve it. For real-time streaming, a PCAP file has a Time-To-Live (TTL) of 10 seconds, and a JSON file containing detailed information has a TTL of 5 minutes.

## DevOps Considerations

### Disk Storage
The Traffic Recorder utilizes the Worker's storage, with a limit set by the `tap.storagelimit` configuration value. To increase this limit and ensure sufficient storage, adjust the value (e.g., setting it to 5GB with `--set tap.storagelimit=5Gi`).

The Worker pod will be evicted if the storage limit is reached. It is the user's responsibility to allocate sufficient storage to prevent eviction.

### Storage Persistency
By default, Kubeshark uses ephemeral storage, not persistent storage. This means all content will be lost in cases of eviction, OOMkilled events, or any other scenario that causes the pod to restart.

To prevent data loss, use persistent volume claims to ensure the use of persistent storage:
```yaml
tap:
  persistentStorage: true
  storageClass: <pvc-class>
```
