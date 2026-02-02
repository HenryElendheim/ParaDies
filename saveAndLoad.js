function saveGame() {
    localStorage.setItem('paraDiesSave', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('paraDiesSave');
    if (saved) {
        const parsed = JSON.parse(saved);

        // Merge loaded data into gameState
        Object.assign(gameState.player, parsed.player); // Saves all the player data (hp, atk, etc)
        Object.assign(gameState.enemy, parsed.enemy);
    }
}



function resetGame() {
    localStorage.clear();
    location.reload();
}



document.addEventListener("DOMContentLoaded", () => {
    loadGame();      // Load saved data
    updateView();    // Update HUD
});