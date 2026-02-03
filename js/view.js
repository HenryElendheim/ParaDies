// Player
const playerDiv = document.getElementById("playerDiv")
const playerHealth = document.getElementById("playerHealth")
const playerHealthText = document.getElementById("playerHealthText");

const playerLevel = document.getElementById("playerLevel");
const playerDef = document.getElementById("playerDef");

const playerXPText = document.getElementById("playerXPText")
const playerXPBar = document.getElementById("playerXPBar");

const playerAttackDiv = document.getElementById("playerAttackDiv")
const playerName = document.getElementById("playerName")


// Enemy
const enemyDiv = document.getElementById("enemyDiv")
const enemyHealth = document.getElementById("enemyHealth")
const enemyHealthText = document.getElementById("enemyHealthText");
const enemyName = document.getElementById("enemyName")

const enemyLevel = document.getElementById("enemyLevel");
const enemyDef = document.getElementById("enemyDef");


// Narrator / text describing
const narrator = document.getElementById("narrator")
const narratorBuffs = document.getElementById("narratorBuffs")



// shortcut for gameState.player/enemy
const p = gameState.player;
const e = getCurrentEnemy();

function getCurrentEnemy() {
    const s = gameState.stages[stage];
    while (s.defeatedEnemies.includes(gameState.currentEnemyIndex)) {
        gameState.currentEnemyIndex++;
    }
    return gameState.enemies[gameState.currentEnemyIndex];
}



//Locking Turns
let isTurnLocked = false;



function updateHUD() {
    // Player
    playerName.textContent = p.name;

    const playerHpPercent = (p.hp / p.maxHp) * 100;
    playerHealth.style.width = `${playerHpPercent}%`;
    playerHealthText.textContent = `HP: ${p.hp} / ${p.maxHp}`;

    playerLevel.textContent = `Lvl: ${p.level}`;
    playerDef.textContent = `Def: ${p.def}`;

    const playerXpPercent = (p.xp / p.xpToNext) * 100;
    playerXPBar.style.width = `${playerXpPercent}%`;
    playerXPText.textContent = `XP: ${p.xp} / ${p.xpToNext}`;


    // Enemy
    const e = getCurrentEnemy();

    if (!e) {
        enemyName.textContent = "All Enemies Defeated";
        enemyHealth.style.width = "0%";
        enemyHealthText.textContent = "HP: 0 / 0";
        enemyLevel.textContent = "";
        enemyDef.textContent = "";
        return;
    }

    enemyName.textContent = e.name;

    const enemyHpPercent = (e.hp / e.maxHp) * 100;
    enemyHealth.style.width = `${enemyHpPercent}%`;
    enemyHealthText.textContent = `HP: ${e.hp} / ${e.maxHp}`;

    enemyLevel.textContent = `Lvl: ${e.level}`;
    enemyDef.textContent = `Def: ${e.def}`;

}



function updateView() {
    updateHUD();
    saveGame();
}
updateView();




// Effects ingame
// Shake screen
function screenShake() {
    document.body.classList.add("shake");

    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 250);
}


// Flash enemy
function enemyHitFlash() {
    enemyDiv.classList.add("hit");

    setTimeout(() => {
        enemyDiv.classList.remove("hit");
    }, 250);
}


// Floating damage number
function showDamage(targetDiv, dmg) {
    const text = document.createElement("div");
    text.className = "damage-text";
    text.textContent = `-${dmg}`;

    targetDiv.appendChild(text);

    text.style.left = "50%";
    text.style.top = "40%";


    setTimeout(() => {
        text.remove();
    }, 1000);
}





