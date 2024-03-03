---

title: Install with CLI
description: Quickly install and run Kubeshark in your Kubernetes cluster using a streamlined CLI option.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---
> For Helm-based installations, refer to the [Helm](/en/install_helm) section.

The fastest way to start with **Kubeshark** is by downloading the [latest release](https://github.com/kubeshark/kubeshark/releases/latest) of the CLI, executing `kubeshark tap`, and navigating your browser to `localhost:8899`.

![Kubeshark UI](/kubeshark-ui.png)

Installing **Kubeshark** via CLI offers functionality akin to using the `helm install` command but does not require Helm to be installed.

For alternative installation methods such as [Helm](/en/install_helm), [Homebrew](/en/install#homebrew), and others based on your needs, see below:

## Homebrew

Installing **Kubeshark** with [Homebrew](https://formulae.brew.sh/formula/kubeshark) is straightforward:
```shell
brew install kubeshark
```

## Shell Script

To download the appropriate binary for your system:
```shell
sh <(curl -Ls https://kubeshark.co/install)
```
> The actual script is [here](https://github.com/kubeshark/kubeshark/blob/master/install.sh)

Alternatively, you can directly download the suitable binary from the [latest release](https://github.com/kubeshark/kubeshark/releases/latest).

## Build from Source

Clone the [Kubeshark GitHub repository](https://github.com/kubeshark/kubeshark) and follow the [build instructions in the README](https://github.com/kubeshark/kubeshark#building-from-source):
```shell
git clone https://github.com/kubeshark/kubeshark
cd kubeshark && make
```

## Tap (Run)

To initiate **Kubeshark**, use the `tap` command, for example:
```shell
kubeshark tap
```
This command not only installs **Kubeshark** but also launches the dashboard. You can exit the dashboard and terminate the CLI session with `^C` at any time. Use the `proxy` command to reconnect and reopen the dashboard.

Terminating the CLI session with `^C` does not stop or remove **Kubeshark**; it merely disconnects the dashboard. **Kubeshark** remains active until you run the `clean` command.

## Proxy

The `proxy` command facilitates dashboard access, whether you installed **Kubeshark** via Helm or CLI. It sets up a `kube-proxy` or, if unavailable, defaults to `port-forward`.

```shell
kubeshark proxy
```

## Clean

To completely remove **Kubeshark** from your cluster when using the CLI:
```shell
kubeshark clean
```

The `clean` command mirrors the `helm uninstall` functionality, eliminating the need for Helm. Note: Exiting **Kubeshark** with ^C only severs the dashboard connection and does not uninstall **Kubeshark**. Use the `clean` command for complete removal.