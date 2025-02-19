document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.getElementById("message");

    //const messages = {
    //    "loadPagesButton": "pressed loadPagesButton",
    //    "overrideButton": "pressed overrideButton",
    //};

    //document.body.addEventListener("click", function (event) {
    //    const buttonId = event.target.id;
    //    if (buttonId === "loadPagesButton") {
    //        messageElement.textContent = messages[event.target.id]
    //        auto
    //    }
    //    else if (buttonId === "overrideButton") {
    //        messageElement.textContent = messages[event.target.id]
    //    }
    //    else {
    //        messageElement.textContent = "Unknown button clicked!";
    //    }
    //});

    document.getElementById("loadPagesButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Load More Pages";

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            }, () => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "startScrolling" });
            });
        });
    });


    document.getElementById("overrideButton").addEventListener("click", function () {
        messageElement.textContent = "Pressed Override Products";
        // Placeholder for future functionality
    });
});
