document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.getElementById("message");
    const maxClicksInput = document.getElementById("maxClicksInput");

    function sendMessageToScript(action, data = {}) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length === 0) return;

            chrome.tabs.sendMessage(tabs[0].id, { action, ...data }, function (response) {
                console.log("sent message:", action);
            });
        });
    }
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "updateMessage") {
            document.getElementById("message").textContent = message.text;
        }

        if (message.action === "updateAdCountPop") {
            document.getElementById("adCountPop").textContent = `Ads: ${message.visible} shown / ${message.hidden} hidden`;
        }
    });

    document.getElementById("viewMoreButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Load More Pages";
        const maxClicks = parseInt(maxClicksInput.value, 10) || 20;
        sendMessageToScript("viewMoreButton", { maxClicks });
    });

    document.getElementById("killProcessButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Kill Process Button";
        sendMessageToScript("stopViewMore");
    });

    document.getElementById("filterViewsButton").addEventListener("click", function () {
        const minViews = parseInt(document.getElementById("minViews").value, 10) || 10; //get the decimal if not put 10
        const showUndefined = document.getElementById("hideUndefined").checked; // getting checkbox value
        document.getElementById("message").textContent = "Filter Views Pressed";
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length === 0) return;

            chrome.tabs.sendMessage(tabs[0].id, { action: "filterAds", minViews, showUndefined });
        });
    });

    document.getElementById("removeFiltersButton").addEventListener("click", function () {
        document.getElementById("message").textContent = "Remove Filters Pressed";

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length === 0) return;

            chrome.tabs.sendMessage(tabs[0].id, { action: "removeFilters" });
        });
    });
});