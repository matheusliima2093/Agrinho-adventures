class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = 12;
        this.isJumping = false;
        this.isFacingRight = true;
        
        // Coleta
        this.seeds = 0;
        this.water = 0;
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }
    
    update(input, platforms) {
        // Movimento horizontal
        this.velocityX = 0;
        if (input.left) this.velocityX = -this.speed;
        if (input.right) this.velocityX = this.speed;
        if (this.velocityX !== 0) this.isFacingRight = this.velocityX > 0;
        
        // Aplicar velocidade
        this.x += this.velocityX;
        this.velocityY += 0.6; // Gravidade
        this.y += this.velocityY;
        
        // Colisão com plataformas
        let onPlatform = false;
        for (let platform of platforms) {
            // Colisão por baixo
            if (this.velocityY > 0 &&
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height + 10 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width) {
                this.velocityY = 0;
                this.y = platform.y - this.height;
                this.isJumping = false;
                onPlatform = true;
            }
            
            // Colisão por cima
            if (this.velocityY < 0 &&
                this.y <= platform.y + platform.height &&
                this.y >= platform.y - 10 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width) {
                this.velocityY = 0;
            }
        }
        
        // Pulo
        if (input.jump && !this.isJumping) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
        }
        
        // Invulnerabilidade
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }
    
    draw(ctx) {
        // Piscar quando invulnerável
        if (this.invulnerable && Math.floor(this.invulnerableTime / 5) % 2 === 0) return;
        
        // Corpo do fazendeiro
        ctx.fillStyle = '#8B4513'; // Marrom
        ctx.fillRect(this.x, this.y + 20, this.width, 20);
        
        // Cabeça
        ctx.fillStyle = '#D2691E'; // Cor de pele
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Chapéu
        ctx.fillStyle = '#FFD700'; // Amarelo
        ctx.fillRect(this.x + 8, this.y - 2, 16, 8);
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(this.x + 6, this.y + 4, 20, 3);
        
        // Olhos
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 12, this.y + 8, 3, 3);
        ctx.fillRect(this.x + 19, this.y + 8, 3, 3);
        
        // Pernas
        ctx.fillStyle = '#2F4F4F'; // Cinza escuro
        ctx.fillRect(this.x + 10, this.y + 40, 4, 8);
        ctx.fillRect(this.x + 18, this.y + 40, 4, 8);
    }
    
    takeDamage() {
        if (!this.invulnerable) {
            this.lives--;
            this.invulnerable = true;
            this.invulnerableTime = 120; // 2 segundos
        }
    }
    
    addSeeds(amount) {
        this.seeds += amount;
    }
    
    addWater(amount) {
        this.water += amount;
    }
    
    useProjectile(type) {
        if (type === 'seed' && this.seeds > 0) {
            this.seeds--;
            return 'seed';
        }
        if (type === 'water' && this.water > 0) {
            this.water--;
            return 'water';
        }
        return null;
    }
}