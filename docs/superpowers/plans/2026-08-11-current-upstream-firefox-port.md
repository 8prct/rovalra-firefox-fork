# Current Upstream Firefox/Zen Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port upstream RoValra `2ab800f19622f531f239332be17dadb5553e23d4` as Firefox/Zen release `2.6.4.1` with all upstream features, including API Docs.

**Architecture:** Import the upstream tree unchanged, then apply a small Firefox layer at the manifest, page-script injection, optional-permission, and build boundaries. Keep Swagger out of the main content bundle and load it as a packaged ES module only when API Docs initializes.

**Tech Stack:** JavaScript, Manifest V3 WebExtensions, esbuild, Sass, Node.js assertions, `web-ext`.

## Global Constraints

- Upstream source commit is exactly `2ab800f19622f531f239332be17dadb5553e23d4`.
- Fork version is `2.6.4.1` and maintainer credit is `8prct`.
- Supported browsers are Firefox 142+ and current Zen Browser.
- Upstream feature code stays unchanged except where Firefox compatibility requires a focused patch.
- API Docs remains enabled and `dist/content.js` stays below 5 MiB.
- No new runtime dependency is added. Add `@eslint/js` as the missing development dependency already imported by upstream's ESLint configuration.

---

### Task 1: Import the upstream snapshot and add the failing compatibility contract

**Files:**

- Replace: upstream-controlled project files, excluding `.git`, `node_modules`, `dist`, `web-ext-artifacts`, and `docs`
- Create: `scripts/check-firefox-compat.mjs`
- Modify: `package.json`

**Interfaces:**

- Consumes: upstream checkout `/tmp/rovalra-upstream-latest` at `2ab800f`
- Produces: a reproducible upstream source snapshot and `npm test` compatibility contract

- [ ] **Step 1: Verify the source revision**

Run:

```bash
git -C /tmp/rovalra-upstream-latest rev-parse HEAD
git -C /tmp/rovalra-upstream-latest status --short
```

Expected: hash `2ab800f19622f531f239332be17dadb5553e23d4` and no changed files.

- [ ] **Step 2: Import upstream while preserving fork-owned state**

Run:

```bash
rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='web-ext-artifacts' \
  --exclude='docs' \
  /tmp/rovalra-upstream-latest/ ./
```

- [ ] **Step 3: Write the compatibility contract**

Create `scripts/check-firefox-compat.mjs`:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
const pkg = JSON.parse(read('package.json'));

assert.equal(manifest.version, '2.6.4.1');
assert.equal(pkg.version, manifest.version);
assert.deepEqual(manifest.background, {
    scripts: ['background.js'],
    type: 'module',
});
assert.ok(manifest.permissions.includes('menus'));
assert.ok(!manifest.optional_permissions.includes('contextMenus'));
assert.equal(
    manifest.browser_specific_settings.gecko.strict_min_version,
    '142.0',
);
assert.ok(
    manifest.web_accessible_resources[0].resources.includes(
        'swagger-ui-bundle.js',
    ),
);

const index = read('src/content/index.js');
assert.match(index, /injectFirefoxPageScripts\(\)/);
assert.match(index, /initApiDocs/);
assert.match(index, /paths:\s*\['\/docs'\]/);

