class Enemy {
    constructor(x, y, type = 'grasshopper') {
        this.x = x;
        this.y = y;
        this.type = type; // grasshopper, fly, pollution
        this.width = 24;
        this.height = 24;
        this.velocityX = Math.random() > 0.5 ? 2 : -2;
        this.velocityY = 0;
        this.health = 1;
        this.moveRange = 200;
        this.startX = x;
        
        if (type === 'fly') {
            this.velocityY = Math.sin(Math.random() * Math.PI) * 2;
            this.width = 20;
            this.height = 20;
        } else if (type === 'pollution') {
            this.velocityX = 1;
            this.velocityY = 0.5;
            this.width = 40;
            this.height = 16;
        }
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.type === 'fly') {
            this.velocityY += Math.sin(this.x * 0.02) * 0.2;
        }
        
        // Voltar se sair do alcance
        if (Math.abs(this.x - this.startX) > this.moveRange) {
            this.velocityX *= -1;
        }
    }
    
    draw(ctx) {
        if (this.type === 'grasshopper') {
            // Corpo do gafanhoto
            ctx.fillStyle = '#FFD700'; // Amarelo ouro
            ctx.beginPath();
            ctx.ellipse(this.x + 12, this.y + 12, 8, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Cabeça
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.arc(this.x + 12, this.y + 4, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Olhos
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x + 9, this.y + 2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 15, this.y + 2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Pernas
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 12);
            ctx.lineTo(this.x + 3, this.y + 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x + 16, this.y + 12);
            ctx.lineTo(this.x + 21, this.y + 20);
            ctx.stroke();
        } else if (this.type === 'fly') {
            // Mosca
            ctx.fillStyle = '#696969';
            ctx.beginPath();
            ctx.ellipse(this.x + 10, this.y + 10, 5, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Asas
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(this.x + 5, this.y + 8, 3, 6, Math.PI / 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(this.x + 15, this.y + 8, 3, 6, -Math.PI / 4, 0, Math.PI * 2);
            ctx.stroke();
            
            // Olhos
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y + 8, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 12, this.y + 8, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'pollution') {
            // Nuvem de poluição
            ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 8, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 22, this.y + 8, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 32, this.y + 8, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}