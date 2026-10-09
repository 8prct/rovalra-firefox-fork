# RoValra Firefox / Zen Browser Fork

An unofficial fork of [RoValra](https://github.com/NotValra/RoValra), maintained by **8prct** for Firefox and [Zen Browser](https://zen-browser.app/).

The current fork release is **2.6.15.1**, based on upstream RoValra 2.6.15 (`b4418391`). Upstream now includes its own Firefox build; this fork uses that build path while keeping the fork's extension ID so existing temporary installs retain their settings.

> This project is an independent fork. It is not affiliated with or endorsed by the original RoValra developers.

## Download

[Download the latest unsigned Firefox/Zen build](./web-ext-artifacts/rovalra-firefox-2.6.15.1.xpi)

The XPI is unsigned. It can be loaded temporarily for testing. Permanent installation requires Mozilla signing.

## Install in Firefox or Zen

### Recommended: build and load the extension

1. Clone or download this repository.
2. Install dependencies and build the extension:

   ```bash
   npm ci
   npm run build
   ```

3. Open `about:debugging#/runtime/this-firefox`.
4. Select **Load Temporary Add-on**.
5. Choose `dist-firefox/manifest.json`.

The temporary add-on is removed when the browser restarts. After pulling an update, run `npm run build`, remove the old temporary add-on, and load `dist-firefox/manifest.json` again.

### Load the packaged XPI

You can also select `web-ext-artifacts/rovalra-firefox-2.6.15.1.xpi` through **Load Temporary Add-on**. Since the file is unsigned, it is intended for development and testing rather than permanent installation.

For a permanent Firefox or Zen installation, submit the XPI for signing through [Mozilla Add-ons](https://extensionworkshop.mozilla.org/documentation/publish/signing-and-distribution-overview/), then install the signed file from `about:addons`.

## Requirements

- Firefox or Zen Browser with Firefox MV3 support
- Firefox version 142 or newer
- Node.js and npm for building from source
- A Roblox account for Roblox features that require authentication

## Build and verify

```bash
npm ci
npm run build
npm test
```

`npm test` checks the Firefox compatibility contract. To lint the generated extension with Mozilla's tooling:

```bash
npm run lint:firefox
```

## Troubleshooting

If the settings page shows only the RoValra title or controls do not respond:

1. Remove the old temporary add-on from `about:debugging`.
2. Pull the latest fork and run `npm run build`.
3. Load `dist-firefox/manifest.json` again.
4. Open the add-on's **Inspect** page in `about:debugging` and check the console for errors.

Load `dist-firefox`, not `dist` (the Chrome build). Rebuild after updating the source.

## Credits and license

- Fork maintenance and previous Firefox/Zen port: **8prct**
- Current RoValra features and Firefox build: [NotValra/RoValra](https://github.com/NotValra/RoValra) and its contributors
- Sales and revenue data: [workframes/roblox-owner-counts](https://github.com/workframes/roblox-owner-counts)
- Region search research: [RoSeal-Extension/Top-Secret-Thing](https://github.com/RoSeal-Extension/Top-Secret-Thing)

RoValra source code is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html), unless otherwise stated.

The logo and related image assets are not licensed for reuse. This includes:

- `public/Assets/Contributor.png`
- `public/Assets/icon-16.png`
- `public/Assets/icon-48.png`
- `public/Assets/icon-128.png`
- `public/Assets/RoValraLogo.png`
- `public/Assets/DonatorTiers/`

For issues specific to this port, please use the [fork's issue tracker](https://github.com/8prct/rovalra-firefox-fork/issues). For the original Chrome extension, use the [upstream RoValra repository](https://github.com/NotValra/RoValra).
