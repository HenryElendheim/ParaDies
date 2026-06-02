"use strict";
/* battle.js — combat, enemies, the boss, the 3-second death-save, leveling. */

// ---- battle ----
let battle = null;
let turnLocked = false;

function makeEnemy(stageIndex, tier) {
    const winsDone = state.stages[stageIndex].wins; // 0-based progress this stage
    const d = stageIndex;
    const st = STAGES[stageIndex];
    const e = {
        name: st.foeName, role: st.foeRole,
        level: 1 + d * 2 + tier,
        maxHp: 8 + d * 10 + tier * 5 + winsDone * 4,
        atk: 1 + Math.floor(d * 1.5) + tier,
        def: Math.floor(d * 0.8) + tier,
        xpDrop: 5 + d * 3 + tier * 2 + winsDone,
        goldDrop: 3 + d * 2 + tier,
        status: {}, boss: false,
    };
    e.hp = e.maxHp;
    return e;
}
function makeBoss() {
    const e = {
        name: "The Steward", role: "keeper of the country",
        level: 16, maxHp: 150, atk: 9, def: 5,
        xpDrop: 0, goldDrop: 0, status: {}, boss: true, phase: 1,
        p2Hp: 110, p2Atk: 13, p2Def: 7, p2Name: "The Steward — won't yield",
    };
    e.hp = e.maxHp;
    return e;
}

function beginBattle() {
    const st = STAGES[state.stageIndex];
    const p = state.player;
    p.status = {};
    let squad;
    if (st.boss) squad = [makeBoss()];
    else { squad = []; const n = st.squad || 2; for (let i = 0; i < n; i++) squad.push(makeEnemy(state.stageIndex, i)); }
    battle = { squad, idx: 0, st };
    turnLocked = false;

    showScreen("battle");
    $("battleTitle").textContent = st.boss ? "The Summit" : st.name;
    $("pName").textContent = p.name;
    renderBattle();
    setNarr(st.boss ? "The Steward looks up from the desk. \"So you made it.\"" : "A " + st.foeName.toLowerCase() + " steps into your path.");

    if (st.boss) {
        turnLocked = true;
        runDialogue([
            { s: "The Steward", t: "What do you want?" },
            { s: "The Steward", t: "Why are you doing this?" },
            { s: "The Steward", t: "..." },
            { s: "The Steward", t: "Nothing to say?" },
            { s: "The Steward", t: "Fine then" },
            { s: "The Steward", t: "..." },
            { s: "The Steward", t: "Let's end this" },
        ], () => { turnLocked = false; });
    }
}
function curEnemy() { return battle.squad[battle.idx]; }

