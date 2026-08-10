const params = new URLSearchParams(location.search);
const requestId = params.get('requestId');
let permissions = [];

try {
    permissions = JSON.parse(params.get('permissions') || '[]').filter(
        Boolean,
    );
} catch {}

document.getElementById('permissions').textContent =
    permissions.join(', ') || 'none';

function finish(granted) {
    chrome.runtime.sendMessage(
        {
            action: 'permissionRequestResult',
            requestId,
            granted: !!granted,
        },
        () => window.close(),
    );
}

document.getElementById('allow').addEventListener('click', () => {
    chrome.permissions.request({ permissions }, (granted) => finish(granted));
});
document.getElementById('cancel').addEventListener('click', () => finish(false));
