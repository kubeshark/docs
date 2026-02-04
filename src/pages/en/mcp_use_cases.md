---
title: MCP - Use Cases
description: Real-world scenarios where AI-powered network analysis with Kubeshark's MCP server delivers value.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark's MCP server enables AI assistants to access and analyze your Kubernetes network traffic. Here are the key scenarios where this capability delivers significant value.

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

## Troubleshooting & Debugging

Day-to-day debugging gets faster when you can ask questions instead of writing queries.

### The Problem

Developers spend significant time:
- Figuring out why their service isn't receiving expected requests
- Understanding what data another service is actually sending
- Debugging integration issues between services
- Verifying that their changes work correctly in the cluster

### How MCP Helps

Ask debugging questions naturally:

**Example prompts:**

> *"Is my user-service receiving requests from the API gateway? Show me the last 10 requests."*

> *"What exactly is the notification-service sending to the email-provider? Show me the request body."*

> *"The frontend says it's sending the right headers, but the backend disagrees. Show me what's actually in the HTTP request."*

> *"Find all 4xx errors returned by my service in the last 30 minutes. What requests caused them?"*

> *"My service calls the inventory API but gets empty responses. Show me the actual request and response."*

### What the AI Can Do

- Show actual request/response payloads
- Verify headers, query parameters, and body content
- Find errors and their corresponding requests
- Compare what's sent vs. what's received
- Filter traffic to/from specific pods or deployments
- Identify mismatches between expected and actual behavior

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

- [MCP Introduction](/en/mcp) — Learn what MCP is and how it works
- [Dashboard Overview](/en/ui) — Explore the Kubeshark interface
- [L7 API Dissection](/en/v2/l7_api_dissection) — Understand API traffic analysis
