---
title: Helpers
description: The reference page for the helpers provided in scripting and jobs features of Kubeshark
layout: ../../layouts/MainLayout.astro
---

Helpers represents actions supported by the various available integrations. They enable writing custom-logic scripts in conjunctions with hooks that can trigger actions based on a programmatic decision.

The following script example shows the use of the Slack helper to trigger a Slack alert every time the response status equals 500.

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(
      env.SLACK_WEBHOOK,
      "Server-side Error",
      JSON.stringify(data),
      "#ff0000"
    );
}
```

This page contains information about the helpers, objects and overall behavior of the scripting API.

The same API is available inside the JavaScript functions defined as jobs.

All of the arguments in function calls are automatically converted from dynamically-typed [JavaScript ES5](https://262.ecma-international.org/5.1/#sec-8)
to statically-typed [native Go types](https://go.dev/ref/spec#Types).

> The JavaScript function signatures are hinted using TypeScript-style hints
> for easier explanations. Although the runtime is **not** TypeScript.

## Console

The `console.*` helpers provide a way to print messages or debug variables in the console.
You can access this console through the **Kubeshark** dashboard or the `kubeshark console` command.

### `console.log(...args: string[])`

Takes N number of `string` typed arguments, concatenates them and prints them to the console with " "(whitespace) as separator between
the arguments.

##### Example:

```js
console.log("The variable x is:", x)
```

### `console.error(...args: string[])`

Takes N number of `string` typed arguments, concatenates them and prints them to the console **as error messages** with " "(whitespace) as separator between
the arguments.

##### Example:

```js
console.error("Something is not right and the value is:", value)
```

## Test

The `test.*` helpers are useful for implementing test rules and manipulating the dashboard.

### `test.pass(data: object): object`

Takes a single argument which is a JavaScript object, sets its `passed` field to `true` like; `data.passed = true` and returns that object. If you use it inside the [`onItemQueried`](/en/automation_hooks#onitemquerieddata-object) hook and return the modified `data`, it will order the dashboard to mark that item as **green** on the left-pane.

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
returns that object. If you use it inside the [`onItemQueried`](/en/automation_hooks#onitemquerieddata-object) hook and return the modified `data`, it will order the dashboard to mark that item as **red** on the left-pane.

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

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

It does an HTTP request to the webhook (the HTTP endpoint) that's defined by HTTP `method` and URL in the `url`
argument with the HTTP body as the string in the `body` argument.

##### Example:

```js
vendor.webhook(
  "POST",
  "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
  JSON.stringify(data)
);
```

### `vendor.slack(webhookUrl: string, pretext: string, text: string, color: string)`

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

Sends a Slack message to the Slack webhook in `webhookUrl` argument.
It's especially useful for **alerting** a group of developers about **an issue detected through the network traffic**, such as
*HTTP 500 response status code:*

##### Example:

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(
      env.SLACK_WEBHOOK,
      "Server-side Error",
      JSON.stringify(data),
      "#ff0000"
    );
}
```

### `vendor.slackBot(token: string, channelID: string, pretext: string, text: string, color: string)`

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

Sends a Slack message to the Slack channel in `channelID` argument using the provided access token in `token` argument.
It's especially useful for **alerting** a group of developers about **an issue detected through the network traffic**, such as
*HTTP 500 response status code:*

##### Example:

```js
function onItemCaptured(data) {
  if (data.response.status === 500)
    vendor.slack(
      env.SLACK_AUTH_TOKEN,     // Webhook URL
      env.SLACK_CHANNEL_ID,     // Pretext (title)
      "Server-side Error",      // Message text
      JSON.stringify(data),     // Color code of the message
      "#ff0000"
    );
}
```

### `vendor.influxdb(url: string, token: string, organization: string, bucket: string, measurement: string, data: object, tags?: object)`

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

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
    env.INFLUXDB_URL,
    env.INFLUXDB_TOKEN,
    env.INFLUXDB_ORGANIZATION,
    env.INFLUXDB_BUCKET,
    "Example Measurement",        // Measurement
    data,                         // Payload
    {"example":"tag"}
  );

  // Reset the data
  data = {};
}

