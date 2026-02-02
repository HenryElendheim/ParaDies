function playerAttack(attackIndex) {
    if (isTurnLocked) return;
    isTurnLocked = true;

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



















// Apply effects from attacks
function applyEffects(target, effects) {
    if (!effects) return;

    effects.forEach(effect => {
        target.status[effect.type] = {
            value: effect.value,
            turns: effect.turns,
            affects: effect.affects
        };
    });
}



// Calculate the effective stat including all debuffs/buffs
function getEffectStatus(target, statName) {
    let base = target[statName];
    let modified = base;

    for (let key in target.status) {
        const effect = target.status[key];
        if (effect.affects === statName) {
            modified += effect.value;
        }
    }

    return modified;
}



// Tick all status effects down by 1 turn and remove expired effects
function tickEffects(target) {
    let statusText = "";

    for (let key in target.status) {
        const appliedEffect = target.status[key];

        appliedEffect.turns--;
        console.log(appliedEffect.turns)

        if (appliedEffect.affects === "hp") {
            target.hp -= appliedEffect.value;
            if (target.hp < 0) target.hp = 0;
        }


        if (appliedEffect.turns < 0) { // makes it so when it goes into negatives it removes it
            delete target.status[key];
        }
        statusText += `<span style="color: #ff9900;">${key} (${appliedEffect.turns + 1})</span> ` // makes it so you see the last turn as a 1 instead of a 0
    }
    return statusText || "No active effects";
}




















// End turn code

function endTurn() {
    const playerStatus = tickEffects(p); // grabs the statusText from the tickEffects() function
    const enemyStatus = tickEffects(e);
    enemyDiv.classList.remove("light-hit", "heavy-hit");
    narratorBuffs.innerHTML = /*html*/ `
  <span style="color: #3fd13f;">${p.name}:</span> ${playerStatus} <br>
  <span style="color: #d13f3f;">${e.name}:</span> ${enemyStatus}`;
    isTurnLocked = false;
    updateView();
}



























// Defeated enemy code
function enemyDown() {
    let enemyXP = e.xpDrop
    enemyXP = Math.floor(Math.random() * 10) + 1;
    p.xp += enemyXP;
    checkLvlUp();

    // Mark enemy as dead
    e.hp = 0;
    e.status = {};  // clear all effects

    updateView();

    // Respawn after 1 second
    setTimeout(() => {
        enemyLvlUp(); // respawn and level up
        updateView();
    }, 1000);
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


function enemyLvlUp() {
    isTurnLocked = false; //Makes it so you can attack again
    e.level++;
    e.maxHp += 2;
    e.atk += 2;
    e.hp = e.maxHp;
    e.def = 2 + e.level;
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
