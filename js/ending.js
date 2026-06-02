"use strict";
/* ending.js — the final choice screen and the epilogue. (Epilogue TEXT is in data.js) */

function showEnding() {
    $("endBody").style.textAlign = "center";
    $("endBody").textContent = "You took down the leader. You are the leader now. What will you do next?";
    const choices = $("endChoices");
    choices.innerHTML = "";
    const b1 = document.createElement("button");
    b1.className = "btn primary"; b1.textContent = "Destroy Paradia";
    b1.onclick = () => chooseEnding("destroy");
    const b2 = document.createElement("button");
    b2.className = "btn"; b2.textContent = "Restore Paradia";
    b2.onclick = () => chooseEnding("restore");
    choices.appendChild(b1); choices.appendChild(b2);
    showScreen("ending");
}
function chooseEnding(which) {
    $("endBody").style.textAlign = "left";
    $("endBody").innerHTML = EPILOGUE[which];
    const choices = $("endChoices");
    choices.innerHTML = "";
    const again = document.createElement("button");
    again.className = "btn ghost"; again.textContent = "The End — Play Again";
    again.onclick = () => { wipeSave(); state = null; showScreen("menu"); refreshMenu(); };
    choices.appendChild(again);
}