function renderBattle() {
    const p = state.player, e = curEnemy();
    setBar("pHpFill", "pHpTxt", p.hp, p.maxHp, "HP");
    $("pAtk").textContent = "ATK " + effStat(p, "atk");
    $("pDef").textContent = "DEF " + effStat(p, "def");
    setXp("pXpFill", "pXpTxt", p);
    $("pStatus").innerHTML = statusText(p);
    $("batLevel").textContent = p.level;

    $("enemyCard").classList.toggle("boss", !!(e && e.boss));
    if (e) {
        $("eName").textContent = e.name;
        $("eRole").textContent = e.boss && e.phase === 2 ? "out of options" : e.role;
        setBar("eHpFill", "eHpTxt", e.hp, e.maxHp, "HP");
        $("eAtk").textContent = "ATK " + effStat(e, "atk");
        $("eDef").textContent = "DEF " + effStat(e, "def");
        $("eStatus").innerHTML = statusText(e);
    }
    $("batWave").textContent = (battle.idx + 1) + " / " + battle.squad.length;
    renderMoves();
}
function setBar(fillId, txtId, val, max, label) {
    val = Math.max(0, val);
    $(fillId).style.width = (max ? val / max * 100 : 0) + "%";
    $(txtId).textContent = label + ": " + val + " / " + max;
}
function setXp(fillId, txtId, p) {
    if (p.xpToNext === "Max") { $(fillId).style.width = "100%"; $(txtId).textContent = "MAX"; }
    else { $(fillId).style.width = (p.xp / p.xpToNext * 100) + "%"; $(txtId).textContent = "XP: " + p.xp + " / " + p.xpToNext; }
}
function renderMoves() {
    const wrap = $("moves"); wrap.innerHTML = "";
    const p = state.player;
    ATTACKS.forEach((atk, i) => {
        const btn = document.createElement("button");
        btn.className = "move";
        const unlocked = p.unlocked.includes(atk.name);
        const limited = atk.maxUses != null;
        const left = limited ? (p.uses[atk.name] || 0) : null;
        if (!unlocked) {
            btn.disabled = true;
            btn.innerHTML = "<div class='m-name'>???</div><div class='m-meta'>unlocks at Lv " + atk.minLvl + "</div>";
        } else if (limited && left <= 0) {
            btn.disabled = true;
            btn.innerHTML = "<div class='m-name'>" + atk.name + " (0/" + atk.maxUses + ")</div><div class='m-meta'>recharge at shop</div>";
        } else {
            btn.innerHTML = "<div class='m-name'>" + atk.name + (limited ? " (" + left + "/" + atk.maxUses + ")" : "") +
                "</div><div class='m-meta'>" + attackMeta(atk) + "</div>";
            btn.onclick = () => playerAttack(i);
        }
        wrap.appendChild(btn);
    });
    const pot = document.createElement("button");
    pot.className = "move item";
    pot.disabled = p.potions <= 0;
    pot.innerHTML = "<div class='m-name'>Field Tonic ×" + p.potions + "</div><div class='m-meta'>heal 18 HP</div>";
    pot.onclick = usePotion;
    wrap.appendChild(pot);

    if (!curEnemy().boss) {
        const flee = document.createElement("button");
        flee.className = "move flee";
        flee.innerHTML = "<div class='m-name'>Retreat</div><div class='m-meta'>back to the hub</div>";
        flee.onclick = () => { if (!turnLocked) { toast("You pull back."); enterHub(); } };
        wrap.appendChild(flee);
    }
}
function setNarr(html) { $("narrator").innerHTML = html; }

// effects
function effStat(t, stat) {
    let v = t[stat];
    for (const k in t.status) if (t.status[k].affects === stat) v += t.status[k].value;
    return v;
}
function applyEffect(t, ef) { if (!ef) return; t.status[ef.type] = { value: ef.value, turns: ef.turns, affects: ef.affects }; }
function statusText(t) {
    const parts = [];
    for (const k in t.status) {
        const ef = t.status[k];
        const col = ef.affects === "hp" ? "var(--red)" : "var(--gold)";
        parts.push("<span style='color:" + col + "'>" + k + " (" + ef.turns + ")</span>");
    }
    return parts.join(" ");
}
function tickStatus(t) {
    for (const k in t.status) {
        const ef = t.status[k];
        if (ef.affects === "hp") { t.hp -= ef.value; if (t.hp < 0) t.hp = 0; }
        ef.turns--; if (ef.turns <= 0) delete t.status[k];
    }
}

function floatDmg(cardId, amount, heal, crit) {
    const el = document.createElement("div");
    el.className = "float-dmg" + (heal ? " heal" : "") + (crit ? " crit" : "");
    el.textContent = (heal ? "+" : "-") + amount;
    $(cardId).appendChild(el);
    setTimeout(() => el.remove(), 900);
}
function floatMiss(cardId) {
    const el = document.createElement("div");
    el.className = "float-dmg miss";
    el.textContent = "miss";
    $(cardId).appendChild(el);
    setTimeout(() => el.remove(), 900);
}
function flash(cardId, heavy) {
    const c = $(cardId);
    c.classList.add("hit");
    if (heavy) c.classList.add("shake-x");
    setTimeout(() => c.classList.remove("hit", "shake-x"), 320);
}
function screenShake() { document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 220); }

