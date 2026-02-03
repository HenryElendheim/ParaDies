// Hub update
function updateHub() {
    let html = document.getElementById("app");

    html.innerHTML = /*HTML*/ `<p>Coins: ${coins}</p>
    <p>Battles won: ${battlesWon}</p>
    <p>Every 3 battles you win you can progress to the next stage</p>

    <div id="hubArea">
        <div class="chest" data-id="chest1" data-value="5">Chest1</div>
        <div class="chest" data-id="chest2" data-value="10">Chest2</div>

        <div class="fight">Fight</div>
        <div id="fightNotice" style="color:#ff4444; font-weight:bold; margin-top:10px;">
            Fights this stage: <span id="fightsCount">0</span>/3
        </div>


        <div id="nextStage" class="forward">Go Forward</div>
        <div id="nextStage" class="back">Back</div>

        <div class="npc" data-name="the Paradian">Person</div>
        <div class="newspaper">Newspaper</div>
        <div class="store hidden">Store</div>
    </div>
    <br>
    <button id="resetGame" onclick="resetGame()">Reset Game</button>
    <!-- <button onclick="loadGame()">Load</button>
    <button onclick="saveGame()">Save</button> -->
`;
    loadStage();
    hubAreaInteractables();
}


document.addEventListener("DOMContentLoaded", () => {
    updateHub();
});

function goToNextStage() {
    if (stage >= 5) return;

    stage++;
    gameState.currentEnemyIndex = 0; // reset for new stage
    localStorage.setItem("stage", stage);
    saveGame();
    loadStage();
}


function goToPastStage() {

    if (stage <= 1) return;

    stage--;
    localStorage.setItem("stage", stage);
    loadStage();
    console.log("Previous stage");
}



function loadStage() {
    // Show correct stage
    document.querySelectorAll(".stage").forEach(s => s.classList.remove("active"));
    const currentStage = document.getElementById(`stage${stage}`);
    if (currentStage) currentStage.classList.add("active");

    // Back button visibility
    // backButton.style.display = stage > 1 ? "block" : "none";

    // Background
    changeBackground();

    // Fight notice logic
    const fightNotice = document.getElementById("fightNotice");
    fightsThisStage = parseInt(localStorage.getItem(`fights_stage_${stage}`)) || 0;

    if (fightsThisStage >= 3) {
        fightNotice.style.display = "block";   // Show notice
    } else {
        fightNotice.style.display = "none";    // Hide notice
    }
}






function changeBackground() {
    switch (stage) {
        case 1:
            body.style.backgroundImage = "url('img/stage1.png')";
            break;

        case 2:
            body.style.backgroundImage = "url('img/stage2.png')";
            break;

        case 3:
            body.style.backgroundImage = "url('img/stage3.png')";
            break;

        case 4:
            body.style.backgroundImage = "url('img/stage4.png')";
            break;

        case 5:
            body.style.backgroundImage = "url('img/stage5.png')";
            break;

        default:
            body.style.backgroundImage = "none";
    }

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}
