---
title: Kubeshark CLI
description: The CLI
layout: ../../layouts/MainLayout.astro
mascot: Hello
---

The **CLI** (Command Line Interface) is a binary distribution of the Kubeshark client and it is written in [Go](https://go.dev/) language. 

To use the **CLI** you need to download it to your computer using one of the options described in the [installation](/en/install) section.

The **CLI** communicates with the [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) to deploy of the [**Hub**](#hub) in the cluster.

**Source code:** [`kubeshark/kubeshark`](https://github.com/kubeshark/kubeshark)

To see the latest documentation of Kubeshark's CLI, run:

```shell
kubeshark -h
```

```shell
Usage:
  kubeshark [command]

Available Commands:
  check       Check the Kubeshark resources for potential problems
  clean       Removes all kubeshark resources
  completion  Generate the autocompletion script for the specified shell
  config      Generate Kubeshark config with default values
  help        Help about any command
  logs        Create a ZIP file with logs for GitHub issues or troubleshooting
  pcap        Capture from a PCAP file using your Docker Daemon instead of Kubernetes.
  proxy       Open the web UI (front-end) in the browser via proxy/port-forward.
  tap         Capture the network traffic in your Kubernetes cluster.
  version     Print version info

Flags:
      --config-path string   Override config file path using --config-path (default "/Users/alongir/.kubeshark/config.yaml")
  -d, --debug                Enable debug mode.
  -h, --help                 help for kubeshark
      --set strings          Override values using --set

Use "kubeshark [command] --help" for more information about a command.
```

### Stop Kubeshark

Use `Ctrl+C` (`^C`) to stop Kubeshark and clean its resources

