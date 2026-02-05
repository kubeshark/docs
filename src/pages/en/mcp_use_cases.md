---
title: AI Integration - Introduction
description: AI-powered network analysis with Kubeshark's MCP server transforms how teams debug, secure, and optimize Kubernetes applications.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Network traffic is the **ground truth** of what happens in your Kubernetes cluster. [It contains everything](/en/why_network_data)—API payloads, performance data, security signals, and infrastructure health. Kubeshark captures and enriches this data with full Kubernetes context.

But [accessing this data effectively](/en/why_network_data#the-accessibility-challenge) has traditionally required deep expertise and complex tools. AI changes that.

---

## The Opportunity: AI-Powered Analysis

What if you could simply *ask questions* about your network traffic?

> *"What API calls failed in the last hour and why?"*

> *"Show me the exact request that caused the payment service to return a 500 error."*

> *"Which services are communicating without authentication?"*

> *"Compare today's latency patterns with yesterday—what changed?"*

This is what Kubeshark's MCP integration enables. By connecting AI assistants to your network data, complex analysis becomes a conversation.

---

## How It Works

Kubeshark exposes network data through the **Model Context Protocol (MCP)**—an open standard for connecting AI assistants to external data sources.

```
+------------------+                     +------------------+
|                  |    MCP Protocol     |                  |
|  AI Assistant    | <-----------------> |    Kubeshark     |
|  (Claude, etc.)  |                     |                  |
|                  |                     |                  |
+------------------+                     +--------+---------+
                                                  |
                                                  v
                                         +------------------+
                                         |   Kubernetes     |
                                         |  Network Data    |
                                         |  (L4/L7, PCAP)   |
                                         +------------------+
```

The AI assistant can:
- Query L7 API transactions with natural language
- Filter traffic by service, namespace, status code, latency
- Analyze patterns across thousands of requests
- Create snapshots and export PCAP files
- Control Kubeshark (start, stop, configure)

---

## What Makes This Powerful

### Natural Language Queries

No need to learn query syntax. Just ask:

| Instead of... | Just ask... |
|---------------|-------------|
| Writing KFL filters | "Show me failed requests to the payment service" |
| Correlating timestamps | "What happened in the 5 minutes before the crash?" |
| Manual traffic analysis | "Which endpoints are slowest?" |
| Reading packet captures | "What's in the request body?" |

### AI-Driven Investigation

The AI doesn't just fetch data—it analyzes it:

- Identifies patterns across requests
- Correlates errors with their causes
- Suggests root causes based on evidence
- Compares current behavior with baselines

### Full Context

Because Kubeshark provides [complete Kubernetes context](/en/why_network_data#how-kubeshark-bridges-the-gap), the AI understands:

- Which pods and services are involved
- The full request/response payloads
- Timing and latency data
- The relationship between calls

---

## Use Cases

Here are the key scenarios where AI-powered network analysis delivers value.

<nav style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.5rem; margin: 1.5rem 0;">

**On this page:**

- [Incident Investigation & Root Cause Analysis](#incident-investigation--root-cause-analysis)
- [Security Analysis & Threat Detection](#security-analysis--threat-detection)
- [Architecture Discovery & Service Mapping](#architecture-discovery--service-mapping)
- [Performance Debugging](#performance-debugging)
- [Network Health Analysis](#network-health-analysis)
- [Compliance & Auditing](#compliance--auditing)
- [Onboarding & Learning](#onboarding--learning)

**Deep dives:**

- [Conversational Debugging](/en/mcp/troubleshooting)
- [Autonomous Development & Testing](/en/mcp/autonomous_development)

</nav>

---

## Incident Investigation & Root Cause Analysis

When production breaks, time is critical. Instead of manually sifting through logs and dashboards, ask the AI to investigate.

### The Problem

Traditional incident response involves:
- Jumping between multiple tools (logs, metrics, traces)
- Writing ad-hoc queries to find relevant data
- Manually correlating timestamps across systems
- Deep expertise in protocols and Kubernetes internals

### How MCP Helps

With Kubeshark's MCP server, you can describe the problem in natural language and let the AI do the investigation:

**Example prompts:**

> *"The checkout flow started failing at 2:15 PM. Find all API calls to payment-related services in that timeframe and identify what went wrong."*

> *"Users are reporting 504 errors on the /api/orders endpoint. Trace the request path and find where the timeout is occurring."*

> *"Pod order-service-abc123 crashed 10 minutes ago. Show me its network activity in the 2 minutes before the crash—what external calls was it making?"*

### What the AI Can Do

- Query traffic history for specific time windows
- Filter by service, endpoint, status code, or error type
- Trace request chains across multiple services
- Correlate network errors with application failures
- Identify the exact request/response that caused the issue
- Compare current traffic patterns with historical baselines

---

## Security Analysis & Threat Detection

Network traffic reveals security issues that application logs miss. Use AI to continuously monitor for threats and investigate suspicious activity.

### The Problem

Security teams face challenges like:
- Detecting data exfiltration through legitimate-looking API calls
- Identifying lateral movement between services
- Finding services communicating without proper authentication
- Spotting unusual traffic patterns that indicate compromise

### How MCP Helps

Ask security-focused questions about your network traffic:

**Example prompts:**

> *"Are any pods making outbound connections to external IPs that aren't in our allowed list?"*

> *"Find all API calls in the last hour that don't have Authorization headers but should."*

> *"Which internal services are accessible from the public-facing namespace? Show me the actual traffic."*

> *"Analyze traffic patterns for the user-service. Is there anything unusual compared to its normal behavior?"*

> *"Find any instances of sensitive data (credit card patterns, SSNs, API keys) appearing in request or response bodies."*

### What the AI Can Do

- Audit authentication headers across all API calls
- Identify unexpected egress traffic
- Detect unusual traffic volumes or patterns
- Find services communicating outside their normal dependencies
- Search payloads for sensitive data patterns
- Map attack surfaces by showing all ingress points

---

## Architecture Discovery & Service Mapping

Understanding how services actually communicate—not how they're supposed to—is essential for debugging, planning, and security.

### The Problem

Documentation gets stale. Teams change. New services get deployed. Before long, nobody fully understands:
- Which services depend on which
- What APIs are actually being called
- How traffic flows through the system
- What would break if a service goes down

### How MCP Helps

Ask the AI to map your actual runtime architecture:

**Example prompts:**

> *"Map out all the services that communicate with the inventory-service. What calls it, and what does it call?"*

> *"Show me the complete request flow when a user places an order—every service-to-service call from start to finish."*

> *"Which services would be affected if the redis-cache pod becomes unavailable?"*

> *"What external APIs does our cluster call? Group them by destination domain."*

> *"Find all services that talk to the database directly instead of going through the data-access-layer."*

### What the AI Can Do

- Build service dependency graphs from actual traffic
- Identify all consumers of a specific service
- Trace end-to-end request flows
- Discover undocumented service dependencies
- Find services bypassing intended architecture patterns
- Quantify traffic volumes between services

---

## Performance Debugging

Latency issues are notoriously hard to debug in distributed systems. AI can analyze timing data across thousands of requests to find patterns.

### The Problem

When users report slowness:
- It's hard to know which service is the bottleneck
- Latency can be intermittent and hard to reproduce
- Multiple services might each add small delays that compound
- Database queries or external API calls might be the real culprit

### How MCP Helps

Ask performance-focused questions:

**Example prompts:**

> *"The /api/checkout endpoint is slow. Break down where time is being spent across the request chain."*

> *"Find API calls with response times over 500ms in the last hour. Which services and endpoints are slowest?"*

> *"Compare response times for the product-service today vs. yesterday. What changed?"*

> *"Is there a correlation between request payload size and latency for the upload endpoint?"*

> *"Which database queries (calls to postgres service) are taking more than 100ms?"*

### What the AI Can Do

- Analyze latency distributions across endpoints
- Identify slow downstream dependencies
- Find requests with unusually high response times
- Compare performance across time periods
- Correlate latency with request characteristics
- Trace slow requests through the full call chain

---

## Network Health Analysis

TCP handshake timing reveals network-level health issues that application metrics miss. Kubeshark captures TCP 3-way handshake completion times, giving you visibility into network latency and congestion.

### The Problem

Network issues can masquerade as application problems:
- Slow connections blamed on application code
- Intermittent timeouts with no clear cause
- Cross-AZ or cross-region latency affecting specific flows
- Network congestion during peak traffic

### How MCP Helps

Use the `list_l4_flows` tool to analyze TCP handshake RTT metrics:

**Example prompts:**

> *"Show me TCP flows with handshake times over 10ms. Which connections are experiencing network latency?"*

> *"Compare TCP handshake times for connections to the database service across different source pods. Is latency consistent?"*

> *"Find all cross-namespace TCP flows and check their handshake RTT. Are there network bottlenecks between namespaces?"*

> *"What's the P99 TCP handshake time for connections to external services? Is our egress path healthy?"*

> *"Identify pods with elevated TCP handshake times. Are they on specific nodes?"*

### Understanding TCP Handshake RTT

The `tcp_handshake_p50/p90/p99_us` fields measure the time (in microseconds) for the TCP 3-way handshake to complete:

- **Client side**: Time from sending SYN to receiving SYN-ACK
- **Server side**: Time from receiving SYN to receiving ACK

| Handshake Time | Interpretation |
|----------------|----------------|
| < 1ms | Excellent — same-node or same-datacenter |
| 1-10ms | Good — typical cross-node within cluster |
| 10-100ms | Elevated — possible congestion or cross-AZ |
| > 100ms | High latency — cross-region or network issues |

### What the AI Can Do

- Identify connections with abnormal TCP handshake times
- Correlate network latency with specific nodes or availability zones
- Detect network congestion patterns during traffic spikes
- Compare handshake times across different traffic paths
- Find workloads affected by network-level issues

---

## Compliance & Auditing

Regulated industries need evidence of what happened, when, and to what data. Network traffic provides an immutable audit trail.

### The Problem

Compliance requirements often demand:
- Complete records of data access
- Evidence for security incident investigations
- Audit trails for specific transactions
- Proof of data handling practices

### How MCP Helps

Ask the AI to gather evidence and create reports:

**Example prompts:**

> *"Create a report of all API calls that accessed customer PII in the last 24 hours. Include source, destination, and timestamps."*

> *"Export all traffic to/from the payment-gateway namespace between 3 PM and 4 PM yesterday as evidence for the security team."*

> *"Which services accessed the user-database service during the reported breach window? List every call with full details."*

> *"Generate an audit trail for order ID 12345—every API call involved in processing that order."*

> *"Find all external API calls made by our cluster in the last week. We need this for the vendor access review."*

### What the AI Can Do

- Query traffic for specific compliance scopes (PCI, HIPAA namespaces)
- Create point-in-time traffic snapshots
- Export PCAP files with full Kubernetes context
- Generate summary reports of data access patterns
- Trace specific transactions across all services
- Identify all external data flows

---

## Conversational Debugging

Day-to-day debugging gets faster when you can ask questions instead of writing queries. See exactly what's on the wire—request payloads, response bodies, headers, and timing.

[**Read more → Conversational Debugging**](/en/mcp/troubleshooting)

---

## Autonomous Development & Testing

Close the dev-to-production feedback loop. Use AI to deploy, test, and verify code in your local Kubernetes cluster—with network-level insights that catch issues unit tests miss.

[**Read more → Autonomous Development & Testing**](/en/mcp/autonomous_development)

---

## Onboarding & Learning

New team members can use AI to explore and understand the system without requiring deep expertise.

### The Problem

Onboarding to a complex microservices system is overwhelming:
- Documentation may be incomplete or outdated
- Understanding traffic patterns requires tribal knowledge
- Learning the query languages and tools takes time
- Asking senior engineers for every question isn't scalable

### How MCP Helps

New team members can ask exploratory questions:

**Example prompts:**

> *"Give me an overview of this cluster's architecture based on actual traffic patterns."*

> *"What are the most heavily used APIs in the system?"*

> *"Explain what the order-processing-service does based on its network traffic."*

> *"What protocols are used in this cluster? Show me examples of each."*

> *"I'm new to this codebase. What services does the team I'm joining own, and how do they communicate?"*

### What the AI Can Do

- Generate architecture overviews from traffic
- Identify the most active services and endpoints
- Explain service behavior based on network patterns
- Show examples of different protocol usage
- Help navigate the system without prior knowledge

---

## What's Next

- [How MCP Works](/en/mcp) — Technical details on the protocol
- [MCP CLI](/en/mcp/cli) — Run MCP from the command line
- [Why Network Data Matters](/en/why_network_data) — Deep dive into network visibility
