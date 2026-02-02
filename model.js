const gameState = {
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

    enemy: {
        name: "Enemy",
        hp: 10,
        maxHp: 10,
        level: 1,

        def: 2,
        atk: 1,
        xpDrop: 5,
        status: {},
    },
}


