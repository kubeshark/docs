---
title: Rich Query Language
description: The filter input enables filtering results using Kubeshark Filter Language (KFL)
layout: ../../layouts/MainLayout.astro
---

[**Kubeshark Filter Language (KFL)**](/en/kfl_syntax_reference) is a rich query language that filters traffic that match a query. For example; to only see the items with HTTP client error responses (`400` – `499`), enter:

```python
http and response.status == r"4.*"
```

and click the **Apply** button. Your traffic stream will look like this:

![Filter example](/filter-applied.png)

## Queryable UI Elements

When you hover over UI elements and they display a green plus sign, it means this element can be added to your query. Selecting an element with a green plus sign will add this element to the query. For example, selecting this queryable element:

![query](/filter-ui-example.png)

adds `response.status == 201` to your query and only displays `HTTP 201` responses in the live traffic streaming.

## Filtering Guide (Cheatsheet)

**Kubeshark** has a built-in cheatsheet to guide for the filtering functionality.

![KFL Cheatsheet](/cheatsheet.png)

The cheatsheet is available by pressing the button that is adjacent to the **Apply** button, right to the filter input.

![KFL Cheatsheet button](/cheatsheet-button.png)

> Visit the [KFL Reference](/en/kfl_reference) page for a complete list of KFL helpers.
