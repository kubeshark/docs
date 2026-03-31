---
title: Raw Capture
description: Continuous L4 packet capture with minimal CPU overhead and zero data loss.
layout: ../../../layouts/MainLayout.astro
---

Raw Capture provides continuous L4 (TCP/UDP) packet capture across all nodes with minimal CPU overhead. It operates independently from real-time traffic indexing and stores all traffic in a node-level FIFO buffer.

> **Helm Configuration:** Control raw capture settings—storage size, capture filters, snapshot storage, and more—via Helm values. See [Raw Capture Configuration](/en/v2/raw_capture_config) for details.

---

## A Prerequisite for:

| Capability | Description |
|------------|-------------|
| [Traffic Snapshots](/en/v2/traffic_snapshots) | Extract and preserve traffic for a specific time window |
| [PCAP Export](/en/dashboard_snapshots#pcap-export) | Download raw packets for Wireshark analysis |
| [Delayed Indexing](/en/v2/l7_api_dissection#delayed-indexing) | Run L7 protocol analysis on non-production compute |

---

## Architecture

Raw Capture collects data from three layers:

| Layer | Data Collected |
|-------|----------------|
| Network | TCP/UDP packets via eBPF/AF_PACKET |
| Kubernetes | Pod lifecycle, service endpoints, namespace events |
| Operating System | Process context, container IDs via eBPF |

Each worker node writes captured data to a local FIFO buffer. When the buffer reaches capacity, older data is recycled and discarded. To preserve traffic before it's recycled, create a [Traffic Snapshot](/en/v2/traffic_snapshots)—the data is moved to dedicated storage where it becomes immutable.

---

## Independence from Real-time Traffic Indexing

Raw Capture and real-time traffic indexing are controlled separately:

| Setting | Effect |
|---------|--------|
| `tap.capture.raw.enabled=true` | Raw capture active |
| `tap.capture.dissection.enabled=false` | Real-time traffic indexing stopped |

Both can run simultaneously, or raw capture can run alone. This enables continuous packet retention with real-time traffic indexing enabled only when needed.

These settings are configured via Helm values. See [Raw Capture Configuration](/en/v2/raw_capture_config) for the full configuration reference and [Enabling/Disabling Indexing](/en/on_off_switch) for operational details.

---

## Resource Characteristics

| Metric | Raw Capture | Real-time Traffic Indexing |
|--------|-------------|---------------|
| CPU | Low (disk I/O bound) | High (protocol parsing) |
| Memory | Fixed buffer | Scales with traffic |
| Data loss risk | Minimal | Higher under load |

Raw Capture's low CPU footprint eliminates packet loss under normal conditions. Real-time traffic indexing requires more resources but can be deferred to non-production systems via [delayed indexing](/en/v2/l7_api_dissection#delayed-indexing).