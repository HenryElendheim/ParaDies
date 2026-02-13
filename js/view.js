// shortcut for gameState.player/enemy
const p = gameState.player;
const e = getCurrentEnemy();

function getCurrentEnemy() {
    const stageNum = gameState.stage.current;
    const stageState = gameState.stages[stageNum];
    let rounds = 0;

    // Skip defeated enemies
    while (stageState.defeatedEnemies.includes(gameState.currentEnemyIndex) || !rounds == 3) {
        gameState.currentEnemyIndex++;
        rounds++;
        console.log(`Defeated enemy: ${gameState.defeatedEnemies}`)
    }

    if (rounds == 3) {
        rounds = 0;
        fadeToPage("hub.html");
    }


    return gameState.enemies[gameState.currentEnemyIndex] || null;
}



//Locking Turns
let isTurnLocked = false;



function updateHTML() {
    let html = document.getElementById("battle");

    html.innerHTML = /*HTML*/ `<div id="playerDiv">
        <div id="playerName" class="cube-name"></div>

        <div class="stat-bar">
            <div id="playerHealth" class="health-bar-fill"></div>
            <span id="playerHealthText"></span>
        </div>
        <br>
        <div class="extra-stats">
            <span id="playerLevel"></span>
            <span id="playerDef"></span>
        </div>

        <div class="stat-bar">
            <div id="playerXPBar" class="xp-bar-fill"></div>
            <span id="playerXPText"></span>
        </div>
    </div>



    <div id="enemyDiv">

        <div id="enemyName" class="cube-name"></div>

        <div class="stat-bar">
            <div id="enemyHealth" class="health-bar-fill"></div>
            <span id="enemyHealthText"></span>
        </div>
        <br>
        <div class="extra-stats">
            <span id="enemyLevel"></span>
            <span id="enemyDef"></span>
        </div>

    </div>



    <div id="narratorDiv">
        <p id="narrator"></p>
        <br>
        <p id="narratorBuffs"></p>
    </div>



    <div id="playerAttackDiv">
        <!--
        <button id="attack1" onclick="playerAttack(0)">${p.attacks[0].name}</button>
        <button id="attack2" onclick="playerAttack(1)">${p.attacks[1].name}</button>
        <button id="attack3" onclick="playerAttack(2)">${p.attacks[2].name}</button>
        <button id="attack4" onclick="playerAttack(3)">${p.attacks[3].name}</button>
        -->
    </div>
    <br>
    <button id="resetGame" onclick="resetGame()">Reset Game</button>
    <!-- <button onclick="loadGame()">Load</button>
    <button onclick="saveGame()">Save</button> -->`
}
updateHTML();





function updateHUD() {

    let maxLvl = 30;

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
    if (p.level == maxLvl) {
        playerXPText.textContent = 'Max level'
        playerXPBar.style.width = `100%`;
    }



    // Enemy
    const e = getCurrentEnemy();

    if (!e) {
        enemyName.textContent = "All Enemies Defeated";
        enemyHealth.style.width = "0%";
        enemyHealthText.textContent = "";
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
    renderAttacks();
    saveGame();
}
updateView();







function renderAttacks() {
    playerAttackDiv.innerHTML = "";

    p.attacks.forEach((attack, index) => {
        const btn = document.createElement("button");

        // If unlocked
        if (p.unlockedAttacks.includes(attack.name)) {
            btn.textContent = attack.name;
            btn.onclick = () => playerAttack(index);
            btn.disabled = false;
        }
        else {
            btn.textContent = `??? (Lvl ${attack.minLvl})`;
            btn.disabled = true;
        }

        playerAttackDiv.appendChild(btn);
    });
}





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