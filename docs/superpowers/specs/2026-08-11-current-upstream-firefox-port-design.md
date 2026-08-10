# Current Upstream Firefox/Zen Port Design

## Goal

Port RoValra upstream `main` commit `2ab800f19622f531f239332be17dadb5553e23d4` to Firefox 142+ and current Zen Browser, preserving Chrome feature parity and 8prct's fork branding.

## Source and Version

- Replace the fork's RoValra source with the exact upstream snapshot at `2ab800f`.
- Publish the fork as `2.6.4.1`, distinguishing it from upstream tag `v2.6.4` and its 75 later commits.
- Keep upstream feature implementation unchanged unless a Firefox WebExtension incompatibility requires a focused patch.

## Firefox Compatibility

- Use a Manifest V3 Firefox background module through `background.scripts`; Firefox does not support `background.service_worker`.
- Preserve the existing Firefox/Zen MAIN-world injection bridge for request interception and server ID extraction at `document_start`.
- Map Chrome's `contextMenus` permission and API to Firefox's required `menus` permission and API; Mozilla's validator rejects menu permissions as optional.
- Request optional permissions from an extension-owned popup because Firefox requires permission requests to follow a direct user action.
- Keep the existing Roblox, RoValra API, and CDN host permissions needed by background fetches and extension resources.
- Keep `browser_specific_settings.gecko`, the extension ID, Firefox 142 minimum, and Mozilla data-collection declaration.

## Full Feature Parity

- Import every feature, route, setting, locale, style, and asset from upstream `2ab800f`.
- Restore the `/docs` API Docs feature omitted by the previous port.
- Build API Docs as a separate lazy-loaded bundle so the main content bundle remains below Mozilla's per-file validator ceiling.
- Add a compatibility contract check that fails when required Firefox manifest fields, page scripts, API Docs output, or upstream feature routes are missing.

## Build and Runtime Flow

1. The Firefox manifest starts the module background script and the isolated `content.js` at `document_start`.
2. The compatibility bridge injects upstream page-context interception scripts exactly once in the top frame.
3. `content.js` initializes the same routed features as upstream; `/docs` loads the separate API Docs bundle only on that route.
4. Permission-gated features request access through the extension popup, then the background script activates the matching listeners.

## Error Handling

- Reject unsupported background fetch hosts through upstream validation.
- Normalize permission aliases at the background boundary.
- Return denied or timed-out permission requests to callers instead of leaving them pending.
- Log lazy API Docs loading failures without preventing unrelated RoValra features from initializing.

## Verification

- Run the compatibility contract check through the project test command.
- Install dependencies cleanly and run the production build.
- Assert the manifest version and Firefox background configuration, required output files, and main bundle size.
- Run `web-ext lint` with zero errors and package a fresh XPI.
- Launch the packaged build in Firefox or Zen and smoke-test extension startup, popup loading, content initialization, page interception, settings, permission requests, and API Docs loading.
- Inspect the final diff, commit the port, and push `main` to `8prct/rovalra-firefox-fork`.

## Non-goals

- Supporting Firefox releases older than 142.
- Refactoring upstream feature code unrelated to browser compatibility.
- Maintaining separate long-lived Chrome and Firefox source trees.
