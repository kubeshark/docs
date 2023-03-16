---
title: Customer-provided Credentials
description:  
layout: ../../layouts/MainLayout.astro
---

**kubeshark** keeps data secure by working on-prem and exporting data only to customer-provided systems using customer-provided credentials.

Some integrations requires credentials and require obtaining its credentials prior to using it.

##  Influx DB

[InfluxDB](https://en.wikipedia.org/wiki/InfluxDB) is a highly popular [time series database](https://en.wikipedia.org/wiki/Time_series_database) that is used to store metrics. InfluXDB can easily be configured to be used as a data source in applications such as [Grafana](https://grafana.com/). If you don't have access to an InfluxDB instance, you can follow the instructions in the [InfluxDB and Grafana](/en/integrations_influxdb#practical-example) section to get one.

The following credentials are necessary:
- InfluxDB URL
- InfluxDB token

> Learn more about the InfluxDB integration and the required credentials [here](/en/integrations_influxdb).

##  Elasticsearch

Elasticsearch is a popular schema free JSON document repository.

To access [elastic cloud](https://elastic.co), the following credentials are necessary:

- Elasticsearch Cloud ID
- ELasticsearch API Key 

## AWS S3

AWS S3 can be used to export forensics in the form of PCAP files (or any other files) to an immutable datastore. 

The following credentials are necessary to use AWS S3:

- AWS Access Key ID
- AWS Secret Access Key

Additional required AWS S3 properties:
- AWS Region
- AWS S3 Bucket

> Learn more about the AWS S3 integration and the required credentials [here](/en/integration_aws_s3).

## Slack

Slack is useful to send alerts, whether in real-time or once a certain task is completed.

The following credentials are necessary:

- Incoming Webhook URL address; or
- OAuth Token & Channel ID

> Learn more about the Slack integration and the required credentials [here](/en/integrations_slack).

## Keeping Credentials Secure

As these credentials are confidential, we highly recommend to keep them in the **Kubeshark** configuration file as environment variables.

Here's an example of a suggested configuration file clause:

```bash
configpath: /home/xxx/.kubeshark/config.yaml
headless: false
license: FT7YKAYBAE....
scripting:
    env:
        AWS_ACCESS_KEY_ID: AKIA...
        AWS_REGION: us-east-2
        AWS_SECRET_ACCESS_KEY: YZv..
        INFLUXDB_TOKEN: edO4...
        INFLUXDB_URL: http://10.0.0.99:8086
        S3_BUCKET: my-bucket-name
        SLACK_AUTH_TOKEN: xoxb-43...
        SLACK_CHANNEL_ID: C0..
        WEBHOOK_URL: https://webhook.site/08c9a...
```
