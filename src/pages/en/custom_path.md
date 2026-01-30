---
title: Reverse Proxy with a Custom Path
description: 
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

If you're hosting [Kubeshark](https://kubeshark.com) behind a reverse proxy and want it to be accessible via a custom path, you need to configure it accordingly.

For example, suppose you deploy a reverse proxy at the following address:  
`https://my.domain.com/`

You then forward traffic to different applications based on custom paths, such as:

- `https://my.domain.com/app1` → App 1  
- `https://my.domain.com/app2` → App 2  
- `https://my.domain.com/custom-kubeshark-path` → [Kubeshark](https://kubeshark.com)

To make [Kubeshark](https://kubeshark.com) work properly under a custom path, you **must** set a Helm value with the desired base path.

> **Note:** The custom path **must** be prefixed with `/`.

You can set it either via the command line:

```bash
--set tap.routing.front.basePath=/custom-kubeshark-path
```

Or in your `values.yaml` file:

```yaml
tap:
  routing:
    front:
      basePath: /custom-kubeshark-path
```

> **Reminder:** The custom path **must** start with a `/`.
