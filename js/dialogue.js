"use strict";
/* dialogue.js — the click-through dialogue box. */

// ---- dialogue ----
let dlgQueue = [], dlgPos = 0, dlgDone = null;
function runDialogue(lines, onDone) {
    dlgQueue = lines; dlgPos = 0; dlgDone = onDone || null;
    $("dlgOverlay").classList.add("active"); renderDlg();
}
function renderDlg() {
    const line = dlgQueue[dlgPos];
    $("dlgSpeaker").textContent = line.s;
    $("dlgText").textContent = line.t;
    $("dlgProg").textContent = (dlgPos + 1) + " / " + dlgQueue.length;
    $("dlgNext").textContent = (dlgPos === dlgQueue.length - 1) ? "Done" : "Next";
}
$("dlgNext").addEventListener("click", () => {
    dlgPos++;
    if (dlgPos >= dlgQueue.length) {
        $("dlgOverlay").classList.remove("active");
        const cb = dlgDone; dlgDone = null; if (cb) cb();
    } else renderDlg();
});
