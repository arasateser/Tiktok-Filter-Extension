chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "filterAds") {
        console.log(`filtering ads with min ${message.minViews} views`);
        filterAdsByUniqueUsers(message.minViews);
    }
})

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "removeFilters") {
        console.log("removing all filters, showing all ads");

        let ads = document.querySelectorAll(".ad_card");
        ads.forEach(ad => {
            ad.style.display = "block";
        });
    }
});

function parseUniqueUsers(value) {
    if (value === "-" || value.startsWith("0")) {
        return 0; // Not Available or "0-1K" case
    }

    let match = value.match(/^(\d+)(K?)/); // first numbers before K
    if (!match) return 0;

    let num = parseInt(match[1], 10); // numeric part
    if (match[2] === "K") num *= 1000; // convert K to 1000

    return num;
}

function getUniqueUsers(ad) {
    let uniques = ad.querySelectorAll(".ad_item_value");

    let valueElement = uniques[2].textContent; //<span class="ad_item_value">-</span>
    if (valueElement) {
        return parseUniqueUsers(valueElement);
    }
    else {
        console.log("could not find")
        return 31;
    }
}

function filterAdsByUniqueUsers(minUsers) {
    let ads = document.querySelectorAll(".ad_card");
    let totalAds = ads.length;
    let hiddenAds = 0;
    let visibleAds = 0;

    if (totalAds === 0) {
        console.log("no ad found. retrying in 2 secs");
        setTimeout(() => filterAdsByUniqueUsers(minUsers), 3000);
        return;
    }

    console.log(`found ${ads.length} ads`);

    ads.forEach(ad => {
        let uniqueUsers = getUniqueUsers(ad);

        if (uniqueUsers < minUsers) {
            ad.style.display = "none";
            hiddenAds++;
            console.log(`H ${uniqueUsers} unique users`); //hiding an ad with $uniqueUsers unique users

        } else {
            visibleAds++;
        }
    });

    chrome.runtime.sendMessage({
        action: "updateMessage",
        text: `Filtered: ${hiddenAds} | Shown: ${visibleAds}`
    });

    console.log(`Ads shown: ${visibleAds}, Ads filtered: ${hiddenAds}`);
}