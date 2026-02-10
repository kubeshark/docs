---
title: Raw Capture
description: Continuous L4 packet capture with minimal CPU overhead and zero data loss.
layout: ../../../layouts/MainLayout.astro
---

Raw Capture provides continuous L4 (TCP/UDP) packet capture across all nodes with minimal CPU overhead. It operates independently from L7 dissection and stores all traffic in a node-level FIFO buffer.

> **Helm Configuration:** Control raw capture settings—storage size, capture filters, snapshot storage, and more—via Helm values. See [Raw Capture Configuration](/en/v2/raw_capture_config) for details.

---

## Capabilities

| Capability | Description |
|------------|-------------|
| [Traffic Snapshots](/en/v2/traffic_snapshots) | Extract and preserve traffic for a specific time window |
| [PCAP Export](/en/dashboard_snapshots#pcap-export) | Download raw packets for Wireshark analysis |
| [Delayed Dissection](/en/v2/l7_api_delayed) | Run L7 protocol analysis on non-production compute |

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

## Independence from L7 Dissection

Raw Capture and L7 dissection are controlled separately:

| Setting | Effect |
|---------|--------|
| `tap.capture.raw.enabled=true` | Raw capture active |
| `tap.capture.stopped=true` | L7 dissection stopped |

Both can run simultaneously, or raw capture can run alone. This enables continuous packet retention with L7 dissection enabled only when needed.

These settings are configured via Helm values. See [Raw Capture Configuration](/en/v2/raw_capture_config) for the full configuration reference and [Enabling/Disabling Dissection](/en/on_off_switch) for operational details.

---

## Resource Characteristics

| Metric | Raw Capture | L7 Dissection |
|--------|-------------|---------------|
| CPU | Low (disk I/O bound) | High (protocol parsing) |
| Memory | Fixed buffer | Scales with traffic |
| Data loss risk | Minimal | Higher under load |

Raw Capture's low CPU footprint eliminates packet loss under normal conditions. L7 dissection requires more resources but can be deferred to non-production systems.