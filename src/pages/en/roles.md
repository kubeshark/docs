---
title: Roles & Permissions
description: Built-in roles, capability vocabulary, group mapping, custom roles, and the license-side feature ceiling.
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

Kubeshark's authorization model is composed of two layers that combine to produce a user's **effective capabilities**:

1. **Role layer** — every authenticated user is resolved to one role. The role carries a set of capabilities (what UI surfaces and API endpoints they can use) and an optional namespace scope (which Kubernetes namespaces' traffic they can see).
2. **License layer** — the license document carries a `Features` list that caps the capability set. Capabilities not unlocked by the current license are filtered out, regardless of role.

The role configuration is shared across both [OIDC](/en/oidc) and [SAML](/en/saml) — admins maintain a single set of role definitions and switch identity backends without rewriting them.

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
| `dissection:live`      | Consume the live API stream (the dashboard's live traffic view).                     |
| `pods:target:write`    | Edit the pod-targeting list (`POST /pods/target/*`).                                 |
| `settings:write`       | Write the rest of the Settings dialog.                                               |
| `snapshot:read`        | List / read snapshots, download PCAPs, view delayed-dissection results.              |
| `snapshot:write`       | Create / delete / rename / upload snapshots.                                         |
| `snapshot:dissection`  | Start / stop delayed-dissection job lifecycle.                                       |

The vocabulary is closed: unknown capability strings in a custom role are dropped with a warning at hub startup (visible in `kubectl logs`).

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

If no candidates remain, `tap.auth.defaultRole` is applied. The chart's default is `kubeshark-viewer`. Set `defaultRole: ""` for strict-deny — authenticated users with no recognized claim get no capabilities.

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

## Authentication bypass paths

Three code paths skip the role resolution entirely and grant the full `kubeshark-admin` capability set:

- **Anonymous mode** (`tap.auth.enabled: false`) — every request runs as admin.
- **License-Key header** — the in-cluster controller path used by Kubeshark's own tooling (CLI, MCP).
- **InternalAuth bearer token** — the in-cluster controller path used by dissection-job pods.

These bypasses ensure that AI agents on MCP and delayed-dissection jobs continue to function regardless of how restrictively the role config is set.

## Verifying the active role

`GET /whoami` returns the authenticated user's identity, resolved `role`, effective `capabilities`, and `authzFilters` (the KFL clauses derived from the role's namespace scope). Use it to diagnose access issues.

The dashboard's **Identity & Access** modal — click your name in the top-right — shows the same information in a UI: identity, resolved role, capability list, namespace scope.
