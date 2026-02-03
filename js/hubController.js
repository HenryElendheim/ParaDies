


// Manual testing
document.addEventListener("keydown", (e) => {
    if (e.key === "k") {
        battlesWon++;
        localStorage.setItem("battlesWon", battlesWon);
        console.log(battlesWon)
        updateHub();
    }
});



// Object interactions
function hubAreaInteractables() {
    // Remove already opened chests
    document.querySelectorAll(".chest").forEach(chest => {

        const id = chest.dataset.id;

        if (openedChests.includes(id)) {
            chest.remove();
        }

    });


    document.querySelectorAll("#hubArea div").forEach(el => {
        el.addEventListener("click", () => {
            if (el.classList.contains("chest")) {

                const value = parseInt(el.dataset.value) || 5;
                const id = el.dataset.id;

                // Safety check
                if (!id) {
                    console.error("Chest missing data-id!");
                    return;
                }

                coins += value;

                // Save coins
                localStorage.setItem("coins", coins);

                // Save chest ID
                if (!openedChests.includes(id)) {
                    openedChests.push(id);
                    localStorage.setItem(
                        "openedChests",
                        JSON.stringify(openedChests)
                    );
                }

                alert(`You opened a chest and got ${value} coins!`);

                // Remove ONLY this chest
                el.remove();

            }



            if (el.classList.contains("npc")) {
                const name = el.dataset.name || "Unknown";
                alert(`You talked to ${name}.`);
            }


            if (el.classList.contains("fight")) {
                const stageNum = gameState.stage.current;
                const stageState = gameState.stages[stageNum];

                // Check fight limit
                if (stageState.fights >= 3) {
                    alert("You can't fight anymore in this stage!");
                    return;
                }

                // Reset enemy state for this fight
                stageState.defeatedEnemies = [];
                gameState.currentEnemyIndex = 0;
                gameState.enemies.forEach(enemy => {
                    enemy.hp = enemy.maxHp;
                    enemy.status = {};
                });

                // Unlock turns
                isTurnLocked = false;

                // Increment fight counter
                stageState.fights++;
                saveGame();

                // Go to battle
                fadeToPage("battle.html");

                // Update the fight notice immediately in the hub
                const fightNotice = document.getElementById("fightNotice");
                if (stageState.fights >= 3) fightNotice.style.display = "block";
            }



            if (el.classList.contains("forward")) {
                if (battlesWon >= 3) {
                    goToNextStage();
                } else {
                    alert("You're not done yet.");
                }
            }


            if (el.classList.contains("back")) {
                goToPastStage();
            }



            if (el.classList.contains("newspaper")) {
                alert("You destroyed a newspaper full of propaganda");
                el.remove();
            }


            if (el.classList.contains("store")) {
                fadeToPage("store.html");
            }

        });

    });
}




function fadeToPage(url) {
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}
