---
title: Send Metrics to InfluxDB
description: Kubeshark enables you can send metrics directly to any InfluxDB local instance or cloud-hosted solution using the InfluxDB helper. You can then use InfluxDB's capabilities as a time-series database for reporting and further aggregation (e.g. to Grafana).
layout: ../../layouts/MainLayout.astro
---
> Use of this integration requires Pro license.

**Kubeshark** enables you can send metrics directly to any [InfluxDB](https://www.influxdata.com/) local instance or cloud-hosted solution using the InfluxDB helper. You can then use InfluxDB's capabilities as a time-series database for reporting and further aggregation (e.g. to Grafana).


The following example aggregates HTTP status codes and pushes them to InfluxDB every minute

```bash
var statusCodes = {};

function onItemCaptured(data) {
  if (data.protocol.name !== "http") return;

  if (statusCodes.hasOwnProperty(data.response.status)) {
    statusCodes[data.response.status]++;
  } else {
    statusCodes[data.response.status] = 1;
  }
}

function pushStatusCodesToInfluxDB() {
  console.log("Status Codes:", JSON.stringify(statusCodes))

  vendor.influxdb(
    INFLUXDB_URL,
    INFLUXDB_TOKEN,
    "Status Codes",
    INFLUXDB_ORGANIZATION,
    INFLUXDB_BUCKET,
    statusCodes
  );

  statusCodes = {};
}

jobs.schedule("push-status-codes-to-influxdb", "0 */1 * * * *", pushStatusCodesToInfluxDB);
```

## Connecting to Grafana

Metrics that are transmitted to InfluxDB can be aggregated to be used inGrafana, when selecting your InfluxDB instance as a source.

The following dashboard can be generated based on the metrics that are transmitted to InfluxDB and then aggregated to Grafana:
![InfluxDB Dashboard](/influxdb-status-codes.png)

Follow one of these resources to add your InfluxDB instance to Grafana:
- https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-influxdb/
- https://www.influxdata.com/blog/getting-started-influxdb-grafana/