---
title: Kubeshark-Lens Extension
description: 
layout: ../../layouts/MainLayout.astro
---

[Kubernetes Lens](https://k8slens.dev/), sometimes referred to as the [Kubernetes](https://kubernetes.io/) IDE, allows users to connect and manage multiple Kubernetes clusters on Mac, Windows, and Linux platforms. It is an intuitive graphical interface that allows users to deploy and manage clusters directly from the console.

[Kubeshark](https://kubeshark.com)'s Lens extension enable Kubernetes Lens users to view real-time traffic of clusters, namespaces, nodes, pods or services, by simply clicking a new menu item added by the extension.

## Installing

1. Open Lens and navigate to the Extensions page (or press Command + Shift + E on macOS).
2. Enter the following URL into the Install Extension box: `@kubeshark/lens`
3. Click the Install button.

## Configuration

In the preference page, you can enter the [Kubeshark](https://kubeshark.com) URL. The default URL is `http://localhost:8899/`.

![Enter Kubeshark URL](/lens_preferences.png)

## How to View

Once the extension is loaded, a new menu item will appear for each specific Kubernetes component. This menu item indicates that you can view real-time traffic for the corresponding component. By clicking on the menu item, [Kubeshark](https://kubeshark.com) will open and present the traffic associated with the selected Kubernetes component.

For example, if you want to view traffic in a particular namespace, follow these steps:

1. Find the namespace in KubernetesLens.
2. Locate and click on the menu item that indicates viewing traffic for that namespace.

![Right click to view traffic](/lens_menu_item.png)

Once you press the menu item, [Kubeshark](https://kubeshark.com)'s dashboard will open automatically configured to filter traffic related only to the selected Kubernetes component. 

## Limitations

[Kubeshark](https://kubeshark.com) will only display traffic under the following circumstances:
- The component is active and either receiving or generating traffic.
- [Kubeshark](https://kubeshark.com) was able to successfully capture and dissect the traffic (there could be various reasons why this may not happen).


<iframe width="560" height="315" src="https://www.youtube.com/embed/corWPtp9hrI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


