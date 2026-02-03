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
    const e = getCurrentEnemy();
    const playerStatus = tickEffects(p); // grabs the statusText from the tickEffects() function
    const enemyStatus = tickEffects(e);
    enemyDiv.classList.remove("light-hit", "heavy-hit");
    narratorBuffs.innerHTML = /*html*/ `
  <span style="color: #3fd13f;">${p.name}:</span> ${playerStatus} <br>
  <span style="color: #d13f3f;">${e.name}:</span> ${enemyStatus}`;
    isTurnLocked = false;
    updateView();
}