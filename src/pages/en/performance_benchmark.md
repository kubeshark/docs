---
title: Hub Streaming Benchmarks
description: Measured Hub throughput, drops, CPU and RSS across synthetic worker tiers, with reproducible calculations and sizing limitations.
layout: ../../layouts/MainLayout.astro
---

During published **53.6.0** validation, the XL tier delivered **20,102.07 entries/s for 30 minutes with zero measured UI-stream drops**, at **449.27/514.84 MiB** average/peak process RSS. A two-hour soak delivered **4,997.94 entries/s**, at **213.89/219.29 MiB** average/peak RSS. These are synthetic Hub measurements, not a universal capacity guarantee or a real packet-capture benchmark.

The current-release figures were measured on October 21, 2026 (UTC), against the published 53.6.0 chart and images. The [release measurement extract](/benchmarks/hub-stream-sizing-53.6.0.json) contains the counters, CPU/RSS samples, measurement timestamps and input digests behind these figures. Earlier release figures and the September CPU-request comparison remain separately dated below; the [historical extract](/benchmarks/hub-stream-sizing.json) retains the September observations. Neither extract contains traffic payloads or infrastructure identities.

## What Was Tested

[Perfshark](/en/benchmark_methodology) used synthetic workers to stream entries from a fixed 2,000-entry corpus through one Hub to one streaming client. The tier sweep represented ten pods per worker; the soak represented 400 pods across 50 workers. This tests Hub aggregation and delivery of prepared entries; it does **not** measure real worker packet capture, TLS decryption, L7 dissection, snapshot processing, browser rendering or multiple simultaneous clients.

| Parameter | Configuration |
| --- | --- |
| Version | Published Kubeshark 53.6.0 |
| Infrastructure | Five AWS `m6in.xlarge` nodes, four vCPUs each |
| Kubernetes / kernel | EKS `v1.35.8-eks-b9510e3` / `6.12.111-136.204.amzn2023.x86_64` |
| Recorded Hub memory limit | `5Gi` |
| CPU reservation/limit and exact producer placement | Not retained in the released measurement JSON; not inferred from measured CPU use |
| Warmup / measurement sampling | One minute / every 10 seconds, including interval endpoints |
| Metrics / RSS coverage | Complete for the reported measurement windows |

