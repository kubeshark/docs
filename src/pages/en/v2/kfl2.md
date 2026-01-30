---
title: Display Filters (KFL2)
description: Filter network traffic using the Kubeshark Filter Language 2 (KFL2), powered by CEL expressions.
layout: ../../../layouts/MainLayout.astro
---

**Kubeshark Filter Language 2 (KFL2)** is the display filter system introduced in V2.00. It uses [Common Expression Language (CEL)](https://github.com/google/cel-go) to provide powerful, flexible filtering of captured network traffic.

> Display filters only affect what is shown in the dashboard. They do not impact which traffic is captured. For controlling what traffic is captured, see [Capture Filters](/en/pod_targeting).

## Using Display Filters

Enter your KFL2 filter expression in the filter input box at the top of the dashboard:

![KFL2 Filter Input](/kfl2_filter_input.png)

### Building Filters with Click-to-Add

Every element visible in the dashboard has a green **+** button that can be clicked to automatically add filter expressions. This helps build complex filtering statements without typing.

![Click to Add Filter](/kfl2_click_to_add.png)

Clicking the **+** button next to any value adds the corresponding filter expression (e.g., `status_code == 200`) to the filter input.

Once a filter is applied, only traffic matching the filter statement flows from the distributed Workers to the Hub to the Dashboard, reducing noise and focusing on relevant traffic.

## Quick Examples

```cel
# HTTP GET requests with errors
http && method == "GET" && status_code >= 400

# Traffic to a specific namespace
dst.pod.namespace == "production"

# DNS queries for specific domains
dns && "google.com" in dns_questions

# Large HTTP responses
http && response_body_size > 10000
```

## Supported Variables

### Network-Level Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `src.ip` | string | Source IP address | `"192.168.1.1"` |
| `dst.ip` | string | Destination IP address | `"10.0.0.1"` |
| `src.port` | int | Source port number | `8080` |
| `dst.port` | int | Destination port number | `80` |
| `protocol` | string | Detected protocol type | `"HTTP"`, `"DNS"`, `"TCP"` |

### Kubernetes Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `src.pod.name` | string | Source pod name | `"web-server-123"` |
| `dst.pod.name` | string | Destination pod name | `"database-456"` |
| `src.pod.namespace` | string | Source pod namespace | `"production"` |
| `dst.pod.namespace` | string | Destination pod namespace | `"default"` |
| `src.service.name` | string | Source service name | `"web-service"` |
| `dst.service.name` | string | Destination service name | `"db-service"` |
| `src.service.namespace` | string | Source service namespace | `"production"` |
| `dst.service.namespace` | string | Destination service namespace | `"default"` |
| `namespaces` | list | All namespaces involved | `["production", "default"]` |
| `pods` | list | All pod names involved | `["web-server-123", "db-456"]` |
| `services` | list | All service names involved | `["web-service", "db-service"]` |
| `node_name` | string | Node name | `"ks-node-001"` |
| `node_ip` | string | Node IP address | `"10.0.0.12"` |

#### Labels and Annotations

| Variable | Type | Description |
|----------|------|-------------|
| `local_labels` | map | K8s labels of the local peer |
| `local_annotations` | map | K8s annotations of the local peer |
| `remote_labels` | map | K8s labels of the remote peer |
| `remote_annotations` | map | K8s annotations of the remote peer |
| `local_process_name` | string | Process name on the local peer |
| `remote_process_name` | string | Process name on the remote peer |

### Protocol Detection

Use these boolean variables to filter by protocol:

| Variable | Description |
|----------|-------------|
| `http` | HTTP traffic |
| `dns` | DNS traffic |
| `tls` | TLS traffic |
| `tcp` | TCP traffic |
| `udp` | UDP traffic |
| `ws` | WebSocket traffic |
| `redis` | Redis traffic |
| `kafka` | Kafka traffic |
| `ldap` | LDAP traffic |
| `amqp` | AMQP traffic |
| `radius` | RADIUS traffic |
| `diameter` | Diameter traffic |
| `sctp` | SCTP traffic |
| `icmp` | ICMP traffic |

### HTTP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `url` | string | Complete URL path |
| `method` | string | HTTP method (GET, POST, etc.) |
| `status_code` | int | Response status code |
| `http_version` | string | HTTP version |
| `path` | string | URL path component |
| `query_string` | map | URL query parameters |
| `request.headers` | map | Request headers |
| `response.headers` | map | Response headers |
| `request.cookies` | map | Request cookies |
| `response.cookies` | map | Response cookies |
| `request_body_size` | int | Request body size in bytes |
| `response_body_size` | int | Response body size in bytes |

### DNS Variables

| Variable | Type | Description |
|----------|------|-------------|
| `dns_questions` | list | DNS question names |
| `dns_answers` | list | DNS answer names |
| `dns_request` | bool | Is DNS request |
| `dns_response` | bool | Is DNS response |
| `dns_question_types` | list | DNS record types (A, AAAA, etc.) |

### TLS Variables

| Variable | Type | Description |
|----------|------|-------------|
| `tls_summary` | string | TLS handshake summary |
| `tls_info` | string | TLS connection details |
| `tls_request_size` | int | TLS request size in bytes |
| `tls_response_size` | int | TLS response size in bytes |

### Redis Variables

| Variable | Type | Description |
|----------|------|-------------|
| `redis_type` | string | Redis command verb (GET, SET, etc.) |
| `redis_command` | string | Full Redis command line |
| `redis_key` | string | The Redis key |
| `redis_request_size` | int | Request size in bytes |
| `redis_response_size` | int | Response size in bytes |

### Kafka Variables

| Variable | Type | Description |
|----------|------|-------------|
| `kafka_api_key` | int | Kafka API key number |
| `kafka_client_id` | string | Kafka client identifier |
| `kafka_size` | int | Message size |
| `kafka_request` | bool | Is Kafka request |
| `kafka_response` | bool | Is Kafka response |

### Timestamp Variables

| Variable | Type | Description |
|----------|------|-------------|
| `timestamp` | timestamp | Event time (UTC) |
| `elapsed_time` | int | Age since timestamp in microseconds |

## Filter Examples

### Basic Network Filtering

```cel
# Filter by destination port
dst.port == 80

# Filter by IP address prefix
src.ip.startsWith("192.168.")

# Filter by multiple ports
dst.port == 80 || dst.port == 443 || dst.port == 8080

# Port range
dst.port >= 8000 && dst.port <= 9000
```

### Kubernetes Filtering

```cel
# Traffic from a specific pod
src.pod.name == "web-server-123"

# Traffic to a specific namespace
dst.pod.namespace == "production"

# Inter-service communication
src.service.name == "api-gateway" && dst.service.name == "user-service"

# Traffic involving production namespace
"production" in namespaces

# Filter by pod labels
local_labels.app == "payments" || remote_labels.app == "payments"

# Filter by process name
local_process_name == "nginx"
```

### HTTP Filtering

```cel
# GET requests
http && method == "GET"

# API endpoints
http && url.contains("/api")

# Client errors (4xx)
http && status_code >= 400 && status_code < 500

# Server errors (5xx)
http && status_code >= 500

# Specific header present
http && "authorization" in request.headers

# Header value match
http && request.headers["content-type"] == "application/json"

# URL pattern matching
http && url.matches(".*/api/v[0-9]+/.*")

# Large responses
http && response_body_size > 1000000
```

### DNS Filtering

```cel
# DNS requests only
dns && dns_request

# Specific domain queries
dns && "google.com" in dns_questions

# DNS responses with answers
dns && dns_response && size(dns_answers) > 0
```

### Database Filtering

```cel
# Redis GET commands
redis && redis_type == "GET"

# Redis key pattern
redis && redis_key.startsWith("session:")

# Large Kafka messages
kafka && kafka_size > 10000

# Large Redis responses
redis && redis_response_size > 8192
```

### Complex Filters

```cel
# HTTP API requests from internal network
src.ip.startsWith("192.168.") && http && method == "POST" && url.contains("/api")

# Error conditions across protocols
http && status_code >= 500 || (tcp && tcp_error_type != "")

# Production namespace with HTTP errors
src.pod.namespace == "production" && http && status_code >= 400

# Cross-namespace communication
src.service.namespace != dst.service.namespace

# Time-based filtering
timestamp > timestamp("2024-11-14T22:00:00Z")

# Recent traffic (last 5 minutes)
elapsed_time <= 300000000
```

## CEL Language Reference

KFL2 uses [Common Expression Language (CEL)](https://github.com/google/cel-go) syntax.

### Operators

| Type | Operators |
|------|-----------|
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Logical | `&&`, `||`, `!` |
| Arithmetic | `+`, `-`, `*`, `/`, `%` |
| Membership | `in` |

### String Functions

| Function | Description |
|----------|-------------|
| `contains(substring)` | Check if string contains substring |
| `startsWith(prefix)` | Check if string starts with prefix |
| `endsWith(suffix)` | Check if string ends with suffix |
| `matches(regex)` | Match against regular expression |
| `size()` | Get string length |

### Collection Functions

| Function | Description |
|----------|-------------|
| `size(collection)` | Get collection size |
| `in` | Check membership (`"value" in list`) |
| `[index]` | Access element by index |
| `[key]` | Access map value by key |

### Examples

```cel
# String operations
url.contains("/api")
src.ip.startsWith("10.")
url.matches(".*\\.(jpg|png|gif)$")

# Collection operations
"production" in namespaces
size(dns_questions) > 1
request.headers["content-type"]

# Map key checking
"authorization" in request.headers
```

## Performance Tips

1. **Use protocol detection first** - More efficient to check `http &&` before checking HTTP-specific fields
2. **Port filtering is fast** - `dst.port == 80` is very efficient
3. **Prefer `startsWith`/`endsWith`** over `contains` for prefix/suffix matching
4. **Empty filters match all** - An empty filter string matches all traffic

## KFL2 vs Capture Filters

| Aspect | Display Filters (KFL2) | Capture Filters |
|--------|----------------------|-----------------|
| Purpose | Filter what is displayed | Filter what is captured |
| Impact | Dashboard view only | Resource consumption |
| Applied | After capture | Before capture |
| Syntax | CEL expressions | Helm values / Dashboard settings |

For those familiar with Wireshark, KFL2 is analogous to Wireshark's Display Filters, while [Capture Filters](/en/pod_targeting) are analogous to Wireshark's BPF filters.
