export class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('giftCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.boxSize = 1;
        this.maxLidHeight = 0;
        
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.resizeCanvas();
        this.calculateDimensions();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.calculateDimensions();
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    calculateDimensions() {
        const minDimension = Math.min(this.canvas.width, this.canvas.height);
        this.boxSize = Math.round(minDimension * 0.25);
        this.maxLidHeight = this.boxSize * 0.8;
        this.boxSize = Math.max(60, Math.min(this.boxSize, 200));
    }

    getCenter() {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height - (this.canvas.height * 0.15) - this.boxSize / 2
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