These figures come from the evidence published with [release 53.6.0](https://github.com/kubeshark/kubeshark/releases/tag/v53.6.0), not development/master runs. Hub, synthetic-worker and Front digests match across the selected measurements. The original reports mark the harness modified and predate current restart-availability attestations; they are not retroactively certified by today's stricter acceptance rules. The historical CPU-request comparison below is the separate evidence behind the request recommendation.

## Tier Sweep: 53.6.0

Sequential measurements against published 53.6.0 used one streaming client. Small through Large ran for 10 minutes each with 61/61 metric and RSS samples; XL ran for 30 minutes with 181/181. Delivery rates below use endpoint counter deltas, not averages that include the partial initial interval.

| Tier | Workers / represented pods | Delivered entries/s | Measured UI drops | Average CPU (cores) | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Small | 10 / 100 | 999.85 | 0 | 0.213 | 170.82 / 171.86 |
| Medium | 50 / 500 | 4,998.00 | 0 | 0.750 | 219.30 / 224.10 |
| Large | 100 / 1,000 | 9,989.50 | 0 | 1.507 | 284.18 / 290.87 |
| XL | 200 / 2,000 | 20,102.07 | 0 | 2.157 | 449.27 / 514.84 |

Every tier had zero measured UI-stream drops. These observations inform starting resource requests; they do not establish minimum reservations or a whole deployment's memory requirement.

A two-hour soak with 50 workers and 400 represented pods delivered 4,997.94 entries/s over 721 samples, with average/peak RSS of 213.89/219.29 MiB. RSS rose from 211.50 MiB at the first sample to 216.86 MiB at the last, an endpoint increase of 5.36 MiB.

## Historical Release 53.5.0

The previous release figures were measured on October 7-8, 2026 (UTC). They remain here as history, not as measurements of 53.6.0. The original published table used summary-average rates, which include the partial initial interval:

| Tier | Workers / represented pods | Summary entries/s | Measured UI drops | Average CPU (cores) | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Small | 10 / 100 | 983.30 | 0 | 0.161 | 169.73 / 170.69 |
| Medium | 50 / 500 | 4,915.61 | 0 | 0.844 | 219.54 / 221.67 |
| Large | 100 / 1,000 | 9,828.24 | 0 | 1.356 | 286.75 / 292.71 |
| XL | 200 / 2,000 | 19,901.35 | 0 | 2.208 | 460.30 / 587.55 |

The XL endpoint calculation was 20,011.91 entries/s. That release's two-hour soak reported 4,991.13 entries/s and 216.44/222.50 MiB average/peak RSS. Do not combine those observations with the current-release results as if they were repeated measurements of one configuration.

## Tier Sweep With the Installation CPU Request

These trials were measured on September 10-11, 2026 (UTC), with the chart's `50m` Hub CPU request. They are not a controlled comparison with the later release tables. The XL failure is retained because it shows why the installation request alone is insufficient evidence for a sizing recommendation.

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

The published 53.6.0 XL measurement used 200 synthetic workers, one streaming client and a 30-minute measurement window. CPU reservation, CPU limit and exact producer placement are not recorded in that report; the older controlled request experiment must not be used to fill those gaps.

| Measurement | Result |
| --- | ---: |
| Measured interval | 13:28:42-13:58:42 UTC, October 21, 2026 |
| Delivered counter increase | 36,183,733 entries |
| Actual delivery over 1,800 seconds | 20,102.07 entries/s |
| Measured Hub UI-stream drop increase | 0 |
| Metrics / RSS samples | 181 / 181 |
| Average / peak CPU | 2.157 / 2.266 cores |
| Average / peak RSS | 449.27 / 514.84 MiB |

The released measurement passed its recorded baseline comparison. That result applies to its original method and inputs, not to additional evidence requirements introduced later.

An earlier trial on September 11, 2026 delivered 20,132.56 entries/s with zero measured UI-stream drops and 390.09/400.78 MiB average/peak RSS. Its CI job failed for a diagnostic reason rather than a measured one: the separate Kubernetes CPU-counter stream disconnected part way through, so scheduler diagnostics covered only the first 12 minutes 44 seconds and the harness never reached its baseline comparison. It remains historical evidence, not the current-release figure.

## Interpreting These Results

See [Benchmark Methodology](/en/benchmark_methodology) for the data path, metric definitions, counter calculations, and how to inspect the public extract. Perfshark and the test corpus are private: the extract supports checking the published calculations, but does not enable independent reproduction of the full experiment.

Use counter deltas rather than averaging rate samples that include the initial partial interval. For the 53.6.0 XL measurement, the built-in average was 19,991.58/s; the endpoint calculation yields 20,102.07/s. The latter is the declared full-window calculation. The difference is the partial initial interval, not a change in delivery.

Require complete metrics coverage and check for counter resets or Hub replacements. The UI drop counter measures Hub-to-client stream loss, not packet capture loss. Queue snapshots taken every 10 seconds can miss brief overflows; a low sampled peak does not override an increasing drop counter. A baseline comparison can permit historical loss and is not equivalent to a zero-drop test.

RSS measures resident process memory. Go heap allocation is a separate quantity, and container memory accounting can include additional charges. Historical estimates formed by multiplying Go `Alloc/Sys` by the pod memory limit were not valid RSS measurements; they are excluded here.

The CPU-request comparison changed resource allocation on an already improved Hub. These measurements do not isolate the individual contributions of the Go upgrade, queue size, batching, or compression changes. One soak and three short zero-drop repetitions establish observed behavior for this configuration, not an uptime guarantee or a maximum supported throughput.

See [Workload Resources](/en/workload_resources) to apply starting requests and [Performance](/en/v2/performance) to control worker indexing load.
