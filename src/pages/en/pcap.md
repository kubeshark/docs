---
title: Working with PCAPs
description: With its distributed PCAP-based architecture, optimized for performance and scale, Kubeshark makes PCAP or It Didn't Happen possible.
layout: ../../layouts/MainLayout.astro
mascot:
---
**Optimized for Performance and Scale**

## Distributed PCAP-based Storage

**Kubeshark**’s workers store the captured L4 (TCP and UDP) streams in the root file system of each node in the cluster as separate PCAP files.

## Manual PCAP export

**Kubeshark** enables exporting a consolidated, compressed, PCAP container that merges all L4 streams that result from a query. PCAP Container includes one PCAP file per node and a `name_resolution_history.json` file that contains the historical changes in the mapping of IPs and identities (e.g. pods or services).

![PCAP Button](/PCAP-button.png)

Clicking the PCAP button will download a `.tar.gz` file that when opened looks something like this:

![PCAP Snapshot](/pcap-snapshot.png)
> Read more about identity to IP resolution here: [Identity Resolution](/en/identity_resolution)

The example below shows how to export the past 72 hours TCP streams to a PCAP file: 

![Historical Traffic](/history2.png)

> **NOTE:** When dealing with a large amount of traffic, this operation can take a few seconds to complete.

## View the PCAP Snapshot

Kubeshark also provides a **CLI** option to view a previously exported PCAP file.

```shell
kubeshark tap --pcap <pcap-snapshot.tar.gz>
```

Running the above command will open Kubeshark in your browser to display the content of the PCAP file.

> **TIP:** You can view the service dependency map of a previously stored PCAP file.



