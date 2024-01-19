---
title: Installing an Older Release
description: Learn how to install a previous version of Kubeshark using an older release tag.
layout: ../../layouts/MainLayout.astro
---

To install an older release of Kubeshark along with all its artifacts, follow these steps based on a specific tag (e.g., v52.0.0):

1. Locate the desired release tag from [Kubeshark's tags on GitHub](https://github.com/kubeshark/kubeshark/tags).

2. Clone the repository at the specified tag release and install the Helm chart by executing the following commands:

```yaml
git clone git@github.com:kubeshark/kubeshark.git
cd kubeshark
git checkout tags/<tag_name>
helm install kubeshark helm-chart
```
