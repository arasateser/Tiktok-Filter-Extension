document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.getElementById("message");

    document.getElementById("viewMoreButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Load More Pages";

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["viewMore.js"]
            }, () => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "viewMoreButton" });
            });
        });
    });

    document.getElementById("overrideButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Override Products";
    });
});