function playerAttack(i) {
    if (turnLocked) return;
    const p = state.player, e = curEnemy(), atk = ATTACKS[i];
    if (!p.unlocked.includes(atk.name)) return;
    if (atk.maxUses != null && (p.uses[atk.name] || 0) <= 0) return;
    turnLocked = true;
    if (atk.maxUses != null) p.uses[atk.name] = Math.max(0, (p.uses[atk.name] || 0) - 1);

    // miss?
    if (Math.random() >= atk.acc) {
        floatMiss("enemyCard");
        setNarr("<b style='color:var(--blue)'>" + p.name + "</b> tried <b>" + atk.name + "</b> — and missed.");
        setTimeout(renderBattle, 200);
        setTimeout(enemyTurn, 850);
        return;
    }

    if (atk.atkType === "debuff") {
        applyEffect(e, atk.effect);
        setNarr("<b style='color:var(--blue)'>" + p.name + "</b> used <b>" + atk.name + "</b> — " + e.name + "'s guard drops.");
    } else {
        let dmg = Math.max(1, Math.floor(effStat(p, "atk") * atk.power) - effStat(e, "def"));
        const crit = Math.random() < (atk.crit || 0);
        if (crit) dmg = Math.floor(dmg * CRIT_MULT);
        e.hp -= dmg;
        if (atk.effect) applyEffect(e, atk.effect);
        flash("enemyCard", crit || dmg >= effStat(p, "atk") * 2);
        if (crit) screenShake();
        floatDmg("enemyCard", dmg, false, crit);
        setNarr((crit ? "Critical hit! " : "") + "<b style='color:var(--blue)'>" + p.name + "</b> used <b>" + atk.name +
            "</b> for <b style='color:var(--red)'>" + dmg + "</b>.");
    }

    setTimeout(renderBattle, 200);
    if (e.hp <= 0) { enemyDefeated(); return; }
    setTimeout(enemyTurn, 900);
}

function usePotion() {
    if (turnLocked) return;
    const p = state.player;
    if (p.potions <= 0) return;
    turnLocked = true;
    p.potions -= 1;
    p.hp = Math.min(p.maxHp, p.hp + 18);
    floatDmg("playerCard", 18, true);
    setNarr("<b style='color:var(--blue)'>" + p.name + "</b> drinks a Field Tonic. <b style='color:var(--green)'>+18 HP</b>.");
    setTimeout(renderBattle, 200);
    setTimeout(enemyTurn, 900);
}

function enemyTurn() {
    const p = state.player, e = curEnemy();
    if (!e || e.hp <= 0) { endTurn(); return; }

    if (Math.random() >= 0.9) { // enemy miss
        floatMiss("playerCard");
        setNarr("<b style='color:var(--red)'>" + e.name + "</b> swings and misses.");
        setTimeout(renderBattle, 200);
        setTimeout(endTurn, 650);
        return;
    }
    let dmg = Math.max(1, effStat(e, "atk"));
    const crit = Math.random() < 0.1;
    if (crit) dmg = Math.floor(dmg * 1.6);
    p.hp -= dmg; if (p.hp < 0) p.hp = 0;
    flash("playerCard", crit || dmg >= 6);
    if (crit) screenShake();
    floatDmg("playerCard", dmg, false, crit);
    setNarr((crit ? "A heavy blow! " : "") + "<b style='color:var(--red)'>" + e.name + "</b> hits <b style='color:var(--blue)'>" + p.name +
        "</b> for <b style='color:var(--red)'>" + dmg + "</b>.");
    setTimeout(renderBattle, 200);

    if (p.hp <= 0) { onPlayerDown(); return; }
    setTimeout(endTurn, 650);
}

function endTurn() {
    const p = state.player, e = curEnemy();
    tickStatus(p);
    if (e) tickStatus(e);
    renderBattle();
    if (p.hp <= 0) { onPlayerDown(); return; }
    if (e && e.hp <= 0) { enemyDefeated(); return; }
    turnLocked = false;
}

