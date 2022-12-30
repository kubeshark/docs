---
title: PCAP Or It Didn't Happen
description: With its distributed PCA-based architecture, optimized for performance and scale, Kubeshark makes PCAP or It Didn't Happen possible.
layout: ../../layouts/MainLayout.astro
mascot:
---
**Optimized for Performance and Scale**

## Distributed PCAP Storage

At its core, **Kubeshark**’s architecture is based on distributed PCAP storage, limited only by the size of the sum of all volumes attached to all of the Nodes as each **Worker** stores the captured traffic at the Node level and in PCAP format.

### Why PCAP

PCAP provides all packet information from the Ethernet header all the way to the application payload, providing full visibility of the application and network interaction, pre- and post-event.

## Export to PCAP

**Kubeshark** enables exporting any query result to a PCAP file that can be downloaded using the PCAP button that can be found just right to the query box (section A).

![PCAP Button](/PCAP-button.png)

The PCAP export operation downloads a tar.gz file that includes the PCAP file and a file named: name_resolution_history.json that helps map dynamically changing IPs to service names.

**NOTE:** When dealing with a large amount of traffic, this operation can take a few seconds to complete.

## View PCAP

Kubeshark also provides a **CLI** option to view a previously exported PCAP file.

```shell
kubeshark tap --pcap <pcap-file-name.pcap.tar.gz>
```

Running the above command will open a local browser window using **Kubeshark**'s **Web UI** to present the content of the PCAP file.



