---
title: KFL Syntax Reference
description: The filter input enables filtering results using Kubeshark Filter Language (KFL)
layout: ../../layouts/MainLayout.astro
---

**Kubeshark** Filter Language (KFL) is the language implemented inside **Kubeshark** server that enables the user to query the traffic logs efficiently and precisely.

```python
http and request.method == "GET" and request.path != "/example" and (request.query.a > 42 or request.headers["x"] == "y")
```

The language as a whole evaluates into a boolean outcome, always. Such that the record which makes the boolean `true` is a record that matches the filter.

There are certain helper methods that can do more than reduce into a boolean value.

### Literals

The language supports the following literals:

- Nil `nil`
- Boolean `true` or `false`
- Number `42`, `3.14` etc.
- String `"hello world"`
- Regex `r"prefix.*"`

### Operators

Operations can be grouped (precedence) using parentheses `(...)`

> *Note: Operators are evaluated from left to right, excluding parentheses `(...)`*

The language supports the following operators:

#### Logical

`and`, `or`

> *Note: `false and`, `true or` are evaluated fast*

#### Equality

`==`, `!=`

#### Comparison

`>=`, `>`, `<=`, `<`

#### Unary

`!`, `-`

### Helpers

Helpers in KFL are method invocations that enable filtering capability which cannot be provided through the syntax. These are the available helpers in KFL:

#### `startsWith(string)`

Returns `true` if the given selector's value starts with the `string`. e.g. `brand.name.startsWith("Chev")`

#### `endsWith(string)`

Returns `true` if the given selector's value ends with the `string`. e.g. `brand.name.endsWith("let")`

#### `contains(string)`

Returns `true` if the given selector's value contains the `string`. e.g. `brand.name.contains("ro")`

#### `datetime(string) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time that's provided by the `string`. If the given date-time string is not in a recognized format then it evaluates to `false`. The format must be same as `"1/2/2006, 3:04:05 PM"` (`en-US`) e.g. `timestamp > datetime("10/19/2021, 6:29:02 PM")`

It's equal to the `time.Now().UnixNano() / int64(time.Millisecond)` in Go. e.g. `1635190131000`

#### `limit(integer)`

Limits the number of records that are streamed back as a result of a query. Always evaluates to `true`.

#### `json()`

A decoding helper that decodes the given JSON field if it's possible. It's used through chain calls and the JSONPath that's wanted to be accessed can be chained to the end like; `response.body.json().brand.name == "Chevrolet"`

#### `xml()`

A decoding helper that decodes the given XML field if it's possible. It's used through chain calls and the dot-notation path that's wanted to be accessed can be chained to the end like; `response.body.xml().brand.name == "Chevrolet"`

#### `redact(string...)`

A record altering helper that takes N number of `string` typed arguments. The arguments are dot-notation paths and it replaces the value on each matching path with `[REDACTED]` string.

The `json()` and `xml()` helpers are supported inside the arguments of the `redact` helper.

#### `now() integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time now.

#### `seconds(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` seconds before or after from now according to the sign of the argument.

#### `minutes(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` minutes before or after from now according to the sign of the argument.

#### `hours(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` hours before or after from now according to the sign of the argument.

#### `days(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` days before or after from now according to the sign of the argument.

#### `weeks(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` weeks before or after from now according to the sign of the argument.

#### `months(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` months before or after from now according to the sign of the argument.

#### `years(integer) integer`

Returns the UNIX timestamp `integer` which is the equivalent of the time `integer` years before or after from now according to the sign of the argument.

> *Note: Calling an undefined helper makes the whole expression collapse and evaluate to `false`.*

### Selectors

Selectors in KFL are JSONPath(s) that refer to the path in a JSON document. In KFL, every record is a JSON document. Any selector that does not match a path is evaluated to `false`.

Following are some selector examples:

- `brand.name` basic selector
- `request.path[1]` index selector
- `request.headers["a"] == "b"` key selector

Selectors can be combined with a subset of helpers such that they evaluate into a boolean without any operator. e.g. `brand.name.startsWith("Chev")` These are the list of helpers that can be used with selectors:

- `startsWith(string)`
- `endsWith(string)`
- `contains(string)`

Such that instead of writing a boolean expression like `brand.name == "Chevrolet"`, one of the following can be written:

```python
brand.name.startsWith("Chev")
brand.name.endsWith("let")
brand.name.contains("ro")
```

A selector can be compared to another selector as well. Such that for these given JSON document, filters like those can be written:

JSON: `{"model":"Camaro","brand":{"name":"Chevrolet"},"year":2021,"salesYear":2021}` Filter: `year == salesYear`

JSON: `{"model":"Camaro","brand":{"name":"Chevrolet"},"year":2021,"salesYear":2020}` Filter: `year != salesYear`

> *Note: A selector (JSONPath) that couldn't be found in the JSON document makes the whole expression collapse and evaluate to `false`.*

#### Wildcard Selector

Wildcard(`*`) selectors are evaluated into arrays and the elements in the array are checked using the respective operator against whether any or all elements are matching the given criteria or not. So, for example;

- for a JSON like `{"request":{"path":["api","v1","example"]}}` the query `request.path.* == "v1"` returns `true`
- for a JSON like `{"request":{"path":["api","v1","example"]}}` the query `request.path.* == "v2"` returns `false`
- for a JSON like `{"request":{"path":["api","v1","example"]}}` the query `request.path.* != "v2"` returns `true`
- for a JSON like `{"request":{"path":[1, 2, 3]}}` the query `request.path.* > 2` returns `true`
- for a JSON like `{"request":{"path":[1, 2, 3]}}` the query `request.path.* > 4` returns `false`

The wildcard selector can be used to compare two JSON arrays. So, for a JSON like `{"request":{"path":[1, 2, 3]},"response":{"header":[1, 2, 3]}}` the query `request.path.* == response.header.*` checks for full value equality and returns `true`.

Empty arrays are evaluated to `false`, the rest is `true`:

- for a JSON like `{"request":{"path":[{"x":1}, {"x":2}, {"x":3}]}}` the query `request.path.*.x and true` returns `true`. The part of the query `request.path.*.x` evaluates to `[1, 2, 3]`.
- for a JSON like `{"request":{"path":[]}}` the query `request.path.* and true` returns `true`

Please check out [the unit tests](https://github.com/up9inc/basenine/blob/main/server/lib/eval_test.go) of the language for more examples.