// Call the JavaScript function `pushDataToInfluxDB` every minute
jobs.schedule("push-data-to-influxdb", "0 */1 * * * *", pushDataToInfluxDB);
```

### `vendor.elastic(url: string, index: string, data: object, username?: string, password?: string, cloudID?: string, apiKey?: string, serviceToken?: string, certificateFingerprint?: string)`

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

Pushes the data into an Elasticsearch `index` inside an instance at URL `url` argument using various different authentication strategies
provided by Elasticsearch:

- Set `username` and `password` for [Basic Authentication](https://www.elastic.co/guide/en/elasticsearch/client/go-api/master/connecting.html#auth-basic).
- Set `serviceToken` for [HTTP Bearer authentication](https://www.elastic.co/guide/en/elasticsearch/client/go-api/master/connecting.html#auth-token).
- Set `url` to empty string, `cloudID` to [Cloud ID of your Elastic Cloud deployment](https://www.elastic.co/guide/en/cloud/current/ec-cloud-id.html) and `apiKey` to the [API key that you have generated in the Elastic Cloud](https://www.elastic.co/guide/en/cloud/current/ec-api-authentication.html).

##### Example:

```js
function pushDataToElasticsearch() {
  // Print the data
  console.log("Data:", JSON.stringify(data))

  // Push the data
  vendor.elastic(
    "",                     // URL is ignored for Elastic Cloud
    env.ELASTIC_INDEX,
    data,                   // Payload
    "",                     // Username is ignored for Elastic Cloud
    "",                     // Password is ignored for Elastic Cloud
    env.ELASTIC_CLOUD_ID,
    env.ELASTIC_API_KEY
  );

  // Reset the data
  data = {};
}

