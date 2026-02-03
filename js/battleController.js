function playerAttack(attackIndex) {
    if (isTurnLocked) return;
    isTurnLocked = true;

    const e = getCurrentEnemy();
    const attack = p.attacks[attackIndex]; //This grabs the specific attack you chose
    if (!attack) return;

    // Decides attack strength with multipliers
    let baseDmg = Math.floor(p.atk * attack.power);


    // check Debuff and buff
    let enemyDef = getEffectStatus(e, "def");


    let dmg = baseDmg - enemyDef;  // Defense check


    if (dmg < 1) dmg = 1; // makes it so you always do at least 1 dmg
    if (p.attacks[attackIndex].atkType === "debuff") dmg = 0;


    e.hp -= dmg; // attacks enemy after the buffs/debuffs have been checked


    narrator.innerHTML = /*html*/ `
  <span style="color: #3fd13f;">${p.name}</span> used 
  <span style="color: #ffcc00;">${attack.name}</span> and dealt 
  <span style="color: #ff4444;">${dmg}</span> damage to 
  <span style="color: #d13f3f;">${e.name}</span>!`;
    console.log(`Base dmg: ${baseDmg}, Enemy def: ${enemyDef}, Final dmg: ${dmg}`);



    // apply debuff
    applyEffects(e, attack.effect);



    if (e.hp <= 0) {
        enemyDown();
        isTurnLocked = true;; //Makes it so you cant attack
        return;
    }



    // Hit animations
    if (dmg >= p.atk * 2) {
        enemyDiv.classList.add("heavy-hit");

    } else {
        enemyDiv.classList.add("light-hit");
    }
    enemyHitFlash();
    showDamage(enemyDiv, dmg);


    //Delaying updateView() to show the health change as you hit
    setTimeout(() => {
        updateView();
    }, 250);

    // Wait time before the enemy attacks
    setTimeout(() => {
        enemyAttack();

        // Wait time until the turn ends
        setTimeout(() => {
            endTurn();
        }, 400);

    }, 1000);
}



function enemyAttack() {
    // Hit animations
    playerDiv.classList.remove("light-hit", "heavy-hit");

    let dmg = e.atk;

    p.hp -= dmg;
    if (p.hp < 0) p.hp = 0;

    if (dmg >= 4) {
        playerDiv.classList.add("heavy-hit");
    } else {
        playerDiv.classList.add("light-hit");
    }

    narrator.innerHTML = /*html*/ `
    <span style="color:#d13f3f;">${e.name}</span> attacked 
    <span style="color:#3fd13f;">${p.name}</span> for 
    <span style="color:#ff4444;">${dmg}</span> damage!
    `;

    // Show floating damage on player
    showDamage(playerDiv, dmg);

    //Delaying updateView() to show the health change as you hit
    setTimeout(() => {
        updateView();
    }, 250);

    setTimeout(() => {
        playerDiv.classList.remove("light-hit", "heavy-hit");
    }, 500);
}







// Defeated enemy code
function enemyDown() {
    const index = gameState.currentEnemyIndex;

    // Save defeated enemy
    if (!gameState.defeatedEnemies.includes(index)) {
        gameState.defeatedEnemies.push(index);
    }

    let enemyXP = Math.floor(Math.random() * 10) + 1;
    p.xp += enemyXP;
    checkLvlUp();
    // Mark current enemy dead
    e.hp = 0;
    e.status = {};

    updateView();

    // Next enemy
    setTimeout(() => {
        if (gameState.currentEnemyIndex >= gameState.enemies.length) {
            // All enemies defeated
            saveGame();
            battlesWon++;
            localStorage.setItem("battlesWon", battlesWon);
            window.location.href = "hub.html";
        } else {
            // Reset stats for next enemy
            const nextE = getCurrentEnemy();

            isTurnLocked = false;
            updateView();
        }
    }, 1000);
}





function nextEnemy() {

    gameState.currentEnemyIndex++; // move to next enemy

    const e = getCurrentEnemy();

    // No enemies left
    if (!e) {
        saveGame();
        battlesWon++;
        localStorage.setItem("battlesWon", battlesWon);
        window.location.href = "hub.html";
        return;
    }

    // Reset enemy
    e.hp = e.maxHp;
    e.status = {};

    isTurnLocked = false;
    updateView();
}




function markEnemyDefeated(enemyIndex) {
    const s = gameState.stages[stage];
    if (!s.defeatedEnemies.includes(enemyIndex)) {
        s.defeatedEnemies.push(enemyIndex);
        saveGame();
    }
}





// Level up code
function checkLvlUp() {
    if (p.xp >= p.xpToNext) {
        p.level++;
        p.maxHp += 5;
        p.atk += 3;
        p.hp = p.maxHp;
        p.xp = 0;
        p.def = 2 + p.level,

            p.xpToNext += 5;
    }
}





// Manual testing
document.addEventListener("keydown", (e) => {
    if (e.key === "j") {
        p.xp = p.xpToNext;
        checkLvlUp();
        updateView();
        console.log("Level up")
    }
});