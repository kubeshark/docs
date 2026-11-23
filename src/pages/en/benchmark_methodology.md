---
title: Benchmark Methodology
description: How Kubeshark uses perfshark to measure Hub streaming, what the measurements cover, and how to inspect the published data.
layout: ../../layouts/MainLayout.astro
---

Perfshark is Kubeshark's internal testing tool for generating controlled workloads and measuring their behavior. Its source repository and the corpus used for the published Hub tests are private. You do not need access to them to read the [benchmark results](/en/performance_benchmark) or inspect the [current release measurement extract](/benchmarks/hub-stream-sizing.json) and [historical measurement extract](/benchmarks/hub-stream-sizing-historical.json).

This page describes the **synthetic Hub streaming scenario** behind those results and the scope of current performance testing. Historical measurements retain their original inputs and limitations; changes to the test method do not remeasure a released version.

## Release Target

Published benchmark validation targets the **latest published Kubeshark release**, with matching chart and component images. The procedures are organized by test family rather than release number. Exact versions, measurement dates, scenario hashes and image digests remain in the reports and downloadable evidence.

Master and branch runs validate development changes. They must not be relabelled as published-release evidence. Refresh the reference measurements from matching released artifacts when the next release is qualified.


## How the Test Works

1. Perfshark creates synthetic workers and Kubernetes metadata representing the configured worker and pod counts. Represented pods are metadata for the test, not an equivalent number of running application workloads.
2. The workers generate prepared entries from a fixed corpus at a configured nominal rate and stream them to a real Kubeshark Hub.
3. A test client consumes the Hub's UI stream and counts received entries. It exercises stream delivery without rendering a browser dashboard.
4. After warmup, the runner samples client counters and Hub metrics over a defined interval. It records image digests, scenario and corpus hashes, and environment details alongside the measurements.

The data path is **synthetic workers → Hub → streaming test client**. Worker count times configured entries/s is nominal load. Generator scheduling and backpressure can affect actual delivery, so results report the received counter increase over elapsed measurement time.

## Current Test Scope and Environment

The performance suite measures Hub streaming, worker-count changes, flow queries, and snapshot operations using synthetic workers. Snapshot tests use a prepared packet-capture seed, not live worker capture. Functional tests separately exercise real capture and dissection against controlled application traffic; passing them does not establish packet-capture throughput.

The standard performance environment uses five workload nodes: one reserved for the Hub and Front, and four for synthetic producers. The streaming receiver runs on a separate Amazon EC2 instance. Receiver location, network path, and workload placement are part of the measurement environment, not interchangeable implementation details. Older published trials can have different placement, as identified on the results page.

The versioned demo-apps workload artifact owns the application fixtures, corpus-generation configuration and coverage expectations, and synthetic snapshot seed. Perfshark consumes and verifies those assets. Reports retain the applicable workload, corpus and seed identities, scenario and resolved images. Generating a corpus from captured application traffic does not turn replaying prepared entries into a capture or dissection benchmark.

The standard suite and the separate two-hour soak are different test selections. A passing standard suite does not imply that the soak ran or that a complete release validation passed.

## What the Measurements Mean

| Measurement | Meaning |
| --- | --- |
| Delivered entries/s | Entries received by the client over the measured interval |
| UI-stream drops | Increase in the Hub's UI-stream drop counter; not packet capture loss |
| CPU | Hub CPU use, with 1,000 millicores equal to one core |
| RSS | Resident process memory from `process_resident_memory_bytes`, converted to MiB |
| Queue utilization | Sampled Hub client-queue occupancy; short spikes can occur between samples |
| Coverage and continuity | Whether expected metrics were available, with checks for gaps, counter resets, restarts, and Hub replacement |

Separate CPU scheduling diagnostics and logs can help explain a result. Historical measurements may have incomplete diagnostics, which must remain visible as a limitation. Current acceptance requires verified input provenance, a compatible baseline, required measurement and restart evidence, and verified cleanup. When log collection is enabled, incomplete collection also prevents acceptance. A report containing measurements is not by itself a passing result, and missing restart evidence must not be interpreted as zero restarts. An integrity or cleanup failure blocks subsequent measurements until the underlying problem is resolved.

## Checking the Published Results

The [current release extract](/benchmarks/hub-stream-sizing.json) contains selected metrics from the published release-validation archive. The [historical extract](/benchmarks/hub-stream-sizing-historical.json) retains the earlier experiments. Each record includes timestamps, input provenance, sampled counters and a summary, not traffic payloads or complete raw artifacts. Zero-valued metric fields omitted in the original reports are expanded to zero alongside the retained collection-availability fields. Missing CPU resource settings or newer restart-availability attestations are not synthesized.

Use the first and last samples after warmup. Sample `t=0` marks the start of measurement, not process startup. Cumulative counters can already be nonzero because traffic is flowing during warmup; subtract the initial value and report any pre-measurement losses separately:

```text
delivered entries/s = (last entriesRecv - first entriesRecv) / (last t - first t)
measured UI drops  = last uiDrops - first uiDrops
RSS in MiB         = process_resident_memory_bytes / 1,048,576
CPU cores          = cpuMillis / 1,000
```

In the extract, `t` is seconds, `memMb` is already RSS in MiB, and `bufUtil` is a fraction. Check that the sample grid covers the stated interval and that `metricsScraped` and `memoryAvailable` are true. Multiple `metricsSegments` require investigating continuity before interpreting counter deltas. Do not infer zero drops from missing metrics or a low sampled queue peak.

This lets readers check the published arithmetic and sampled trends. It is not independent verification of the collection process. Exact reproduction requires the private harness and matching scenarios, images, and corpus; hashes identify those inputs but do not make them publicly available.

## Scope and Limits

The published streaming measurements exercise Hub aggregation and delivery of prepared entries. They do not measure real packet capture, TLS decryption, L7 dissection, snapshot processing, browser rendering or production traffic diversity. Other test families have their own scope; synthetic snapshot-copy tests are not live capture benchmarks. Single-client streaming results do not establish capacity with many concurrent clients.

Comparisons should keep traffic inputs, images, placement, warmup, and duration controlled, while changing the setting being investigated. Synthetic generators sharing compute with the Hub can still introduce variation. Repeated trials and longer runs strengthen the evidence, but a zero-drop run is neither a maximum-throughput measurement nor an uptime guarantee.

Use [Hub Streaming Benchmarks](/en/performance_benchmark) for the tested configurations, results, and run-specific limitations. Use [Workload Resources](/en/workload_resources) for starting allocations, then validate with representative traffic and client concurrency in your own environment.
