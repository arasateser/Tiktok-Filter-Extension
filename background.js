chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateBadge") {
        chrome.action.setBadgeText({ text: message.text });
        chrome.action.setBadgeBackgroundColor({ color: "#00C853" }); // green
    }
});
