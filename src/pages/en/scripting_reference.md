---
title: Scripting API Reference
description: The reference page for the API provided in scripting and jobs features of Kubeshark
layout: ../../layouts/MainLayout.astro
---

This page contains information about the helpers, objects and overall behavior of the scripting API.

The same API is available inside the JavaScript functions defined as jobs.

All of the arguments in function calls are automatically converted from dynamically-typed [JavaScript ES5](https://262.ecma-international.org/5.1/#sec-8)
to statically-typed [native Go types](https://go.dev/ref/spec#Types).

> The JavaScript function signatures are hinted using TypeScript-style hints
> for easier explanations. Although the runtime is **not** TypeScript.

## Console

The `console.*` helpers provide a way to print messages or debug variables in the console.
You can access this console through web UI or `kubeshark console` command.

### `console.log(...params: string[])`

Takes N number of `string` typed arguments, concatenates them and prints them to the console with " "(whitespace) as separator between
the arguments.

##### Example:

```js
console.log("The variable x is:", x)
```

### `console.error(...params: string[])`

Takes N number of `string` typed arguments, concatenates them and prints them to the console **as error messages** with " "(whitespace) as separator between
the arguments.

##### Example:

```js
console.error("Something is not right and the value is:", value)
```

## Test

The `test.*` helpers are useful for implementing test rules and manipulating the web UI.

### `test.pass(data: object): object`

Takes a single argument which is a JavaScript object, sets its `passed` field to `true` like; `data.passed = true` and
returns that object. If you use it inside the `onItemQueried` hook and return the modified `data`, it will order the
web UI to mark that item as **green** on the left-pane.

##### Example:

```js
function onItemQueried(data) {
  if (data.response.status == 200) {
    return test.pass(data)
  }
}
```

### `test.fail(data: object): object`

Takes a single argument which is a JavaScript object, sets its `failed` field to `true` like; `data.failed = true` and
returns that object. If you use it inside the `onItemQueried` hook and return the modified `data`, it will order the
web UI to mark that item as **red** on the left-pane.

##### Example:

```js
function onItemQueried(data) {
  if (data.response.status == 500) {
    return test.fail(data)
  }
}
```

## Vendor

The `vendor.*` helpers provide integrations to other software and services. They are useful for alerting other systems
and pushing data to them when a certain event occur or periodically through jobs.

### `vendor.webhook(method: string, url: string, body: string)`

> (!) This helper requires a Pro license.

It does an HTTP request to the WebHook (the HTTP endpoint) that's defined by HTTP `method` and URL in the `url`
argument with the HTTP body as the string in the `body` argument.

##### Example:

```js
vendor.webhook(
  "POST",
  "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
  JSON.stringify(data)
);
```

### `vendor.slack(token: string, channelID: string, pretext: string, text: string, color: string)`

> (!) This helper requires a Pro license.

Sends a Slack message to the Slack channel in `channelID` argument using the provided access token in `token` argument.
It's especially useful for **alerting** a group of developers about **an issue detected through the network traffic**, such as
*HTTP 500 response status code:*

##### Example:

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(
      SLACK_AUTH_TOKEN,
      SLACK_CHANNEL_ID,
      "Server-side Error",
      JSON.stringify(data),
      "#ff0000"
    );
}
```

### `vendor.influxdb(url: string, token: string, measurement: string, organization: string, bucket: string, data: object)`

> (!) This helper requires a Pro license.

Pushes the data into a `bucket` the InfluxDB instance at URL `url` argument using the provided access token in `token` argument.
InfluxDB, as **a timeseries database**, is useful for collecting data or measurements about the Kubernetes network.
InfluxDB can also be added as [**a data source to Grafana**](https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-influxdb/).
It's logical to **aggregate data into a global variables** from hooks and **push it to InfluxDB through a job**:

##### Example:

```js
function pushDataToInfluxDB() {
  // Print the data
  console.log("Data:", JSON.stringify(data))

  // Push the data
  vendor.influxdb(
    INFLUXDB_URL,
    INFLUXDB_TOKEN,
    "Example Measurement",
    INFLUXDB_ORGANIZATION,
    INFLUXDB_BUCKET,
    data
  );

  // Reset the data
  data = {};
}

// Call the JavaScript function `pushDataToInfluxDB` every minute
jobs.schedule("push-data-to-influxdb", "0 */1 * * * *", pushDataToInfluxDB);
```

### `vendor.s3.put(region: string, keyID: string, accessKey: string, bucket: string, path: string)`

> (!) This helper requires a Pro license.

Uploads a file to an AWS S3 `bucket` on AWS `region` using the **AWS credentials** provided in `keyID` and `accessKey` arguments.
The S3 path of the file is set based on this pattern: `<NODE_NAME>_<NODE_IP>/<FILENAME>`.

##### Example:

```js
vendor.s3.put(
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET,
  filePath
);
```

### `vendor.s3.clear(region: string, keyID: string, accessKey: string, bucket: string)`

> (!) This helper requires a Pro license.

Clears the content of the folder `<NODE_NAME>_<NODE_IP>/` in the AWS S3 `bucket`.
The folder is simply owned by the Kubeshark worker/node.
It can be called through a job to do a periodic clean up.

##### Example:

```js
vendor.s3.clear(
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET
);
```

## PCAP

The `vendor.*` helpers provide certain functionality revolving around **the PCAP-based
network traffic storage mechanism of Kubeshark**.

### `pcap.nameResolutionHistory(): object`

The helper immediately returns a map of **the name resolution history of the given Kubernetes node**. Which
its **keys are UNIX timestamps** and values are yet another map with keys are IPs and values are names and Kubernets namespaces.
The UNIX timestamps mark a change in the name resolution throughout the history.

##### Example:

```js
var nameResolutionHistory = pcap.nameResolutionHistory();
```

### `pcap.snapshot(dir: string): string`

It **merges all the PCAP files (TCP/UDP streams) into a single PCAP file** and saves it under `dir` folder.
The returned `path` has always this pattern: `<DIR>/<UNIX_TIMESTAMP>.pcap`. Then you can supply this file path
to other helpers that accept a file path as argument such as; `vendor.s3.put`, or `file.delete`.

##### Example:

```js
var dir = file.mkdirTemp("snapshots");
var snapshot = pcap.snapshot(dir);
```

### `pcap.path(tpcOrUdpStream: string): string`

Returns the full path of a given TCP/UDP stream then you can supply this file path
to other helpers that accept a file path as argument such as; `vendor.s3.put`.

> It's <ins>advised against modifiying these files</ins> using helpers like `file.write`, `file.append`, `file.move` or `file.delete`
> because the TCP/UDP streams are internally tracked, written and updated files
> that emerge from the Kubernetes network traffic capture.
> <ins>Modifiying these files can break the core functionality of Kubeshark.</ins>

##### Example:

```js
function onItemCaptured(data) {
  // Get the PCAP file path of the TCP/UDP stream
  var pcapPath = pcap.path(data.stream);
}
```
