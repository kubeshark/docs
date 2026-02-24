---
title: TCP Expert Insights
description: Wireshark-grade TCP connection health metrics for your entire Kubernetes cluster — retransmissions, RTT, jitter, window problems, and more. Queryable by AI.
layout: ../../../layouts/MainLayout.astro
mascot: Bookworm
---

> **Coming Soon — V2.00:** MCP integration is coming as part of Kubeshark V2.00. [Read the announcement](https://kubeshark.com/post/kubeshark-v2-00-coming-soon).

Kubeshark's TCP Expert Insights give you [Wireshark Expert Information](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html) for **every TCP connection in your cluster** — retransmissions, RTT jitter, window saturation, connection lifecycle, and goodput — all queryable by AI through MCP.

---

## What You Can Diagnose

### Network Problems

> *"Show me all TCP connections with retransmission rates above 5%"*

> *"Which connections have the highest RTT jitter?"*

> *"Find connections where rtt_max is more than 10x rtt_min — those have bufferbloat."*

### Application Bottlenecks

> *"Find connections with zero window events — which receivers are overwhelmed?"*

> *"Which connections have small receive windows? They may need TCP tuning."*

> *"Compare goodput vs total bytes for database connections — how much bandwidth is wasted on retransmissions?"*

### Connection Failures

> *"Show me connections that were reset (RST) — what's getting forcefully terminated?"*

> *"Find connections with incomplete handshakes — are there connectivity issues?"*

### Performance Analysis

> *"Show me connections with high initial_rtt — which network paths are slow?"*

> *"Show TCP connections sorted by goodput — which are transferring the most useful data?"*

> *"Find connections with high window_full_events — are we hitting buffer limits?"*

---

## How to Use

### Prerequisites

| Requirement | Status |
|-------------|--------|
| Kubeshark running | Required |
| L7 dissection enabled | **Required** |
| Raw capture enabled | Not required |

### Enable Dissection

```
POST /mcp/dissection/enable
```

Or ask your AI assistant: *"Enable dissection and show me TCP connection health."*

### Query TCP Metrics

TCP flow entries are available through the `list_api_calls` endpoint using the KFL filter `tcp_flow`:

```
GET /mcp/calls?kfl=tcp_flow&format=raw&limit=10
```

Each result represents a TCP connection with full health metrics attached in the `tcp_metrics` object.

<div class="callout callout-info">

**Note**: TCP Expert metrics are currently available in the `raw` response format, which returns the original protobuf structure from workers. The `compact` and `full` formats will include these metrics in a future release.

</div>

---

## Diagnostic Decision Trees

### "The service is slow"

```
Query tcp_flow entries for the service
|
+-- initial_rtt_us > 10ms?
|   YES -> Network latency problem
|       +-- Same for all source pods? -> Destination node or path issue
|       +-- Only some sources? -> Source node or routing issue
|
+-- initial_rtt_us < 1ms but rtt_avg_us >> initial_rtt_us?
|   YES -> Bufferbloat or congestion
|       +-- High jitter_us? -> Variable queuing, check for burst traffic
|       +-- Consistently high avg? -> Sustained congestion on the path
|
+-- retransmission_rate > 5%?
|   YES -> Packet loss problem
|       +-- fast_retransmissions ~ retransmissions? -> Lossy but recovering
|       +-- fast_retransmissions << retransmissions? -> Timeout-based, severe
|
+-- zero_window_events > 0?
|   YES -> Receiver application is too slow
|       +-- Check receiver pod CPU/memory
|       +-- Application isn't reading from socket fast enough
|
+-- All metrics look normal?
    Problem is at L7 (application logic, database queries, etc.)
    Use L7 API calls to investigate
```

### "Connections are failing"

```
Query tcp_flow entries for the service
|
+-- connection_completeness = 33 (SYN + RST)?
|   Connection refused -- no listener on port, or firewall blocking
|
+-- connection_completeness = 1 (SYN only)?
|   No response -- destination unreachable, network partition
|
+-- connection_completeness = 3 (SYN + SYN-ACK)?
|   Client didn't complete handshake -- client-side issue or crash
|
+-- rst_count > 0 with connection_completeness including DATA?
|   Connection reset after data transfer -- app-level rejection
|       +-- Check application logs
|       +-- May be load balancer timeout or idle connection kill
|
+-- fin_count = 1 (not 2)?
    Half-close -- one side closed but other didn't acknowledge
    Possible app crash during graceful shutdown
```

---

## Metrics Reference

Every TCP connection carries a `tcp_metrics` object with 24 fields organized into six categories. Each metric maps directly to a [Wireshark TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html) feature.

### Retransmission Metrics — "Are packets getting lost?"

| Field | Type | Wireshark Equivalent | Description |
|-------|------|---------------------|-------------|
| `retransmissions` | uint32 | Expert Info: **TCP Retransmission** | Total packets re-sent because the original was lost or not acknowledged in time. [RFC 5681 &sect;3.2](https://datatracker.ietf.org/doc/html/rfc5681#section-3.2) |
| `fast_retransmissions` | uint32 | Expert Info: **TCP Fast Retransmission** | Subset triggered by 3+ duplicate ACKs — the receiver detected a gap and the sender re-sent immediately without waiting for a timeout. [RFC 5681 &sect;3.2](https://datatracker.ietf.org/doc/html/rfc5681#section-3.2) |
| `retransmission_rate` | float | Manual calculation in Wireshark I/O Graph | Ratio of retransmitted packets to total packets (0.0–1.0). The single most useful health indicator. |

#### Interpreting Retransmission Rate

| Rate | Health | Meaning |
|------|--------|---------|
| 0–1% | Healthy | Normal for any network |
| 1–5% | Degraded | Noticeable performance impact, investigate network path |
| 5%+ | Severe | Significant throughput loss, likely congestion or faulty link |

---

### Window Metrics — "Is the receiver keeping up?"

| Field | Type | Wireshark Equivalent | Description |
|-------|------|---------------------|-------------|
| `zero_window_events` | uint32 | Expert Info: **TCP ZeroWindow** | Receiver advertised window=0, telling the sender to stop. The receiving application isn't reading data fast enough. [RFC 9293 &sect;3.8.6](https://datatracker.ietf.org/doc/html/rfc9293#section-3.8.6) |
| `window_full_events` | uint32 | Expert Info: **TCP Window Full** | Sender filled the receiver's advertised window and must wait for ACKs. [RFC 9293 &sect;3.8.6](https://datatracker.ietf.org/doc/html/rfc9293#section-3.8.6) |
| `window_scale` | uint32 | TCP Options in SYN/SYN-ACK | Shift count (0–14) negotiated at handshake. Effective window = `window_field << window_scale`. Common values: 7 (~8MB max), 8 (~16MB max). [RFC 7323 &sect;2](https://www.rfc-editor.org/rfc/rfc7323.html#section-2) |
| `avg_receive_window` | uint32 | Window Scaling Graph | Average effective receive buffer in bytes. Small windows on high-latency links limit throughput. [RFC 7323 &sect;2](https://www.rfc-editor.org/rfc/rfc7323.html#section-2) |

#### What Window Problems Tell You

- **High `zero_window_events`**: The receiver application is too slow. This is an application-level problem, not a network problem. Common cause: overloaded database, slow consumer, insufficient memory.
- **High `window_full_events` with low `zero_window_events`**: The receiver's buffer is simply too small for the link's bandwidth-delay product. May need TCP tuning.
- **Low `window_scale`**: The connection can't use large windows. On high-bandwidth or high-latency paths, this caps throughput.

---

### Sequence Analysis — "Are packets arriving in order?"

| Field | Type | Wireshark Equivalent | Description |
|-------|------|---------------------|-------------|
| `out_of_order` | uint32 | Expert Info: **TCP Out-Of-Order** | Packets arriving with lower sequence numbers than expected, but carrying new data (not retransmissions). Caused by multipath routing or load balancer issues. |
| `dup_acks` | uint32 | Expert Info: **TCP Dup ACK** | Receiver repeatedly acknowledging the same sequence — requesting a missing segment. 3+ consecutive duplicate ACKs trigger fast retransmit. [RFC 5681 &sect;3.2](https://datatracker.ietf.org/doc/html/rfc5681#section-3.2) |
| `missing_segments` | uint32 | Expert Info: **TCP Previous segment not captured** | Gaps in the sequence stream where expected data never arrived. Direct evidence of packet loss. |

#### What Sequence Anomalies Tell You

- **High `out_of_order`**: Packets taking different network paths. Check for ECMP routing doing per-packet (instead of per-flow) load balancing, or asymmetric paths.
- **High `dup_acks`**: The receiver is seeing gaps. If `fast_retransmissions` is also high, the connection is recovering. If not, data may be permanently lost.
- **High `missing_segments`**: Packet loss on the wire. Correlate with `retransmissions` — if retransmissions are also high, TCP is recovering. If not, the capture missed the retransmissions.

---

### Connection State — "How did the connection live and die?"

| Field | Type | Wireshark Equivalent | Description |
|-------|------|---------------------|-------------|
| `rst_count` | uint32 | RST flag count in stream | Forceful connection terminations. Causes: connection refused, app crash, firewall kill, timeout. [RFC 9293 &sect;3.5.2](https://datatracker.ietf.org/doc/html/rfc9293#section-3.5.2) |
| `fin_count` | uint32 | FIN flag count in stream | Graceful close packets. Normal connections have 2 (one per direction). More indicates FIN retransmissions. [RFC 9293 &sect;3.6](https://datatracker.ietf.org/doc/html/rfc9293#section-3.6) |
| `keepalive_count` | uint32 | Expert Info: **TCP Keep-Alive** | Heartbeat probes on idle connections. High count means the connection is mostly idle but kept open. [RFC 9293 &sect;3.8.4](https://datatracker.ietf.org/doc/html/rfc9293#section-3.8.4) |
| `connection_completeness` | uint32 | **TCP Conversation Completeness** | Bitmask of observed connection phases — identical to Wireshark's completeness tracking. |

#### Connection Completeness Bitmask

This field uses the exact same bitmask as Wireshark:

| Bit | Value | Phase |
|-----|-------|-------|
| 0 | 1 (0x01) | **SYN** — Client initiated connection |
| 1 | 2 (0x02) | **SYN-ACK** — Server responded |
| 2 | 4 (0x04) | **ACK** — Handshake completed |
| 3 | 8 (0x08) | **DATA** — Application data observed |
| 4 | 16 (0x10) | **FIN** — Graceful close initiated |
| 5 | 32 (0x20) | **RST** — Connection reset |

#### Common Completeness Values

| Value | Meaning | What It Tells You |
|-------|---------|-------------------|
| **31** (0x1F) | SYN + SYN-ACK + ACK + DATA + FIN | Complete normal connection lifecycle |
| **47** (0x2F) | SYN + SYN-ACK + ACK + DATA + RST | Data transferred, then forcefully reset |
| **7** (0x07) | SYN + SYN-ACK + ACK | Handshake completed but no data — possibly idle or immediately closed |
| **8** (0x08) | DATA only | Mid-stream capture — Kubeshark started after the connection was already established |
| **3** (0x03) | SYN + SYN-ACK | Server responded but client never completed handshake — possible SYN flood or client crash |
| **33** (0x21) | SYN + RST | Connection attempt immediately rejected |

---

### Latency Metrics — "How fast is the network?"

All times in **microseconds** (us).

| Field | Type | Wireshark Equivalent | Description |
|-------|------|---------------------|-------------|
| `initial_rtt_us` | uint32 | `tcp.analysis.initial_rtt` (iRTT) | SYN to SYN-ACK round trip. The cleanest RTT measurement — small packets, no app delay, no congestion. Your **baseline network latency**. |
| `handshake_time_us` | uint32 | SYN to ACK delta (manual) | Full 3-way handshake duration. Should be ~1.5x initial RTT. Much larger = client slow to ACK. |
| `connection_time_us` | uint32 | SYN to first DATA delta (manual) | Time until data transfer begins. Includes handshake + app startup + TLS overhead. |
| `time_to_first_byte_us` | uint32 | TTFB (manual delta) | When the first application data byte appeared after connection start. |
| `rtt_min_us` | uint32 | Minimum on TCP Stream Graph, RTT | Best-case latency (empty queues). Your network floor. |
| `rtt_max_us` | uint32 | Maximum on TCP Stream Graph, RTT | Worst-case latency (congested). Large max/min ratio = bufferbloat. |
| `rtt_avg_us` | uint32 | Average on TCP Stream Graph, RTT | Typical round-trip time during the connection. |
| `rtt_samples` | uint32 | Number of points on RTT graph | How many measurements. More samples = more confidence in min/max/avg. |
| `jitter_us` | uint32 | Std deviation (manual calculation) | RTT variability. High jitter = inconsistent network, bad for real-time apps. |

#### Interpreting Latency

| Scenario | What the numbers look like |
|----------|---------------------------|
| **Healthy same-node** | `initial_rtt: <100us`, `jitter: <50us` |
| **Healthy cross-node** | `initial_rtt: 200-2000us`, `jitter: <500us` |
| **Cross-AZ** | `initial_rtt: 1-10ms`, consistent `avg ~ min` |
| **Bufferbloat** | Low `min`, high `max` (10-100x min), high `jitter` |
| **Network congestion** | `avg` much higher than `min`, `jitter` > 50% of `avg` |
| **TLS overhead** | `connection_time` >> `handshake_time` (TLS adds round trips) |

#### Real Example from a Live Cluster

```json
{
  "rtt_min_us": 28,
  "rtt_max_us": 42028,
  "rtt_avg_us": 8753,
  "rtt_samples": 100,
  "jitter_us": 15707,
  "connection_completeness": 8,
  "avg_receive_window": 2776,
  "goodput_bytes": 1072387
}
```

**Reading this**: Best-case RTT is 28us (same-node, very fast), but average is 8.7ms — **300x worse** — with 15.7ms jitter. `connection_completeness: 8` means only DATA was observed (capture started mid-stream, handshake was missed). The small `avg_receive_window` (2776 bytes) suggests the receiver's buffer is constraining throughput. This pattern points to **application-side backpressure** combined with **variable queuing delays**.

---

### Throughput — "How efficient is the connection?"

| Field | Type | Wireshark Equivalent | Description |
|-------|------|---------------------|-------------|
| `goodput_bytes` | uint64 | Statistics > Conversations (minus retransmissions) | Useful application data delivered, excluding retransmitted bytes. Goodput <= total bytes — the gap is retransmission waste. |

#### Calculating Retransmission Overhead

Compare `goodput_bytes` with the flow's `local_bytes`:

```
overhead = 1 - (goodput_bytes / local_bytes)
```

If goodput is 90% of total bytes, you're losing 10% of bandwidth to retransmissions.

---

## What's Next

- [L4 Tools](/en/mcp/l4_tools) — Lightweight flow visibility without dissection
- [L7 Tools](/en/mcp/l7_tools) — Application-layer API transaction analysis
- [Delayed Dissection](/en/mcp/delayed_dissection) — Analyze snapshots with L7 dissection
- [Wireshark TCP Analysis Reference](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html) — The upstream documentation these metrics are based on
