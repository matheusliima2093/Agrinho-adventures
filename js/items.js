class Item {
    constructor(x, y, type, config) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.config = config;
        this.size = config.ITEM_SIZE;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.rotation = 0;
        this.lifetime = 300;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += 0.1;
        this.lifetime--;
        
        this.alpha = Math.max(0, this.lifetime / 50);
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha || 1;
        
        if (this.type === 'good') {
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#27ae60';
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x = Math.cos(angle) * (this.size * 0.6);
                const y = Math.sin(angle) * (this.size * 0.6);
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.5, -this.size * 0.5);
            ctx.lineTo(this.size * 0.5, this.size * 0.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.size * 0.5, -this.size * 0.5);
            ctx.lineTo(-this.size * 0.5, this.size * 0.5);
            ctx.stroke();
        }
        
        ctx.strokeStyle = this.type === 'good' ? 'rgba(46, 204, 113, 0.5)' : 'rgba(231, 76, 60, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}