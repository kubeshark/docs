---
title: Decrypting TLS
description: In certain situations, Kubeshark can sniff the encrypted traffic (TLS) in your cluster using eBPF without actually doing decryption.
layout: ../../layouts/MainLayout.astro
mascot:
---

[Kubeshark](https://kubeshark.com) can display [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) traffic in clear text for `non-stripped` applications when using [OpenSSL](https://www.openssl.org/), Go's [crypto/tls](https://pkg.go.dev/crypto/tls) package, or Google's [BoringSSL](https://github.com/google/boringssl) as the TLS termination, provided they are utilized as shared libraries. When TLS termination is detected via one of these libraries, the entire message is reassembled into a request-response pair, similar to HTTP, allowing you to view encrypted traffic in clear text.

![eBPF TLS](/ebpf_tls.png)

## TL;DR - Use of eBPF

[Kubeshark](https://kubeshark.com) traces both kernel-space and user-space functions using [eBPF](https://prototype-kernel.readthedocs.io/en/latest/bpf/) (Extended Berkeley Packet Filter). eBPF is an in-kernel virtual machine that runs programs passed from user space. First introduced in Linux kernel version 4.4, it has since matured significantly.

#### OpenSSL

[Kubeshark](https://kubeshark.com) attaches [uprobes](https://docs.kernel.org/trace/uprobetracer.html) to [`SSL_read`](https://www.openssl.org/docs/man1.1.1/man3/SSL_read.html) and [`SSL_write`](https://www.openssl.org/docs/man1.1.1/man3/SSL_write.html), capturing unencrypted incoming responses and outgoing encrypted requests in any TLS/SSL connection.

Languages like Python, Java, PHP, Ruby, and Node.js use the OpenSSL library for encryption/decryption tasks, so any program or service using TLS for encrypted communication falls into this category.

#### Go

Go's encryption process is a bit more complex than OpenSSL, but the underlying principle is similar.

Go has two ABIs: **ABI0** and **ABIInternal**, and [Kubeshark](https://kubeshark.com) supports both **amd64** and **arm64**, which translates into a significant number of offsets to handle.

We probe [`crypto/tls.(*Conn).Read`](https://github.com/golang/go/blob/go1.17.6/src/crypto/tls/conn.go#L1263) and [`crypto/tls.(*Conn).Write`](https://github.com/golang/go/blob/go1.17.6/src/crypto/tls/conn.go#L1099), much like OpenSSL's `SSL_read` and `SSL_write`. Additionally, we disassemble targeted Go binaries using Capstone to locate the offsets of `ret` instructions, as `uretprobe` does not work properly in Go due to its unique ABI.

Finally, we track the Goroutine ID using offsets identified in the DWARF table.

#### Kernel

We use [`kprobes`](https://www.kernel.org/doc/html/latest/trace/kprobes.html) on certain kernel tracepoints to perform tasks such as address resolution (learning the IP and port for both source and destination) and matching request-response pairs.

While these methods may sound complex, **Kubeshark's** TLS sniffer has minimal performance impact due to the efficient eBPF in-kernel virtual machine and our carefully written C code. Furthermore, the Linux kernel limits the number of instructions allowed for probing purposes, ensuring there is no significant slowdown or crash risk.

## TLS Capture in Action

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/18d9f744402a4b37b1e14c8fd7401aab?sid=0e136344-33af-4739-9899-c41ec0ca0de9" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>


## Detecting Encrypted Traffic

Before attempting to display encrypted traffic in clear text, [Kubeshark](https://kubeshark.com) detects and marks TLS TCP packets, identifying various TLS-related messages (e.g., `ClientHello` and `ServerHello`).

> TLS traffic is marked with an open lock icon to the left of the entry. You can use `tls` as a [KFL2](/en/v2/kfl2) query to filter and view all TLS traffic.

![TLS Traffic Example](/tls_traffic.png)

#### TLS 1.x Items

At the very least, [Kubeshark](https://kubeshark.com) will display the [ClientHello](https://datatracker.ietf.org/doc/html/rfc8446#section-4.1.2) and [ServerHello](https://datatracker.ietf.org/doc/html/rfc8446#section-4.1.3) TLS messages and related information.

#### TLS TCP Packets

In addition to the TLS messages mentioned above, [Kubeshark](https://kubeshark.com) shows all encrypted TCP packets within Kubernetes contexts, including information such as namespaces, pod and service names, IPs, ports, and more.