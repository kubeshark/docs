---
title: Upgrading & Downgrading
description: 
layout: ../../layouts/MainLayout.astro
mascot:
---
> Pro edition is in Beta and is provided for free while in Beta.

## Upgrading to Pro

Type the following command in your terminal to upgrade from community edition to Pro:
```bash
kubeshark pro
```
A browser window will open and you will be asked to sign up or in to the [Kubeshark Cloud Console](https://console.kubeshark.co). 

![Kubeshark Console Auth Screen](/auth.png)

The authentication process will attempt to automatically configure **Kubeshark** to use the Pro edition. 

If something goes wrong, you will be asked to manually enter a license key when prompted in the CLI.

## Downgrading

Using the Pro edition, requires having a valid license key in the Kubeshark configuration file, that usually resides at ~/.kubeshark/config.yaml.

To downgrade, simply erase the license key and Kubeshark will use the community version. 

No need to save the license key. You can always upgrade, by running the `kubeshark pro` command.