// Call the JavaScript function `pushDataToElasticsearch` every minute
jobs.schedule("push-data-to-elastic", "0 */1 * * * *", pushDataToElasticsearch);
```

### `vendor.s3.put(region: string, keyID: string, accessKey: string, bucket: string, path: string): string`

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

Uploads a file to an AWS S3 `bucket` on AWS `region` using the **AWS credentials** provided in `keyID` and `accessKey` arguments.
The S3 path of the file is set based on this pattern: `<NODE_NAME>_<NODE_IP>/<FILENAME>`.
Returns the URL of the S3 location once the file is successfully uploaded.

##### Example:

```js
location = vendor.s3.put(
  env.AWS_REGION,
  env.AWS_ACCESS_KEY_ID,
  env.AWS_SECRET_ACCESS_KEY,
  env.S3_BUCKET,
  filePath
);
```

### `vendor.s3.clear(region: string, keyID: string, accessKey: string, bucket: string)`

> (!) This helper is part of the [Pro edition](https://kubeshark.co/pricing).

Clears the content of the folder `<NODE_NAME>_<NODE_IP>/` in the AWS S3 `bucket`.
The folder is simply owned by the Kubeshark worker/node.
It can be called through a job to do a periodic clean up.

##### Example:

```js
vendor.s3.clear(
  env.AWS_REGION,
  env.AWS_ACCESS_KEY_ID,
  env.AWS_SECRET_ACCESS_KEY,
  env.S3_BUCKET
);
```

## PCAP

The `pcap.*` helpers provide certain functionality revolving around **the PCAP-based
network traffic storage mechanism of Kubeshark**.

### `pcap.nameResolutionHistory(): object`

The helper immediately returns a map of **the name resolution history of the given Kubernetes node**. Which
its **keys are UNIX timestamps** and values are yet another map with keys are IPs and values are names and Kubernets namespaces.
The UNIX timestamps mark a change in the name resolution throughout the history.

##### Example:

```js
var nameResolutionHistory = pcap.nameResolutionHistory();
```

### `pcap.snapshot(selectedPcaps?: string[], pcapsDir?: string): string`

It **merges all the PCAP files (TCP/UDP streams) into a single PCAP file** and saves it under the root folder.
The returned `path` has always this pattern: `<UNIX_TIMESTAMP>.pcap`. Then you can supply this file path
to other helpers that accept a file path as argument such as; [`vendor.s3.put`](#vendors3putregion-string-keyid-string-accesskey-string-bucket-string-path-string-string), [`file.move`](#filemoveoldpath-string-newpath-string) or [`file.delete`](#filedeletepath-string).

You can supply a list of PCAP filenames (the base names of TCP/UDP streams) in the optional `selectedPcaps` argument to specify
the list of PCAP files to merge. For example; `data.stream` in [`onItemCaptured(data)`](/en/automation_hooks#onitemcaptureddata-object) hook is a PCAP filename.

You can specify a custom directory using the optional `pcapsDir` argument which contains PCAP files.
By default the merge happens in the internally managed folder of Kubeshark that contains all the PCAP files.
This argument should be used in conjunction with [`file.mkdirTemp`](#filemkdirtempname-string-dir-string-string) and [`file.move`](#filemoveoldpath-string-newpath-string) to collect PCAP files
into a directory.

##### Example:

```js
var dir = file.mkdirTemp("snapshots");
var snapshot = pcap.snapshot(dir);
```

### `pcap.path(tpcOrUdpStream: string): string`

Returns the full path of a given TCP/UDP stream then you can supply this file path
to other helpers that accept a file path as argument such as; [`vendor.s3.put`](#vendors3putregion-string-keyid-string-accesskey-string-bucket-string-path-string-string).

> It's <ins>advised against modifiying these files</ins> using helpers like [`file.write`](#filewritepath-string-content-string), [`file.append`](#fileappendpath-string-content-string), [`file.move`](#filemoveoldpath-string-newpath-string) or [`file.delete`](#filedeletepath-string)
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

## File

The `file.*` helpers provide file system operations on the worker-level (per Kubernetes node) to manipulate files,
aggregate data and temporarily or permanently store data in the disk.

### `file.write(path: string, content: string)`

Writes the string `content` into file at `path`. Throws an error if the file does not exist on given `path`.

##### Example:

```js
file.write("example.txt", "hello");
```

### `file.append(path: string, content: string)`

Appends the string `content` into file at `path`. Throws an error if the file does not exist on given `path`.

##### Example:

```js
file.append("example.txt", " world");
```

### `file.move(oldPath: string, newPath: string)`

Moves the file at `oldPath` to `newPath`. Throws an error if the operation fails.
If `newPath` is a directory then the file is copied to that directory by preserving its
base name.

##### Example:

```js
file.move("example.txt", "hello.txt");
file.move("example.txt", "directory/");
```

### `file.copy(srcPath: string, dstPath: string)`

Copies the file at `srcPath` to `dstPath`. Throws an error if the operation fails.

##### Example:

```js
file.copy("example.txt", "example2.txt");
```

### `file.delete(path: string)`

Deletes the file at `path`. Throws an error if the operation fails.

##### Example:

```js
file.delete("hello.txt")
```

### `file.mkdir(path: string)`

Creates a new directory satisfies `path`, along with any necessary parent directories. Throws an error if the operation fails.

##### Example:

```js
file.mkdir("example/folder/here")
```

### `file.mkdirTemp(name?: string, dir?: string): string`

Creates a new temporary directory in the directory `dir` and returns the path of the new directory. The new directory's name is generated by adding a random string to the end of `name`. Throws an error if the operation fails.

##### Example:

```js
var tempDir = file.mkdirTemp("foo", "example/folder/here")
```

### `file.temp(name: string, dir: string, extension: string): string`

Creates a new temporary file in the directory `dir` and returns the path of the new file. The new directory's name is generated by adding a random string to the end of `name`. The file extension is set to `extension`, default is `.txt`. Throws an error if the operation fails.

##### Example:

```js
var tempFile = file.temp("bar", "example/folder/here", "json")
```

### `file.tar(path: dir): string`

Generates a `.tar.gz` with its name `kubeshark_<UNIX_TIMESTAMP>.tar.gz` based on the files under the directory `dir`. Throws an error if the operation fails.

##### Example:

```js
var tarFile = file.tar("example/folder/here")
```

## Jobs

The `jobs.*` helpers provide certain functionality revolving around **the jobs system of Kubeshark** which augments the scripting system by
scheduling or triggering jobs that you write as JavaScript functions.

### `jobs.schedule(tag: string, cron: string, task: function, limit: number, ...argumentList: any[])`

Schedules a job using the `cron` statement and function given by `task`. The job is uniquely identified by its `tag` and scheduled on all workers (Kubernetes nodes) simultaneously.

`limit` sets the limit for how many times it has to run. (per node)

`argumentList` is passed to the function given by `task`.

##### Example:

```js
function exampleJob() {
  // Your code goes here
}

