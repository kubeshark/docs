---
title: TLS Decryption
description: How Kubeshark decrypts TLS in-cluster and the container images it supports.
layout: ../../layouts/MainLayout.astro
mascot:
---

Kubeshark decrypts encrypted traffic and makes it available for inspection in clear text — **no private keys, no certificates, no sidecars, no application changes**. It hooks the cryptographic library inside each targeted container with eBPF, intercepting data after decryption (on read) and before encryption (on write), so plaintext is captured directly from process memory.

![eBPF TLS](/ebpf_tls.png)

## Decryption Is Image-Specific

Every container image running in the cluster uses a specific TLS tech stack — Go's `crypto/tls`, OpenSSL, BoringSSL, and so on. Each of these requires a different method to perform decryption, and each is affected by how the binary was built (dynamically vs. statically linked, stripped vs. with symbols).

Kubeshark identifies the library inside each targeted container and attaches the appropriate eBPF probes automatically. It currently targets the cryptographic stacks that account for the overwhelming majority of TLS terminations in cloud-native workloads:

| Library | Typical Languages / Runtimes | Example Workloads |
|---------|------------------------------|-------------------|
| [OpenSSL](https://www.openssl.org/) | C, C++, Python, Ruby, PHP, Perl, Lua / OpenResty | nginx, HAProxy, Apache httpd, MySQL, PostgreSQL, Redis, MongoDB, Kong, APISIX |
| [BoringSSL](https://github.com/google/boringssl) | C, C++, gRPC stacks | Envoy, Istio data plane, gRPC services |
| [Go `crypto/tls`](https://pkg.go.dev/crypto/tls) | Go | Traefik, Bifrost |

Together these cover the dominant share of cloud-native traffic: web servers, ingress controllers, API gateways, service-mesh data planes, databases, caches, and message brokers. Supported linking and symbol combinations include:

- **OpenSSL** and **BoringSSL** — dynamically or statically linked
- **Go `crypto/tls`** — stripped or with symbols

## Service Mesh & mTLS

Because Kubeshark hooks the crypto library inside the workload, mTLS-encrypted traffic is captured in plaintext with no additional setup. This applies to [Istio](https://istio.io/), [Cilium Service Mesh](https://cilium.io/), [Consul Connect](https://www.consul.io/), and other Envoy-based meshes. See [Istio support](/en/service_mesh) for additional notes.

## On-Demand Support for New Images

There may be images that are not yet covered. In most cases, support for a new image **can be added on demand**. If you are running a workload and **do not see its traffic decrypted in clear text**, please reach out via our [contact us](https://kubeshark.com/contact-us) form and request activation for that specific image.

## Supported Images

The list below is **not exhaustive** — it is a set of images Kubeshark has been explicitly tested against. Support very likely extends to many more images built on the same TLS libraries.

### Web Servers, Reverse Proxies & Load Balancers

- [`nginx`](https://hub.docker.com/_/nginx)
- [`haproxy`](https://hub.docker.com/_/haproxy)
- [`envoyproxy/envoy`](https://hub.docker.com/r/envoyproxy/envoy)

### Kubernetes Ingress Controllers & Gateways

- [`registry.k8s.io/ingress-nginx/controller`](https://github.com/kubernetes/ingress-nginx)
- [`nginx/nginx-ingress`](https://hub.docker.com/r/nginx/nginx-ingress) (F5 NGINX)
- [`nginx/nginx-gateway-fabric`](https://github.com/nginx/nginx-gateway-fabric)
- [`kong/kubernetes-ingress-controller`](https://github.com/Kong/kubernetes-ingress-controller)
- [`haproxytech/kubernetes-ingress`](https://github.com/haproxytech/kubernetes-ingress)
- [`jcmoraisjr/haproxy-ingress`](https://github.com/jcmoraisjr/haproxy-ingress)
- [`traefik`](https://hub.docker.com/_/traefik)

### API Gateways

- [`kong`](https://hub.docker.com/_/kong)
- [`apache/apisix`](https://hub.docker.com/r/apache/apisix)

### Service Mesh Proxies

- [`istio/proxyv2`](https://hub.docker.com/r/istio/proxyv2) (Istio Gateway, Envoy / BoringSSL)
- [`istio/proxy`](https://github.com/istio/proxy) (Istio sidecar, Envoy / BoringSSL)

### AI / LLM Gateways & Inference Servers

- [`vllm/vllm-openai`](https://github.com/vllm-project/vllm)
- [`ghcr.io/berriai/litellm`](https://github.com/BerriAI/litellm)
- [`ghcr.io/huggingface/text-generation-inference`](https://github.com/huggingface/text-generation-inference)
- [`nvcr.io/nvidia/tritonserver`](https://github.com/triton-inference-server/server)
- [`maximhq/bifrost`](https://hub.docker.com/r/maximhq/bifrost)

### Databases

- [`postgres`](https://hub.docker.com/_/postgres)
- [`mysql`](https://hub.docker.com/_/mysql)
- [`redis`](https://hub.docker.com/_/redis)
- [`valkey/valkey`](https://hub.docker.com/r/valkey/valkey)
- [`mongo`](https://hub.docker.com/_/mongo)

### Message Brokers

- [`rabbitmq`](https://hub.docker.com/_/rabbitmq)
- [`redpandadata/redpanda`](https://hub.docker.com/r/redpandadata/redpanda)

### Observability

- [`fluent/fluent-bit`](https://hub.docker.com/r/fluent/fluent-bit)

---

## Don't See Your Traffic Decrypted?

If traffic from one of your workloads is not showing up in clear text, the image likely uses a TLS path we haven't explicitly activated yet. [Contact us](https://kubeshark.com/contact-us) with the image name and we'll work with you to enable decryption for it.
