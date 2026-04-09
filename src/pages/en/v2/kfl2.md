---
title: KFL Reference
description: Query network traffic using KFL (Kubeshark Filter Language), powered by CEL expressions.
layout: ../../../layouts/MainLayout.astro
---

**KFL (Kubeshark Filter Language)** is the query language used across Kubeshark — the dashboard, MCP, and API all return results matching KFL queries. It uses [Common Expression Language (CEL)](https://github.com/google/cel-go) to query traffic with Kubernetes, API, and network semantics.

> KFL queries affect what traffic is returned from the indexed database. They do not impact which traffic is captured. For controlling what traffic is captured, see [Capture Filters](/en/pod_targeting).

## Using KFL

In the dashboard, enter a KFL expression in the query input box:

![KFL Query Input](/kfl2_filter_input.png)

Every element visible in the dashboard has a green **+** button that can be clicked to automatically add query expressions — helping build complex queries without typing.

![Click to Add Query](/kfl2_click_to_add.png)

KFL queries also work via MCP (for AI agents) and the API, using the `kfl` parameter.

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

# Slow requests (over 5 seconds)
http && elapsed_time > 5000000

# Recent traffic (last 5 minutes)
timestamp > now() - duration("5m")
```

## Operators

| Category | Operators |
|----------|-----------|
| Comparison | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Logical | `&&`, `\|\|`, `!` |
| Arithmetic | `+`, `-`, `*`, `/`, `%` |
| Membership | `in` |
| Ternary | `condition ? true_val : false_val` |

## String Functions

| Function | Description |
|----------|-------------|
| `str.contains(substring)` | Substring search |
| `str.startsWith(prefix)` | Prefix match |
| `str.endsWith(suffix)` | Suffix match |
| `str.matches(regex)` | Regex match (RE2 syntax) |
| `size(str)` | String length |

## Collection Functions

| Function | Description |
|----------|-------------|
| `size(collection)` | List/map/string length |
| `key in map` | Key existence check |
| `map[key]` | Value access (errors if key missing) |
| `map_get(map, key, default)` | Safe access with default value |
| `value in list` | List membership |

## Time Functions

| Function | Description |
|----------|-------------|
| `timestamp("2026-03-14T22:00:00Z")` | Parse ISO timestamp |
| `duration("5m")` | Parse duration string |
| `now()` | Current time (snapshot at filter creation) |

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

| Variable | Type | Description |
|----------|------|-------------|
| `src.pod.name` | string | Source pod name |
| `dst.pod.name` | string | Destination pod name |
| `src.pod.namespace` | string | Source pod namespace |
| `dst.pod.namespace` | string | Destination pod namespace |
| `src.service.name` | string | Source service name |
| `dst.service.name` | string | Destination service name |
| `src.service.namespace` | string | Source service namespace |
| `dst.service.namespace` | string | Destination service namespace |
| `namespaces` | []string | All namespaces involved (src + dst) |
| `pods` | []string | All pod names involved (src + dst) |
| `services` | []string | All service names involved (src + dst) |
| `node_name` | string | Node name |
| `node_ip` | string | Node IP address |
| `local_node_name` | string | Node name of local peer |
| `remote_node_name` | string | Node name of remote peer |

Pod fields automatically fall back to service data when pod info is unavailable — `dst.pod.namespace` works even when only service-level resolution exists.

#### Labels and Annotations

| Variable | Type | Description |
|----------|------|-------------|
| `local_labels` | map | K8s labels of the local peer |
| `local_annotations` | map | K8s annotations of the local peer |
| `remote_labels` | map | K8s labels of the remote peer |
| `remote_annotations` | map | K8s annotations of the remote peer |
| `local_process_name` | string | Process name on the local peer |
| `remote_process_name` | string | Process name on the remote peer |

Always use `map_get()` for labels and annotations — direct access like `local_labels["app"]` errors if the key doesn't exist:

```cel
map_get(local_labels, "app", "") == "checkout"
map_get(remote_labels, "version", "") == "canary"
"tier" in local_labels
```

#### DNS Resolution

| Variable | Type | Description |
|----------|------|-------------|
| `src.dns` | string | DNS resolution of the source peer's IP |
| `dst.dns` | string | DNS resolution of the destination peer's IP |
| `dns_resolutions` | []string | All DNS resolutions from both peers (deduplicated) |

#### Resolution Status

| Variable | Type | Values |
|----------|------|--------|
| `local_resolution_status` | string | `""` (resolved), `"no_node_mapping"`, `"rpc_error"`, `"rpc_empty"`, `"cache_miss"`, `"queue_full"` |
| `remote_resolution_status` | string | Same as above |

### Protocol Detection

Boolean variables that indicate which protocol was detected. Use these as the first filter term for best performance.

| Variable | Protocol | Variable | Protocol |
|----------|----------|----------|----------|
| `http` | HTTP/1.1, HTTP/2 | `redis` | Redis |
| `dns` | DNS | `kafka` | Kafka |
| `tls` | TLS/SSL | `amqp` | AMQP |
| `tcp` | TCP | `ldap` | LDAP |
| `udp` | UDP | `ws` | WebSocket |
| `sctp` | SCTP | `gql` | GraphQL (v1 + v2) |
| `icmp` | ICMP | `gqlv1` / `gqlv2` | GraphQL version-specific |
| `radius` | RADIUS | `conn` / `flow` | L4 connection/flow tracking |
| `diameter` | Diameter | `tcp_conn` / `udp_conn` | Transport-specific connections |
| | | `tcp_flow` / `udp_flow` | Transport-specific flows |

### Identity and Metadata Variables

| Variable | Type | Description |
|----------|------|-------------|
| `id` | int | BaseEntry unique identifier |
| `node_id` | string | Node identifier (assigned by hub) |
| `index` | int | Entry index for stream uniqueness |
| `stream` | string | Stream identifier (hex string) |
| `timestamp` | timestamp | Event time (UTC), use with `timestamp()` function |
| `elapsed_time` | int | Age since timestamp in microseconds |
| `worker` | string | Worker identifier |

### Cross-Reference Variables

| Variable | Type | Description |
|----------|------|-------------|
| `conn_id` | int | L7 to L4 connection cross-reference ID |
| `flow_id` | int | L7 to L4 flow cross-reference ID |
| `has_pcap` | bool | Whether PCAP data is available for this entry |

### Capture Source Variables

| Variable | Type | Description | Values |
|----------|------|-------------|--------|
| `capture_source` | string | Canonical capture source | `"unspecified"`, `"af_packet"`, `"ebpf"`, `"ebpf_tls"` |
| `capture_backend` | string | Backend family | `"af_packet"`, `"ebpf"` |
| `capture_source_code` | int | Numeric enum | 0=unspecified, 1=af_packet, 2=ebpf, 3=ebpf_tls |

### HTTP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `method` | string | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `url` | string | Full URL path and query string |
| `path` | string | URL path component (no query) |
| `status_code` | int | HTTP response status code |
| `http_version` | string | HTTP version |
| `query_string` | map | URL query parameters |
| `request.headers` | map | Request headers |
| `response.headers` | map | Response headers |
| `request.cookies` | map | Request cookies |
| `response.cookies` | map | Response cookies |
| `request_headers_size` | int | Request headers size in bytes |
| `request_body_size` | int | Request body size in bytes |
| `response_headers_size` | int | Response headers size in bytes |
| `response_body_size` | int | Response body size in bytes |

GraphQL requests have `gql` (or `gqlv1`/`gqlv2`) set to true and all HTTP variables available.

### DNS Variables

| Variable | Type | Description |
|----------|------|-------------|
| `dns_questions` | []string | DNS question domain names |
| `dns_answers` | []string | DNS answer domain names |
| `dns_question_types` | []string | Record types (A, AAAA, CNAME, MX, TXT, SRV, PTR) |
| `dns_request` | bool | Is DNS request |
| `dns_response` | bool | Is DNS response |
| `dns_request_length` | int | DNS request size in bytes |
| `dns_response_length` | int | DNS response size in bytes |
| `dns_total_size` | int | Sum of request + response sizes |

### TLS Variables

| Variable | Type | Description |
|----------|------|-------------|
| `tls_summary` | string | TLS handshake summary |
| `tls_info` | string | TLS connection details |
| `tls_request_size` | int | TLS request size in bytes |
| `tls_response_size` | int | TLS response size in bytes |
| `tls_total_size` | int | Sum of request + response sizes |

### TCP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `tcp_method` | string | TCP method information |
| `tcp_payload` | bytes | Raw TCP payload data |
| `tcp_error_type` | string | TCP error type (empty if none) |
| `tcp_error_message` | string | TCP error message (empty if none) |

### UDP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `udp_length` | int | UDP packet length |
| `udp_checksum` | int | UDP checksum value |
| `udp_payload` | bytes | Raw UDP payload data |

### SCTP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `sctp_checksum` | int | SCTP checksum value |
| `sctp_chunk_type` | string | SCTP chunk type |
| `sctp_length` | int | SCTP chunk length |

### ICMP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `icmp_type` | string | ICMP type code |
| `icmp_version` | int | ICMP version (4 or 6) |
| `icmp_length` | int | ICMP message length |

### WebSocket Variables

| Variable | Type | Description |
|----------|------|-------------|
| `ws_opcode` | string | Operation code: `"text"`, `"binary"`, `"close"`, `"ping"`, `"pong"` |
| `ws_request` | bool | Is WebSocket request |
| `ws_response` | bool | Is WebSocket response |
| `ws_request_payload_data` | string | Request payload (safely truncated) |
| `ws_request_payload_length` | int | Request payload length in bytes |
| `ws_response_payload_length` | int | Response payload length in bytes |

### Redis Variables

| Variable | Type | Description |
|----------|------|-------------|
| `redis_type` | string | Redis command verb (GET, SET, DEL, HGET) |
| `redis_command` | string | Full Redis command line |
| `redis_key` | string | The Redis key (truncated to 64 bytes) |
| `redis_request_size` | int | Request size in bytes |
| `redis_response_size` | int | Response size in bytes |
| `redis_total_size` | int | Sum of request + response sizes |

### Kafka Variables

| Variable | Type | Description |
|----------|------|-------------|
| `kafka_api_key` | int | Kafka API key number |
| `kafka_api_key_name` | string | Human-readable API operation (PRODUCE, FETCH) |
| `kafka_client_id` | string | Kafka client identifier |
| `kafka_size` | int | Message size |
| `kafka_request` | bool | Is Kafka request |
| `kafka_response` | bool | Is Kafka response |
| `kafka_request_summary` | string | Request summary/topic |
| `kafka_request_size` | int | Request size in bytes |
| `kafka_response_size` | int | Response size in bytes |

### AMQP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `amqp_method` | string | AMQP method name (`"basic.publish"`, `"channel.open"`) |
| `amqp_summary` | string | Operation summary |
| `amqp_request` | bool | Is AMQP request |
| `amqp_response` | bool | Is AMQP response |
| `amqp_request_length` | int | Request length in bytes |
| `amqp_response_length` | int | Response length in bytes |
| `amqp_total_size` | int | Sum of request + response sizes |

### LDAP Variables

| Variable | Type | Description |
|----------|------|-------------|
| `ldap_type` | string | LDAP operation type |
| `ldap_summary` | string | Operation summary |
| `ldap_request` | bool | Is LDAP request |
| `ldap_response` | bool | Is LDAP response |
| `ldap_request_length` | int | Request length in bytes |
| `ldap_response_length` | int | Response length in bytes |
| `ldap_total_size` | int | Sum of request + response sizes |

### RADIUS Variables

| Variable | Type | Description |
|----------|------|-------------|
| `radius_code` | int | RADIUS code |
| `radius_code_name` | string | Code name (`"Access-Request"`) |
| `radius_request` | bool | Is RADIUS request |
| `radius_response` | bool | Is RADIUS response |
| `radius_request_authenticator` | string | Request authenticator (hex) |
| `radius_request_length` | int | Request size in bytes |
| `radius_response_length` | int | Response size in bytes |
| `radius_total_size` | int | Sum of request + response sizes |

### Diameter Variables

| Variable | Type | Description |
|----------|------|-------------|
| `diameter_method` | string | Method name |
| `diameter_summary` | string | Operation summary |
| `diameter_request` | bool | Is Diameter request |
| `diameter_response` | bool | Is Diameter response |
| `diameter_request_length` | int | Request size in bytes |
| `diameter_response_length` | int | Response size in bytes |
| `diameter_total_size` | int | Sum of request + response sizes |

### L4 Connection Tracking Variables

| Variable | Type | Description |
|----------|------|-------------|
| `conn` | bool | Connection tracking entry |
| `conn_state` | string | Connection state: `"open"`, `"in_progress"`, `"closed"` |
| `conn_local_pkts` | int | Packets from local peer |
| `conn_local_bytes` | int | Bytes from local peer |
| `conn_remote_pkts` | int | Packets from remote peer |
| `conn_remote_bytes` | int | Bytes from remote peer |
| `conn_l7_detected` | []string | L7 protocols detected on connection |
| `conn_group_id` | int | Connection group identifier |

Use `tcp_conn` or `udp_conn` to filter by transport protocol.

```cel
conn && conn_state == "open" && conn_local_bytes > 1000000
tcp_conn && "HTTP" in conn_l7_detected
```

### L4 Flow Tracking Variables

Flows extend connections with rate metrics (packets/bytes per second).

| Variable | Type | Description |
|----------|------|-------------|
| `flow` | bool | Flow tracking entry |
| `flow_state` | string | Flow state: `"open"`, `"in_progress"`, `"closed"` |
| `flow_local_pkts` | int | Packets from local peer |
| `flow_local_bytes` | int | Bytes from local peer |
| `flow_remote_pkts` | int | Packets from remote peer |
| `flow_remote_bytes` | int | Bytes from remote peer |
| `flow_local_pps` | int | Local packets per second |
| `flow_local_bps` | int | Local bytes per second |
| `flow_remote_pps` | int | Remote packets per second |
| `flow_remote_bps` | int | Remote bytes per second |
| `flow_l7_detected` | []string | L7 protocols detected on flow |
| `flow_group_id` | int | Flow group identifier |

Use `tcp_flow` or `udp_flow` to filter by transport protocol.

```cel
flow && flow_local_pps > 1000
tcp_flow && flow_local_bps > 5000000
```

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

# Filter by pod labels (safe access)
map_get(local_labels, "app", "") == "payments"

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

# Slow requests (over 5 seconds)
http && elapsed_time > 5000000

# GraphQL errors
gql && status_code >= 400
```

### DNS Filtering

```cel
# DNS requests only
dns && dns_request

# Specific domain queries
dns && "google.com" in dns_questions

# Failed DNS lookups
dns && dns_response && status_code != 0

# A record queries
dns && "A" in dns_question_types

# DNS responses with answers
dns && dns_response && size(dns_answers) > 0
```

### DNS Resolution Filtering

Use `src.dns` and `dst.dns` to filter traffic by the resolved DNS name of a peer's IP address. This works on any protocol, not just DNS traffic.

```cel
# Traffic to a specific external domain
dst.dns == "db.example.com"

# Traffic involving a domain (either direction)
src.dns.contains("example.com") || dst.dns.contains("example.com")

# Check if any peer resolved to a domain
"db.example.com" in dns_resolutions

# External traffic (resolved DNS, not internal)
dst.dns != "" && !dst.dns.endsWith(".internal")
```

### Database and Messaging Filtering

```cel
# Redis GET commands
redis && redis_type == "GET"

# Redis key pattern
redis && redis_key.startsWith("session:")

# Kafka produce operations
kafka && kafka_api_key_name == "PRODUCE"

# Kafka topic filtering
kafka && kafka_request_summary.contains("orders")

# Large Kafka messages
kafka && kafka_size > 10000

# AMQP publish
amqp && amqp_method == "basic.publish"

# LDAP bind requests
ldap && ldap_type == "bind"

# RADIUS auth
radius && radius_code_name == "Access-Request"
```

### Transport and Connection Filtering

```cel
# TCP errors
tcp && tcp_error_type != ""

# Open connections with high volume
conn && conn_state == "open" && conn_local_bytes > 1000000

# High packet-rate flows
flow && flow_local_pps > 1000

# High-bandwidth TCP flows
tcp_flow && flow_local_bps > 5000000

# Connections with detected L7 protocols
conn && "HTTP" in conn_l7_detected
```

### Negation

```cel
# Everything that is NOT HTTP
!http

# HTTP responses that aren't 200
http && status_code != 200

# Exclude health checks
http && !path.contains("/health")

# Exclude system namespace
!(src.pod.namespace == "kube-system")
```

### Time-Based Filtering

```cel
# After a specific time
timestamp > timestamp("2026-03-14T22:00:00Z")

# Time range
timestamp >= timestamp("2026-03-14T22:00:00Z") && timestamp <= timestamp("2026-03-14T23:00:00Z")

# Last 5 minutes
timestamp > now() - duration("5m")
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

# Filter by capture source
capture_source == "ebpf_tls"
```

## Type Safety

KFL is statically typed. Common gotchas:

- `status_code` is `int`, not string — use `status_code == 200`, not `"200"`
- `elapsed_time` is in **microseconds** — 5 seconds = `5000000`
- `timestamp` requires the `timestamp()` function — not a raw string
- Map access on missing keys errors — use `key in map` or `map_get()` first
- List membership uses `value in list` — not `list.contains(value)`

## Default Values

When a variable is not present in an entry, KFL uses these defaults:

| Type | Default |
|------|---------|
| string | `""` |
| int | `0` |
| bool | `false` |
| list | `[]` |
| map | `{}` |
| bytes | `[]` |

## Performance Tips

1. **Protocol flags first** — `http && ...` is faster than `... && http`
2. **`startsWith`/`endsWith` over `contains`** — prefix/suffix checks are faster
3. **Specific ports before string ops** — `dst.port == 80` is cheaper than `url.contains(...)`
4. **Use `map_get` for labels** — avoids errors on missing keys
5. **Keep filters simple** — CEL short-circuits on `&&`, so put cheap checks first
6. **Empty filters match all** — an empty filter string matches all traffic

## KFL vs Capture Filters

| Aspect | KFL Queries | Capture Filters |
|--------|------------|-----------------|
| Purpose | Query indexed traffic | Control what is captured |
| Impact | Dashboard, MCP, API | Resource consumption |
| Applied | After indexing | Before capture |
| Syntax | CEL expressions | Helm values / Dashboard settings |

For those familiar with Wireshark: KFL is analogous to Wireshark's display filters, while [Capture Filters](/en/pod_targeting) are analogous to Wireshark's BPF filters.
