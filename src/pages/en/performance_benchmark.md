---
title:  TBD
description: TBD.
layout: ../../layouts/MainLayout.astro
---

## Running Kubeshark at a steady state

Running [Kubeshark](https://kubeshark.com) at a steady state, without using the Dashboard should require very little resources in terms of CPU and memory. In this state, [Kubeshark](https://kubeshark.com) captures all traffic and save it to the Worker nodes local storage. 

## Using the Dashboard

Depending on the amount of traffic and the various queries perform in the dashboard, the dashboard can consume significant efforts. 

In any event, Workers will not consume more resources than the provided limits. 

If the traffic workload is high, you can assign dedicated resources that will be used only when you conduct your investigation and will offload .


The following elements impact performance and resource consumption:
- Using the dashboard
- The KFL 

## Running Kubeshark without the dashboard

## Using the Dashboard 

## Using Scripts

| KPI | Description |
| -------- | ------- |
| ALLOC | Bytes of allocated heap objects including all reachable objects, as well as unreachable objects that the garbage collector has not yet freed. Specifically, ALLOC increases as heap objects are allocated and decreases as the heap is swept and unreachable objects are freed. Sweeping occurs incrementally between GC cycles, so these two processes occur simultaneously, and as a result ALLOC tends to change smoothly. |
| RSS | Resident set size.  The portion of memory occupied by a process that is held in main memory (RAM).|
| CPU | 100 = 1 CPU |
| PROCESSED BYTES | Amount of bytes processed over period of time|
| TOTAL PACKETS | Amount of packets processed over period of time | 
| REASSEMBLED | Amount of messages that were successfully reassembled over period of time |
| PACKETS RECEIVED | Amount of packets received over period of time  |
| PACKETS DROPPEDs   | Amount of packets dropped over period of time  |




(1) Medium load test, using two workers of size c5.xlarge, over a short period of time, using AF_PACKET with no dashboard

| # | Period  | Test Type | Dashboard | Library | ALLOC | CPU | PROCESSED BYTES | TOTAL PACKETS | REASSEMBLED | PACKETS RECEIVED | PACKETS DROPPED |
| -------- | ------- | ------- | ------- | -------- |  ------- | ------- | ------- | -------- | ------- | ------- | ------- |
| (1) | 46m25 | Load Test | No | AF_PACKET | 91.1MB  | 13% | 1.8GB | 2.6MB | 549K | 2.6M |0 |  

![](/cloud_watch_1.png)


Scenarios 1-2 did not consider whether the dashboard was open or not.
(1) Small load testing over a short period of time, using AF_PACKET and KFL to focus only on two pods: no reassembly  
(2) Small load testing over a short period of time, using AF_PACKET and KFL to focus only on two pods: with reassembly  
(3) Stress testing over a long period of time, using AF_PACKET and KFL to focus only on two pods 

| Scenario | Period  | Test Type | Library | ALLOC | RSS | CPU | PROCESSED BYTES | TOTAL PACKETS | REASSEMBLED | PACKETS RECEIVED | PACKETS DROPPED |
| -------- | ------- | ------- | ------- | -------- | ------- | ------- | ------- | -------- | ------- | ------- | ------- |
| (1) | 48m50 | Small Load | AF_PACKET | 41.23MB | 102.8MB | 8 | 2.7M | 2887 | 0 | 3170 | 0 |
| (2) | 1h1m45 | Small Load | AF_PACKET |  76.19MB | 162.2MB | 11.6  | 130MB | 384K | 48K | 263K | 0 |
| (3) | 13h43m15 | Stress | AF_PACKET | 620.3MB | 832.5MB | 60 | 4.6GB | 2.5M | 1M | 1.2M | 358 |

 
