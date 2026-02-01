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
You can access this console through the [Kubeshark](https://kubeshark.com) dashboard or the `kubeshark console` command.

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

### `vendor.webhook(method: string, url: string, body: string, object: headers)`

This helper executes an HTTP request to a webhook (the HTTP endpoint) that's defined by HTTP `method` and URL in the `url`
argument with the HTTP body as the string in the `body` argument. YOu can add headers to the request by providing a key/value pair set as the last argument.

The webhook returns the response as value.

##### Example:

```js
response = vendor.webhook(
  "POST",
  "https://webhook.site/a42ca96d-4984-45dc-8f72-a601448399dc",
  JSON.stringify(data),
  {
    "content-type": "application/json"
  }
);
```

### `vendor.slack(webhookUrl: string, pretext: string, text: string, color: string)`

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

### `vendor.slackBot(token: string, channelID: string, pretext: string, text: string, color: string, fields?: object, files?: object)`

Sends a Slack message to the Slack channel in `channelID` argument using the provided access token in `token` argument.

`fields` optional argument is a list key-value pairs which describes the fields that are going to be added to the Slack message.
The keys are field names. The values should be string. There is always a *Timestamp* field added to the list of fields automatically.

`files` optional argument is a list of key-value pairs which describes the list of files that are going to be attached into the Slack message.
The keys are file names. The values are file paths.

It's especially useful for **alerting** a group of developers about **an issue detected through the network traffic**, such as
*"HTTP 500 response status code:"*

##### Example:

```js
function onItemCaptured(data) {
  // Check if it's an HTTP request and the response status is 500
  if (data.protocol.name === "http" && data.response.status === 500) {
    var files = {};

    // Get the path of the PCAP file that this stream belongs to
    var pcapPath = pcap.path(data.stream);
    files[data.stream + ".pcap"] = pcapPath;

    // Dump the `data` argument into a temporary JSON file
    var dataPath = file.temp("data", "", "json");
    file.write(dataPath, JSON.stringify(data, null, 2));
    files["data.json"] = dataPath;

    // Send a detailed Slack message with 2 attached files
    vendor.slackBot(
      SLACK_AUTH_TOKEN,
      SLACK_CHANNEL_ID,
      "Server-side Error in Kubernetes Cluster",                                    // Pretext
      "An HTTP request resulted with " + data.response.status + " status code:",    // Text
      "#ff0000",                                                                    // Color
      {
        "Service": data.dst.name,
        "Namespace": data.namespace,
        "Node": data.node.name,
        "HTTP method": data.request.method,
        "HTTP path": data.request.path
      },
      files
    );

    // Delete the temporary file
    file.delete(dataPath);
  }
}
```

### `vendor.influxdb(url: string, token: string, organization: string, bucket: string, measurement: string, data: object, tags?: object)`

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

### `vendor.s3.put(bucket: string, path: string, region: string, keyID: string, accessKey: string): string`

Uploads a file to an AWS S3 `bucket` on AWS `region` using the either AWS authentication. AWS authentication can be achieved using:
- Specific credentials: `keyID` and `accessKey` arguments
- Shared configuration (e.g. IRSA, kube2aim)

The S3 path of the file is set based on this pattern: `<NODE_NAME>_<NODE_IP>_<RUN_ID>/<FILENAME>`.
Returns the URL of the S3 location once the file is successfully uploaded.

#### Example:

```js
location = vendor.s3.put(
  env.S3_BUCKET,
  filePath
  env.AWS_REGION,             
  env.AWS_ACCESS_KEY_ID,      // optional. will default to shared configuration 
  env.AWS_SECRET_ACCESS_KEY   // optional. will default to shared configuration 
);
```

#### Using IRSA or kube2iam 

`vendor.s3.put(bucket: string, path: string, region: string): string`

[IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) is a method for not using specific credentials but rather use a role associated with a service account.
To use IRSA, you'd need to:
1. Provide annotation of the IAM role
2. Use shared configuration

For example, when using help (or CLI), add the following property:

```shell
--set-json 'tap.annotations={"eks.amazonaws.com/role-arn":"arn:aws:iam::7456....3350:role/s3-role"}'
```

And as the helper use:

```js
location = vendor.s3.put(
  env.S3_BUCKET,
  filePath
  env.AWS_REGION
);
```
### `vendor.s3.clear(region: string, keyID: string, accessKey: string, bucket: string)`

Clears the content of the folder `<NODE_NAME>_<NODE_IP>/` in the AWS S3 `bucket`.
The folder is simply owned by the [Kubeshark](https://kubeshark.com) worker/node.
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
### `vendor.gcs.put(bucket: string, path: string, saKeyObj: json): string`

Uploads a file to a GCS `bucket` on GCP using a service account key.

The GCS path of the file is set based on this pattern: `<NODE_NAME>_<NODE_IP>_<RUN_ID>/<FILENAME>`.
Returns the URL of the S3 location once the file is successfully uploaded.

#### Example:

```js
location = vendor.s3.put(
  env.GCS_BUCKET,
  filePath
  JSON.parse(env.GCS_SA_KEY_JSON)             
);
```
### `vendor.gcs.clear(bucket: string, , saKeyObj: json)`

Clears the content of the folder `<NODE_NAME>_<NODE_IP>/` in the GCS `bucket`.
The folder is simply owned by the [Kubeshark](https://kubeshark.com) worker/node.
It can be called through a job to do a periodic clean up.

##### Example:

```js
vendor.s3.clear(
  env.AWS_REGION,
  env.AWS_ACCESS_KEY_ID,
  env.AWS_SECRET_ACCESS_KEY,
  env.S3_BUCKET
);

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
By default the merge happens in the internally managed folder of [Kubeshark](https://kubeshark.com) that contains all the PCAP files.
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

> It's <ins>advised against modifying these files</ins> using helpers like [`file.write`](#filewritepath-string-content-string), [`file.append`](#fileappendpath-string-content-string), [`file.move`](#filemoveoldpath-string-newpath-string) or [`file.delete`](#filedeletepath-string)
> because the TCP/UDP streams are internally tracked, written and updated files
> that emerge from the Kubernetes network traffic capture.
> <ins>Modifying these files can break the core functionality of [Kubeshark](https://kubeshark.com).</ins>

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

## ChatGPT

The `chatgpt.*` helpers lets you use [OpenAI's ChatGPT](https://openai.com/blog/chatgpt) in your scripts.

### `chatgpt.prompt(apiKey: string, prompt: string, maxTokens?: number): string`

Prompts ChatGPT using [OpenAI's API](https://platform.openai.com/docs/api-reference/introduction) with given `apiKey`.
You build the `prompt` string argument by starting with a question and include some network data to get a response from ChatGPT.
`maxTokens` optional argument lets you set the "the maximum number of tokens to generate in the completion", the default value is `1024`.

##### Example:

```js
function onItemCaptured(data) {
  if (data.protocol.name == "http") {
    // Delete internally used fields to not confuse ChatGPT
    delete data.passed
    delete data.failed

    var payload = JSON.stringify(data);

    var response = chatgpt.prompt(
      env.OPENAI_API_KEY,
      "Did the HTTP request failed in this HTTP request-response pair? " + payload
    );
    console.log("ChatGPT:", response);

    var score = chatgpt.sentiment(response);
    if (score.pos > 0.4) {
      console.log("ALERT! ChatGPT is detected a failed HTTP request:", response, "Payload:", payload);
    }
  }
}
```

### `chatgpt.sentiment(text: string): object`

Does [sentiment analysis](https://en.wikipedia.org/wiki/Sentiment_analysis) on a given `text` input and returns the
score object below:

```go
type Score struct {
	Negative float64 `json:"neg"`
	Neutral  float64 `json:"neu"`
	Positive float64 `json:"pos"`
	Compound float64 `json:"compound"`
}
```

> This helper is supposed to be used in conjunction with [chatgpt.prompt](#chatgptpromptapikey-string-prompt-string-maxtokens-number-string) helper
> in such a way that you pass the **response of ChatGPT** to this helper to get a **sentiment analysis score**.
> Using this score, you can detect whether the ChatGPT's judgement is **positive or negative**.
> Alternatively, you can tell ChatGPT to respond only using **"Yes" or "No"**. In that case, **you don't require** `chatgpt.sentiment` helper
> but **you lose the context** in the ChatGPT's response.


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
