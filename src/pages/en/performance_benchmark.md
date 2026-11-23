---
title: Hub Streaming Benchmarks
description: How Hub performance tests are organized, what they measure, and how to interpret the latest released-product reference results.
layout: ../../layouts/MainLayout.astro
---

## Release Target

Published benchmarks target the **latest published Kubeshark release**, with its matching chart and component images. Refresh the reference results from that release's validation evidence rather than substituting development results. The exact tested version, measurement dates, scenario hashes and image digests belong in the [measurement extract](/benchmarks/hub-stream-sizing.json) and matching [release reports](https://github.com/kubeshark/kubeshark/releases), not in version-specific testing instructions.

Master and branch runs are development validation. A passing development run does not automatically certify a published release or replace its benchmark evidence.

## Test Families

[Perfshark](/en/benchmark_methodology) separates controlled synthetic Hub workloads from real capture correctness:

| Test family | Controlled workload | What it establishes |
| --- | --- | --- |
| Streaming tiers | Increasing synthetic worker and represented-pod counts, with a streaming client | Hub delivery rate, CPU, RSS and UI-stream drops |
| Worker scaling | Known worker-count increases and decreases | Behavior through controlled topology transitions |
| Stability and soak | Sustained synthetic streaming over a defined window | Observed delivery and resource trends, not an uptime guarantee |
| Flow queries | Synthetic topology and flow responses | Hub query latency and response behavior |
| Snapshot operations | Seed-replayed packet files from synthetic workers | Snapshot copy/storage behavior, not live capture throughput |
| Functional correctness | Controlled application traffic captured by real workers | Capture, dissection, filtering and export correctness, not a throughput benchmark |

The standard performance selection and the separate two-hour soak are distinct. A standard-suite pass does not imply that the soak ran. Browser rendering and production traffic diversity are outside these synthetic measurements.

## Measurement Environment

The current standard fixture reserves one workload node for the Hub and Front, uses four producer nodes, and runs the streaming receiver on a separate EC2 instance. Keep receiver location, topology, resources, corpus, images and client count controlled when comparing runs.

The reference observations below retain their original recorded environment. They use five four-vCPU workload nodes and a recorded 5 GiB Hub memory limit, but do not attest CPU reservation/limit or exact producer placement. Do not fill those gaps from today's fixture. Exact Kubernetes/kernel versions and other recorded inputs remain in the extract.

## Reference Streaming Results

These latest-release reference measurements used one streaming client and a fixed 2,000-entry replay corpus. Small through Large used ten-minute windows with 61 metric/RSS samples each; XL used thirty minutes with 181 samples. Represented pods are synthetic metadata, not that many running application workloads.

| Tier | Workers / represented pods | Delivered entries/s | Measured UI drops | Average CPU (cores) | RSS average / peak (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Small | 10 / 100 | 999.85 | 0 | 0.213 | 170.82 / 171.86 |
| Medium | 50 / 500 | 4,998.00 | 0 | 0.750 | 219.30 / 224.10 |
| Large | 100 / 1,000 | 9,989.50 | 0 | 1.507 | 284.18 / 290.87 |
| XL | 200 / 2,000 | 20,102.07 | 0 | 2.157 | 449.27 / 514.84 |

The separate two-hour reference soak used 50 workers and 400 represented pods. It delivered 4,997.94 entries/s over 721 samples, at 213.89/219.29 MiB average/peak RSS. Its first-to-last RSS increase was 5.36 MiB. That endpoint difference is distinct from the harness's window-based memory summary.

These observations support sizing decisions for similar synthetic workloads. They do not establish minimum reservations, maximum supported throughput or whole-deployment memory requirements.

## Reading the Evidence

Use endpoint counter differences, not averages containing the partial initial interval:

```text
delivered entries/s = (last entriesRecv - first entriesRecv) / (last t - first t)
measured UI drops  = last uiDrops - first uiDrops
```

For the reference XL window, `(36,184,757 - 1,024) / 1,800` gives 20,102.07 entries/s. The first sample marks measurement after warmup, not Hub startup. Account for pre-measurement losses separately.

Check complete metric/RSS coverage, counter continuity, restart availability and actual input identity. A baseline comparison can tolerate historical loss; it is not equivalent to a zero-drop claim. Queue samples can miss short overflows, and UI-stream drops are not packet-capture drops.

The released reference reports mark their harness modified and predate current restart-availability attestations. Their recorded baseline comparisons remain historical outcomes; the measurements are not retroactively certified under newer evidence requirements. The extract exposes these limitations without inventing missing resource or restart data.

## Applying the Results

Use [Workload Resources](/en/workload_resources#recommended-sizing-by-cluster-size) for starting requests, then validate representative traffic, entry sizes, client concurrency and competing workloads. Process RSS is not total container memory, and resource use need not scale linearly with worker count or entry rate.

The [historical sizing experiments](/en/hub_sizing_experiments) retain earlier tier sweeps and the controlled CPU-request comparison. They inform the request recommendation but are not measurements of the latest release. See [Benchmark Methodology](/en/benchmark_methodology) for the data path, measurement definitions and reproduction limits.
