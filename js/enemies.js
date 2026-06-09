class Enemy {
    constructor(x, y, config, isBoss = false) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.config = config;
        this.isBoss = isBoss;
        
        if (isBoss) {
            this.size = config.BOSS_SIZE;
            this.speed = config.BOSS_SPEED;
            this.health = config.BOSS_HEALTH;
            this.damage = config.BOSS_DAMAGE;
            this.color = '#e74c3c';
        } else {
            this.size = config.ENEMY_SIZE;
            this.speed = config.ENEMY_SPEED;
            this.health = config.ENEMY_HEALTH;
            this.damage = config.ENEMY_DAMAGE;
            this.color = '#e67e22';
        }
        
        this.attackCooldown = 0;
        this.direction = Math.random() * Math.PI * 2;
    }
    
    update(player, canvasWidth, canvasHeight) {
        // Chase player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary
        if (this.x < -this.size) this.x = canvasWidth + this.size;
        if (this.x > canvasWidth + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvasHeight + this.size;
        if (this.y > canvasHeight + this.size) this.y = -this.size;
        
        // Cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
    
    draw(ctx) {
        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Outline
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eyes
        const eyeSize = 4;
        const eyeOffsetX = this.size * 0.4;
        const eyeOffsetY = -this.size * 0.3;
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - eyeOffsetX, this.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + eyeOffsetX, this.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x - eyeOffsetX, this.y + eyeOffsetY, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + eyeOffsetX, this.y + eyeOffsetY, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Health bar
        const barWidth = this.size * 2;
        const barHeight = 5;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.size - 15;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        const healthPercent = Math.max(0, this.health / (this.isBoss ? this.config.BOSS_HEALTH : this.config.ENEMY_HEALTH));
        ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Boss indicator
        if (this.isBoss) {
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
