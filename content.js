chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "startScrolling") {
        let scrollCount = 0;
        const scrollLength = 1000; // Pixels to scroll per step
        const maxScrolls = 10;
        const scrollInterval = 500; // 3-second delay

        const scrollIntervalId = setInterval(() => {
            if (scrollCount < maxScrolls) {
                window.scrollBy(0, scrollLength);
                scrollCount++;
            } else {
                clearInterval(scrollIntervalId);
            }
        }, scrollInterval);
    }
});
