---
title: Hooks
description:  Kubeshark provides various hooks including OSI L4 and L7 hooks that enable running functions whenever a packet is captured or a new protocol-level message is dissected.
layout: ../../layouts/MainLayout.astro
---

Hooks are pre-defined JavaScript functions in the scripting system that are being attached to a certain point in the network packet **capture - dissect - query** pipeline of **Kubeshark**.

**Kubeshark** provides [OSI](https://en.wikipedia.org/wiki/OSI_model) L4 and L7 hooks that enable running functions whenever a packet is captured or a new protocol-level message is dissected. 

Hooks function arguments with type **object** can be printed to console with the purpose of seeing the data structure of that argument, like;

```js
console.log(JSON.stringify(data))
```

A couple of examples can be found at the [end of this section](/en/automation_hooks#http-data-record).

Hook description includes an **Arguments** section that explains the hook's arguments' Go data structure. These **Go data structures provide hints about the typings** that emerge in the JavaScript runtime. Please refer to the [JSON and Go](https://go.dev/blog/json) page to understand how JSON encoding works in Go language if you're not familiar with the Go language.

## `onPacketCaptured(info: object)`

```js
function onPacketCaptured(info) {
  // Your code goes here
}
```
The `onPacketCaptured` is an OSI L4 network hook. It is called whenever a new network packet is captured by **Kubeshark**.

On a **busy cluster**, the call frequency of this hook can go more than a **10000 times per second**. Because of that; a poorly optimized `onPacketCaptured` implementation can have a **performance impact** on the network traffic capture speed of **Kubeshark**. Therefore it's logical to not call helpers (e.g. `console.log` or `vendor.slack`) and instead use this hook to aggregate data into a global variable and then handle the aggregated data in another hook or a job:

```js
var packetCount = 0;
var totalKB = 0;

function onPacketCaptured(info) {
  // Example of data aggregation, packet and KB counter
  packetCount++;
  totalKB += info.length / 1000;
}

function yourJob() {
  // Handle `packetCount` and `totalKB` here
}

// Schedule a call to function `yourJob` every minute
jobs.schedule("example-job", "0 */1 * * * *", yourJob);
```

> The call to hook `onPacketCaptured` does not depend on user's action, it's sourced from network traffic capture.

### Arguments

Arguments of `onPacketCaptured` hook:

#### `info`

```go
type Info struct {
	Timestamp     time.Time `json:"timestamp"`
	CaptureLength int       `json:"captureLength"`
	Length        int       `json:"length"`
	Truncated     bool      `json:"truncated"`
}
```

`timestamp` is the UTC timestamp of the moment that packet is captured.

`captureLength` is the length of the capture.

`length` is the actual length of packet.

`truncated` whether the packet is truncated or not. See [packet truncation](https://www.cisco.com/c/en/us/td/docs/net_mgmt/xnc/nexus_data_broker/use-case/39/packet-truncation.html) for more info.

## `onItemCaptured(data: object)`

```js
function onItemCaptured(data) {
  // Your code goes here
}
```

The hook `onItemCaptured` is an OSI L7 network hook that is called whenever a TCP/UDP stream is captured, reassembled and successfully dissected by one of the protocol parsers of **Kubeshark**. 

This hook is triggered less compared to the `onPacketCaptured` hook, since multiple packets translate into a protocol-level message (e.g. an HTTP request-response pair, a Kafka publish, a Kafka consume or an AMQP exchange declare). 

The item's scope is determined by the corresponding application layer protocol as one can imagine. For example; an HTTP request-response pair contains a lot parameters   while an AMQP exchange declare is quite a simple message.

> The call to hook `onItemCaptured` does not depend on user's action, it's sourced from network traffic capture.

### Arguments

Arguments of `onItemCaptured` hook:

#### `data`

```go
// `{Worker}/{Stream}-{Index}` uniquely identifies an item
type Data struct {
	Id           string                 `json:"id"`
	Index        int64                  `json:"index"`
	Stream       string                 `json:"stream"`
	Worker       string                 `json:"worker"`
	Node         *Node                  `json:"node"`
	Protocol     Protocol               `json:"protocol"`
	Tls          bool                   `json:"tls"`
	Source       *TCP                   `json:"src"`
	Destination  *TCP                   `json:"dst"`
	Namespace    string                 `json:"namespace"`
	Outgoing     bool                   `json:"outgoing"`
	Timestamp    int64                  `json:"timestamp"`
	StartTime    time.Time              `json:"startTime"`
	Request      map[string]interface{} `json:"request"`
	Response     map[string]interface{} `json:"response"`
	RequestSize  int                    `json:"requestSize"`
	ResponseSize int                    `json:"responseSize"`
	ElapsedTime  int64                  `json:"elapsedTime"`
	Passed       bool                   `json:"passed"`
	Failed       bool                   `json:"failed"`
}

type Node struct {
	IP   string `json:"ip"`
	Name string `json:"name"`
}

type Protocol struct {
	Name            string   `json:"name"`
	Version         string   `json:"version"`
	Abbreviation    string   `json:"abbr"`
	LongName        string   `json:"longName"`
	Macro           string   `json:"macro"`
	BackgroundColor string   `json:"backgroundColor"`
	ForegroundColor string   `json:"foregroundColor"`
	FontSize        int8     `json:"fontSize"`
	ReferenceLink   string   `json:"referenceLink"`
	Ports           []string `json:"ports"`
	Layer4          string   `json:"layer4"`
	Priority        uint8    `json:"priority"`
}

type TCP struct {
	IP   string `json:"ip"`
	Port string `json:"port"`
	Name string `json:"name"`
}
```

While there are many fields in the `Data` struct, most of them are pretty self-explanatory.

The data structure of `request` and `response` fields change based on the `protocol.name`.

`Node` struct contains the information about the Kubernetes node which capture happened inside.

`Protocol` struct contains information about the application layer protocol. `name` field uniquely identifies the protocol.
`layer4` tells whether it's TCP-based or UDP-based.

`TCP` struct contains the information about the TCP layer source/destination IP, port, name. Becomes UDP layer source/destination IP, port, name if the stream is UDP-based

`tls` field indicates that the capture happened on an encrypted TLS traffic through eBPF.

`namespace` is the Kubernetes namespace of the node.

`timestamp` is the capture timestamp in UTC.

`outgoing` indicates whether the request is incoming to or outgoing from the Kubernetes cluster.

`startTime` is the timestamp of the first packet in the TCP/UDP stream.

`elapsedTime` is the time that passed until the emit of this item.

`passed` field manipulates the web UI to mark the item as **green** in the left-pane.

`failed` field manipulates the web UI to mark the item as **red** in the left-pane.

The hook `onItemQueried` is called whenever an already captured and stored TCP/UDP stream is queried or fetched through the web UI.
All of its other aspects are same with the [`onItemCaptured`](#onitemcaptureddata-object) hook.

> The call to hook `onItemQueried` depends on user's action, it's **not** sourced from network traffic capture.

### Arguments

Same as [`onItemCaptured`](#onitemcaptureddata-object) hook.

## `onJobPassed(tag: string, cron: string, limit: number)`

```js
function onJobPassed(tag, cron, limit) {
  // Your code goes here
}
```

The hook `onJobPassed` is called whenever a job passes.

### Arguments

`tag` is job tag.

`cron` is the cron statement.

`limit` is the limit of job runs.

## `onJobFailed(tag: string, cron: string, limit: number)`

```js
function onJobFailed(tag, cron, limit, err) {
  // Your code goes here
}
```

The hook `onJobFailed` is called whenever a job fails.

### Arguments

`tag` is job tag.

`cron` is the cron statement.

`limit` is the limit of job runs.

`err` is the error message.

## Examples for the Input Parameter: Data


Here's an example of the input variable `data` content:

### HTTP Data Record

```js
{
  "dst": {
    "ip": "10.0.0.99",
    "name": "",
    "port": "8086"
  },
  "elapsedTime": 23,
  "failed": false,
  "id": "192.168.49.2:8897/000000025258.pcap-0",
  "index": 0,
  "namespace": "default",
  "node": {
    "ip": "192.168.49.2",
    "name": "mizu"
  },
  "outgoing": false,
  "passed": false,
  "protocol": {
    "abbr": "HTTP",
    "backgroundColor": "#326de6",
    "fontSize": 12,
    "foregroundColor": "#ffffff",
    "layer4": "tcp",
    "longName": "Hypertext Transfer Protocol -- HTTP/1.1",
    "macro": "http",
    "name": "http",
    "ports": [
      "80",
      "443",
      "8080"
    ],
    "priority": 0,
    "referenceLink": "https://datatracker.ietf.org/doc/html/rfc2616",
    "version": "1.1"
  },
  "request": {
    "bodySize": 124,
    "cookies": {},
    "headers": {
      "Accept-Encoding": "gzip",
      "Authorization": "Token edO4nlXbD5cfx8nw9_94LMO4tvGJ_xeMQMiFc6J_DNYFAGRe0YIgG8gz98UwDKOa6otCzml3SNw_c5TiDuB4eA==",
      "Content-Length": "124",
      "Host": "10.0.0.99:8086",
      "User-Agent": "influxdb-client-go/2.12.2 (linux; amd64)"
    },
    "headersSize": -1,
    "httpVersion": "HTTP/1.1",
    "method": "POST",
    "path": "/api/v2/write",
    "pathSegments": [
      "api",
      "v2",
      "write"
    ],
    "postData": {
      "mimeType": "",
      "params": [],
      "text": "PerformanceKPIs,namespace=sock-shop,path=/basket.html,service=front-end.sock-shop latency=51,status=200 1678675066165748213\n"
    },
    "queryString": {
      "bucket": "Metrics",
      "org": "Kubeshark",
      "precision": "ns"
    },
    "targetUri": "/api/v2/write?bucket=Metrics&org=Kubeshark&precision=ns",
    "url": "/api/v2/write?bucket=Metrics&org=Kubeshark&precision=ns"
  },
  "requestSize": 428,
  "response": {
    "bodySize": 0,
    "content": {
      "encoding": "base64",
      "mimeType": "",
      "size": 0
    },
    "cookies": {},
    "headers": {
      "Date": "Mon, 13 Mar 2023 02:37:46 GMT",
      "X-Influxdb-Build": "OSS",
      "X-Influxdb-Version": "2.6.1"
    },
    "headersSize": -1,
    "httpVersion": "HTTP/1.1",
    "redirectURL": "",
    "status": 204,
    "statusText": "No Content"
  },
  "responseSize": 114,
  "src": {
    "ip": "192.168.49.2",
    "name": "kubernetes.default",
    "port": "36848"
  },
  "startTime": "2023-03-13T02:37:46.172360504Z",
  "stream": "000000025258.pcap",
  "timestamp": 1678675066172,
  "tls": false,
  "worker": "192.168.49.2:8897"
}
```
### DNS Data Record

```js
{
  "dst": {
    "ip": "172.17.0.3",
    "name": "kube-dns.kube-system",
    "port": "53"
  },
  "elapsedTime": 0,
  "failed": false,
  "id": "192.168.49.2:8897/000000025277_udp.pcap-0",
  "index": 0,
  "namespace": "kube-system",
  "node": {
    "ip": "192.168.49.2",
    "name": "mizu"
  },
  "outgoing": false,
  "passed": false,
  "protocol": {
    "abbr": "DNS",
    "backgroundColor": "#606060",
    "fontSize": 12,
    "foregroundColor": "#ffffff",
    "layer4": "udp",
    "longName": "Domain Name System",
    "macro": "dns",
    "name": "dns",
    "ports": [],
    "priority": 4,
    "referenceLink": "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml",
    "version": "0"
  },
  "request": {
    "opCode": "Query",
    "questions": [
      {
        "class": "IN",
        "name": "session-db.sock-shop.svc.cluster.local",
        "type": "A"
      }
    ]
  },
  "requestSize": 154,
  "response": {
    "answers": [
      {
        "class": "IN",
        "cname": "",
        "ip": "10.101.46.75",
        "mx": "",
        "name": "session-db.sock-shop.svc.cluster.local",
        "ns": "",
        "opt": "",
        "ptr": "",
        "soa": "",
        "srv": "",
        "ttl": 24,
        "txts": "",
        "type": "A",
        "uri": ""
      }
    ],
    "code": "No Error"
  },
  "responseSize": 154,
  "src": {
    "ip": "172.17.0.1",
    "name": "",
    "port": "33305"
  },
  "startTime": "2023-03-13T02:37:49.958762876Z",
  "stream": "000000025277_udp.pcap",
  "timestamp": 1678675069958,
  "tls": false,
  "worker": "192.168.49.2:8897"
}
```