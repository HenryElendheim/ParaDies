# ⚔️ ParaDies

A dark turn-based combat RPG in **vanilla JavaScript** — no frameworks, no build step, runs straight in the browser. You fight your way through the five districts of Paradia toward the Spire and its Steward. The people bar their doors when you pass. The newspapers call you a murderer. You're saving them from these monsters... right?

Complete and fully playable — from the first fight all the way to either of the two endings.

## 🎮 How it plays

Each stage is a hub where you choose what to do next:

- **Fight** — turn-based battles against the stage's defenders; win enough to unlock the path forward
- **Store** — spend gold on permanent ATK/DEF/HP upgrades, healing tonics (which also save you from a knockout), and attack recharges
- **Explore** — talk to the locals, read what the city is saying about you, and crack open chests for gold
- **Advance** — march on the next district when you've won enough

Beat the Steward at the top of Paradia Spire and the game asks you one final question — with **two different endings** depending on your answer.

## ⚔️ Combat

Battles are turn-based with accuracy rolls, critical hits (×1.75) and status effects. Leveling up unlocks stronger attacks — but the strong ones have **limited uses**, so recharges at the store matter:

| Attack | Unlocks at | Notes |
|---|---|---|
| Punch | Lv 1 | Unlimited uses, reliable |
| Backhand | Lv 3 | Harder hit, 15 uses |
| Cut | Lv 5 | Causes bleed over 3 turns |
| Break Armor | Lv 7 | No damage — shreds enemy DEF instead |
| Pow | Lv 9 | Huge damage, risky accuracy, 5 uses |

Progress autosaves in your browser (localStorage), so you can close the tab and pick up where you left off.

## 🚀 Run it

No installation, no dependencies:

```
git clone https://github.com/HenryElendheim/ParaDies.git
```

Then open `index.html` in your browser.

## 🗂️ Project structure

```
├── index.html
├── css/style.css
└── js/
    ├── data.js      # All content: stages, dialogue, attacks, shop, endings
    ├── core.js      # Game state, save/load, shared helpers
    ├── main.js      # Menu and game flow
    ├── hub.js       # The between-battles hub: store, exploring, advancing
    ├── battle.js    # Turn-based combat engine
    ├── dialogue.js  # Conversation rendering
    └── ending.js    # The final choice and epilogues
```

All the editable content (story text, stats, prices) lives in `data.js`, separate from the game logic — so rebalancing or rewriting the story never touches the engine.

## 💭 Reflections

> This started as a turn based combat test but i really reallyyy liked making it.
> It has been sitting here unfinished for quite some time but it's not complete.
> It's not perfect and may be confusing to most, but its basically a turn based combat game where you level up and can buy upgrades etc.
>
> The story is mid but eh, its more about the gameplay.

*(Update: it's finished now.)*
