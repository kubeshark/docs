---
title: Send Logs to Elasticsearch
description: Elasticsearch integration enables persistent storage and search in an Elasticsearch instance.
layout: ../../layouts/MainLayout.astro
---

> This integration is part of the [Pro edition](https://kubehq.com/pricing).

This integration enables you to send schema-free JSON documents directly to any [Elasticsearch](https://en.wikipedia.org/wiki/Elasticsearch) local or cloud-hosted instance by using the [`vendor.elastic`](/en/automation_helpers#vendorelasticurl-string-index-string-data-object-username-string-password-string-cloudid-string-apikey-string-servicetoken-string-certificatefingerprint-string) helper.



## Sending Select Traffic Logs to Elasticsearch

A ready-to-run script that enables you to send select traffic logs to Elasticsearch can be found [here](https://github.com/kubeshark/scripts/tree/master/telemetry#send-select-traffic-logs-to-elasticsearch). 

```js
var kflQuery    = "gql and (src.name == 'my-pod-name' or dst.name == 'my-pod-name')";
var ACTIVE      = true;  // change to false to disable this script

// Use environment variables (recommended) or change these variables locally
var elaIdx      = env.ELASTIC_INDEX;
var elaCloId    = env.ELASTIC_CLOUD_ID;
var elaApiKey   = env.ELASTIC_API_KEY;

function onItemCaptured(data) {
    if (!ACTIVE) return;
    try{
        if (kflQuery.match(kflQuery, data)){
            vendor.elastic(
                "",     // URL is ignored for Elastic Cloud
                elaIdx,
                data,   // Payload
                "",     // Username is ignored for Elastic Cloud
                "",     // Password is ignored for Elastic Cloud
                elaCloId,
                elaApiKey
            );
        }
    }
    catch(error){
        console.error("Elastic Traffic Logs", error);
    }
}
```

Change the KFL query and the Elasticsearch Authentication variables at the top of the script to fit your use-case and put the script in the script folder.

## TL;DR

The script uses the [`onItemCaptured`](/en/automation_hooks#onitemcaptureddata-object) hook, the [`kfl.match` helper](https://docs.kubehq.com/en/automation_helpers#kflmatchquery-string-data-object-boolean) in conjunction with a [KFL](https://docs.kubehq.com/en/filtering) query to identify the select traffic logs. 

For example, the following KFL query can be used to filter pod specific ingress/egress GraphQL traffic:
```js
gql and (src.name == "my-pod-name" or dst.name == "my-pod-name")
```

The `vendor.elastic` helper is used to send the traffic logs to an Elasticsearch cloud instance.

## Prerequisites

Using the Elasticsearch integration requires the Pro edition and is currently supported only by the CLI. If you haven't done so:
1. Install the CLI, by following [these instructions](/en/install#cli).
2. Sign up to the Pro edition by running the `pro` command:
```shell
kubeshark pro
```
> More information about upgrading to the Pro edition can be found in the [Upgrading & Downgrading](/en/pro_upgrade) section.

Ensure your configuration file includes the following configuration at a minimum:
```shell
license: FT7YKAYBAE****************AA=
scripting:
    env:
        ELASTIC_CLOUD_ID: <your-elastic-cloud-id>
        ELASTIC_API_KEY:  <your-elastic-api-key>
        ELASTIC_INDEX:    <your-elastic-index-name>
    source: /path/to/your/script/folder/
    watchScripts: true
```




