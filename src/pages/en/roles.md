---
title: Roles & Permissions
description: Built-in roles, capability vocabulary, group mapping, custom roles, and the license-side feature ceiling.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark's authorization model is composed of two layers that combine to produce a caller's **effective capabilities**:

1. **Role layer** — every caller is resolved to one role. The role carries a set of capabilities (what UI surfaces and API endpoints they can use) and an optional namespace scope (which Kubernetes namespaces' traffic they can see).
2. **License layer** — the license document carries a `Features` list that caps the capability set. Capabilities not unlocked by the current license are filtered out, regardless of role.

The role configuration is shared across both [OIDC](/en/oidc) and [SAML](/en/saml) — admins maintain a single set of role definitions and switch identity backends without rewriting them.

**Roles apply whether or not authentication is enabled.** `tap.auth.enabled` decides whether callers are *identified*; it does not decide whether they are *authorized*. With authentication off nobody logs in, every caller is unidentified, and every caller is resolved to `tap.auth.defaultRole` — which the chart defaults to `kubeshark-admin`, so an installation that never configured authorization behaves as it always has. Narrowing that one value is what makes a deployment read-only without an identity provider. See [Deployments without an identity provider](#deployments-without-an-identity-provider).

## Built-in roles

Four built-in roles ship with Kubeshark. Their names and capability presets are immutable — operators can map SSO groups onto them but cannot rename them or change which capabilities they grant.

| Role                  | Use case                                          | Live traffic | Snapshots tab | Settings / pod targeting |
|-----------------------|---------------------------------------------------|--------------|---------------|--------------------------|
| `kubeshark-admin`     | Full access — all capabilities, all namespaces.   | Read + control | Read + write + dissection | Yes |
| `kubeshark-realtime`  | Live-focused. Watches live, toggles dissection, edits pod targeting + settings. **No snapshot tab.** | Read + control | Hidden | Yes |
| `kubeshark-snapshot`  | Snapshot-focused. Creates / reads / deletes snapshots, runs delayed dissection. **No live access.** | Hidden | Read + write + dissection | No |
| `kubeshark-viewer`    | Read-everything baseline. Watches live + browses snapshots. **No state changes.** | Read | Read | No |

All four built-in roles are unscoped (`namespaces: "*"`). Namespace restrictions are an opt-in feature of custom roles only.

## Capability vocabulary

Capabilities are the atomic units of authorization. Each gated UI control and API endpoint is wired to exactly one capability.

| Capability             | Gates                                                                                |
|------------------------|--------------------------------------------------------------------------------------|
| `dissection:control`   | Toggle live dissection on/off (`POST /settings/dissection`, UI Resume/Pause).        |
| `dissection:live`      | Consume the live API stream (`UIEventService.RegisterClient`, the dashboard's live traffic view) and read L7 data boundaries. |
| `pods:target:write`    | Change what is captured — every `POST /pods/target/*` route: `regex`, `namespaces`, `excluded-namespaces`, `pod-list`, `excluded-pods`, `node-list`, `excluded-nodes` and the raw `bpf` override. |
| `settings:write`       | Deployment-wide configuration writes: the rest of the Settings dialog, the enabled-dissector set (`POST /settings/enabled-dissectors`), stored preset filters (`POST /query/filter`), the continuous-PCAP-dump knobs and out-of-cluster worker registration. |
| `snapshot:read`        | List / read snapshots, download PCAPs, view delayed-dissection results, browse recordings and continuous PCAP dumps. |
| `snapshot:write`       | Create / delete / rename / upload snapshots, write recordings, fetch records into the cluster, start and delete PCAP dumps. |
| `snapshot:dissection`  | Start / stop delayed-dissection job lifecycle.                                       |
| `mcp:use`              | Use the MCP (Model Context Protocol) tool surface (`/mcp/*`). Coarse all-or-nothing — a principal with it may use every MCP tool, otherwise none. |

The vocabulary is closed: unknown capability strings in a custom role are dropped with a warning at hub startup (visible in `kubectl logs`).

Two things are deliberately **not** capabilities, because they are not questions about the caller. Whether a deployment offers them at all is an operator decision:

- **Scripting** — `scripting.enabled` (default `false`). With it off, `/scripts`, `/scripts/exec`, `/jobs` and the AI assistant answer `409` and the dashboard hides the scripting UI. See [Scripting](/en/automation_scripting).
- **Network policies** — `tap.networkPolicies.enabled` (default `false`). Those routes create and remove Kubernetes NetworkPolicy objects, which acts outside Kubeshark's own data. With it off they answer `409`.

### Built-in role presets

| Capability             | `admin` | `realtime` | `snapshot` | `viewer` |
|------------------------|:-------:|:----------:|:----------:|:--------:|
| `dissection:control`   |    ✓    |     ✓      |            |          |
| `dissection:live`      |    ✓    |     ✓      |            |    ✓     |
| `pods:target:write`    |    ✓    |     ✓      |            |          |
| `settings:write`       |    ✓    |     ✓      |            |          |
| `snapshot:read`        |    ✓    |            |     ✓      |    ✓     |
| `snapshot:write`       |    ✓    |            |     ✓      |          |
| `snapshot:dissection`  |    ✓    |            |     ✓      |          |
| `mcp:use`              |    ✓    |            |            |          |

Only `kubeshark-admin` carries `mcp:use`, so by default the MCP tool surface is admin-only. Other roles are `403`'d on `/mcp/*` — the dashboard reads data boundaries via the Connect-RPC API instead, so it does not need `mcp:use`.

The in-cluster CLI credential (see [CLI & headless credentials](#cli-and-headless-credentials-on-a-gated-hub)) resolves like any other principal: `kubeshark-cli` is not a built-in role name, so it is not identity-matched, and it lands on `tap.auth.defaultRole` unless `tap.auth.groupMapping` says otherwise. With the chart default of `kubeshark-admin` that grants `mcp:use` and `kubeshark mcp` works. **If you narrow `defaultRole`, map the ServiceAccount explicitly** or the CLI loses MCP along with everyone else:

```yaml
tap:
  auth:
    defaultRole: kubeshark-viewer
    groupMapping:
      kubeshark-cli: kubeshark-admin
```

### Where capabilities are enforced

There are three enforcement points, sharing one capability vocabulary:

| Surface | Enforced by | Notes |
|---|---|---|
| REST | Route table in the Hub's authz middleware | Routes absent from the table are not capability-gated, though they still pass through authentication. |
| Connect-RPC | Interceptor keyed on procedure name | Covers the live stream, snapshot management and export, base-entry reads, and the delayed-dissection lifecycle. |
| MCP | Group-level check on `/mcp/*` | All-or-nothing on `mcp:use`; routes added later inherit it. |

Namespace scope is AND-ed onto REST queries and both stream paths. The legacy `/ws*` endpoints are authenticated but not capability-gated, and namespace scope does not apply to them.

## Mapping SSO groups to roles

The `tap.auth.groupMapping` block translates SSO claim values (OIDC group names, SAML attribute values) into role names:

```yaml
tap:
  auth:
    groupMapping:
      sso-engineering-leads: kubeshark-admin
      sso-sre-oncall: kubeshark-realtime
      sso-support: kubeshark-viewer
      payments-team: payments-viewer    # custom role, see below
```

Built-in role names (`kubeshark-*`) can also be **identity-matched** — if a user's claim already contains the literal string `kubeshark-admin`, they resolve to admin without needing an explicit `groupMapping` entry. Identity-match is built-in-only: custom role names MUST appear in `groupMapping` to participate.

When a user's claim resolves to multiple role candidates, the highest-precedence built-in wins (`admin > realtime > snapshot > viewer`). Built-in roles always rank above custom roles when both match.

If no candidates remain, `tap.auth.defaultRole` is applied. The chart's default is `kubeshark-admin`. Set `defaultRole: ""` for strict-deny — authenticated users with no recognized claim get no capabilities.

`defaultRole` is also what an unidentified caller gets when authentication is disabled, so the value answers two questions at once. The strict-deny reading applies only with authentication on: with it off, an empty or unrecognized `defaultRole` falls back to `kubeshark-admin` rather than locking the deployment out of itself.

## Custom roles

Operators can declare custom roles under `tap.auth.roles` to grant a narrower capability set or to limit visibility to specific namespaces:

```yaml
tap:
  auth:
    groupMapping:
      payments-team: payments-viewer
      checkout-ops: checkout-ops
    roles:
      payments-viewer:
        capabilities:
          - snapshot:read
        namespaces: "payments,checkout"
      checkout-ops:
        capabilities:
          - snapshot:read
          - snapshot:write
          - snapshot:dissection
        namespaces: "checkout"
```

### Rules

- **Names with the `kubeshark-` prefix are reserved** for built-in roles and will be rejected at hub startup.
- **Custom roles must be referenced from `groupMapping`** — identity-match doesn't apply to custom role names.
- **Unknown capability strings** in `capabilities:` are dropped with a warning at hub startup.
- **Built-in roles win over custom roles** when a user's claim matches both.

### Namespace scope

The `namespaces` field accepts a comma-separated list with `*` and glob support:

| Value             | Effect                                                                              |
|-------------------|-------------------------------------------------------------------------------------|
| `""` (unset)      | Deny all — the user can authenticate but sees no traffic.                           |
| `"*"`             | Every namespace; no scope filter applied.                                           |
| `"foo"`           | Only the literal namespace `foo`.                                                   |
| `"foo,bar"`       | OR over literal namespaces; whitespace tolerated.                                   |
| `"foo-*"`         | Glob expansion against the cluster's currently-watched namespaces.                  |
| `"a, b, c-*"`     | Mix of literals and globs in the same list.                                         |

The hub expands the list into a server-side KFL filter (`src.namespace in {…} OR dst.namespace in {…}`) AND-ed onto every query and stream. Out-of-scope entries never leave the hub — enforcement covers REST queries, the legacy `/ws` stream, and the Connect-RPC dashboard stream.

## License layer

The license document carries an optional `Features` list. Each feature unlocks a group of capabilities:

| Feature      | Unlocks                                                       |
|--------------|---------------------------------------------------------------|
| `realtime`   | `dissection:live`                                             |
| `snapshot`   | `snapshot:read`, `snapshot:write`, `snapshot:dissection`      |

Three deployment-admin capabilities are **always granted** regardless of the license: `dissection:control`, `settings:write`, `pods:target:write`. These gate cluster-admin actions, which are role-side concerns rather than commercial ones.

### Enforcement rules

- **`Features` field absent or `null`** (legacy licenses) — no enforcement; role preset applies as-is.
- **`Features: []`** (explicit empty list) — no enforcement; role preset applies as-is. This is what the mint pipeline ships for every edition today.
- **`Features: ["realtime"]`** — enforcement on; effective capabilities = role preset ∩ (realtime caps ∪ always-allowed caps).

`/license` surfaces the active feature list and the resolved capability ceiling for inspection.

## Deployments without an identity provider

`tap.auth.enabled: false` turns off *identification*, not authorization. There is no login and no identity, but there is still a question of what an unidentified caller may do, and `tap.auth.defaultRole` answers it. The capability gates run exactly as they do on a gated Hub, on REST, MCP and the Connect-RPC API alike.

```yaml
tap:
  auth:
    enabled: false
    defaultRole: kubeshark-viewer
```

That is a read-only deployment: anyone who can reach the Hub can watch live traffic and browse snapshots, and nobody can change pod targeting, toggle dissection, write settings, create or delete snapshots, or reach `/mcp/*`. No identity provider, no SSO configuration, no login screen.

Leaving `defaultRole` at its `kubeshark-admin` default keeps the historical behaviour: anyone who can reach the Hub can do anything. An empty or unrecognized value falls back to `kubeshark-admin` too, so a typo cannot silently lock an operator out of their own installation.

## Authentication bypass paths

Two code paths skip role resolution entirely and carry the full `kubeshark-admin` capability set. Both are machine principals that *did* authenticate — they are not anonymous:

- **License-Key header** — callers presenting the installed license key, used by Kubeshark's own tooling. Also the CLI's transitional fallback credential when it cannot mint a ServiceAccount token (see below).
- **InternalAuth bearer token** — the in-cluster controller path used by dissection-job pods and by the Worker DaemonSet when it seeds name resolution and capture targets over HTTP.

These bypasses ensure delayed-dissection jobs and traffic ingestion keep working regardless of how restrictively the role config is set. Note that the CLI's ServiceAccount-token path is **not** among them: it resolves a role like any other principal.

## CLI and headless credentials on a gated Hub

When the Hub enforces authentication, the CLI and its `mcp` subcommand need a real credential — the dashboard's browser SSO flow isn't available to headless callers. Kubeshark issues a **scoped ServiceAccount token** for this:

- The CLI mints a short-lived token for the `kubeshark-cli` ServiceAccount via the Kubernetes TokenRequest API (audience `kubeshark-hub`) and presents it to the Hub in the custom **`X-Kubeshark-Authorization`** header. (The standard `Authorization` header is consumed by the Kubernetes API-server proxy before it reaches the Hub, so a custom header is used.)
- Who may use the CLI against a gated Hub is bounded by **Kubernetes RBAC** — specifically, who is allowed to `create serviceaccounts/token` for `kubeshark-cli`. The chart provisions this ServiceAccount and its token-minter Role when `tap.auth.cli.enabled: true`, and controls the allowed subjects via `tap.auth.cli.subjects`.
- The Hub only accepts tokens for ServiceAccounts named in its `AUTH_CLI_SERVICE_ACCOUNTS` allowlist (populated by the chart as `<namespace>:kubeshark-cli`). The ServiceAccount identity resolves to a role through the same `groupMapping` / `defaultRole` pipeline as SSO users. `kubeshark-cli` is not a built-in role name, so it is not identity-matched: absent a `groupMapping` entry it lands on `tap.auth.defaultRole`, which the chart defaults to `kubeshark-admin`. A deployment that narrows `defaultRole` must map `kubeshark-cli` explicitly, or the CLI is held to the narrowed role and `kubeshark mcp` is `403`'d on `mcp:use`.
- If the CLI cannot mint a token (no kube access — e.g. `mcp --url` against a remote deployment), pass the token explicitly via `--token` / `KUBESHARK_HUB_TOKEN`. See [MCP Installation](/en/mcp/cli).

With `tap.auth.enabled: false` the token path is a no-op and requests are admitted without identification — but they are still authorized as `tap.auth.defaultRole`, so `kubeshark mcp` against an ungated Hub needs that role to carry `mcp:use`. The default (`kubeshark-admin`) does.

## Verifying the active role

`GET /whoami` returns the authenticated user's identity, resolved `role`, effective `capabilities`, and `authzFilters` (the KFL clauses derived from the role's namespace scope). Use it to diagnose access issues.

The dashboard's **Identity & Access** modal — click your name in the top-right — shows the same information in a UI: identity, resolved role, capability list, namespace scope.
