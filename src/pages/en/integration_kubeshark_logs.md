---
title: Aggregate Custom Logs
description: The easiest way to aggregate logs is by using Kubeshark logs.
layout: ../../layouts/MainLayout.astro
---

## Aggregate Custom Logs

The easiest way to aggregate logs is by using [Kubeshark](https://kubeshark.com) logs. You can aggregate custom logs to either the Hub's log or the Workers' logs.

Using a helper, you can print any string, JSON object, or a combination of both to [Kubeshark](https://kubeshark.com) logs with a custom log level.

### Example

Here’s a quick example of how to use the various methods:

```javascript
if (utils.nodeName() == "hub") { // Send to the Hub's logs
  aggregation.msg("AP0", "Hello world " + i + " " + d);
  aggregation.json("AP1", "Interface", { 
    "key": i, 
    "data": d 
  });
} else { // Send to all Workers' logs
  aggregation.jsonWithMsg("AP2", "Interface", { 
    "key": i, 
    "data": d 
  }, "Hello world " + i + " " + d);
}
```

### Log Output Example

Here’s an example of how such logs might appear in [Kubeshark](https://kubeshark.com) logs:

```shell
2024-12-14T19:02:45-08:00 APP Interface={"data":6,"key":12}
2024-12-14T19:02:45-08:00 APP Interface={"data":11,"key":12}
2024-12-14T19:02:45-08:00 APP Hello world 12 6 Interface={"data":6,"key":12}
2024-12-14T19:02:45-08:00 AP0 Hello world 12 2
2024-12-14T19:02:45-08:00 APP Hello world 12 11 Interface={"data":11,"key":12}
2024-12-14T19:02:45-08:00 AP1 Interface={"data":0,"key":12}
2024-12-14T19:02:45-08:00 APP Hello world 12 13 Interface={"data":13,"key":12}
2024-12-14T19:02:45-08:00 APP Interface={"data":17,"key":12}
2024-12-14T19:02:45-08:00 APP Interface={"data":16,"key":12}
2024-12-14T19:02:45-08:00 APP Hello world 12 17 Interface={"data":17,"key":12}
2024-12-14T19:02:45-08:00 AP2 Hello world 12 3 Interface={"data":3,"key":12}
2024-12-14T19:02:45-08:00 AP0 Hello world 12 14
2024-12-14T19:02:45-08:00 APP Hello world 12 16 Interface={"data":16,"key":12}
2024-12-14T19:02:45-08:00 AP2 Hello world 12 7 Interface={"data":7,"key":12}
2024-12-14T19:02:45-08:00 AP1 Interface={"data":2,"key":12}
```
