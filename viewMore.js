console.log("viewMore.js injected successfully!");

let observerActive = true;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "viewMoreButton") {
        console.log("Received message to click 'View More'");

        let clickCounter = 0;
        const maxClicks = 5;
        let observer;

        function clickViewMore(button) {

            if (clickCounter >= maxClicks) {
                if (observerActive) {
                    console.log(`Finished clicking 'View More' ${maxClicks} times. Stopping observer.`);
                    observer.disconnect();
                    observerActive = false;
                }
            } else {
                console.log(`Clicking 'View More' (${clickCounter + 1}/${maxClicks})`);

                //one click simulation    
                button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
                button.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
                button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

                clickCounter++;
            }
        }

        function observeViewMore() {
            observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        let button = document.querySelector(".loading_more_text");
                        if (button) {
                            clickViewMore(button);
                        }
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            console.log("Started watching for 'View More' button");
        }
        
        observeViewMore();
    }
    return false;
});
