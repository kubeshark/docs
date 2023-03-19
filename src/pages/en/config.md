---
title: Configuration
description: Kubeshark configuration explained in detail.
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** reads configuration elements both from the **CLI** and from a configuration file that can be located either in `$HOME/.kubeshark/config.yaml` or at a different location specified as a CLI flag: `--configpath string`.

## The Config Command

The `config` command generates a ​**​Kubeshark​**​ config file with default values.

```shell
Usage:
  kubeshark config [flags]

Flags:
  -h, --help         help for config
  -r, --regenerate   Regenerate the config file with default values to path $HOME/.kubeshark/config.yaml or to chosen path using --configpath

Global Flags:
      --configpath string   Override config file path using --configpath (default "$HOME/.kubeshark/config.yaml")
  -d, --debug               Enable debug mode.
      --set strings         Override values using --set
```

## Popular Configuration Elements

### Private Docker Registry

Use when you'd like **Kubeshark** to pull its images from a local Docker repository. This is useful in an Enterprise environment, where images are built and hosted locally.

```shell
tap:
    docker:
        registry: docker.io/kubeshark
        tag: latest
        imagepullpolicy: Always
```

Alternatively, use the shell config option:
```shell
kubeshark tap -A --docker-registry "docker.io/kubeshark"
```

### Dashboard IP and Accessibility

For security reasons, the default address of the proxy host for the **Kubeshark** dashboard is set to `127.0.0.1` that allows opening only local connections.

```shell
tap:
    proxy:
        host: 127.0.0.1
```

Alternatively, use the shell config option:
```shell
kubeshark tap -A --proxy-host 0.0.0.0
```

Consider changing this address to `0.0.0.0` or any other publicly accessible IP, to allow public address. Keep in mind that access to the dashboard isn't encrypted or authenticated.

When you run **Kubeshark** on a remote server, make sure ports `8898`-`8899` are open for external connections.

### Worker Storage Limit

**Kubeshark** **Workers** store the captured traffic locally at the Node level with no limit other than the limit of the volumes attached to the Nodes. Use the following configuration to set the limit of the storage used by the **Workers**.

```shell
tap:
    storagelimit: 200MB
```

Alternatively, use the shell config option:

```shell
kubeshark tap -A --storagelimit 2000MB
```

### Kubeshark Resource Assignment Limits

Use to change the amount of resources assigned to **Kubeshark**.

```shell
tap:
    resources:
        worker:
            cpu-limit: 750m
            memory-limit: 1Gi
            cpu-requests: 50m
            memory-requests: 50Mi
        hub:
            cpu-limit: 750m
            memory-limit: 1Gi
            cpu-requests: 50m
            memory-requests: 50Mi
```

### Run Kubeshark Headless

By default, the **Kubeshark** dashboard opens automatically. If you are running **Kubeshark** on a headless machine and you'd like NOT to open the dashboard, set `headless` to true.

```shell
headless: true
```

Alternatively, use the shell config option:
```shell
kubeshark tap -A --set headless=true
```

### Public IP and Headless

This is a very popular option that enables running **Kubeshark** on a public IP and without opening the its dashboard.

```shell
tap:
    proxy:
        host: 0.0.0.0
headless: true
```
Alternatively, use the shell config option:
```shell
kubeshark tap -A --proxy-host 0.0.0.0 --set headless=true
```
You can now access the **Kubeshark** dashboard from a remote server.

As stated above, when you run **Kubeshark** on a remote server, make sure ports `8898`-`8899` are open for external connections.

### Scripts

Information related to **Kubeshark**'s scripting engine. For example:

```shell
scripting:
    env:
      VAR-1: "VALUE"
      VAR-2: 77
    source: "/path/to/script/folder"
```

#### Source Folders

```shell
scripting:
    source: "/path/to/script/folder"
```
A path for the scripts folder. If not empty and pre-populated with scripts, all script will run when **Kubeshark** starts.

#### Environment Variables

This section includes variable that can be used inside of scripts.

```shell
scripting:
    env:
      VAR-1: "VALUE"
      VAR-2: 77
