---
title: Jobs
description: Jobs are functions that are automated to run on a schedule. When functions don't depend on certain network behaviors, they can be automated to run on a schedule. 
layout: ../../layouts/MainLayout.astro
---

Jobs are functions that are automated to run on a schedule. When functions don't depend on certain network behaviors, they can be automated to run on a schedule. 

As network hooks can be very expensive in terms of computing resources, it is recommended to attempt to run scripts as Jobs and use network hooks only when necessary.

**Kubeshark** uses a [crontab](https://crontab.guru/) mechanism to schedule Jobs at the node level. It furthers provides complete control over the scheduled Jobs via the **Web UI**.


## The Jobs Dashboard
The Jobs Dashboard enables complete control over schedule jobs enabling the following operations:
- Stop a specific Jobs or all Jobs
- Start / Re-start a specific Job or all Jobs
- Delete a specific Job or all Jobs

![Jobs Dashboard](/jobs-dashboard.png)

## Running Jobs Programmatically

While you can manually control the Jobs from the jobs dashboard, you can also control them programmatically from a script using the [`jobs.run`](/en/scripting_api_reference#jobsruntag-string) helper.

> Visit the [Scripting API Reference](/en/scripting_api_reference#jobs) page to read the complete list of helpers related to Jobs.
