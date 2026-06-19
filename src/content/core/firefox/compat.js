// Firefox MV3 does not run background service workers and older Firefox-based
// browsers do not consistently honor manifest-declared MAIN-world scripts.
// Inject the page interceptor from the regular document_start content script.

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
