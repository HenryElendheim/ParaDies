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
const e = gameState.enemy;


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
    enemyName.textContent = e.name;

    const enemyHpPercent = (e.hp / e.maxHp) * 100;
    enemyHealth.style.width = `${enemyHpPercent}%`;
    enemyHealthText.textContent = `HP: ${e.hp} / ${e.maxHp}`;

    enemyLevel.textContent = `Lvl: ${e.level}`;
    enemyDef.textContent = `Def: ${e.def}`;
}



function updateView() {
    updateHUD();
    saveGame()
}



// Level up manually
document.addEventListener("keydown", (e) => {
    if (e.key === "j") {
        p.xp = p.xpToNext;
        checkLvlUp();
        updateView();
        console.log("Level up")
    }
    if (e.key === "k") {

    }
});

