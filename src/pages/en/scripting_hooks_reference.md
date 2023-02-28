---
title: Hooks Reference
description: The list of hooks in the scripting system of Kubeshark
layout: ../../layouts/MainLayout.astro
---

Hooks are pre-defined JavaScript functions in the scripting system that are being attached
to a certain point in the network packet **capture - dissect - query** pipeline of Kubeshark.

The function arguments of hooks with type **object** can be printed to console with
the purpose of seeing the data structure of that argument, like;

```js
console.log(JSON.stringify(data))
```

Each hook description in this page, has an **Arguments** section that explains the Go data structure of
the arguments in the hook. These **Go data structures give you a hint about the typing** that emerge in
JavaScript runtime and understanding how **static or dynamic** the data type or its fields are. Please refer
to the [JSON and Go](https://go.dev/blog/json) page to understand how JSON encoding works in Go language
if you're not familiar with the Go language.

## `onPacketCaptured(info: object)`

```js
function onPacketCaptured(info) {
  // Your code goes here
}
```

The hook `onPacketCaptured` is called whenever a new network packet is captured by Kubeshark.
On a **busy cluster**, the call frequency of this hook can go more than a **10000 times per second**. Because of that;
a poorly optimized `onPacketCaptured` implementation can have a **performance impact**
on the network traffic capture speed of Kubeshark. Therefore it's logical to not call `console.log` or
a helper which does an HTTP request like `vendor.slack` and instead use this hook
to aggregate data into a global variable and then handle the aggregated data in another hook
or a job:

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

The hook `onItemCaptured` is called whenever a TCP/UDP stream is captured, reassembled
and successfully dissected by one of the protocol parsers of Kubeshark. This hook is relatively less
triggered than the `onPacketCaptured` hook. Since multiple packets translate into an HTTP request-response pair,
a Kafka publish, a Kafka consume or an AMQP exchange declare. The item's scope is determined by the corresponding
application layer protocol as one can imagine. For example; an HTTP request-response pair contains a lot parameters
while an AMQP exchange declare is quite a simple message.

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

The data structure of `request` and `reponse` fields change basend the `protocol.name`.

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

## `onItemQueried(data: object)`

```js
function onItemQueried(data) {
  // Your code goes here
}
```

The hook `onItemQueried` is called whenever an already captured and stored TCP/UDP stream is queried or fetched through the web UI.
All of its other aspects are same with the `onItemCaptured` hook.

> The call to hook `onItemQueried` depends on user's action, it's **not** sourced from network traffic capture.

### Arguments

Same as `onItemCaptured` hook.

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
