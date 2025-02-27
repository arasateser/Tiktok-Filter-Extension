function updateBadge(status) {
    chrome.runtime.sendMessage({
        action: "updateBadge",
        text: status ? "ON" : "" // on when active, remove when inactive
    });
}


if (window.viewMoreScriptLoaded) { //checking if this script already injected
    console.log("viewMore.js already loaded. skipping duplicate injection")
} else {
    window.viewMoreScriptLoaded = true;
    console.log("viewMore.js injected successfully!");

    let observerActive = false; //global olmali ama her calistiginda tekrar olusturulmaya calisiliyor 
    //hata veriyor - programi bozmuyor. - programdaki yeri hakkinda suphelerim 
    //var sadece bunu incelemek icin zaman ayir
    let stopRequested = false;
    let observer = null;

    chrome.runtime.onMessage.addListener((message) => { //listening buttons on the popup
        if (message.action === "stopViewMore") {//kill process button
            console.log("Stop requested. Stopping view more process");
            updateBadge(false); // Revert to default icon

            stopRequested = true;

            if (observerActive) { //if observer alive kill it
                observer.disconnect();
                observerActive = false;
            }
            return;
        }

        if (message.action === "viewMoreButton") { //view more pages button
            console.log("Received message to click 'View More'");

            let clickCounter = 0;
            const maxClicks = message.maxClicks || 5;
            stopRequested = false; //Reset stop request when starting again

            console.log(`Number of pages to load: ${maxClicks}`);

            function clickViewMore(button) {//clicking the view more button func
                if (stopRequested) {
                    console.log("Stop requested. stopping clicks");
                    return;
                }

                if (clickCounter >= maxClicks) {//if the limit reached stop
                    if (observerActive) {
                        console.log(`Finished clicking 'View More' ${maxClicks} times. Stopping observer.`);
                        observer.disconnect();
                        observerActive = false;
                        updateBadge(false); // Change to active
                    }
                } else {//if limit not reached keep clicking
                    console.log(`Clicking 'View More' (${clickCounter + 1}/${maxClicks})`);
                    updateBadge(true);


                    //one click simulation    
                    button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
                    button.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
                    button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

                    clickCounter++;
                }
            }

            function observeViewMore() {//observe the page if view more button reappeared
                if (observerActive) {
                    console.log("observer alrady running skipping duplicate");
                    return
                }

                observerActive = true;

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
}