---
title: Websocket API Endpoints
description: Use a Websocket API endpoint to extract the traffic you need.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark offers a Websocket API endpoint, enabling external applications to access captured data. These endpoints facilitate real-time data retrieval through Websocket connections.

Two options are available:
1. A single central endpoint via the Hub with access to all nodes
2. Direct node access via the Worker

## Hub Websocket API Endpoint

To demonstrate, this example uses [wscat](https://github.com/websockets/wscat), a command-line tool, to establish a WebSocket connection to the Hub. The tool simplifies interactions with WebSocket servers, making it ideal for testing and development purposes.

```shell
wscat --connect ws://127.0.0.1:8899/api/wsFull
```
Once open, the connection awaits a KFL (Key Filtering Logic) to start sending traffic. The KFL instructs the Hub on which data to filter and send back.

Data will continue streaming until the connection is closed.

Here's an example where we send the KFL: `response.status > 300` once the connection is open. The returning stream will include traffic with response status codes that are greater than 300.

```yaml
➜  ~ wscat --connect ws://127.0.0.1:8899/api/wsFull
Connected (press CTRL+C to quit)
> response.status > 300
< {"dst":{"endpointSlice":null,"ip":"169.254.169.254","name":"","namespace":"","pod":null,"port":"80","service":null},"elapsedTime":0,"entryFile":"000000019561_pcap-0_entry.json","error":null,"failed":false,"id":"10.0.41.65:30001/000000019561.pcap-0","index":0,"node":{"ip":"10.0.41.65","name":"ip-10-0-41-65.ec2.internal"},"outgoing":false,"passed":false,"protocol":{"abbr":"HTTP","backgroundColor":"#416CDE","fontSize":12,"foregroundColor":"#ffffff","layer3":"ip","layer4":"tcp","longName":"Hypertext Transfer Protocol -- HTTP/1.1","macro":"http","name":"http","ports":["80","443","8080"],"priority":0,"referen
```

Another example for retrieving the content of a certain node:
```yaml
➜  ~ wscat --connect ws://127.0.0.1:8899/api/wsFull
Connected (press CTRL+C to quit)
> response.status > 300 and node.name == "ip-10-0-41-65.ec2.internal"
< {"dst":{"endpointSlice":null,"ip":"169.254.169.254","name":"","namespace":"","pod":null,"port":"80","service":null},"elapsedTime":0,"entryFile":"000000019561_pcap-0_entry.json","error":null,"failed":false,"id":"10.0.41.65:30001/000000019561.pcap-0","index":0,"node":{"ip":"10.0.41.65","name":"ip-10-0-41-65.ec2.internal"},"outgoing":false,"passed":false,"protocol":{"abbr":"HTTP","backgroundColor":"#416CDE","fontSize":12,"foregroundColor":"#ffffff","layer3":"ip","layer4":"tcp","longName":"Hypertext Transfer Protocol -- HTTP/1.1","macro":"http","name":"http","ports":["80","443","8080"],"priority":0,"referen
```

Another example for running in a non interactive mode:

```yaml
➜  ~ wscat --connect ws://127.0.0.1:8899/api/wsFull -x "response.status > 300 and node.name == \"ip-10-0-41-65.ec2.internal\"" -w 1000
Connected (press CTRL+C to quit)
< {"dst":{"endpointSlice":null,"ip":"169.254.169.254","name":"","namespace":"","pod":null,"port":"80","service":null},"elapsedTime":0,"entryFile":"000000019561_pcap-0_entry.json","error":null,"failed":false,"id":"10.0.41.65:30001/000000019561.pcap-0","index":0,"node":{"ip":"10.0.41.65","name":"ip-10-0-41-65.ec2.internal"},"outgoing":false,"passed":false,"protocol":{"abbr":"HTTP","backgroundColor":"#416CDE","fontSize":12,"foregroundColor":"#ffffff","layer3":"ip","layer4":"tcp","longName":"Hypertext Transfer Protocol -- HTTP/1.1","macro":"http","name":"http","ports":["80","443","8080"],"priority":0,"referen
```
## Controlling the Returned JSON Structure
TBD