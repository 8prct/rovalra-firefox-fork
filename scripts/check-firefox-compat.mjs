import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
const pkg = JSON.parse(read('package.json'));

assert.equal(manifest.version, '2.6.15.1');
assert.equal(pkg.version, manifest.version);
assert.equal(manifest.background.service_worker, 'background.js');
assert.match(pkg.scripts.build, /scripts\/build-firefox\.js/);
assert.match(read('src/content/index.js'), /import '\.\/core\/firefoxCompat\.js'/);
assert.match(read('src/content/core/firefoxCompat.js'), /cloneInto/);
assert.match(read('src/firefox/backgroundCompat.js'), /firefox-permission-request\.html/);
assert.match(read('src/background/settingsCompat.ts'), /message\?\.type !== "settingsCompatGetRes"/);

const firefoxBuild = read('scripts/build-firefox.js');
assert.match(firefoxBuild, /rovalra-firefox-fork@local/);
assert.match(firefoxBuild, /firefox-event-replay\.js/);

const output = path.join(root, 'dist-firefox');
if (fs.existsSync(output)) {
    const built = JSON.parse(read('dist-firefox/manifest.json'));
    assert.equal(built.version, manifest.version);
    assert.equal(built.browser_specific_settings.gecko.id, 'rovalra-firefox-fork@local');
    assert.equal(built.browser_specific_settings.gecko.strict_min_version, '142.0');
    assert.deepEqual(built.background.scripts, [
        'firefox-background-compat.js',
        'background.js',
    ]);
    assert.ok(built.permissions.includes('contextMenus'));
    assert.ok(!built.optional_permissions.includes('contextMenus'));
    assert.equal(built.content_scripts[0].js[0], 'firefox-event-replay.js');
    assert.ok(built.content_scripts.some((script) => script.js.includes('content.js')));
    assert.ok(fs.existsSync(path.join(output, 'firefox-permission-request.html')));
    assert.ok(fs.statSync(path.join(output, 'content.js')).size < 5 * 1024 * 1024);
}

console.log('Firefox compatibility contract passed.');
