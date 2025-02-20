console.log("content.js injected successfully!");

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "viewMoreButton") {
        console.log("Received message to click 'View More'");

        let clickCounter = 0;
        let searchAttempts = 0;
        const maxSearchAttempts = 5;
        const maxClicks = 5;
        const checkInterval = 1000; // Check every 1 second

        function clickViewMore() {
            let button = document.querySelector(".loading_more_text");
            
            if (button) {
                console.log(`Clicking 'View More   (${clickCounter + 1}/${maxClicks})`, button);
                //console.log(button.tagName); //SPAN

                //simulating click event
                button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                button.dispatchEvent(new Event("mousedown", { bubbles: true }));
                button.dispatchEvent(new Event("mouseup", { bubbles: true }));

                clickCounter++;

                if (clickCounter < maxClicks) {
                    setTimeout(clickViewMore, checkInterval);
                } else {
                    console.log("Finished clicking 'View More' 5 times.");
                }
            } else {
                searchAttempts++;
                if (searchAttempts >= maxSearchAttempts) {
                    console.log(`view more button could not find in ${(maxSearchAttempts)} attemps`)
                } else {
                    console.log("Waiting for 'View More' button to appear...");
                    setTimeout(clickViewMore, checkInterval);
                }
            }
        }

        clickViewMore();
    }
});
