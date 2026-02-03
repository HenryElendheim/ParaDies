const storeText = document.querySelector(".store");
const backButton = document.querySelector(".back");
const body = document.body;
let fightsThisStage = parseInt(localStorage.getItem(`fights_stage_${stage}`)) || 1;