document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.getElementById("message");

    document.getElementById("viewMoreButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Load More Pages";

        const maxClicks = parseInt(maxClicksInput.value, 10) || 5;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["viewMore.js"]
            }, () => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "viewMoreButton", maxClicks });
            });
        });
    });

    document.getElementById("killProcessButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Kill Process Button";

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopViewMore" });
        })
    });

    document.getElementById("overrideButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Override Products";
    });
});
