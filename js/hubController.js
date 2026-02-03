// Remove already opened chests
document.querySelectorAll(".chest").forEach(chest => {

    const id = chest.dataset.id;

    if (openedChests.includes(id)) {
        chest.remove();
    }

});



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
            fightsThisStage = parseInt(localStorage.getItem(`fights_stage_${stage}`)) || 0;

            if (fightsThisStage >= 3) {
                alert("You can't fight anymore in this stage!");
                return;
            }

            fadeToPage("battle.html");

            // Increment fights counter (when fight ends, you'll save it too)
            fightsThisStage++;
            localStorage.setItem(`fights_stage_${stage}`, fightsThisStage);

            // Update the notice immediately
            const fightNotice = document.getElementById("fightNotice");
            if (fightsThisStage >= 3) fightNotice.style.display = "block";
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



function fadeToPage(url) {
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}
