---
title: Web UI Alerts
description:  
layout: ../../layouts/MainLayout.astro
---
The **Web UI** can show alerts using the `test.pass` and `test.fail` helpers.

Here's an example for a script that uses these helpers and the results:
```js
function onItemQueried(data) {
  if (data.protocol.name == "http")
    return test.pass(data);
  else
    return test.fail(data);
}
```
![Web UI Alerts](/web-ui-alerts.png)

> Read more about the `test.*` helpers in the [helpers](/en/automation_helpers) section.