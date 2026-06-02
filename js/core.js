"use strict";

const SAVE_KEY = "paradies_save_v3";

// ---- state ----
let state = null;

function maxUsesFor(name) {
    const a = ATTACKS.find(x => x.name === name);
    return a ? a.maxUses : null;
}
function freshState(name) {
    return {
        stageIndex: 0,
        player: {
            name: name || "You",
            hp: 30, maxHp: 30, level: 1, atk: 3, def: 2,
            xp: 0, xpToNext: 12, status: {},
            gold: 0, potions: 1,
            unlocked: ["Punch"],
            uses: {}, // name -> remaining (only for limited attacks)
        },
        stages: STAGES.map(() => ({ wins: 0, chests: [], talked: false, paper: false })),
        cleared: false,
    };
}

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }
function loadSave() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
function wipeSave() { localStorage.removeItem(SAVE_KEY); }

const $ = (id) => document.getElementById(id);
function showScreen(id) {
    document.querySelectorAll(".screen, #menu, #ending").forEach(s => s.classList.remove("active"));
    $(id).classList.add("active");
    window.scrollTo(0, 0);
}
function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 1600);
}
