chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded and has a URL
    if (changeInfo.status === 'complete' && tab.url) {
        // We inject into all pages, including the new tab page
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["script.js"]
        });
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["styles.css"]
        });
    }
});