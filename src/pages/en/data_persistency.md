---
title: Data Persistency 
description: 
layout: ../../layouts/MainLayout.astro
---

### Storage Persistency
By default, [Kubeshark](https://kubeshark.com) employs ephemeral storage, as opposed to persistent storage. Consequently, all content will be lost in scenarios such as pod eviction, OOMkilled events, or any other circumstances that lead to pod restart.

While completely optional, to mitigate the risk of data loss, it is advisable to utilize persistent volume claims, thereby ensuring the use of persistent storage:
```yaml
tap:
  persistentStorage: true
  storageClass: <pvc-class>
```
Having said the above, [Kubeshark](https://kubeshark.com) will still record traffic the same way without persistent storage.