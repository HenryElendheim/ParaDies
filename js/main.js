"use strict";

// ---- menu ----
function refreshMenu() {
    const saved = loadSave();
    $("btnContinue").disabled = !saved;
    if (saved && saved.player && saved.player.name) $("nameInput").value = saved.player.name;
}
$("btnNew").addEventListener("click", () => {
    const name = ($("nameInput").value || "").trim().slice(0, 14) || "You";
    state = freshState(name); save();
    showScreen("hub"); renderHub();
    const st = STAGES[0];
    if (st.intro) runDialogue(st.intro, () => { renderHub(); save(); });
});
$("btnContinue").addEventListener("click", () => {
    const saved = loadSave();
    if (!saved) return;
    state = saved;
    // migrate / safety
    if (!state.stages || state.stages.length !== STAGES.length) {
        const old = state.stages || [];
        state.stages = STAGES.map((_, i) => old[i] || { wins: 0, chests: [], talked: false, paper: false });
    }
    if (!state.player.uses) state.player.uses = {};
    if (state.player.potions == null) state.player.potions = 1;
    if (state.cleared) { showEnding(); return; }
    enterHub();
});
$("btnWipe").addEventListener("click", () => { wipeSave(); toast("Save erased"); refreshMenu(); $("nameInput").value = ""; });
$("nameInput").addEventListener("keydown", ev => { if (ev.key === "Enter") $("btnNew").click(); });

// boot
refreshMenu();
