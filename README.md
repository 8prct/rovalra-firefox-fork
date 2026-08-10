## RoValra Firefox / Zen port by 8prct

Unofficial Firefox and [Zen Browser](https://zen-browser.app/) port of
**RoValra 2.6.4.2**, maintained by [8prct](https://github.com/8prct).
Original RoValra: [NotValra/RoValra](https://github.com/NotValra/RoValra).

Build locally:

```bash
npm ci
npm run build
```

Load the current unsigned build in Zen from
`about:debugging#/runtime/this-firefox` using the generated
`dist/manifest.json`. The `.xpi` in `web-ext-artifacts/` is the packaged build
for testing or Mozilla signing.

---

<p align="center">
  <img src="./public/Assets/logo.svg" alt="RoValra" width="520">
</p>

<p align="center">
  <strong>RoValra</strong> is a modern browser extension that enhances the Roblox experience with quality-of-life features and advanced tooling, all completely free.
</p>

<p align="center">
  <a href="https://rovalra.com"><strong>Official Website</strong></a> •
  <a href="https://chromewebstore.google.com/detail/RoValra%20-%20Roblox%20Improved/njcickgebhnpgmoodjdgohkclfplejli">Chrome Web Store</a> •
  <a href="https://discord.gg/GHd5cSKJRk">Discord</a>
</p>

<p align="center">
  <a href="https://github.com/NotValra/RoValra/releases"><img alt="GitHub Downloads" src="https://img.shields.io/github/downloads/NotValra/RoValra/total?label=Downloads"></a>
  <a href="https://chromewebstore.google.com/detail/rovalra-roblox-improved/njcickgebhnpgmoodjdgohkclfplejli"><img alt="Chrome Webstore Installs" src="https://img.shields.io/chrome-web-store/users/njcickgebhnpgmoodjdgohkclfplejli?logo=googlechrome&logoColor=white&label=Weekly%20Users&link=https%3A%2F%2Fchromewebstore.google.com%2Fdetail%2Frovalra-roblox-improved%2Fnjcickgebhnpgmoodjdgohkclfplejli"></a>
  <a href="https://chromewebstore.google.com/detail/rovalra-roblox-improved/njcickgebhnpgmoodjdgohkclfplejli/reviews"><img alt="Rating" src="https://img.shields.io/chrome-web-store/stars/njcickgebhnpgmoodjdgohkclfplejli?logo=reverbnation&logoColor=yellow&link=https%3A%2F%2Fchromewebstore.google.com%2Fdetail%2Frovalra-roblox-improved%2Fnjcickgebhnpgmoodjdgohkclfplejli%2Freviews&label=Rating"></a>
  <a href="https://discord.gg/GHd5cSKJRk"><img alt="Discord" src="https://img.shields.io/discord/1143867106765570088?logo=discord&logoColor=white&label=Discord&color=002bff&link=https://discord.gg/GHd5cSKJRk"></a>

</p>

---

## Official Links

- **Website:** https://rovalra.com
- **Features:** https://www.rovalra.com/features/
- **FAQ & Support:** https://www.rovalra.com/support/

> [!WARNING]
> Original RoValra is distributed through the official [website](https://rovalra.com) and [Chrome Web Store](https://chromewebstore.google.com/detail/RoValra%20-%20Roblox%20Improved/njcickgebhnpgmoodjdgohkclfplejli). This repository is 8prct's unofficial Firefox/Zen Browser port.

---

## Support the Project

If you find RoValra useful, consider giving the repository a **star⭐**.\
Or [donate robux.](https://www.roblox.com/games/store-section/9452973012) \
It helps a lot and supports continued development.

---

## Installation

### Option 1: Firefox / Zen temporary install

The current GitHub build is unsigned. In Firefox or Zen it can be loaded for
testing until the browser restarts:

1. Download or clone this repository.
2. Run `npm ci` and `npm run build`.
3. Open `about:debugging#/runtime/this-firefox`.
4. Choose **Load Temporary Add-on**.
5. Select `dist/manifest.json`.

For a permanent release-channel installation, the packaged XPI must first be
[signed by Mozilla through AMO](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/).
After signing, open `about:addons`, choose the settings cog, and select
**Install Add-on From File**.

Chrome users can install the original extension from the
[Chrome Web Store](https://chromewebstore.google.com/detail/RoValra%20-%20Roblox%20Improved/njcickgebhnpgmoodjdgohkclfplejli).

> [!WARNING]
> This Firefox/Zen port is maintained by 8prct and is not controlled by the original RoValra developers. Use it at your own risk.

---

### Option 2: Manual Installation (Developer Mode)

<details>
<summary><strong>Expand instructions</strong></summary>

### Build from source

```bash
npm ci
npm run build
```

### Load into browser

1. Open `about:debugging#/runtime/this-firefox` in Firefox or Zen
2. Choose **Load Temporary Add-on**
3. Select `dist/manifest.json`
4. The selected folder must directly contain:
    - `manifest.json`

</details>

---

## License

RoValra source code is licensed under the **GNU General Public License version 3.0** unless otherwise stated.

The following image assets are **not** licensed under GPL-3.0 and are not available for reuse:

- `public/Assets/Contributor.png`
- `public/Assets/icon-16.png`
- `public/Assets/icon-48.png`
- `public/Assets/icon-128.png`
- `public/Assets/RoValraLogo.png`
- `public/Assets/DonatorTiers/`

These images, including the RoValra logo and related logo/icon artwork, are fully copyrighted by Valra. All rights, title, and ownership in the RoValra logo belong to Valra. They may not be copied, redistributed, modified, published, used, or included in any other project, product, service, website, extension, fork, or derivative work without prior written permission from Valra.

---

## Credits

- **Contributors:**
  [https://github.com/NotValra/RoValra/graphs/contributors](https://github.com/NotValra/RoValra/graphs/contributors)

- **Sales / Revenue Data:**
  [https://github.com/workframes/roblox-owner-counts](https://github.com/workframes/roblox-owner-counts)

- **UI & Chrome Store Graphics:**
  mmfw

- **Development:**
  Gemini, Valra and [the contributors](https://github.com/NotValra/RoValra/graphs/contributors)

- **Region Searcher:**
  Originally a Python script by l5se (used with permission, improved and rewritten for the extension)

- **Additional Development Help:**
  [Aspect](https://github.com/Aspectise)

- **Extension Logo:**
  _Gilbert_, a fish caught in
  [Fisch](https://www.roblox.com/games/16732694052/Fisch)

- **Early help with locating Servers:**
  7_lz (Discord)

- **Roblox Datacenter IP Research:**
  Julia -
  [Datacenter IP Research](https://github.com/RoSeal-Extension/Top-Secret-Thing)

- **Project Name:**
  coweggs (Discord)
