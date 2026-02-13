const gameState = loadGame() || {
    stage: {
        current: 1,
        battlesWon: 0,
        required: 3
    },
    player: {
        unlockedAttacks: ["Punch"],
        name: "User",
        hp: 10,
        maxHp: 10,
        level: 1,
        def: 2,
        atk: 2,

        xp: 0,
        xpToNext: 10,
        status: {},


        levelRewards: [
            { level: 1, def: 2 },
            { level: 5, def: 4, unlock: "Backhand" },
            { level: 10, def: 6, unlock: "Cut" },
            { level: 15, def: 8, unlock: "Break armor" },
            { level: 20, def: 10, unlock: "Pow" },
        ],

        attacks: [
            {
                name: "Punch",
                power: 1,
                minLvl: 1,
            },
            {
                name: "Backhand",
                power: 2,
                minLvl: 5,
            },
            {
                name: "Cut",
                power: 3,
                minLvl: 10,
                effect: [
                    { type: "bleed", affects: "hp", value: 2, turns: 3 },
                ]
            },
            {
                name: "Break armor",
                power: 0,
                minLvl: 15,
                atkType: "debuff",
                effect: [
                    { type: "defDown", affects: "def", value: -2, turns: 3 },
                ]
            },
            {
                name: "Pow",
                power: 10,
                minLvl: 20,
                effect: [
                    { type: "bleed", affects: "hp", value: 5, turns: 2 },
                ]
            },
        ]
    },

    enemies: [
        {
            name: "Protector 1",
            hp: 10,
            maxHp: 10,
            level: 1,
            def: 2,
            atk: 1,
            xpDrop: 5,
            status: {}
        },
        {
            name: "Protector 2",
            hp: 12,
            maxHp: 12,
            level: 2,
            def: 3,
            atk: 2,
            xpDrop: 5,
            status: {}
        },
        {
            name: "Protector 3",
            hp: 15,
            maxHp: 15,
            level: 3,
            def: 4,
            atk: 3,
            xpDrop: 5,
            status: {}
        },
        {
            name: "Protector 4",
            hp: 10,
            maxHp: 10,
            level: 1,
            def: 2,
            atk: 1,
            xpDrop: 5,
            status: {}
        },
        {
            name: "Protector 5",
            hp: 12,
            maxHp: 12,
            level: 2,
            def: 3,
            atk: 2,
            xpDrop: 5,
            status: {}
        },
        {
            name: "Protector 6",
            hp: 15,
            maxHp: 15,
            level: 3,
            def: 4,
            atk: 3,
            xpDrop: 5,
            status: {}
        },
    ],
    currentEnemyIndex: 0,
};

gameState.stages = {
    1: { defeatedEnemies: [], fights: 0 },
    2: { defeatedEnemies: [], fights: 0 },
    3: { defeatedEnemies: [], fights: 0 },
    4: { defeatedEnemies: [], fights: 0 },
    5: { defeatedEnemies: [], fights: 0 },
};