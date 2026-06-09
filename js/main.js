// Configurações do jogo
const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_SPEED: 5,
    PLAYER_SIZE: 30,
    PLAYER_DAMAGE: 10,
    PLAYER_HEALTH: 100,
    PLAYER_MAX_HEALTH: 100,
    
    ENEMY_SIZE: 25,
    ENEMY_SPEED: 2,
    ENEMY_HEALTH: 30,
    ENEMY_DAMAGE: 5,
    ENEMY_SPAWN_RATE: 0.05, // 5%
    
    BOSS_SIZE: 50,
    BOSS_SPEED: 1.5,
    BOSS_HEALTH: 200,
    BOSS_DAMAGE: 15,
    
    ITEM_SIZE: 15,
    ITEM_SPAWN_RATE: 0.02, // 2%
    
    ATTACK_RANGE: 100,
    ATTACK_COOLDOWN: 500, // ms
};

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.state = 'menu'; // menu, playing, paused, gameOver
        this.level = 1;
        this.wave = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.particles = [];
        
        this.gameLoop = null;
        this.lastSpawnTime = 0;
        this.waveStartTime = 0;
        
        this.setupEventListeners();
        this.initGame();
    }
    
    setupEventListeners() {
        // Menu buttons
        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showInstructions());
        document.getElementById('backBtn').addEventListener('click', () => this.hideInstructions());
        
        // Game controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Pause/Resume
        document.getElementById('resumeBtn').addEventListener('click', () => this.resume());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('menuBtn').addEventListener('click', () => this.goToMenu());
        
        // Game Over
        document.getElementById('restartGameBtn').addEventListener('click', () => this.restart());
        document.getElementById('menuGameOverBtn').addEventListener('click', () => this.goToMenu());
    }
    
    initGame() {
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height / 2,
            GAME_CONFIG
        );
        this.enemies = [];
        this.items = [];
        this.particles = [];
        this.level = 1;
        this.wave = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.waveStartTime = Date.now();
    }
    
    startGame() {
        this.initGame();
        this.state = 'playing';
        this.hideMenu('mainMenu');
        this.showElement('gameScreen');
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => this.update(), 1000 / 60); // 60 FPS
        }
    }
    
    showInstructions() {
        this.hideMenu('mainMenu');
        this.showMenu('instructionsMenu');
    }
    
    hideInstructions() {
        this.hideMenu('instructionsMenu');
        this.showMenu('mainMenu');
    }
    
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.showMenu('pauseMenu');
        }
    }
    
    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            this.hideMenu('pauseMenu');
        }
    }
    
    restart() {
        this.hideMenu('gameOverScreen');
        this.hideMenu('pauseMenu');
        this.startGame();
    }
    
    goToMenu() {
        this.hideMenu('pauseMenu');
        this.hideMenu('gameOverScreen');
        this.hideElement('gameScreen');
        this.showMenu('mainMenu');
        this.state = 'menu';
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    handleKeyDown(e) {
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            if (this.state === 'playing') this.pause();
            else if (this.state === 'paused') this.resume();
            return;
        }
        
        if (this.state === 'playing') {
            this.player.handleKeyDown(e.key);
        }
    }
    
    handleKeyUp(e) {
        if (this.state === 'playing') {
            this.player.handleKeyUp(e.key);
        }
    }
    
    handleClick(e) {
        if (this.state === 'playing') {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.player.attack(x, y);
        }
    }
    
    update() {
        if (this.state !== 'playing') {
            this.draw();
            return;
        }
        
        // Update player
        this.player.update(this.canvas.width, this.canvas.height);
        
        // Spawn enemies
        if (Math.random() < GAME_CONFIG.ENEMY_SPAWN_RATE && this.enemies.length < 5 + this.level) {
            this.spawnEnemy();
        }
        
        // Spawn items
        if (Math.random() < GAME_CONFIG.ITEM_SPAWN_RATE) {
            this.spawnItem();
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(this.player, this.canvas.width, this.canvas.height);
            
            // Check collision with player attacks
            if (this.player.isAttacking) {
                const dist = Math.hypot(
                    this.enemies[i].x - this.player.x,
                    this.enemies[i].y - this.player.y
                );
                if (dist < GAME_CONFIG.ATTACK_RANGE) {
                    this.enemies[i].takeDamage(GAME_CONFIG.PLAYER_DAMAGE);
                    this.createParticles(this.enemies[i].x, this.enemies[i].y, '#ff6b6b');
                }
            }
            
            // Enemy dies
            if (this.enemies[i].health <= 0) {
                this.score += this.enemies[i].isBoss ? 500 : 100;
                this.enemiesKilled++;
                this.createParticles(this.enemies[i].x, this.enemies[i].y, '#ffd700', 10);
                this.enemies.splice(i, 1);
                
                // Wave complete
                if (this.enemies.length === 0 && this.wave > 1) {
                    this.nextWave();
                }
                continue;
            }
            
            // Enemy collision with player
            const dist = Math.hypot(
                this.enemies[i].x - this.player.x,
                this.enemies[i].y - this.player.y
            );
            if (dist < GAME_CONFIG.PLAYER_SIZE) {
                this.player.takeDamage(this.enemies[i].damage);
                this.createParticles(this.player.x, this.player.y, '#ff0000');
            }
        }
        
        // Update items
        for (let i = this.items.length - 1; i >= 0; i--) {
            this.items[i].update();
            
            // Item collision with player
            const dist = Math.hypot(
                this.items[i].x - this.player.x,
                this.items[i].y - this.player.y
            );
            if (dist < GAME_CONFIG.PLAYER_SIZE) {
                if (this.items[i].type === 'good') {
                    this.player.defense = Math.min(20, this.player.defense + 5);
                    this.createParticles(this.items[i].x, this.items[i].y, '#00ff00', 5);
                } else {
                    this.player.takeDamage(10);
                    this.createParticles(this.items[i].x, this.items[i].y, '#ff0000', 5);
                }
                this.items.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Check game over
        if (this.player.health <= 0) {
            this.gameOver();
        }
        
        // Wave progression
        const waveTime = (Date.now() - this.waveStartTime) / 1000;
        if (waveTime > 60 && this.enemies.length === 0) {
            this.nextWave();
        }
        
        this.draw();
    }
    
    spawnEnemy() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        
        // Ensure enemy spawns outside screen
        if (Math.random() > 0.5) {
            if (Math.random() > 0.5) {
                return;
            }
        }
        
        const isBoss = Math.random() < 0.02 * this.wave; // 2% per level
        const enemy = new Enemy(x, y, GAME_CONFIG, isBoss);
        this.enemies.push(enemy);
    }
    
    spawnItem() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const type = Math.random() > 0.3 ? 'good' : 'bad';
        const item = new Item(x, y, type, GAME_CONFIG);
        this.items.push(item);
    }
    
    createParticles(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const particle = new Particle(x, y, angle, color);
            this.particles.push(particle);
        }
    }
    
    nextWave() {
        this.wave++;
        if (this.wave > 5) {
            this.level++;
            this.wave = 1;
            this.player.health = GAME_CONFIG.PLAYER_MAX_HEALTH;
        }
        this.waveStartTime = Date.now();
        this.enemies = [];
    }
    
    gameOver() {
        this.state = 'gameOver';
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        
        const isBoss = this.level > 1 || this.wave > 3;
        const message = `Você chegou ao Nível ${this.level}, Onda ${this.wave}!`;
        
        this.showGameOverScreen(message);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Draw items
        this.items.forEach(item => item.draw(this.ctx));
        
        // Draw particles
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        // Update HUD
        this.updateHUD();
    }
    
    updateHUD() {
        document.getElementById('healthText').textContent = `${Math.max(0, this.player.health)}/100`;
        document.getElementById('healthFill').style.width = `${Math.max(0, this.player.health)}%`;
        document.getElementById('defenseText').textContent = Math.round(this.player.defense);
        document.getElementById('scoreText').textContent = this.score;
        document.getElementById('levelInfo').textContent = `Nível ${this.level}`;
        document.getElementById('waveInfo').textContent = `Onda ${this.wave}`;
        document.getElementById('enemyCountText').textContent = this.enemies.length;
    }
    
    showGameOverScreen(message) {
        document.getElementById('gameOverTitle').textContent = this.score > 1000 ? '🎉 VITÓRIA!' : '💀 Game Over';
        document.getElementById('gameOverMessage').textContent = message;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('finalEnemies').textContent = this.enemiesKilled;
        this.showMenu('gameOverScreen');
    }
    
    showMenu(menuId) {
        document.getElementById(menuId).classList.remove('hidden');
    }
    
    hideMenu(menuId) {
        document.getElementById(menuId).classList.add('hidden');
    }
    
    showElement(elementId) {
        document.getElementById(elementId).classList.remove('hidden');
    }
    
    hideElement(elementId) {
        document.getElementById(elementId).classList.add('hidden');
    }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
