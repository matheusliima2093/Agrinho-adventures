class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.state = 'menu';
        this.currentPhase = 0;
        this.totalScore = 0;
        this.totalSeeds = 0;
        
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.boss = null;
        
        this.input = {
            left: false,
            right: false,
            jump: false,
            shoot: false
        };
        
        this.gameLoop = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showInstructions());
        document.getElementById('backBtn').addEventListener('click', () => this.hideInstructions());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resume());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('menuBtn').addEventListener('click', () => this.goToMenu());
        document.getElementById('restartGameBtn').addEventListener('click', () => this.restart());
        document.getElementById('menuGameOverBtn').addEventListener('click', () => this.goToMenu());
        document.getElementById('nextPhaseBtn').addEventListener('click', () => this.loadPhase(this.currentPhase + 1));
        document.getElementById('playAgainBtn').addEventListener('click', () => this.startGame());
        document.getElementById('menuVictoryBtn').addEventListener('click', () => this.goToMenu());
        
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') this.input.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd') this.input.right = true;
        if (e.key === ' ') { this.input.jump = true; e.preventDefault(); }
        if (e.key === 'ArrowUp' || e.key === 'w') this.input.shoot = true;
        if (e.key === 'p' || e.key === 'P') {
            if (this.state === 'playing') this.pause();
            else if (this.state === 'paused') this.resume();
        }
    }
    
    handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') this.input.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd') this.input.right = false;
        if (e.key === ' ') this.input.jump = false;
        if (e.key === 'ArrowUp' || e.key === 'w') this.input.shoot = false;
    }
    
    startGame() {
        this.currentPhase = 0;
        this.totalScore = 0;
        this.totalSeeds = 0;
        this.loadPhase(0);
    }
    
    loadPhase(phaseIndex) {
        if (phaseIndex >= LEVELS.length) {
            this.victory();
            return;
        }
        
        this.currentPhase = phaseIndex;
        const level = LEVELS[phaseIndex];
        
        this.player = new Player(50, 450);
        this.platforms = level.platforms.map(p => new Platform(p.x, p.y, p.width, p.height, p.type));
        this.enemies = level.enemies.map(e => new Enemy(e.x, e.y, e.type));
        this.items = level.items.map(i => new Item(i.x, i.y, i.type));
        this.projectiles = [];
        
        this.currentLevel = level;
        this.state = 'playing';
        
        this.hideMenu('pauseMenu');
        this.hideMenu('phaseCompleteScreen');
        this.hideMenu('gameOverScreen');
        this.showElement('gameScreen');
        
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => this.update(), 1000 / 60);
        }
        
        if (level.hasBoss) {
            this.boss = new Boss(level.bossX, level.bossY);
        }
        
        this.updateHUD();
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
        this.startGame();
    }
    
    goToMenu() {
        this.state = 'menu';
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.hideElement('gameScreen');
        this.hideMenu('pauseMenu');
        this.hideMenu('gameOverScreen');
        this.hideMenu('phaseCompleteScreen');
        this.hideMenu('victoryScreen');
        this.showMenu('mainMenu');
    }
    
    showInstructions() {
        this.hideMenu('mainMenu');
        this.showMenu('instructionsMenu');
    }
    
    hideInstructions() {
        this.hideMenu('instructionsMenu');
        this.showMenu('mainMenu');
    }
    
    update() {
        if (this.state !== 'playing') {
            this.draw();
            return;
        }
        
        // Atualizar plataformas
        this.platforms.forEach(p => p.update());
        
        // Atualizar jogador
        this.player.update(this.input, this.platforms);
        this.input.jump = false;
        
        // Atirar
        if (this.input.shoot) {
            const projectileType = this.player.seeds > 0 ? 'seed' : 'water';
            if (projectileType === 'seed' && this.player.seeds > 0) {
                const proj = new Projectile(this.player.x + this.player.width / 2, this.player.y + 10, 'seed', this.player.isFacingRight ? 1 : -1);
                this.projectiles.push(proj);
                this.player.seeds--;
            } else if (projectileType === 'water' && this.player.water > 0) {
                const proj = new Projectile(this.player.x + this.player.width / 2, this.player.y + 10, 'water', this.player.isFacingRight ? 1 : -1);
                this.projectiles.push(proj);
                this.player.water--;
            }
            this.input.shoot = false;
        }
        
        // Atualizar projéteis
        this.projectiles.forEach(proj => proj.update());
        this.projectiles = this.projectiles.filter(proj => proj.active);
        
        // Atualizar inimigos
        this.enemies.forEach(enemy => enemy.update());
        
        // Colisão jogador com inimigos
        this.enemies.forEach((enemy, index) => {
            if (this.checkCollision(this.player, enemy)) {
                if (this.player.y + this.player.height - this.player.velocityY <= enemy.y + 8) {
                    // Pulo no inimigo
                    this.player.velocityY = -8;
                    this.enemies.splice(index, 1);
                    this.totalScore += 50;
                } else if (!this.player.invulnerable) {
                    this.player.takeDamage();
                }
            }
        });
        
        // Colisão projéteis com inimigos
        this.projectiles.forEach((proj, pIndex) => {
            this.enemies.forEach((enemy, eIndex) => {
                if (proj.checkCollision(enemy)) {
                    if (enemy.takeDamage()) {
                        this.enemies.splice(eIndex, 1);
                        this.totalScore += 100;
                    }
                    proj.active = false;
                    this.projectiles.splice(pIndex, 1);
                }
            });
        });
        
        // Colisão com itens
        this.items.forEach((item, index) => {
            if (item.checkCollision(this.player)) {
                item.collected = true;
                if (item.type === 'seed') {
                    this.player.addSeeds(1);
                    this.totalSeeds++;
                    this.totalScore += 10;
                } else if (item.type === 'water') {
                    this.player.addWater(1);
                    this.totalScore += 15;
                }
                this.items.splice(index, 1);
            }
        });
        
        this.items.forEach(item => item.update());
        
        // Atualizar chefe
        if (this.boss) {
            this.boss.update(this.player, this.enemies);
            
            // Colisão com projéteis
            this.projectiles.forEach((proj, pIndex) => {
                if (proj.checkCollision(this.boss)) {
                    this.boss.takeDamage(proj.type === 'water' ? 20 : 10);
                    proj.active = false;
                    this.projectiles.splice(pIndex, 1);
                }
            });
            
            // Colisão com jogador
            if (this.checkCollision(this.player, this.boss) && !this.player.invulnerable) {
                this.player.takeDamage();
            }
            
            if (this.boss.health <= 0) {
                this.boss = null;
                this.totalScore += 500;
            }
        }
        
        // Verificar Game Over
        if (this.player.y > this.canvas.height || this.player.lives <= 0) {
            this.gameOver();
            return;
        }
        
        // Verificar vitória da fase
        if (this.checkCollision(this.player, { x: this.currentLevel.goalX, y: this.currentLevel.goalY, width: 40, height: 40 })) {
            if (!this.boss || this.boss.health <= 0) {
                this.phaseComplete();
            }
        }
        
        this.updateHUD();
        this.draw();
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    gameOver() {
        this.state = 'gameOver';
        document.getElementById('finalPhase').textContent = this.currentPhase + 1;
        document.getElementById('finalScore').textContent = this.totalScore;
        document.getElementById('finalSeeds').textContent = this.totalSeeds;
        this.showMenu('gameOverScreen');
    }
    
    phaseComplete() {
        this.state = 'phaseComplete';
        document.getElementById('currentPhase').textContent = this.currentPhase + 1;
        document.getElementById('phaseSeeds').textContent = this.player.seeds + this.player.water;
        document.getElementById('phaseScore').textContent = this.totalScore;
        this.showMenu('phaseCompleteScreen');
    }
    
    victory() {
        this.state = 'victory';
        document.getElementById('totalPhases').textContent = LEVELS.length;
        document.getElementById('totalScore').textContent = this.totalScore;
        document.getElementById('totalSeeds').textContent = this.totalSeeds;
        this.hideElement('gameScreen');
        this.showMenu('victoryScreen');
    }
    
    updateHUD() {
        document.getElementById('phaseText').textContent = this.currentPhase + 1;
        document.getElementById('scoreText').textContent = this.totalScore;
        document.getElementById('seedsText').textContent = this.player.seeds;
        document.getElementById('waterText').textContent = this.player.water;
        document.getElementById('livesText').textContent = this.player.lives;
        
        if (this.boss) {
            document.getElementById('bossHPContainer').classList.remove('hidden');
            const bossHPPercent = Math.max(0, (this.boss.health / this.boss.maxHealth) * 100);
            document.getElementById('bossHPText').textContent = Math.ceil(bossHPPercent);
        } else {
            document.getElementById('bossHPContainer').classList.add('hidden');
        }
    }
    
    draw() {
        // Fundo
        this.ctx.fillStyle = '#87CEEB'; // Azul céu
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Nuvens
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.beginPath();
        this.ctx.ellipse(100, 80, 50, 30, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(650, 120, 60, 35, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sol
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(720, 60, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Desenhar plataformas
        this.platforms.forEach(p => p.draw(this.ctx));
        
        // Desenhar goal
        this.ctx.fillStyle = '#00DD00';
        this.ctx.fillRect(this.currentLevel.goalX, this.currentLevel.goalY, 40, 40);
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('✓', this.currentLevel.goalX + 10, this.currentLevel.goalY + 28);
        
        // Desenhar jogador
        this.player.draw(this.ctx);
        
        // Desenhar inimigos
        this.enemies.forEach(e => e.draw(this.ctx));
        
        // Desenhar itens
        this.items.forEach(i => i.draw(this.ctx));
        
        // Desenhar projéteis
        this.projectiles.forEach(p => p.draw(this.ctx));
        
        // Desenhar chefe
        if (this.boss) {
            this.boss.draw(this.ctx);
        }
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

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.health = 100;
        this.maxHealth = 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 2;
        this.moveCounter = 0;
        this.moveInterval = 60;
    }
    
    update(player, enemies) {
        this.moveCounter++;
        
        if (this.moveCounter > this.moveInterval) {
            this.velocityX = (Math.random() - 0.5) * this.speed * 4;
            this.velocityY = (Math.random() - 0.5) * this.speed * 2;
            this.moveCounter = 0;
        }
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Limites
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 800) this.x = 800 - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > 400) this.y = 400 - this.height;
    }
    
    draw(ctx) {
        // Corpo do chefe (grande poluição)
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 30, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 45, this.y + 35, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Olhos
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Barra de vida
        const barWidth = 60;
        const barHeight = 6;
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y - 15, barWidth, barHeight);
        
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : healthPercent > 0.25 ? '#FFFF00' : '#FF0000';
        ctx.fillRect(this.x, this.y - 15, barWidth * healthPercent, barHeight);
        
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y - 15, barWidth, barHeight);
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
}

// Iniciar jogo
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});