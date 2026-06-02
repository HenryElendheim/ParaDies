"use strict";

// ---- hub ----
function enterHub() {
    showScreen("hub");
    renderHub();
    save();
}
function renderHub() {
    const st = STAGES[state.stageIndex];
    $("stageArt").style.background = STAGE_BG[state.stageIndex];
    $("hubStageSub").textContent = st.sub;
    $("hubStageName").textContent = st.name;
    $("artWhere").textContent = st.name;
    $("artBlurb").textContent = st.blurb;
    refreshHubMeters();
    renderHubTiles();
}
function refreshHubMeters() {
    const p = state.player;
    $("hubLevel").textContent = p.level;
    $("hubGold").textContent = p.gold;
    $("hubHp").textContent = p.hp + "/" + p.maxHp;
}
function renderHubTiles() {
    const st = STAGES[state.stageIndex];
    const prog = state.stages[state.stageIndex];
    const p = state.player;
    const ops = $("opTiles"), area = $("areaTiles");
    ops.innerHTML = ""; area.innerHTML = "";

    const fightTile = document.createElement("div");
    if (st.boss) {
        fightTile.className = "tile boss";
        fightTile.innerHTML = tileInner("☗", "Face the Steward", "End it.");
        fightTile.onclick = () => beginBattle();
    } else {
        const more = prog.wins < st.winsNeeded;
        fightTile.className = "tile fight" + (more ? "" : " disabled");
        fightTile.innerHTML = tileInner("⚔", "Fight", st.foeName + " patrol");
        if (more) fightTile.onclick = () => beginBattle();
    }
    ops.appendChild(fightTile);

    const storeTile = document.createElement("div");
    storeTile.className = "tile";
    storeTile.innerHTML = tileInner("🏪", "Shop", "Upgrades & recharge");
    storeTile.onclick = openStoreOverlay;
    ops.appendChild(storeTile);

    if (!st.boss) {
        const ready = prog.wins >= st.winsNeeded && state.stageIndex < STAGES.length - 1;
        const adv = document.createElement("div");
        adv.className = "tile advance" + (ready ? "" : " disabled");
        adv.innerHTML = tileInner("▲", "Move forward", ready ? "Head deeper in" : "Win " + (st.winsNeeded - prog.wins) + " more first");
        if (ready) adv.onclick = advanceStage;
        ops.appendChild(adv);
    }
    if (state.stageIndex > 0) {
        const back = document.createElement("div");
        back.className = "tile";
        back.innerHTML = tileInner("▼", "Go back", "To " + STAGES[state.stageIndex - 1].name);
        back.onclick = () => { state.stageIndex--; enterHub(); };
        ops.appendChild(back);
    }

    $("progNote").innerHTML = st.boss
        ? "This is the end of the road."
        : "Won this stage: <b>" + prog.wins + " / " + st.winsNeeded + "</b>" + (prog.wins >= st.winsNeeded ? " — you can move on." : "");

    (st.chests || []).forEach(c => {
        if (prog.chests.includes(c.id)) return;
        const t = document.createElement("div");
        t.className = "tile";
        t.innerHTML = tileInner("📦", "Stash", c.gold + " gold");
        t.onclick = () => {
            p.gold += c.gold; prog.chests.push(c.id);
            toast("+" + c.gold + " gold"); refreshHubMeters(); renderHubTiles(); save();
        };
        area.appendChild(t);
    });
    if (st.npc) {
        const t = document.createElement("div");
        t.className = "tile";
        t.innerHTML = tileInner("💬", st.npc.name, prog.talked ? "talked already" : "someone's here");
        t.onclick = () => runDialogue(st.npc.lines, () => { prog.talked = true; save(); renderHubTiles(); });
        area.appendChild(t);
    }
    if (st.paper) {
        const t = document.createElement("div");
        t.className = "tile";
        t.innerHTML = tileInner("📰", "Notice", prog.paper ? "read already" : "pinned up");
        t.onclick = () => runDialogue(st.paper.lines, () => { prog.paper = true; save(); renderHubTiles(); });
        area.appendChild(t);
    }
    if (!area.children.length) area.innerHTML = "<div class='hint'>Nothing else here.</div>";
}
function tileInner(glyph, name, desc) {
    return "<div class='glyph'>" + glyph + "</div><div class='t-name'>" + name + "</div><div class='t-desc'>" + desc + "</div>";
}
function advanceStage() {
    state.stageIndex++; save();
    const st = STAGES[state.stageIndex];
    if (st.intro && st.intro.length) runDialogue(st.intro, enterHub);
    else enterHub();
}
$("hubMenuBtn").addEventListener("click", () => { save(); showScreen("menu"); refreshMenu(); });

// ---- store ----
function populateStore() {
    $("storeGold").textContent = state.player.gold;
    const wrap = $("storeItems"); wrap.innerHTML = "";
    STORE.forEach(item => {
        const row = document.createElement("div");
        row.className = "store-item" + (item.type === "recharge" ? " recharge" : "");
        const afford = state.player.gold >= item.cost;
        row.innerHTML =
            "<div class='si-icon'>" + item.icon + "</div>" +
            "<div class='si-body'><div class='si-name'>" + item.name + "</div><div class='si-desc'>" + item.desc + "</div></div>" +
            "<button class='si-buy' " + (afford ? "" : "disabled") + ">" + item.cost + "g</button>";
        row.querySelector(".si-buy").onclick = () => buy(item);
        wrap.appendChild(row);
    });
}
function buy(item) {
    const p = state.player;
    if (p.gold < item.cost) { toast("Not enough gold"); return; }
    p.gold -= item.cost;
    if (item.type === "atk") p.atk += item.val;
    else if (item.type === "def") p.def += item.val;
    else if (item.type === "maxhp") { p.maxHp += item.val; p.hp = p.maxHp; }
    else if (item.type === "potion") p.potions += 1;
    else if (item.type === "recharge") { rechargeAll(); }
    toast(item.type === "recharge" ? "Attacks recharged" : "Bought " + item.name);
    save(); populateStore(); refreshHubMeters();
}
function rechargeAll() {
    const p = state.player;
    p.unlocked.forEach(n => { const m = maxUsesFor(n); if (m != null) p.uses[n] = m; });
}
function openStoreOverlay() { populateStore(); $("storeOverlay").classList.add("active"); }
$("storeClose").addEventListener("click", () => $("storeOverlay").classList.remove("active"));
