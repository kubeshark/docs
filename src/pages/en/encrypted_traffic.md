---
title: Decrypting TLS
description: Kubeshark captures TLS traffic in clear text using eBPF hooks — without requiring access to private keys or certificates.
layout: ../../layouts/MainLayout.astro
mascot:
---

Kubeshark captures TLS traffic in clear text by hooking into the cryptographic libraries used by applications — **without requiring access to private keys**. Using eBPF, it intercepts data after decryption (on read) and before encryption (on write), capturing the plain text directly from memory.

![eBPF TLS](/ebpf_tls.png)

---

## Supported Libraries

| Library | Languages / Runtimes | Requirement |
|---------|---------------------|-------------|
| [OpenSSL](https://www.openssl.org/) | Python, Java, PHP, Ruby, Node.js | Linked as shared library |
| [Go crypto/tls](https://pkg.go.dev/crypto/tls) | Go services | Non-stripped binaries |
| [BoringSSL](https://github.com/google/boringssl) | gRPC, Chrome, Envoy | Linked as shared library |

If your application uses one of these libraries for TLS termination, Kubeshark can display the traffic in clear text.

---

## How It Works

Kubeshark traces both kernel-space and user-space functions using [eBPF](https://prototype-kernel.readthedocs.io/en/latest/bpf/) (Extended Berkeley Packet Filter) — an in-kernel virtual machine that runs programs passed from user space.

### OpenSSL

Kubeshark attaches [uprobes](https://docs.kernel.org/trace/uprobetracer.html) to [`SSL_read`](https://www.openssl.org/docs/man1.1.1/man3/SSL_read.html) and [`SSL_write`](https://www.openssl.org/docs/man1.1.1/man3/SSL_write.html), capturing unencrypted data in any TLS/SSL connection. Languages like Python, Java, PHP, Ruby, and Node.js use the OpenSSL library, so any service using TLS via OpenSSL is covered.

### Go

Go has two ABIs (**ABI0** and **ABIInternal**), and Kubeshark supports both **amd64** and **arm64**. It probes [`crypto/tls.(*Conn).Read`](https://github.com/golang/go/blob/go1.17.6/src/crypto/tls/conn.go#L1263) and [`crypto/tls.(*Conn).Write`](https://github.com/golang/go/blob/go1.17.6/src/crypto/tls/conn.go#L1099), similar to OpenSSL's `SSL_read` and `SSL_write`. Additionally, it disassembles targeted Go binaries using Capstone to locate `ret` instruction offsets, as `uretprobe` does not work properly in Go due to its unique ABI. Goroutine IDs are tracked using offsets from the DWARF table.

### Kernel

[`kprobes`](https://www.kernel.org/doc/html/latest/trace/kprobes.html) are used on certain kernel tracepoints for address resolution (learning IP and port for source and destination) and matching request-response pairs.

### Performance

These methods have minimal performance impact due to the efficient eBPF in-kernel virtual machine. The Linux kernel limits the number of instructions allowed for probing, ensuring no significant slowdown or crash risk.

