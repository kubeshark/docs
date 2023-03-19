---
title: Jobs
description: Jobs are functions that are automated to run on a schedule. When functions don't depend on certain network behaviors, they can be automated to run on a schedule.
layout: ../../layouts/MainLayout.astro
---

Jobs are functions that are automated to run on a schedule. When functions don't depend on certain network behaviors, they can be automated to run on a schedule.
Jobs are added by adding one line of code at the script scope.

```js
jobs.schedule("push-status-codes-to-influxdb", "0 */1 * * * *", pushStatusCodesToInfluxDB);
```

**Kubeshark** uses a [crontab](https://crontab.guru/) mechanism to schedule Jobs at the node level. It furthers provides complete control over the scheduled Jobs via the dashboard.


## The Jobs Dashboard
The jobs dashboard enables complete control over schedule jobs enabling the following operations:
- Stop a specific Jobs or all Jobs
- Start / Re-start a specific Job or all Jobs
- Delete a specific Job or all Jobs

![Jobs Dashboard](/jobs-dashboard.png)

## Running Jobs Programmatically

While you can manually control the Jobs from the jobs dashboard, you can also control them programmatically from a script using the [`jobs.run`](/en/automation_helpers#jobsruntag-string) helper.

> Visit the [helpers](/en/automation_helpers#jobs) page to read the complete list of helpers related to Jobs.
