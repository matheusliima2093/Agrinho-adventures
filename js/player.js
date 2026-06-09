class Player {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.config = config;
        
        this.health = config.PLAYER_HEALTH;
        this.defense = 0;
        this.maxDefense = 20;
        this.size = config.PLAYER_SIZE;
        this.speed = config.PLAYER_SPEED;
        this.damage = config.PLAYER_DAMAGE;
        
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackDirection = 0;
        
        this.keys = {};
    }
    
    handleKeyDown(key) {
        this.keys[key.toLowerCase()] = true;
    }
    
    handleKeyUp(key) {
        this.keys[key.toLowerCase()] = false;
    }
    
    update(canvasWidth, canvasHeight) {
        this.vx = 0;
        this.vy = 0;
        
        if (this.keys['arrowup'] || this.keys['w']) this.vy = -this.speed;
        if (this.keys['arrowdown'] || this.keys['s']) this.vy = this.speed;
        if (this.keys['arrowleft'] || this.keys['a']) this.vx = -this.speed;
        if (this.keys['arrowright'] || this.keys['d']) this.vx = this.speed;
        if (this.keys[' ']) this.attack(this.x + Math.cos(this.attackDirection) * 50, this.y + Math.sin(this.attackDirection) * 50);
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.x = Math.max(this.size, Math.min(canvasWidth - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvasHeight - this.size, this.y));
        
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        this.defense = Math.max(0, this.defense - 0.05);
        this.health = Math.min(this.config.PLAYER_MAX_HEALTH, this.health + 0.1);
    }
    
    attack(x, y) {
        if (this.attackCooldown > 0) return;
        
        this.isAttacking = true;
        this.attackCooldown = this.config.ATTACK_COOLDOWN / 16;
        
        const dx = x - this.x;
        const dy = y - this.y;
        this.attackDirection = Math.atan2(dy, dx);
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
    }
    
    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.defense * 0.5);
        this.health -= actualDamage;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        const eyeX = this.x + Math.cos(this.attackDirection) * (this.size * 0.6);
        const eyeY = this.y + Math.sin(this.attackDirection) * (this.size * 0.6);
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.isAttacking) {
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.config.ATTACK_RANGE, 0, Math.PI * 2);
            ctx.stroke();
            
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const x1 = this.x + Math.cos(angle) * (this.size + 5);
                const y1 = this.y + Math.sin(angle) * (this.size + 5);
                const x2 = this.x + Math.cos(angle) * (this.size + 15);
                const y2 = this.y + Math.sin(angle) * (this.size + 15);
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
        
        if (this.defense > 0) {
            ctx.strokeStyle = `rgba(243, 156, 18, ${this.defense / this.maxDefense})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5 + this.defense, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class Particle {
    constructor(x, y, angle, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * 3;
        this.vy = Math.sin(angle) * 3;
        this.color = color;
        this.life = 30;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life--;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 30;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}