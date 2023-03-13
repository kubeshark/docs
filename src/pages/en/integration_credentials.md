---
title: Customer-provided Credentials
description:  
layout: ../../layouts/MainLayout.astro
---

**kubeshark** keeps data secure by working on-prem and exporting data only to customer-provided systems using customer-provided credentials.

To harness the full potential of the integrations supported by **Kubeshark**, the following credentials are nessasery. 

##  Influx DB

InfluxDB is a highly popular time series database used by many to store metrics. InfluXDB can easily be configured to be used as a data source in applications such as Grafana. If you don't have an InfluxDB instance, it takes only a few minutes to launch a local instance or sign up to a hosted InfluxDB instance.

The following credentials are necessary:
- InfluxDB URL
- InfluxDB token

> Learn more about the InfluxDB integration and the required credentials [here](/en/integrations_influxdb).

## AWS S3

AWS S3 credentials are requires to export forensics in the form of PCAP files to an S3 bucket which is an immutable datastore.

The following credentials are necessary:

- AWS Access Key ID
- AWS Secret Access Key

Additional AWS S3 properties:
- AWS Region
- AWS S3 Bucket

> Learn more about the AWS S3 integration and the required credentials [here](/en/integration_aws_s3).

## Slack

Slack is useful to send alert, whether in real-time or once a certain task is completed.

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
