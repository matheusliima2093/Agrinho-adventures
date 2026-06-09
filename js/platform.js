class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // normal, moving, disappearing
        this.moveDir = 1;
        this.moveRange = 80;
        this.moveSpeed = 2;
        this.startX = x;
        this.visible = true;
        this.disappearTimer = 0;
    }
    
    update() {
        if (this.type === 'moving') {
            this.x += this.moveSpeed * this.moveDir;
            if (Math.abs(this.x - this.startX) > this.moveRange) {
                this.moveDir *= -1;
            }
        }
        
        if (this.type === 'disappearing') {
            if (this.disappearTimer > 0) {
                this.disappearTimer--;
            } else {
                this.visible = !this.visible;
                if (this.visible) {
                    this.disappearTimer = 120; // 2 segundos visível
                } else {
                    this.disappearTimer = 60; // 1 segundo invisível
                }
            }
        }
    }
    
    draw(ctx) {
        if (!this.visible) return;
        
        // Cor da plataforma
        if (this.type === 'moving') {
            ctx.fillStyle = '#2F4F4F'; // Cinza escuro
        } else if (this.type === 'disappearing') {
            ctx.fillStyle = '#A0A0A0'; // Cinza
        } else {
            ctx.fillStyle = '#8B4513'; // Marrom
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Borda
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Textura de grama (topo)
        ctx.fillStyle = '#228B22'; // Verde floresta
        ctx.fillRect(this.x, this.y, this.width, 4);
    }
}