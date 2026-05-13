---
title: TLS Handshake Inspection
description: Inspect TLS ClientHello and ServerHello handshakes across your cluster for security auditing, egress monitoring, and troubleshooting.
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

Kubeshark's TLS handshake dissector (`tlsx`) captures and displays TLS ClientHello and ServerHello messages from every connection in your cluster. Because the TLS handshake is unencrypted by design, this works **without any eBPF TLS hooks or decryption** — it simply reads the plaintext handshake bytes from the wire.

This is different from [TLS Decryption](/en/encrypted_traffic), which decrypts the application data inside the encrypted tunnel. Handshake inspection shows the negotiation metadata: who is connecting where, which TLS version and cipher suite are being used, and what the client advertises.

<!-- TODO: Add screenshot of TLS entries in the traffic list showing ClientHello and ServerHello -->

## What You Can See

Every TLS connection begins with a handshake. Kubeshark captures both sides:

**ClientHello** — what the client offers:
- **SNI** (Server Name Indication) — the hostname the client is connecting to
- **Cipher suites** — the list of encryption algorithms the client supports
- **ALPN** — application-layer protocol negotiation (e.g., `h2`, `http/1.1`)
- **TLS version** — the maximum version the client supports
- **Extensions** — all TLS extensions present
- **JA3 fingerprint** — a standard hash that uniquely identifies the client's TLS stack

**ServerHello** — what the server negotiated:
- **Cipher suite** — the encryption algorithm selected by the server
- **Negotiated version** — the TLS version both sides agreed on
- **ALPN protocol** — the selected application protocol
- **JA3S fingerprint** — a standard hash that uniquely identifies the server's TLS response

<!-- TODO: Add screenshot of the DATA tab showing ClientHello and ServerHello details -->

## Security Auditing

The dissector includes a built-in security assessment that flags insecure configurations:

- **Deprecated TLS versions** — SSL 3.0, TLS 1.0, and TLS 1.1 are flagged per RFC 8996
- **Weak cipher suites** — RC4, DES, NULL, EXPORT, and anonymous ciphers are flagged

When a ServerHello negotiates an insecure configuration, a **Security** section appears in the entry details with specific warnings.

## Egress Monitoring via SNI

The SNI field in ClientHello reveals what external hostnames your pods are connecting to — without decrypting any traffic. This is valuable for:

- Detecting unexpected outbound connections to unknown domains
- Verifying that workloads only connect to approved external services
- Monitoring egress patterns across namespaces

<div class="callout callout-tip">
SNI is set when clients connect using a hostname. Internal Kubernetes traffic that connects by ClusterIP typically does not include SNI. For internal east-west visibility, use <a href="/en/encrypted_traffic">TLS Decryption</a> instead.
</div>

## JA3 Fingerprinting

[JA3](https://github.com/salesforce/ja3) is an industry-standard method for fingerprinting TLS clients and servers. Kubeshark computes JA3 (from ClientHello) and JA3S (from ServerHello) automatically.

JA3 fingerprints are useful for:

- **Threat detection** — known malware families have well-documented JA3 hashes
- **Client identification** — different applications produce different JA3 hashes, even when connecting to the same server
- **Anomaly detection** — unexpected JA3 hashes in a namespace may indicate a compromised workload

## Filtering TLS Handshake Entries

Use `tlsx` in the KFL filter box to see all TLS handshake entries:

```
tlsx
```

Combine with other fields for targeted analysis:

```
tlsx && src.pod.namespace == "production"
```

```
tlsx && tls_sni.contains("amazonaws.com")
```

```
tlsx && tls_version < 771
```

### Available KFL Variables

| Variable | Type | Description |
|----------|------|-------------|
| `tlsx` | bool | TLS handshake entry (ClientHello or ServerHello) |
| `tls_sni` | string | Server Name Indication hostname |
| `tls_cipher_suite` | int | Negotiated cipher suite ID (from ServerHello) |
| `tls_cipher_suites` | []string | Offered cipher suite names (from ClientHello) |
| `tls_alpn` | string | Negotiated ALPN protocol |
| `tls_version` | int | Negotiated TLS version (772 = TLS 1.3, 771 = TLS 1.2) |
| `tls_summary` | string | Entry summary (SNI, ALPN, or cipher suite name) |
| `tls_info` | string | Entry method (`ClientHello` or `ServerHello`) |

<div class="callout callout-tip">
The <code>tls</code> filter (without the <code>x</code>) is different — it matches traffic captured via eBPF TLS interception (decrypted HTTPS, Redis, etc.). Use <code>tlsx</code> for TLS handshake entries.
</div>

## How It Works

The TLS handshake happens in plaintext before the encrypted tunnel is established. Kubeshark's worker captures these packets via AF_PACKET or eBPF and parses the ClientHello and ServerHello messages according to the TLS specification (RFC 5246, RFC 8446).

No special configuration is needed — handshake inspection is enabled by default whenever Kubeshark is running.