// Schedule a job that calls `exampleJob` function every 5 seconds
jobs.schedule("example-job", "*/5 * * * * *", exampleJob)
```

### `jobs.remove(tag: string)`

Removes the job scheduled by `tag` from all nodes.

##### Example:

```js
jobs.remove("example-job")
```

### `jobs.removeAll()`

Removes all jobs from all nodes unconditionally.

##### Example:

```js
jobs.removeAll()
```

### `jobs.list(): string[]`

Returns the list of all scheduled jobs (tags).

##### Example:

```js
var tags = jobs.list()
```

### `jobs.run(tag: string)`

Runs the job scheduled by `tag` from all nodes.

##### Example:

```js
jobs.run("example-job")
```

### `jobs.runAll()`

Run all jobs from all nodes unconditionally.

##### Example:

```js
jobs.runAll()
```

### `jobs.scheduler.isRunning(): boolean`

Returns `true` if the job scheduler is running. Otherwise returns `false`.

##### Example:

```js
var status = jobs.scheduler.isRunning()
```

### `jobs.scheduler.start()`

Starts the job scheduler.

##### Example:

```js
var status = jobs.scheduler.start()
```

### `jobs.scheduler.stop()`

Stops the job scheduler.

##### Example:

```js
var status = jobs.scheduler.stop()
```

## KFL

The `kfl.*` helpers provide functionality around the [**Kubeshark Filter Language (KFL)**](/en/filtering#kfl-syntax-reference).

### `kfl.match(query: string, data: object): boolean`

Checks whether the KFL `query` matches to given `data` or not. Returns `true` or `false` accordingly.

##### Example:

```js
function onItemCaptured(data) {
  if (kfl.match("http and response.status == 500", data)) {
    console.log("HTTP 500!")
  } else {
    console.log("Seems OK.")
  }
}
```

### `kfl.validate(query: string): boolean`

Verifies whether a given KFL `query` is a syntactically valid KFL statement. Returns `true` or `false` accordingly.

##### Example:

```js
if (kfl.validate("http and response.status == 500")) {
  console.log("Valid KFL.")
} else {
  console.log("Gibberish!")
}
```


## Environment Variables

The global object `env` holds all of the constants defined in the `scripting.env` field of `$HOME/.kubeshark/config.yaml`
or `kubeshark.yaml` in your current working directory.
Printing this variable allows you to debug the availability of those constants in the runtime.

##### Example:

Suppose you have;

```yaml
scripting:
    env:
      SLACK_AUTH_TOKEN: "foo"
      SLACK_CHANNEL_ID: "bar"
```

in your `kubeshark.yaml`. Then the JavaScript code below;

```js
console.log(JSON.stringify(env));
```

would print;

```
{"SLACK_AUTH_TOKEN":"foo","SLACK_CHANNEL_ID":"bar"}
```

into the console.
