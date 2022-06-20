var started;

if (typeof started === 'undefined') {
    chrome.storage.local.clear()
    started = true;
}
