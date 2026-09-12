---
title: Hub Streaming Benchmarks
description: Measured Hub throughput, drops, CPU and RSS across synthetic worker tiers, with reproducible calculations and sizing limitations.
layout: ../../layouts/MainLayout.astro
---

A Hub with a **2-CPU request and no CPU limit** delivered **20,132.56 entries/s for 30 minutes with zero measured UI-stream drops** in the XL scenario below. Its average/peak process RSS was **390.09/400.78 MiB**. This supports the [XL starting configuration](/en/workload_resources#recommended-sizing-by-cluster-size) for similar workloads, not a universal capacity guarantee.

Measurements were collected on September 10-11, 2026 (UTC). The [downloadable measurement extract](/benchmarks/hub-stream-sizing.json) contains the sampled counters, CPU/RSS values, measurement timestamps, image digests, scenario hashes, and perfshark revisions underlying these tables. It excludes traffic payloads and infrastructure identifiers.

## What Was Tested

[Perfshark](/en/benchmark_methodology) used synthetic workers to stream entries from a fixed 2,000-entry corpus through one Hub to one streaming client. Each worker represented 10 pods. This tests Hub aggregation and delivery of prepared entries; it does **not** measure real worker packet capture, TLS decryption, L7 dissection, snapshot processing, browser rendering, or multiple simultaneous clients.

| Parameter | Configuration |
| --- | --- |
| Hub revision | `aed2cbc9c6a0981c13caee1333ddd5cb9ebca518` |
| Hub runtime and stream settings | Go 1.27.1; 8,192-entry client queue; batches up to 64 entries with a 3 ms wait; gzip BestSpeed |
| Chart | 53.4.0 with the Hub image overridden to the revision above |
| Infrastructure | Five AWS `m6i.xlarge` nodes, four vCPUs each |
| Kubernetes / kernel | EKS `v1.35.7-eks-cb19647` / `6.12.103-127.188.amzn2023.x86_64` |
| Hub memory request / limit during tests | `50Mi` / `5Gi` |
| Hub CPU limit | Unset in every reported trial |
| Warmup / measurement sampling | One minute / every 10 seconds, including interval endpoints |
| Profiling | Disabled; stream diagnostics enabled |

The Hub image override matters: chart version alone does not identify the tested code. All reported trials resolved to the same Hub, mock-worker, and front image digests, recorded in the extract. The mock-worker and front tags in the initial tier sweep were mutable; the controlled comparison and soak pinned those images by digest. Do not assume an older release or a floating `master` tag contains this Hub revision.

## Tier Sweep: Observed Usage

These were sequential 10-minute measurements with a `50m` Hub CPU request. Worker placement was not balanced as in the later controlled comparison. All four tiers had 61/61 metric and RSS samples. The XL failure is included to show why the installation request is insufficient evidence for a sizing recommendation.

| Tier | Workers / represented pods | Nominal entries/s | Delivered entries/s | Measured UI drops | Average CPU (cores) | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Small | 10 / 100 | 1,000 | 999.68 | 0 | 0.171 | 165.25 / 165.75 |
| Medium | 50 / 500 | 5,000 | 4,997.10 | 0 | 0.829 | 211.08 / 211.88 |
| Large | 100 / 1,000 | 10,000 | 9,992.93 | 0 | 1.287 | 273.97 / 275.41 |
| XL | 200 / 2,000 | 20,000 | 19,576.73 | 236,399 | 2.027 | 426.03 / 475.90 |

These observations inform the Small, Medium, and Large starting requests. They do not establish minimum reservations, validate those proposed requests under contention, or measure a whole deployment's memory consumption.

## Controlled XL CPU-Request Comparison

A fresh cluster ran six 10-minute trials in the order below. The Hub was restarted before each trial and pinned to the same node. All trials used the same image digests, corpus, 200 workers at 100 nominal entries/s each, one client, and 40 ready workers per physical node. Front and mock-controller placement also remained constant. This reduces placement and ordering differences when comparing CPU requests.

| Trial order | Hub CPU request | Delivered entries/s | Measured UI drops | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: |
| 1 | `2` | 19,893.82 | 0 | 400.46 / 410.33 |
| 2 | `50m` | 19,964.46 | 3,092 | 395.38 / 418.63 |
| 3 | `50m` | 19,962.34 | 7,071 | 437.51 / 468.51 |
| 4 | `2` | 19,894.51 | 0 | 406.94 / 410.41 |
| 5 | `2` | 19,903.95 | 0 | 399.57 / 402.33 |
| 6 | `50m` | 19,961.09 | 3,625 | 407.83 / 414.68 |

All trials had complete 61-sample metrics, one client connection, and no Hub replacement during measurement. No CPU quota throttling was observed. The higher request reduced average aggregate thread runqueue wait by about 27%, supporting CPU contention as a contributor to loss even without a CPU limit.

The `2` trials delivered slightly less traffic than the `50m` trials, despite the same nominal rate. The generators share nodes with the Hub, so this is not an independently controlled arrival-rate experiment. Earlier repetitions also included zero-drop `50m` trials. These results support the higher request; they do not prove that it eliminates every possible source of loss.

## XL Soak Above 20,000 Delivered Entries/s

The next run increased each worker to 101 nominal entries/s, or 20,200/s aggregate, and extended the measured interval to 30 minutes. It retained the `2` Hub request, no CPU limit, balanced 40-worker placement, the same image digests and corpus, and disabled profiling.

| Measurement | Result |
| --- | ---: |
| Measured interval | 23:00:53-23:30:53 UTC, September 11, 2026 |
| Delivered counter increase | 36,238,608 entries |
| Actual delivery over 1,800 seconds | 20,132.56 entries/s |
| Measured Hub UI-stream drops | 0 |
| Metric / RSS coverage | 181 / 181 samples |
| Average / peak CPU | 2.162 / 2.284 cores |
| Average / peak RSS | 390.09 / 400.78 MiB |
| Sampled client-queue peak | 10.69% |
| Hub restarts / health errors | 0 / 0 |
| Client connection attempts | 1 |

The full-window delivery target was met. It was not a minimum for every short interval: non-overlapping one-minute delivery rates ranged from 19,855.72 to 20,405.15 entries/s.

**Diagnostic limitation:** the CI job failed because its separate Kubernetes CPU-counter stream disconnected before the benchmark finished. CPU scheduler diagnostics cover only the first 12 minutes 44 seconds of measurement, and Hub/front log streams are incomplete. The benchmark report itself contains all 181 delivery and RSS samples; client diagnostics contain all 1,860 one-second samples including warmup. The zero-drop and delivery verdict above was recomputed from the completed report. The harness did not reach its baseline comparison, so this is not described as a passing CI run. Cluster cleanup succeeded.

## Interpreting These Results

See [Benchmark Methodology](/en/benchmark_methodology) for the data path, metric definitions, counter calculations, and how to inspect the public extract. Perfshark and the test corpus are private: the extract supports checking the published calculations, but does not enable independent reproduction of the full experiment.

Use counter deltas rather than averaging rate samples that include the initial partial interval. For the soak, the built-in average was 20,022.46/s; the endpoint calculation yields 20,132.56/s. Both exceed the target, but the latter is the declared full-window calculation.

Require complete metrics coverage and check for counter resets or Hub replacements. The UI drop counter measures Hub-to-client stream loss, not packet capture loss. Queue snapshots taken every 10 seconds can miss brief overflows; a low sampled peak does not override an increasing drop counter. A baseline comparison can permit historical loss and is not equivalent to a zero-drop test.

RSS measures resident process memory. Go heap allocation is a separate quantity, and container memory accounting can include additional charges. Historical estimates formed by multiplying Go `Alloc/Sys` by the pod memory limit were not valid RSS measurements; they are excluded here.

The CPU-request comparison changed resource allocation on an already improved Hub. These measurements do not isolate the individual contributions of the Go upgrade, queue size, batching, or compression changes. One soak and three short zero-drop repetitions establish observed behavior for this configuration, not an uptime guarantee or a maximum supported throughput.

See [Workload Resources](/en/workload_resources) to apply starting requests and [Performance](/en/v2/performance) to control worker indexing load.
