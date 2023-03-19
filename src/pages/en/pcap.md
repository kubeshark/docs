---
title: PCAP and L4 Streams
description: With its distributed PCA-based architecture, optimized for performance and scale, Kubeshark makes PCAP or It Didn't Happen possible.
layout: ../../layouts/MainLayout.astro
mascot:
---
**Optimized for Performance and Scale**

## PCAP - Network Traces

PCAP, short for packet capture, is a [file format](https://datatracker.ietf.org/doc/id/draft-gharris-opsawg-pcap-00.html#name-introduction) that is commonly used by network analysis tools such as [Wireshark](https://wireshark.org), [Fiddler](https://www.telerik.com/fiddler) and [TCPdump](https://www.tcpdump.org/).

PCAP file format is suitable to contains network traces that include all communication information relevant to the trace.

## Distributed PCAP-based Storage

**Kubeshark** captures all L4 (UDP and TCP) streams and stores each L4 stream in a separate PCAP file in the root file system of each node in the cluster.

As the raw network traces do not include identity information (e.g. service names), **kubeshark** also keeps track of name resolution history in a JSON file that is attached to each PCAP file.

## Export a Network Snapshot

**Kubeshark** enables you to export any network snapshot that is represented by a [filter](/en/filtering). The network snapshot comes in the form of a compressed PCAP repository that includes one PCAP file per node, where all L4 streams that match the filter at the specific node are merged into that PCAP file.

![Selective Network Snapshot](/network-snapshot.png)

**Kubeshark** enables you to manually export a network snapshot or conditionally generate and upload a network snapshot to an immutable datastore.

### Manual PCAP Export

Clicking the PCAP button will download the compressed PCAP repository in a `.tar.gz` format.

![PCAP Button](/PCAP-button.png)

The PCAP repository will also include one file named: `name_resolution_history.json` per each node in the cluster. `name_resolution_history.json` file contains the historical changes in the mapping of IPs to pod or service names:

![PCAP Snapshot](/pcap-snapshot.png)

The example below shows how to export a network snapshot of the past 72 hours:

![Historical Traffic](/history2.png)

## Network Snapshot Automation

You can write custom-logic scripts to generate network snapshots based on programmatic decisions and then export the generated PCAP repositories to S3.

> Read more in the [Cloud Forensics](/en/cloud_forensics) section.

## View the PCAP Snapshot

Kubeshark provides a **CLI** option to view a previously exported PCAP file.

```shell
kubeshark tap --pcap <pcap-snapshot.tar.gz>
```

Running the above command will open the **Kubeshark** dashboard in your browser and display the content of the PCAP file.

> **TIP:** You can view the service dependency map of a previously stored PCAP file.

## OSI L4 (TCP/UDP) Streams

**Kubeshark** stores the dissected protocols' complete TCP or UDP streams. TCP and UDP streams include all of the request-response pairs throughout the communication between client and server.

> NOTE: Captured TCP or UDP streams that do not belong to a dissected protocols are discarded

### L4 Stream Section

![TCP Stream](/tcp-stream.png)

This L4 stream section exposes the following information:

- The unique identifier of the L4 stream (internal to Kubeshark)
- The index of the item in the L4 stream
- The node name or IP.

and buttons:

- To open the L4 stream replay prompt.
- PCAP download (The original PCAP file of this TCP stream)

### L4 Stream Replay

Use the **Replay** button to replay the L4 stream. Replaying a TCP or UDP stream establishes a brand new connection to the destination server using the destination IP and port of the item. It only replays the payload of client packets.

![TCP stream Replay](/tcp-replay.png)

#### Stress Testing

**Kubeshark** provides an option to replay the TCP or UDP stream concurrently. This capability is intended to provide an easy way to stress test the target server. 

To activate the stress test, put any number in the **replay count** and select the **Replay the TCP/UDP streams concurrently. (load testing)**.

### L4 Stream Traffic Entries

When you select a traffic entry from the left-pane, all the other traffic entries that belong to the same stream are marked with dashed borders:

![Request-Response](/req-res.png)

To automatically build such a filter that matches to items from a specific TCP or UDP stream, use the green + button by the TCP or UDP stream identifier:

![TCP stream query](/stream-query.png)






