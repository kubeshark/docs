---
title: Half & Erroneous Connection Analysis
description: Kubeshark is useful for detecting various network-related errors
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

**Kubeshark** is useful for detecting various network-related errors, such as:

- [Connection errors](#tcp-connection-errors)
- [Timeout errors](#timeout-errors)
- [Packet loss](#packet-loss)
- [ICMP issues](#icmp)
- [Dissection errors](#dissection-errors)
- [Half connections](#half-connections)

In addition to offering details about detected errors, **Kubeshark** allows you to record raw traffic for in-depth analysis using tools such as Wireshark

> Learn more in the [Traffic Recorder](/en/traffic_recorder) section.

## TCP (Connection) Errors

Connection errors, identified as part of the TCP protocol, include:

| Error | Description |
| --- | --- |
| SynSent | The client attempted to establish a connection, but the connection was refused. SYN sent, but ACK not received. |
| CloseWait | One side closed the connection with FIN, but the final ACK confirmation is pending. |
| LastAck | One side received a FIN from the peer, sent an ACK, sent a FIN, and is waiting for the final ACK from the peer. |
| Reset | A RST packet is seen, indicating that one side will neither accept nor send more data. |

![TCP Errors](/tcp_error.png)

## Timeout Errors

**Kubeshark**'s L4 stream capture times out after 10 seconds. If an L4 stream capture doesn't complete within this timeframe, the stream is marked stale and dropped.

## Packet Loss

Packet loss can cause **Kubeshark** L4 streams to timeout and parser errors. Additionally, lost packets might result in no symptoms and no signals.

Potential causes of packet loss:

| Cause | Description |
|---|---|
| Insufficient CPU resources for **Kubeshark** | Packet loss can occur when **Kubeshark** is unable to read packets quickly enough, often due to a lack of CPU resources. | 
| AF-PACKET vs PF-RING | AF-PACKET is prone to packet loss, whereas [PF-RING](/en/performance#af-packet-and-pf-ring) is less likely to cause it.|

## ICMP

**Kubeshark** intercepts, dissects, and presents [ICMP](https://datatracker.ietf.org/doc/html/rfc792) messages. ICMP is an L4 protocol used for error reporting and network diagnostics. For instance, if a router cannot forward a packet because the destination is unreachable, an ICMP message is sent back to the sender indicating the problem.

Partial list of errors reported by ICMP messages:

**Destination Unreachable**: Sent when a packet cannot be delivered to its destination for various reasons, with subcodes including:

- Network Unreachable
- Host Unreachable
- Protocol Unreachable
- Port Unreachable
- Fragmentation Needed and DF (Don't Fragment) set
- Source Route Failed
- Destination Network Unknown
- Destination Host Unknown
- Source Host Isolated
- Network Administratively Prohibited
- Host Administratively Prohibited
- Network Unreachable for Type of Service
- Host Unreachable for Type of Service

**Time Exceeded**: Indicates that the Time to Live (TTL) field of the packet has reached zero, necessitating discarding the packet. This is commonly used in network route tracing.

**Source Quench**: A deprecated message requesting the sender to decrease the message sending rate due to router or host congestion.

**Redirect Message**: Sent by routers to indicate a more efficient packet routing path.

**Parameter Problem**: Indicates an error in the IP packet header fields, preventing processing.

Router Advertisement and Router Solicitation: Used for routing information discovery and announcement.

![ICMP reported errors](/icmp_error.png)

## Dissection Errors

Dissection errors are reported by **Kubeshark** protocol parsers:

| Error | Description |
|---|---|
| unexpected EOF | TCP connection closed unexpectedly. |
| Parser error | **Kubeshark**'s application layer protocol parser reports an invalid payload according to the protocol definition. |

## Half Connections

Half connections represent incomplete transactions where either a request or a response is missing.

![Half Connection Example](/half_connections.png)

**Kubeshark** aims to identify the reasons for these incomplete transactions.

## Error Filter

Use **Kubeshark** Filter Language (KFL) to selectively display or filter out various errors. For example:

```yaml
!error      # Filters out any half-connections
!icmp       # Filters out any ICMP entries
!tcp        # Filters out any TCP level errors
```

## Tip: Error Dashboard
Enter the following KFL in the KFL box:
`response.status > 400 or error or icmp or tcp`, apply, copy and enter to favorite.
The link should look like this:
```yaml
http://<kubeshark-domain>:<port>/?q=response.status%20%3E%20400%20or%20error%20or%20icmp%20or%20tcp
```
It will look even better on a 60" screen.