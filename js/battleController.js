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



function startBattle() {
    // Reset currentEnemyIndex for this fight
    gameState.currentEnemyIndex = 0;

    // Clear defeated enemies for this stage
    const s = gameState.stages[gameState.stage?.current || 1];
    s.defeatedEnemies = [];

    // Reset enemy HP
    gameState.enemies.forEach(e => {
        e.hp = e.maxHp;
        e.status = {};
    });

    // Unlock player turn
    isTurnLocked = false;

    // Update HUD/HTML
    updateHTML();
    updateView();
}



// Defeated enemy code
function enemyDown() {
    const stageNum = gameState.stage.current;
    const stageState = gameState.stages[stageNum];
    const index = gameState.currentEnemyIndex;
    const e = getCurrentEnemy();

    if (!e) return;

    // Mark defeated
    if (!stageState.defeatedEnemies.includes(index)) {
        stageState.defeatedEnemies.push(index);
    }

    // Give XP
    let enemyXP = Math.floor(Math.random() * 10) + 1;
    gameState.player.xp += enemyXP;
    checkLvlUp();

    // Mark HP 0 and clear status
    e.hp = 0;
    e.status = {};

    // Show HP 0 and death flash
    enemyDiv.classList.add("dead");

    setTimeout(() => {
        nextEnemy();
    }, 780); // delay so you can see the death animation
}



function nextEnemy() {
    const e = getCurrentEnemy();

    if (!e) {
        // All enemies defeated
        saveGame();
        battlesWon++;
        localStorage.setItem("battlesWon", battlesWon);
        window.location.href = "hub.html";
        console.log("Battle won")
        return;
    }



    // Reset enemy stats
    e.hp = e.maxHp;
    e.status = {};

    // Remove death class from previous enemy
    enemyDiv.classList.remove("dead");

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
// Checks if player has enough XP to level up
function checkLvlUp(max = 30) {

    const p = gameState.player;

    // Keep leveling up as long as we have enough XP
    while (p.xp >= p.xpToNext && p.level < max) {

        // Remove XP used for this level
        p.xp -= p.xpToNext;

        // Increase level
        p.level++;


        // Increase max HP every level
        p.maxHp += 5;

        // Heal player to full on level up
        p.hp = p.maxHp;


        // If player hit max level
        if (p.level === max) {

            // Stop XP growth
            p.xpToNext = "Max";

        } else {

            // Make next level harder (30% more XP)
            p.xpToNext = Math.floor(p.xpToNext * 1.3);
        }


        // Give rewards for this new level
        levelRewards(gameState);
    }

    // Update HUD + save
    updateView();
}



// Creates a list of level rewards
function generateRewards(max = 30) {

    const rewards = [];

    // Loop through every level
    for (let i = 1; i <= max; i++) {

        // Every 5 levels → +2 DEF
        if (p.level % 5 === 0) {
            p.def += 2
        }

        // Every 10 levels → +5 ATK
        if (p.level % 10 === 0) {
            p.atk += 5
        }
    }

    return rewards;
}



// Gives player rewards when they level up
function levelRewards(gameState, max = 30) {

    const p = gameState.player;

    // Get list of all rewards
    const rewards = generateRewards(max);


    // Create reward history if missing
    // (prevents getting same reward twice)
    if (!p.appliedRewards) {
        p.appliedRewards = [];
    }


    // Loop through all rewards
    rewards.forEach(reward => {

        // If player is high enough level
        if (p.level >= reward.level) {

            // If already got this reward → skip
            if (p.appliedRewards.includes(reward.level)) return;


            // Add DEF if reward has it
            if (reward.def) {
                p.def += reward.def;
            }

            // Add ATK if reward has it
            if (reward.atk) {
                p.atk += reward.atk;
            }


            // Save that this reward was used
            p.appliedRewards.push(reward.level);
        }
    });


    // Unlock attacks based on level
    p.attacks.forEach(attack => {

        // If high enough level AND not unlocked yet
        if (
            p.level >= attack.minLvl &&
            !p.unlockedAttacks.includes(attack.name)
        ) {
            p.unlockedAttacks.push(attack.name);
        }
    });


    // Save progress
    saveGame(gameState);
}



function unlockAttack(name) {
    const allAttacks = {
        "Backhand": {
            name: "Backhand",
            power: 2
        },
        "Cut": {
            name: "Cut",
            power: 3,
            effect: [
                { type: "bleed", affects: "hp", value: 2, turns: 3 },
            ]
        },
        "Break armor": {
            name: "Break armor",
            power: 0,
            atkType: "debuff",
            effect: [
                { type: "defDown", affects: "def", value: -2, turns: 3 },
            ]
        }
    };

    // Already unlocked?
    if (p.attacks.some(a => a.name === name)) return;

    if (allAttacks[name]) {
        p.attacks.push(allAttacks[name]);
    }
}



function unlockAttacksByLevel() {

    p.attacks.forEach(attack => {

        if (
            p.level >= attack.requiredLevel &&
            !p.unlockedAttacks.includes(attack.name)
        ) {
            p.unlockedAttacks.push(attack.name);

            showNarrator(`${attack.name} unlocked!`);
        }

    });
}



function checkLvlEnemy() {
    e.level++;
    e.maxHp += 5;
    e.atk += 3;
    e.hp = e.maxHp;
    e.def = 2 + e.level;
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