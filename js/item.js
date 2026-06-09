class Item {
    constructor(x, y, type = 'seed') {
        this.x = x;
        this.y = y;
        this.type = type; // seed, water, powerup
        this.width = 16;
        this.height = 16;
        this.collected = false;
        this.floatOffset = 0;
        this.floatSpeed = 0.1;
    }
    
    update() {
        this.floatOffset += this.floatSpeed;
    }
    
    draw(ctx) {
        const floatY = Math.sin(this.floatOffset) * 3;
        
        if (this.type === 'seed') {
            // Semente
            ctx.fillStyle = '#FFD700'; // Amarelo
            ctx.beginPath();
            ctx.ellipse(this.x + 8, this.y + 8 + floatY, 6, 8, Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Detalhe
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else if (this.type === 'water') {
            // Gota de água
            ctx.fillStyle = '#00BFFF'; // Azul profundo
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 2 + floatY);
            ctx.bezierCurveTo(this.x + 4, this.y + 6 + floatY, this.x + 4, this.y + 12 + floatY, this.x + 8, this.y + 14 + floatY);
            ctx.bezierCurveTo(this.x + 12, this.y + 12 + floatY, this.x + 12, this.y + 6 + floatY, this.x + 8, this.y + 2 + floatY);
            ctx.fill();
            
            // Brilho
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x + 6, this.y + 6 + floatY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    checkCollision(player) {
        return !this.collected &&
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y;
    }
}