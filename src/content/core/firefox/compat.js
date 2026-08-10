// Firefox MV3 uses a document background script, and this page script must run
// in Roblox's world early enough to intercept page requests.
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

/**
 * Dispatches data to a script running in the page's main world.
 * Firefox blocks page scripts from reading objects created in an extension's
 * isolated world unless the value is explicitly cloned into the page.
 */
export function dispatchPageEvent(name, detail) {
    const cloneIntoPage = globalThis.cloneInto;
    const pageDetail =
        typeof cloneIntoPage === 'function'
            ? cloneIntoPage(detail, window)
            : detail;

    document.dispatchEvent(
        new CustomEvent(name, {
            detail: pageDetail,
        }),
    );
}
