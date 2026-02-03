// Load coins and battles won from localStorage
let coins = Number(localStorage.getItem("coins")) || 0;
let battlesWon = Number(localStorage.getItem("battlesWon")) || 0;
let openedChests =
    JSON.parse(localStorage.getItem("openedChests")) || [];



// hub stages save
let stage = Number(localStorage.getItem("stage")) || 1;



function saveGame() {
    localStorage.setItem('paraDiesSave', JSON.stringify(gameState));
}



function loadGame() {
    const saved = localStorage.getItem('paraDiesSave');
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    console.log("Game loaded", parsed);
    return parsed;
}




function resetGame() {
    localStorage.clear();
    location.reload();
}


document.addEventListener("DOMContentLoaded", () => {
    loadGame();
});