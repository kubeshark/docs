---
title: Hub Streaming Benchmarks
description: Measured Hub throughput, drops, CPU and RSS across synthetic worker tiers, with reproducible calculations and sizing limitations.
layout: ../../layouts/MainLayout.astro
---

A Hub with a **2-CPU request and no CPU limit** delivered **19,901.35 entries/s for 30 minutes with zero measured UI-stream drops** in the XL tier, at an average/peak process RSS of **460.30/587.55 MiB**. A two-hour soak at the Medium rate held **4,991.13 entries/s** with **7.46 MiB** of RSS growth across the window. This supports the [XL starting configuration](/en/workload_resources#recommended-sizing-by-cluster-size) for similar workloads, not a universal capacity guarantee.

The current-release figures were measured on October 7-8, 2026 (UTC) as part of release validation for 53.5.0. The CPU-request comparison further down was measured on September 10-11, 2026 (UTC) and has not been repeated since; it is kept because it is the evidence behind the sizing recommendation, and it is labelled with its own date and settings. The [downloadable measurement extract](/benchmarks/hub-stream-sizing.json) contains the sampled counters, CPU/RSS values, measurement timestamps, image digests and scenario hashes underlying the September tables. It excludes traffic payloads and infrastructure identifiers.

## What Was Tested

[Perfshark](/en/benchmark_methodology) used synthetic workers to stream entries from a fixed 2,000-entry corpus through one Hub to one streaming client. Each worker represented 10 pods. This tests Hub aggregation and delivery of prepared entries; it does **not** measure real worker packet capture, TLS decryption, L7 dissection, snapshot processing, browser rendering, or multiple simultaneous clients.

| Parameter | Configuration |
| --- | --- |
| Hub runtime and stream settings | Go 1.27.1; 8,192-entry client queue; batches up to 64 entries with a 3 ms wait; gzip BestSpeed |
| Version | The latest Kubeshark release |
| Infrastructure | Five AWS `m6in.xlarge` nodes, four vCPUs each |
| Kubernetes / kernel | EKS `v1.35.8-eks-3b4a6ca` / `6.12.110-135.201.amzn2023.x86_64` |
| Hub memory request / limit during tests | `50Mi` / `5Gi` |
| Hub CPU limit | Unset in every reported trial |
| Warmup / measurement sampling | One minute / every 10 seconds, including interval endpoints |
| Profiling | Disabled; stream diagnostics enabled |

These figures describe the latest Kubeshark release. Every release is re-measured before publication, and this page is updated whenever a release changes the numbers. All reported trials resolved to the same Hub, mock-worker, and front image digests, recorded in the extract. The mock-worker and front tags in the initial tier sweep were mutable; the controlled comparison and soak pinned those images by digest.

## Tier Sweep: Current Release

Sequential measurements against the latest release with a **2-CPU Hub request and no CPU limit**, one streaming client, and 100 nominal entries/s per worker (101 at XL). Small through Large ran for 10 minutes each with 61/61 metric and RSS samples; XL ran for 30 minutes with 181/181.

| Tier | Workers / represented pods | Nominal entries/s | Delivered entries/s | Measured UI drops | Average CPU (cores) | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Small | 10 / 100 | 1,000 | 983.30 | 0 | 0.161 | 169.73 / 170.69 |
| Medium | 50 / 500 | 5,000 | 4,915.61 | 0 | 0.844 | 219.54 / 221.67 |
| Large | 100 / 1,000 | 10,000 | 9,828.24 | 0 | 1.356 | 286.75 / 292.71 |
| XL | 200 / 2,000 | 20,200 | 19,901.35 | 0 | 2.208 | 460.30 / 587.55 |

Every tier delivered its nominal rate within 2% with no measured UI-stream drops. These observations inform the Small, Medium, and Large starting requests. They do not establish minimum reservations or measure a whole deployment's memory consumption.

A two-hour soak at the Medium rate (50 workers, 400 pods, 100 entries/s each) delivered 4,991.13 entries/s over 721 samples, with average/peak RSS of 216.44/222.50 MiB and 7.46 MiB of growth across the window.

## Tier Sweep With the Installation CPU Request

The same tiers measured on September 10-11, 2026 (UTC) with the chart's `50m` Hub CPU request instead of a 2-CPU request, and without the balanced worker placement used above. The XL failure is the reason this table is kept: it shows why the installation request is insufficient evidence for a sizing recommendation.

| Tier | Workers / represented pods | Nominal entries/s | Delivered entries/s | Measured UI drops | Average CPU (cores) | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Small | 10 / 100 | 1,000 | 999.68 | 0 | 0.171 | 165.25 / 165.75 |
| Medium | 50 / 500 | 5,000 | 4,997.10 | 0 | 0.829 | 211.08 / 211.88 |
| Large | 100 / 1,000 | 10,000 | 9,992.93 | 0 | 1.287 | 273.97 / 275.41 |
| XL | 200 / 2,000 | 20,000 | 19,576.73 | 236,399 | 2.027 | 426.03 / 475.90 |

## Controlled XL CPU-Request Comparison

A fresh cluster ran six 10-minute trials in the order below. The Hub was restarted before each trial, then passed through setup and warmup before measurement began; it was pinned to the same node. All trials used the same image digests, corpus, 200 workers at 100 nominal entries/s each, one client, and 40 ready workers per physical node. Front and mock-controller placement also remained constant. This reduces placement and ordering differences when comparing CPU requests.

| Trial order | Hub CPU request | Delivered entries/s | Measured UI drops | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: |
| 1 | `2` | 19,893.82 | 0 | 400.46 / 410.33 |
| 2 | `50m` | 19,964.46 | 3,092 | 395.38 / 418.63 |
| 3 | `50m` | 19,962.34 | 7,071 | 437.51 / 468.51 |
| 4 | `2` | 19,894.51 | 0 | 406.94 / 410.41 |
| 5 | `2` | 19,903.95 | 0 | 399.57 / 402.33 |
| 6 | `50m` | 19,961.09 | 3,625 | 407.83 / 414.68 |

The initial sample (`t=0`) is the start of measurement after warmup, not the time of the Hub restart. In trial 3, the replacement Hub was ready at 14:44:02 UTC, warmup began at 14:45:24, and measurement began at 14:46:24. Its initial `uiDrops` value was already 30,361, reflecting losses before measurement. The final value was 37,432, so the table reports **7,071 additional drops** during the measured interval. The initial losses remain visible in the data extract; they are excluded from the measured delta, not evidence that the previous trial's counter survived a restart.

All trials had complete 61-sample metrics, one client connection, and no Hub replacement during measurement. No CPU quota throttling was observed. The higher request reduced average aggregate thread runqueue wait by about 27%, supporting CPU contention as a contributor to loss even without a CPU limit.

The `2` trials delivered slightly less traffic than the `50m` trials, despite the same nominal rate. The generators share nodes with the Hub, so this is not an independently controlled arrival-rate experiment. Earlier repetitions also included zero-drop `50m` trials. These results support the higher request; they do not prove that it eliminates every possible source of loss.

## XL Above 20,000 Delivered Entries/s

Each worker runs at 101 nominal entries/s, or 20,200/s aggregate, over a 30-minute measured interval, with the `2` Hub request, no CPU limit, one streaming client and profiling disabled.

| Measurement | Result |
| --- | ---: |
| Measured interval | 22:55:45-23:25:45 UTC, October 7, 2026 |
| Delivered counter increase | 36,021,440 entries |
| Actual delivery over 1,800 seconds | 20,011.91 entries/s |
| Measured Hub UI-stream drops | 0 |
| Metric / RSS coverage | 181 / 181 samples |
| Average / peak CPU | 2.208 / 2.304 cores |
| Average / peak RSS | 460.30 / 587.55 MiB |
| Hub restarts / health errors | 0 / 0 |
| Client connection attempts | 1 |

The full-window delivery target was met, and this measurement passed its committed baseline comparison as part of release validation.

An earlier run of this scenario on September 11, 2026 delivered 20,132.56 entries/s with the same zero-drop result and 390.09/400.78 MiB average/peak RSS. Its CI job failed for a diagnostic reason rather than a measured one: the separate Kubernetes CPU-counter stream disconnected part way through, so scheduler diagnostics covered only the first 12 minutes 44 seconds and the harness never reached its baseline comparison. The figures above supersede it.

## Interpreting These Results

See [Benchmark Methodology](/en/benchmark_methodology) for the data path, metric definitions, counter calculations, and how to inspect the public extract. Perfshark and the test corpus are private: the extract supports checking the published calculations, but does not enable independent reproduction of the full experiment.

Use counter deltas rather than averaging rate samples that include the initial partial interval. For the XL measurement above, the built-in average was 19,901.35/s; the endpoint calculation yields 20,011.91/s. The latter is the declared full-window calculation, and the difference is the initial partial interval, not a change in delivery.

Require complete metrics coverage and check for counter resets or Hub replacements. The UI drop counter measures Hub-to-client stream loss, not packet capture loss. Queue snapshots taken every 10 seconds can miss brief overflows; a low sampled peak does not override an increasing drop counter. A baseline comparison can permit historical loss and is not equivalent to a zero-drop test.

RSS measures resident process memory. Go heap allocation is a separate quantity, and container memory accounting can include additional charges. Historical estimates formed by multiplying Go `Alloc/Sys` by the pod memory limit were not valid RSS measurements; they are excluded here.

The CPU-request comparison changed resource allocation on an already improved Hub. These measurements do not isolate the individual contributions of the Go upgrade, queue size, batching, or compression changes. One soak and three short zero-drop repetitions establish observed behavior for this configuration, not an uptime guarantee or a maximum supported throughput.

See [Workload Resources](/en/workload_resources) to apply starting requests and [Performance](/en/v2/performance) to control worker indexing load.
