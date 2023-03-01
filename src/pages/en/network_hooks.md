---
title: Network Hooks
description:  Kubeshark, among other network hooks, provides OSI L4 and L7 hooks that enable running functions whenever a packet is captured or a new protocol-level message is dissected. 
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** provides [OSI](https://en.wikipedia.org/wiki/OSI_model) L4 and L7 hooks that enable running functions whenever a packet is captured or a new protocol-level message is dissected. 

Network hooks can be very expensive in terms of computing resources. When you develop scripts you should first attempt to run scripts on a schedule and use network hooks only when necessary.

## onItemCaptured
The `onItemCaptured` is an OSI L7 network hook. The function will run every time a new protocol-level message is dissected. The function input variable- `data`, is a JSON dictionary that includes all the information resulting from that was dissected.
```bash
function onItemCaptured(data) {
  console.log("DATA:",JSON.stringify(data));
}
```
The above function will print to the console something like this:
```bash
DATA: {"dst":{"ip":"10.96.0.10","name":"kube-dns.kube-system","port":"53"},"elapsedTime":0,"failed":false,"id":"","index":0,"namespace":"kube-system","node":{"ip":"","name":""},"outgoing":false,"passed":false,"protocol":{"abbr":"DNS","backgroundColor":"#606060","fontSize":12,"foregroundColor":"#ffffff","layer4":"udp","longName":"Domain Name System","macro":"dns","name":"dns","ports":[],"priority":4,"referenceLink":"https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml","version":"0"},"request":{"opCode":"Query","questions":[{"class":"IN","name":"rabbitmq.sock-shop.svc.cluster.local","type":"AAAA"}]},"requestSize":191,"response":{"authorities":[{"class":"IN","cname":"","ip":"\u003cnil\u003e","mx":"","name":"cluster.local","ns":"","opt":"","ptr":"","soa":"hostmaster.cluster.local","srv":"","ttl":9,"txts":"","type":"SOA","uri":""}],"code":"No Error"},"responseSize":191,"src":{"ip":"172.17.0.17","name":"mizutest-amqp-py.sock-shop","port":"38040"},"startTime":"2023-03-01T01:56:45.471967384Z","stream":"000000001646_udp.pcap","timestamp":1677635805471,"tls":false,"worker":""}
```
## onItemQueried
The `onItemQueried` is very similar to `onItemCaptured` only it runs on dissected protocol-level message that are part of an active query that usually runs from the **WebUI**.

For example, if I'm using the `dns` KFL query, the `onItemQueried` will only process DNS traffic. If at the same time I'll be using the above mentioned `onItemCaptured`, the latter would be activated on all traffic.

## onPacketCaptured
The `onPacketCaptured` is an OSI L4 network hook. The function will run every time a new packet is captured.
```bash
function onPacketCaptured(info) {
  console.log("Info:",JSON.stringify(info));
}
```
The above function will print to the console something like this:
```bash
Info: {"captureLength":68,"length":68,"timestamp":"2023-03-01T02:11:33.791425527Z","truncated":false}
```
As the rate of packet capture can be very high, printing anything to log or doing an CPU or input/output operation is highly discouraged. This hook is best used for quick calculations. 