// ---- death save (3-second clutch heal) ----
let clutchTimer = null;
function onPlayerDown() {
    const p = state.player;
    if (p.potions > 0) openClutch();
    else { setNarr("You go down, and you don't get back up."); setTimeout(playerDefeated, 800); }
}
function openClutch() {
    $("clutchPotions").textContent = state.player.potions;
    $("clutchUse").disabled = state.player.potions <= 0;
    $("clutchOverlay").classList.add("active");
    const bar = $("clutchBar");
    bar.style.transition = "none"; bar.style.width = "100%";
    void bar.offsetWidth; // reflow
    bar.style.transition = "width 3s linear"; bar.style.width = "0%";
    clutchTimer = setTimeout(() => { closeClutch(); playerDefeated(); }, 3000);
}
function closeClutch() { clearTimeout(clutchTimer); clutchTimer = null; $("clutchOverlay").classList.remove("active"); }
$("clutchUse").addEventListener("click", () => {
    const p = state.player;
    if (p.potions <= 0) return;
    closeClutch();
    p.potions -= 1;
    p.hp = Math.min(p.maxHp, 18);
    floatDmg("playerCard", 18, true);
    setNarr("You catch yourself and force down a tonic. <b style='color:var(--green)'>+18 HP</b>.");
    renderBattle();
    setTimeout(endTurn, 500);
});

function enemyDefeated() {
    const e = curEnemy();
    // boss phase transition
    if (e.boss && e.phase === 1) {
        e.phase = 2; e.name = e.p2Name; e.maxHp = e.p2Hp; e.hp = e.p2Hp;
        e.atk = e.p2Atk; e.def = e.p2Def; e.status = {};
        renderBattle();
        turnLocked = true;
        runDialogue([
            { s: "The Steward", t: "...Not yet..." },
            { s: "The Steward", t: "I won't let you get away..." },
        ], () => { turnLocked = false; setNarr("The Steward forces himself upright and raises his sword again."); });
        return;
    }

    e.hp = 0; e.status = {};
    renderBattle();
    $("enemyCard").classList.add("dead");
    const p = state.player;
    if (e.xpDrop) p.xp += e.xpDrop;
    if (e.goldDrop) p.gold += e.goldDrop;
    checkLevelUp();

    setTimeout(() => {
        $("enemyCard").classList.remove("dead");
        if (battle.idx < battle.squad.length - 1) {
            battle.idx++; turnLocked = false; renderBattle();
            setNarr("Another " + curEnemy().name.toLowerCase() + " takes their place.");
        } else battleWon();
    }, 640);
}

function battleWon() {
    const st = STAGES[state.stageIndex];
    const prog = state.stages[state.stageIndex];
    if (st.boss) {
        state.cleared = true; save();
        setNarr("As your enemy falls breathless to the floor. You stand victorious.");
        setTimeout(showEnding, 1100);
        return;
    }
    prog.wins = Math.min(st.winsNeeded, prog.wins + 1);
    save();
    const left = st.winsNeeded - prog.wins;
    toast(left > 0 ? (left + " more to clear this area") : "Area cleared");
    enterHub();
}

function playerDefeated() {
    const p = state.player;
    setNarr("You're beaten back, and you retreat to recover.");
    setTimeout(() => { p.hp = p.maxHp; p.status = {}; save(); enterHub(); }, 1300);
}

// ---- leveling ----
function checkLevelUp() {
    const p = state.player, MAX = 30;
    let leveled = false;
    while (p.xpToNext !== "Max" && p.xp >= p.xpToNext && p.level < MAX) {
        p.xp -= p.xpToNext; p.level++; leveled = true;
        p.maxHp += 6;
        if (p.level % 2 === 0) p.atk += 1;
        if (p.level % 3 === 0) p.def += 1;
        p.hp = p.maxHp;
        ATTACKS.forEach(a => {
            if (p.level >= a.minLvl && !p.unlocked.includes(a.name)) {
                p.unlocked.push(a.name);
                if (a.maxUses != null) p.uses[a.name] = a.maxUses;
                setTimeout(() => toast(a.name + " unlocked!"), 300);
            }
        });
        if (p.level >= MAX) p.xpToNext = "Max"; else p.xpToNext = Math.floor(p.xpToNext * 1.35);
    }
    if (leveled) toast("Level " + p.level + "!");
    save();
}
