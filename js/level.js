const LEVELS = [
    // Fase 1
    {
        platforms: [
            new Platform(0, 550, 800, 50), // Chão
            new Platform(100, 480, 120, 20),
            new Platform(300, 420, 120, 20),
            new Platform(500, 380, 120, 20),
            new Platform(680, 320, 120, 20),
            new Platform(400, 250, 80, 20, 'moving'),
            new Platform(150, 180, 150, 20),
            new Platform(650, 120, 100, 20)
        ],
        enemies: [
            new Enemy(200, 400, 'grasshopper'),
            new Enemy(400, 350, 'fly'),
            new Enemy(700, 250, 'grasshopper')
        ],
        items: [
            new Item(100, 450, 'seed'),
            new Item(300, 390, 'water'),
            new Item(500, 350, 'seed'),
            new Item(400, 220, 'seed'),
            new Item(150, 150, 'water'),
            new Item(700, 90, 'seed')
        ],
        goalX: 750,
        goalY: 80,
        hasBoss: false
    },
    // Fase 2
    {
        platforms: [
            new Platform(0, 550, 800, 50),
            new Platform(50, 470, 100, 20),
            new Platform(200, 400, 80, 20, 'disappearing'),
            new Platform(350, 380, 100, 20),
            new Platform(520, 320, 100, 20, 'moving'),
            new Platform(100, 240, 120, 20),
            new Platform(350, 180, 150, 20),
            new Platform(600, 140, 150, 20)
        ],
        enemies: [
            new Enemy(150, 360, 'fly'),
            new Enemy(400, 300, 'grasshopper'),
            new Enemy(550, 240, 'pollution'),
            new Enemy(200, 150, 'fly')
        ],
        items: [
            new Item(50, 440, 'seed'),
            new Item(200, 370, 'water'),
            new Item(350, 350, 'seed'),
            new Item(520, 290, 'water'),
            new Item(100, 210, 'seed'),
            new Item(350, 150, 'seed'),
            new Item(650, 110, 'water')
        ],
        goalX: 700,
        goalY: 110,
        hasBoss: false
    },
    // Fase 3 (Com Chefe)
    {
        platforms: [
            new Platform(0, 550, 800, 50),
            new Platform(80, 480, 100, 20),
            new Platform(250, 420, 100, 20),
            new Platform(420, 360, 120, 20, 'moving'),
            new Platform(150, 280, 100, 20),
            new Platform(400, 240, 150, 20, 'disappearing'),
            new Platform(650, 300, 120, 20),
            new Platform(300, 140, 200, 20)
        ],
        enemies: [
            new Enemy(150, 380, 'grasshopper'),
            new Enemy(350, 320, 'fly'),
            new Enemy(500, 260, 'pollution')
        ],
        items: [
            new Item(80, 450, 'seed'),
            new Item(250, 390, 'water'),
            new Item(420, 330, 'seed'),
            new Item(150, 250, 'water'),
            new Item(400, 210, 'seed'),
            new Item(650, 270, 'seed'),
            new Item(300, 110, 'water')
        ],
        goalX: 350,
        goalY: 110,
        hasBoss: true,
        bossX: 400,
        bossY: 100
    },
    // Fase 4 (Com Chefe)
    {
        platforms: [
            new Platform(0, 550, 800, 50),
            new Platform(60, 480, 80, 20),
            new Platform(200, 420, 100, 20, 'disappearing'),
            new Platform(380, 380, 120, 20),
            new Platform(80, 300, 100, 20, 'moving'),
            new Platform(350, 260, 100, 20),
            new Platform(600, 320, 150, 20),
            new Platform(250, 160, 80, 20),
            new Platform(520, 180, 150, 20)
        ],
        enemies: [
            new Enemy(200, 350, 'fly'),
            new Enemy(400, 300, 'pollution'),
            new Enemy(150, 240, 'grasshopper'),
            new Enemy(650, 280, 'fly')
        ],
        items: [
            new Item(60, 450, 'seed'),
            new Item(200, 390, 'water'),
            new Item(380, 350, 'seed'),
            new Item(80, 270, 'water'),
            new Item(350, 230, 'seed'),
            new Item(600, 290, 'seed'),
            new Item(250, 130, 'water'),
            new Item(600, 150, 'seed')
        ],
        goalX: 600,
        goalY: 150,
        hasBoss: true,
        bossX: 400,
        bossY: 90
    },
    // Fase 5 - Final (Com Chefe)
    {
        platforms: [
            new Platform(0, 550, 800, 50),
            new Platform(100, 480, 80, 20),
            new Platform(250, 420, 100, 20, 'disappearing'),
            new Platform(420, 380, 100, 20),
            new Platform(100, 300, 120, 20, 'moving'),
            new Platform(350, 280, 150, 20),
            new Platform(600, 320, 120, 20),
            new Platform(200, 180, 100, 20),
            new Platform(480, 200, 100, 20),
            new Platform(350, 80, 100, 20)
        ],
        enemies: [
            new Enemy(200, 350, 'pollution'),
            new Enemy(400, 300, 'fly'),
            new Enemy(150, 240, 'grasshopper'),
            new Enemy(600, 280, 'pollution'),
            new Enemy(350, 180, 'fly')
        ],
        items: [
            new Item(100, 450, 'seed'),
            new Item(250, 390, 'water'),
            new Item(420, 350, 'seed'),
            new Item(100, 270, 'water'),
            new Item(350, 250, 'seed'),
            new Item(600, 290, 'water'),
            new Item(200, 150, 'seed'),
            new Item(500, 170, 'seed'),
            new Item(350, 50, 'water')
        ],
        goalX: 350,
        goalY: 50,
        hasBoss: true,
        bossX: 400,
        bossY: 80,
        isFinal: true
    }
];