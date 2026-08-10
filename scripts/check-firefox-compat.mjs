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
    assert.ok(
        fs.statSync(path.join(dist, 'content.js')).size < 5 * 1024 * 1024,
    );
}

console.log('Firefox compatibility contract passed.');
