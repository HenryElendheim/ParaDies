const gameState = loadGame() || {
    stage: {
        current: 1,
        battlesWon: 0,
        required: 3
    },
    player: {
        name: "User",
        hp: 10,
        maxHp: 10,
        level: 1,
        def: 2,

        xp: 0,
        xpToNext: 10,
        atk: 2,
        status: {},

        attacks: [
            {
                name: "Punch",
                power: 1
            },
            {
                name: "Backhand",
                power: 2
            },
            {
                name: "Cut",
                power: 3,
                effect: [
                    { type: "bleed", affects: "hp", value: 2, turns: 3 },
                ]
            },
            {
                name: "Break armor",
                power: 0,
                atkType: "debuff",
                effect: [
                    { type: "defDown", affects: "def", value: -2, turns: 3 },
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
    ],
    defeatedEnemies: [],
    currentEnemyIndex: 0,
};

gameState.stages = {
    1: { defeatedEnemies: [], fights: 0 },
    2: { defeatedEnemies: [], fights: 0 },
    3: { defeatedEnemies: [], fights: 0 },
    4: { defeatedEnemies: [], fights: 0 },
    5: { defeatedEnemies: [], fights: 0 },
};
