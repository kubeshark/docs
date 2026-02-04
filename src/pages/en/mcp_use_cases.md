---
title: AI Integration - Use Cases
description: Real-world scenarios where AI-powered network analysis with Kubeshark's MCP server delivers value.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

[Network traffic contains a wealth of information](/en/mcp_why)—API payloads, performance data, security signals, and infrastructure health. With Kubeshark's MCP server, you can query all of this using natural language.

Here are the key scenarios where AI-powered network analysis delivers value.

---

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/incident_investigation">Incident Investigation</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Debug production failures fast. Trace the exact request that caused an incident, find root causes, and build timelines—all by asking questions.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"The checkout flow started failing at 2:15 PM. Find what went wrong."</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/security_analysis">Security Analysis</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Find vulnerabilities, audit authentication, detect anomalies, and investigate suspicious activity in your network traffic.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"Find all API calls without Authorization headers."</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/architecture_discovery">Architecture Discovery</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Map actual service dependencies from real traffic. Discover how services communicate, find undocumented connections, and assess failure impact.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"What would break if redis-cache goes down?"</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/performance_debugging">Performance Debugging</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Find latency bottlenecks, identify slow dependencies, detect N+1 queries, and analyze performance patterns across thousands of requests.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"Why is the product listing page slow?"</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/compliance_auditing">Compliance & Auditing</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Generate audit reports, create evidence for investigations, trace data access patterns, and document compliance for PCI, HIPAA, SOC 2, and GDPR.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"Generate an audit trail for order ID 12345."</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/troubleshooting">Troubleshooting & Debugging</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Debug integration issues by seeing exactly what's on the wire. Verify headers, payloads, and responses. Find out why services aren't communicating.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"Show me what's actually in the HTTP request."</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/autonomous_development">Autonomous Development</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Close the dev-to-production loop. Deploy, test, and verify code with network-level feedback. AI finds issues and suggests fixes automatically.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"Deploy my changes and verify the caching works correctly."</em></p>
</div>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #f8fafc;">
<h3 style="margin: 0 0 0.5rem 0; color: #1e293b;"><a href="/en/mcp/onboarding">Onboarding & Learning</a></h3>
<p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.95rem;">Help new team members understand the system. Explore architecture, learn service behavior, and navigate the codebase using actual traffic patterns.</p>
<p style="margin: 0; font-size: 0.9rem; color: #64748b;"><em>"Give me an overview of how this system works."</em></p>
</div>

</div>

---

## See It in Action

For a complete walkthrough of AI-powered network analysis—from question to actionable insights—see [MCP in Action](/en/mcp_in_action).

---

## What's Next

- [Why Network Data Matters](/en/mcp_why) — Understand the value of network-level visibility
- [MCP in Action](/en/mcp_in_action) — Complete example with terminal mockup
- [How It Works](/en/mcp) — Technical details of the MCP protocol
