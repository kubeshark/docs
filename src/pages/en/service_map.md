---
title: Service Map
description: Service Map
layout: ../../layouts/MainLayout.astro
---

Kubeshark offers a **Service Dependency Graph** to display your Kubernetes cluster.

Once you deployment is complete, Kubeshark CLI will open the UI at [http://localhost:8899](http://localhost:8899)
Click the button named **Service Map** in the upper right hand corner to open the service dependency graph:

![Service Dependency Graph](/service-dependency-graph.png)

The graph displays your current pods and the relationships between them based on the network traffic.
Click **Reset** to clear old capture information and rebuild the graph from incoming network capture
or **Refresh** to update the graph.
