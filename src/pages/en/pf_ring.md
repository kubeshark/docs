---
title: PF_RING
description: PF-RING is a traffic processing library, which is considered more performant than AF_PACKET and therefore more suitable for high-speed networks.
layout: ../../layouts/MainLayout.astro
---

[PF-RING](https://www.ntop.org/products/packet-capture/pf_ring/) is a high-performance traffic processing library, offering superior performance compared to [AF_PACKET](https://man7.org/linux/man-pages/man7/packet.7.html). It is particularly well-suited for high-speed network environments.

The integration of PF_RING with [Kubeshark](https://kubeshark.com) is depicted in the following diagram:

![Worker's Architecture](/worker-architecture.png)

Due to PF_RING's requirement for specific support based on the Node's kernel version, and the vast variety of kernel versions, [Kubeshark](https://kubeshark.com)'s support for PF_RING cannot be universally guaranteed.

## Adding Support for Your Kernel Version

We consolidate all PF_RING module files into a single image named `kubeshark/pf-ring-module:all`. To check if your kernel version is supported, visit [this link](https://github.com/kubeshark/pf-ring-compiler/tree/main/modules/ko).

Should your kernel version lack support, you can undertake the following steps to incorporate a new PF_RING module into the `kubeshark/pf-ring-module:all` image:

1. Download the latest release of `pf-ring-compiler` for your platform from [here](https://github.com/kubeshark/pf-ring-compiler/releases).
2. Execute `pfring-compiler` for your target platform (for instance, EKS, which uses Amazon Linux 2):

```
pfring-compiler compile --target al2
{"level":"info","msg":"creating compile job default/al2-pf-ring-compiler","time":"2024-03-21T14:17:52+02:00"}
{"level":"info","msg":"compile job default/al2-pf-ring-compiler created","time":"2024-03-21T14:17:52+02:00"}
{"level":"info","msg":"waiting for compile job to start","time":"2024-03-21T14:17:52+02:00"}
{"level":"info","msg":"compile job started","time":"2024-03-21T14:17:54+02:00"}
{"level":"info","msg":"waiting for compile pod to start","time":"2024-03-21T14:17:54+02:00"}
{"level":"info","msg":"compile pod started","time":"2024-03-21T14:18:12+02:00"}
{"level":"info","msg":"waiting for compile job to complete pf-ring module compilation","time":"2024-03-21T14:18:12+02:00"}
{"level":"info","msg":"pf-ring module compilation completed","time":"2024-03-21T14:19:41+02:00"}
{"level":"info","msg":"copying kernel module to local fs","time":"2024-03-21T14:19:41+02:00"}
{"level":"info","msg":"kernel module copied to pf-ring-5.10.210-201.852.amzn2.x86_64.ko","time":"2024-03-21T14:19:43+02:00"}
{"level":"info","msg":"cleaning up compile job","time":"2024-03-21T14:19:43+02:00"}
```

You will obtain a module named `pf-ring-5.10.210-201.852.amzn2.x86_64.ko` in the current folder, formatted as `pf-ring-<kernel version>.ko`.

3. Clone the pf-ring-compiler repository:

```
git clone https://github.com/kubeshark/pf-ring-compiler
cd pf-ring-compiler
git checkout -b "add-module-<version>"
```

4. Transfer the kernel module from step 2 into the `modules/ko` folder.
5. Commit your modifications and submit a pull request (PR):

```
git add modules/ko/pf-ring-5.10.210-201.852.amzn2.x86_64.ko
git commit -S -m "Add PF_RING module for kernel 5.10.210-201.852.amzn2.x86_64"
git push origin add-module-<version>
```

After creating the PR, wait for it to be reviewed and merged. Following the merge, a GitHub Action pipeline will construct a new `kubeshark/pf-ring-module:all` image, enabling [Kubeshark](https://kubeshark.com) to support PF_RING for your kernel version.