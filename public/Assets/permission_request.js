const params = new URLSearchParams(location.search);
const requestId = params.get('requestId');
const permissions = JSON.parse(params.get('permissions') || '[]').map((name) =>
    name === 'contextMenus' ? 'menus' : name,
);

document.getElementById('permission-list').textContent =
    permissions.length > 0
        ? `Requested permissions: ${permissions.join(', ')}`
        : 'No extra permissions are required.';

function finish(granted) {
    chrome.runtime.sendMessage({
        action: 'permissionRequestResult',
        requestId,
        granted,
    });
    window.close();
}

document.getElementById('allow').addEventListener('click', () => {
    if (permissions.length === 0) return finish(true);
    chrome.permissions.request({ permissions }, (granted) =>
        finish(!!granted),
    );
});

document.getElementById('deny').addEventListener('click', () => finish(false));
