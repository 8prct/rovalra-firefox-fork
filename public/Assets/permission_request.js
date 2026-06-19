const params = new URLSearchParams(location.search);
const requestId = params.get('requestId');
let permissions = [];

try {
    permissions = JSON.parse(params.get('permissions') || '[]');
} catch {
    permissions = [];
}

permissions = permissions
    .map((name) => (name === 'contextMenus' ? 'menus' : name))
    .filter(Boolean);

const permissionName = document.querySelector('#permName');
const permissionList = document.querySelector('#permList');

if (permissions.length === 1) {
    permissionName.textContent = permissions[0];
    permissionList.hidden = true;
} else {
    permissionName.textContent = `${permissions.length} additional permissions`;
    for (const permission of permissions) {
        const item = document.createElement('li');
        item.textContent = permission;
        permissionList.appendChild(item);
    }
}

function respond(granted) {
    chrome.runtime.sendMessage(
        {
            action: 'permissionRequestResult',
            requestId,
            granted,
        },
        () => window.close(),
    );
}

document.querySelector('#grantBtn').addEventListener('click', () => {
    chrome.permissions.request({ permissions }, (granted) => {
        respond(!!granted);
    });
});

document
    .querySelector('#denyBtn')
    .addEventListener('click', () => respond(false));
