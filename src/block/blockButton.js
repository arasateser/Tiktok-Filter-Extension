console.log("blockButton injected");
function addButtonsToAds() {
    let ads = document.querySelectorAll(".ad_card");

    ads.forEach(ad => {
        if (ad.querySelector(".block-button")) return; //return if duplicate

        let adInfoElement = ad.querySelector(".ad_info_text");
        if (!adInfoElement) return;

        let adInfoText = adInfoElement.textContent.trim();

        let button = document.createElement("button"); //create button
        button.textContent = "X";
        button.classList.add("block-button");

        button.addEventListener("click", function () {
            document.querySelectorAll(".ad_card").forEach(otherAd => {
                let otherAdInfoElement = otherAd.querySelector(".ad_info_text");
                if (otherAdInfoElement && otherAdInfoElement.textContent.trim() === adInfoText) {
                    otherAd.style.display = "none";
                    console.log(`Hide ${adInfoText}`)
                }
            });
        });

        ad.style.position = "relative";
        ad.appendChild(button);
    });
}

setTimeout(() => {
    addButtonsToAds();
}, 5000);