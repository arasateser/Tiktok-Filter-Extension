document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.getElementById("message");

    const messages = {
        "loadPagesButton": "pressed loadPagesButton",
        "overrideButton": "pressed overrideButton",
    };

    // Use event delegation to handle all button clicks
    //document.body.addEventListener("click", function (event) {
    //    if (event.target.tagName === "BUTTON") {
    //        const buttonId = event.target.id;
    //        messageElement.textContent = messages[buttonId] || "Unknown button clicked!";
    //    }
    //});

    document.body.addEventListener("click", function (event) {
        const buttonId = event.target.id;
        if (buttonId === "loadPagesButton") {
            messageElement.textContent = messages[event.target.id]
        }
        else if (buttonId === "overrideButton") {
            messageElement.textContent = messages[event.target.id]
        }
        else {
            messageElement.textContent = "Unknown button clicked!";
        }
    });

});
