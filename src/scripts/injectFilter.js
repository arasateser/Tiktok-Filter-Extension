function parseUniqueUsers(value) {
    if (value === "-" || value.startsWith("0")) {
        return 0; // Not Available or "0-1K" case
    }

    let match = value.match(/^(\d+)(K?)/); // first numbers before K
    if (!match) return 0;

    let num = parseInt(match[1], 10); // numeric part
    //if (match[2] === "K") num *= 1000; // convert K -- ihtiyac yok kullanicidan alinan deger carpilacak

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

    if (ads.length === 0) {
        console.log("no ad found. retrying in 2 secs");
        setTimeout(() => filterAdsByUniqueUsers(minUsers), 3000);
        return;
    }

    console.log(`found ${ads.length} ads`);

    ads.forEach(ad => {
        let uniqueUsers = getUniqueUsers(ad);

        if (uniqueUsers < minUsers) {
            ad.style.display = "none";
            //console.log(`Hiding `);
            console.log(`this ad has ${uniqueUsers} unique users`);

        } else {
            //console.log(`Keeping `);
            console.log(`this ad has ${uniqueUsers} unique users`);

        }
    });
}
filterAdsByUniqueUsers(9);


//PROBLEEMMMOOO : PARSELANMIS SAYILAR DOGRU GELMIYOR YAZDIKLARINI GOZDEN GECIR GELEN
//DEGERLERE VE HANGI REKLAMLARIN TAKILDIGINA BAK GONDERDIGIN DEGERE GORE YANLIS FILTRELENIYORLAR