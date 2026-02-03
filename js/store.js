const storeCoinsEl = document.getElementById("storeCoins");
const storeItemsEl = document.querySelector(".store-items");
const backButton = document.getElementById("backButton");

// Abilities you can buy
const abilities = [
    { name: "Stronger Attack", cost: 20, effect: "Increase attack power" },
    { name: "Defense Boost", cost: 15, effect: "Increase defense" },
    { name: "Heal Potion", cost: 10, effect: "Heal during fights" },
];



// Show coins
storeCoinsEl.textContent = coins;

// Only show store if 3+ battles won
if (battlesWon >= 3) {
    // Add each ability to the store
    abilities.forEach((ability, index) => {
        const div = document.createElement("div");
        div.className = "store-item";
        div.textContent = `${ability.name} - ${ability.cost} coins`;
        div.style.cursor = "pointer";
        div.style.margin = "10px 0";
        div.style.padding = "10px";
        div.style.border = "1px solid #fff";
        div.style.borderRadius = "5px";
        div.style.background = "rgba(255,255,255,0.1)";
        div.addEventListener("click", () => buyAbility(index));
        storeItemsEl.appendChild(div);
    });
} else {
    storeItemsEl.innerHTML = "<p>You need to win at least 3 battles to access the store!</p>";
}



// Buy ability function
function buyAbility(index) {
    const ability = abilities[index];
    if (coins >= ability.cost) {
        coins -= ability.cost;
        alert(`Bought ${ability.name}!`);
        storeCoinsEl.textContent = coins;
        localStorage.setItem("coins", coins); // Save coins back
    } else {
        alert("Not enough coins!");
    }
}



// Back button
backButton.addEventListener("click", () => {
    window.location.href = "hub.html"; // go back to hub
});