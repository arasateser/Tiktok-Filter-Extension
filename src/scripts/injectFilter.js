chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "filterAds") {
        console.log(`filtering ads with min ${message.minViews}\nviews showUndefined: ${message.showUndefined}`);
        filterAdsByUniqueUsers(message.minViews, message.showUndefined);
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
    if (value.startsWith("0")) {
        return 0; // Not Available or "0-1K" case
    } else if (value === "-")
        return "hyphen";

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

function getAdvertiserName(ad) {
    let lightTextLength = ad.querySelectorAll(".ad_info_text_light").length;
    if (lightTextLength === 0) {
        return '';
        //console.log(ad.querySelectorAll(".ad_info_text_light").length)
    } else {
        let advertiserName = ad.querySelectorAll(".ad_info_text_light")[0];
        let advertiserContent = advertiserName.textContent;
        return advertiserContent;
    }
}

function filterAdsByUniqueUsers(minUsers, hideUndefined) {
    let ads = document.querySelectorAll(".ad_card");
    let totalAds = ads.length;
    let hiddenAds = 0;
    let visibleAds = 0;
    //setTimeout(() => filterAdsByUniqueUsers(minUsers, hideUndefined), 3000);

    if (totalAds === 0) {
        console.log("no ad found. retrying in 2 secs");
        setTimeout(() => filterAdsByUniqueUsers(minUsers), 3000);
        return;
    }

    //console.log(`found ${ads.length} ads`);

    ads.forEach(ad => {
        let uniqueUsers = getUniqueUsers(ad);
        let advertiserName = getAdvertiserName(ad);


        if (uniqueUsers < minUsers) {
            ad.style.display = "none";
            hiddenAds++;
            console.log(`Hide ${uniqueUsers} users`); //hiding an ad with $uniqueUsers unique users

        } else if (uniqueUsers === "hyphen" && hideUndefined) {
            ad.style.display = "none";
            hiddenAds++;
            console.log(`Hide '-' users`); //hiding an ad with $uniqueUsers unique users

            } else if (advertiserName === "(Name unavailable)") { //hiding ads without name no matter what
                ad.style.display = "none";
                hiddenAds++;
                console.log(`Hide name unavailable`); //hiding an ad with $uniqueUsers unique users

        } else {
            visibleAds++;
        }
    });

    chrome.storage.local.set({ visibleAds, hiddenAds });

    chrome.runtime.sendMessage({
        action: "updateAdCountPop",
        visible: visibleAds,
        hidden: hiddenAds
    });

    console.log(`Ads shown: ${visibleAds}, Ads filtered: ${hiddenAds}`);
}