const apiDocs = read('src/content/features/developer/apiDocs.js');
assert.match(
    apiDocs,
    /chrome\.runtime\.getURL\(\s*['"]swagger-ui-bundle\.js['"]\s*\)/,
);

const background = read('src/background/background.js');
assert.match(background, /permission_request\.html/);
assert.match(background, /permissionRequestResult/);
assert.match(background, /chrome\.contextMenus/);

const build = read('build.js');
assert.match(build, /dist\/swagger-ui-bundle\.js/);

const serverIds = read('src/content/core/games/servers/serverids.js');
assert.match(serverIds, /serverid_extractor\.js/);

const dist = path.join(root, 'dist');
if (fs.existsSync(dist)) {
    const builtManifest = JSON.parse(read('dist/manifest.json'));
    assert.equal(builtManifest.version, manifest.version);
    assert.ok(builtManifest.permissions.includes('menus'));
    assert.ok(!builtManifest.optional_permissions.includes('contextMenus'));
    assert.ok(fs.existsSync(path.join(dist, 'swagger-ui-bundle.js')));
    assert.ok(fs.statSync(path.join(dist, 'content.js')).size < 5 * 1024 * 1024);
}

console.log('Firefox compatibility contract passed.');
```

- [ ] **Step 4: Expose the check through npm**

Add this script to `package.json`:

```json
"test": "node scripts/check-firefox-compat.mjs"
```

- [ ] **Step 5: Run the contract and verify RED**

Run:

```bash
npm test
```

Expected: FAIL because the freshly imported Chrome manifest is `2.6.4`, uses `background.service_worker`, and lacks the Firefox lazy Swagger output.

---

### Task 2: Apply the minimal Firefox/Zen compatibility layer

**Files:**

- Modify: `manifest.json`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `build.js`
- Create: `src/content/core/firefox/compat.js`
- Modify: `src/content/index.js`
- Modify: `src/content/features/developer/apiDocs.js`
- Modify: `src/background/background.js`
- Create: `public/Assets/permission_request.html`
- Create: `public/Assets/permission_request.js`
- Modify: `public/Assets/popup/popup.js`
- Modify: `public/Assets/locales/en.json`
- Modify: `src/content/features/settings/index.js`
- Modify: `README.md`

**Interfaces:**

- Consumes: upstream features and Chrome WebExtension message actions
- Produces: Firefox manifest/background startup, page-world interception, optional permission requests, and lazy Swagger loading

- [ ] **Step 1: Set Firefox metadata and manifest entry points**

Set version `2.6.4.1`, fork name/author/homepage/description, the existing Roblox/RoValra/CDN host permissions, and:

```json
"content_scripts": [
  {
    "matches": ["*://*.roblox.com/*"],
    "js": ["content.js"],
    "css": ["css/sitewide.css", "css/rovalra.css"],
    "run_at": "document_start",
    "all_frames": false
  }
],
"permissions": ["declarativeNetRequest", "storage", "scripting", "menus"],
"background": {
  "scripts": ["background.js"],
  "type": "module"
},
"optional_permissions": ["webNavigation", "webRequest"]
```

Add `swagger-ui-bundle.js` and the permission-request page files to `web_accessible_resources`. Keep:

```json
"browser_specific_settings": {
  "gecko": {
    "id": "rovalra-firefox-fork@local",
    "strict_min_version": "142.0",
    "data_collection_permissions": {
      "required": ["none"],
      "optional": []
    }
  }
}
```

- [ ] **Step 2: Restore fork package metadata**

Set package and lockfile root versions to `2.6.4.1`; set author `8prct`, Firefox/Zen description, repository `https://github.com/8prct/rovalra-firefox-fork.git`, and retain all upstream dependencies. Keep the `test` script from Task 1.

- [ ] **Step 3: Restore the page-world bridge**

Create `src/content/core/firefox/compat.js` using the existing one-shot injection:

```js
export function injectFirefoxPageScripts() {
    if (window.top !== window.self) return;
    if (document.documentElement.dataset.rovalraFirefoxInjected === 'true')
        return;

    document.documentElement.dataset.rovalraFirefoxInjected = 'true';

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('intercept.js');
    script.addEventListener('load', () => script.remove(), { once: true });
    (document.head || document.documentElement).appendChild(script);
}
```

Import it at the top of `src/content/index.js` and call `injectFirefoxPageScripts()` immediately before route initialization. Keep upstream's `initApiDocs` import and `/docs` route unchanged.

- [ ] **Step 4: Split Swagger from the main content bundle**

In `apiDocs.js`, replace the package-name dynamic import with:

```js
swaggerUiBundlePromise = import(
    chrome.runtime.getURL('swagger-ui-bundle.js')
).then((module) => module.default || module);
```

In `build.js`, keep minification enabled and add an esbuild ESM output:

```js
esbuild
    .build({
        ...commonConfig,
        stdin: {
            contents:
                "import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js'; export default SwaggerUIBundle;",
            resolveDir: __dirname,
            sourcefile: 'swagger-ui-entry.js',
        },
        outfile: 'dist/swagger-ui-bundle.js',
        bundle: true,
        format: 'esm',
    })
    .catch(() => process.exit(1));
```

Keep the 8prct Firefox/Zen banner and Swagger CSS copy.

- [ ] **Step 5: Move optional permission prompts to a user-click popup**

Normalize upstream's `contextMenus` permission to Firefox's required `menus` permission and route menu calls through `chrome.menus || chrome.contextMenus`. Replace the `requestPermission` message case so it:

1. Opens `public/Assets/permission_request.html` with requested permissions and a request ID.
2. Waits for `permissionRequestResult` from that extension page.
3. Returns `granted: false` after five minutes if the popup is abandoned.

The popup's Allow button must call:

```js
chrome.permissions.request({ permissions }, (granted) =>
    chrome.runtime.sendMessage({
        action: 'permissionRequestResult',
        requestId,
        granted: !!granted,
    }),
);
```

The Cancel button sends the same message with `granted: false`. Keep check, revoke, permission listeners, and context-menu creation from upstream.

- [ ] **Step 6: Restore 8prct branding without replacing upstream credit**

- Point popup and settings GitHub links to `https://github.com/8prct/rovalra-firefox-fork`.
- Add locale key `settings.credits.firefoxPort` crediting 8prct for the Firefox/Zen port and NotValra for original RoValra.
- Render that credit above upstream's contributors list.
- Update the README header, build/install instructions, current version, unofficial-port warning, and maintainer credit.

- [ ] **Step 7: Build and verify GREEN**

Run:

```bash
npm ci --cache /tmp/rovalra-npm-cache
npm run build
npm test
```

Expected: all commands exit 0, `dist/swagger-ui-bundle.js` exists, and `dist/content.js` is below 5 MiB.

---

### Task 3: Verify parity, package, commit, and publish

**Files:**

- Remove: previous tracked `web-ext-artifacts/rovalra-firefox-2.6.2.xpi`
- Create: `web-ext-artifacts/rovalra-firefox-2.6.4.1.xpi`

**Interfaces:**

- Consumes: verified `dist/`
- Produces: installable XPI and pushed `main`

- [ ] **Step 1: Confirm only intentional source files differ from upstream**

Run:

```bash
diff -qr /tmp/rovalra-upstream-latest/src src
diff -qr /tmp/rovalra-upstream-latest/public public
```

Expected differences are limited to the Firefox compatibility, API Docs loader, branding, locale, permission popup, settings credit, and background files listed in Task 2. Every other feature source must match upstream.

- [ ] **Step 2: Run final static checks**

Run:

```bash
git diff --check
npm test
node -e "const fs=require('fs');const m=require('./dist/manifest.json');const n=fs.statSync('./dist/content.js').size;console.log({version:m.version,background:m.background,contentBytes:n,contentMiB:(n/1024/1024).toFixed(2),swagger:fs.existsSync('./dist/swagger-ui-bundle.js')})"
```

Expected: no whitespace errors, compatibility contract passes, version `2.6.4.1`, Firefox background scripts, Swagger `true`, and content below 5 MiB.

- [ ] **Step 3: Lint and package with Mozilla tooling**

Run:

```bash
npx --yes web-ext@latest lint --source-dir dist
npx --yes web-ext@latest build --source-dir dist --artifacts-dir web-ext-artifacts --overwrite-dest
```

Expected: zero lint errors. Upstream `innerHTML` warnings are acceptable notices for this port.

- [ ] **Step 4: Create the named XPI and checksum**

Copy the generated ZIP to `web-ext-artifacts/rovalra-firefox-2.6.4.1.xpi`, remove the old tracked XPI, and run:

```bash
shasum -a 256 web-ext-artifacts/rovalra-firefox-2.6.4.1.xpi
```

- [ ] **Step 5: Launch a Firefox/Zen smoke test**

Locate the installed browser executable, run `web-ext run --source-dir dist --firefox <executable>`, and verify:

- extension startup has no manifest/background errors;
- popup opens and its fork GitHub link works;
- Roblox receives `content.js` and the page interceptor;
- settings and permission toggles render;
- `/docs` requests `swagger-ui-bundle.js` only when visited.

Stop the temporary browser profile after collecting console evidence.

- [ ] **Step 6: Commit and push**

Run:

```bash
git add -A
git diff --cached --check
git commit -m "Port current RoValra 2.6.4 main to Firefox and Zen"
git push origin main
git status --short --branch
git log -2 --oneline --decorate
```

Expected: clean `main` tracking `origin/main`, with the implementation commit above the design commit.
