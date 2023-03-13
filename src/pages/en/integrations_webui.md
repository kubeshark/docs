---
title: Web UI Alerts
description:  
layout: ../../layouts/MainLayout.astro
---
The **Web UI** can show alerts using the `test.pass` and `test.fail` helpers. The `test.pass` will color a traffic entry green, where the `test.fail` helper will color the traffic entry red. You can use these helpers in a script based on a programmatic decision.

Here's an example for a script that uses these helpers:

```js
function onItemQueried(data) {
  if (data.protocol.name == "http")
    return test.pass(data);
  else
    return test.fail(data);
}
```
The results look like this:

![Web UI Alerts](/web-ui-alerts.png)

> Read more about the `test.*` helpers in the [helpers](/en/automation_helpers) section.