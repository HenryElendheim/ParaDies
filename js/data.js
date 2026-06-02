"use strict";
/* =============================================================
   data.js  —  ALL the editable content lives here.
   Dialogue, stages, attacks, the shop, and the two endings.
   Edit the text in the t:"..." strings. Use a plain apostrophe '.
   Dialogue text is shown as-is (no HTML). The EPILOGUE strings
   at the bottom DO allow <br> for line breaks.
   ============================================================= */

// backgrounds (simple CSS gradients)
const STAGE_BG = [
    "linear-gradient(160deg,#3a2c33,#231820)",  // outskirts
    "linear-gradient(160deg,#23304a,#141a2a)",  // quiet rows (night)
    "linear-gradient(160deg,#4a3618,#1e1609)",  // district (amber)
    "linear-gradient(160deg,#283844,#121a22)",  // citadel (steel)
    "linear-gradient(160deg,#3a3015,#17120a)",  // spire (dim gold)
];

// attacks. Punch is unlimited. Others have limited uses, accuracy, crit chance.
const CRIT_MULT = 1.75;
const ATTACKS = [
    { name: "Punch",       power: 1.0, minLvl: 1, acc: 0.95, crit: 0.10, maxUses: null },
    { name: "Backhand",    power: 1.7, minLvl: 3, acc: 0.90, crit: 0.12, maxUses: 15 },
    { name: "Cut",         power: 2.2, minLvl: 5, acc: 0.85, crit: 0.12, maxUses: 10,
      effect: { type: "bleed", affects: "hp", value: 3, turns: 3 } },
    { name: "Break Armor", power: 0,   minLvl: 7, acc: 0.90, crit: 0,    maxUses: 8, atkType: "debuff",
      effect: { type: "armor broken", affects: "def", value: -3, turns: 3 } },
    { name: "Pow",         power: 3.2, minLvl: 9, acc: 0.72, crit: 0.18, maxUses: 5,
      effect: { type: "bleed", affects: "hp", value: 5, turns: 2 } },
];
function attackMeta(a) {
    let bits = [];
    if (a.atkType === "debuff") bits.push("lowers DEF");
    else bits.push(Math.round(a.acc * 100) + "% hit");
    if (a.effect && a.effect.affects === "hp") bits.push("bleed " + a.effect.value);
    return bits.join(" · ");
}

// stages
const STAGES = [
    {
        sub: "Stage I", name: "The Outskirts", winsNeeded: 3,
        foeName: "Recruit", foeRole: "young conscript", squad: 2,
        blurb: "The edge of the city. Doors shut as you pass.",
        chests: [{ id: "s0c0", gold: 8 }, { id: "s0c1", gold: 10 }],
        npc: {
            name: "Woman in the doorway",
            lines: [
                { s: "Woman in the doorway", t: "Please..." },
                { s: "Woman in the doorway", t: "Whatever you're after, it isn't here..." },
            ]
        },
        paper: {
            name: "Notice",
            lines: [
                { s: "Notice", t: "TO EVERY HOUSEHOLD: Bar your doors. Stay off the road after dark. If you see them, do not run." },
            ]
        },
        intro: null,
    },
    {
        sub: "Stage II", name: "Quiet Rows", winsNeeded: 3,
        foeName: "Guard", foeRole: "neighborhood watch", squad: 2,
        blurb: "Rows of dark houses. Nobody looks out the windows.",
        chests: [{ id: "s1c0", gold: 14 }],
        npc: {
            name: "A child",
            lines: [
                { s: "A child", t: "U-uh..." },
                { s: "A child", t: "A-are you..." },
                { s: "A child", t: "The murderer...?" },
            ]
        },
        paper: {
            name: "Paradise News",
            lines: [
                { s: "Paradise News", t: "Paradia will stand against this murderer roaming our streets. Be not afraid!" },
            ]
        },
        intro: null,
    },
    {
        sub: "Stage III", name: "The District", winsNeeded: 3,
        foeName: "Sergeant", foeRole: "what's left of the watch", squad: 3,
        blurb: "Shuttered shops under orange light. Fewer people every block.",
        chests: [{ id: "s2c0", gold: 20 }, { id: "s2c1", gold: 16 }],
        npc: {
            name: "Wounded sergeant",
            lines: [
                { s: "Wounded sergeant", t: "What have you done...?" },
            ]
        },
        paper: {
            name: "Advert",
            lines: [
                { s: "Advert", t: "I want YOU for Paradise Military!" },
            ]
        },
        intro: null,
    },
    {
        sub: "Stage IV", name: "Citadel Approach", winsNeeded: 3,
        foeName: "Citadel Guard", foeRole: "the last to stay", squad: 3,
        blurb: "The cold stairs to the Spire. No one left to guard them.",
        chests: [{ id: "s3c0", gold: 28 }],
        npc: {
            name: "Old watchman",
            lines: [
                { s: "Old watchman", t: "Hey..." },
                { s: "Old watchman", t: "Please don't hurt me..." },
            ]
        },
        paper: {
            name: "Last dispatch",
            lines: [
                { s: "Last dispatch", t: "The garrison is gone. We could not stop them. Whoever finds this — be far from here by morning." },
            ]
        },
        intro: null,
    },
    {
        sub: "Stage V", name: "Paradia Spire", winsNeeded: 1,
        foeName: "The Steward", foeRole: "keeper of the country", squad: 1, boss: true,
        blurb: "The leader of Paradia.",
        chests: [], npc: null, paper: null,
        intro: null,
    },
];

const STORE = [
    { id: "rch", icon: "↻", name: "Recharge Attacks", desc: "Refill all attack uses to full.", cost: 5, type: "recharge" },
    { id: "atk", icon: "⚔", name: "Sharpen", desc: "+2 ATK, permanent.", cost: 24, type: "atk", val: 2 },
    { id: "def", icon: "🛡", name: "Padded Coat", desc: "+2 DEF, permanent.", cost: 20, type: "def", val: 2 },
    { id: "hp",  icon: "❤", name: "Square Meal", desc: "+10 Max HP and heal up.", cost: 22, type: "maxhp", val: 10 },
    { id: "pot", icon: "🧪", name: "Field Tonic", desc: "Heals 18 HP. Also saves you from a knockout.", cost: 12, type: "potion", val: 18 },
];

// ---- endings: shown after you beat the Steward and pick a path ----
const EPILOGUE = {
    destroy:
        "You sit down in the chair of the previous leader of Paradia. You see a button labled 'Undo Everything'. You slam it down, no questions asked.<br><br>" +
        "Alarms start blaring loudly outside. As you see rockets launching from the ground. They are headed towards the homes of Paradia.<br><br>" +
        "The rockets slam into the ground making the loudest sounds you've ever heard.<br><br>" +
        "For what seems like a lifetime of waiting. The bangs stop and you see the mess you've made.<br><br>" +
        "Everything is destroyed. The people of this country are few in number now. You could probably count the remaining living people on your hands.",
    restore:
        "You decide to save this broken country. Restore it to it's former glory.<br><br>" +
        "People learn to live proper lives again. Without fear or worry of the bad people who were in control before.<br><br>" +
        "Because you were never the bad guy. You only traumatized your people by brutally murdering people in front of them.<br><br>" +
        "But that wasn't your fault. They did it to themselves.",
};
