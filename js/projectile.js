class Projectile {
    constructor(x, y, type = 'seed', direction = 1) {
        this.x = x;
        this.y = y;
        this.type = type; // seed, water
        this.direction = direction;
        this.velocityX = direction * 8;
        this.velocityY = -6;
        this.width = 8;
        this.height = 8;
        this.active = true;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.4; // Gravidade
        
        // Desativar se sair da tela
        if (this.y > 800 || this.x < -50 || this.x > 850) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (this.type === 'seed') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, 5, 7, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'water') {
            ctx.fillStyle = '#00BFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Efeito de respingo
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    checkCollision(enemy) {
        return this.active &&
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y;
    }
}