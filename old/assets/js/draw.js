/**
 * draw.js - Drawing module for Pyastrator
 * Handles canvas-based astronomical visualization
 */

class AstroCanvas {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id ${canvasId} not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Default options
        this.options = {
            backgroundColor: '#000000',
            starColor: '#FFFFFF',
            gridColor: '#333333',
            showGrid: true,
            ...options
        };
        
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.objects = [];
        
        this.init();
    }
    
    init() {
        this.clear();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Zoom functionality
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom(delta, e.offsetX, e.offsetY);
        });
        
        // Pan functionality
        let isDragging = false;
        let lastX, lastY;
        
        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.offsetX;
            lastY = e.offsetY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.pan(e.offsetX - lastX, e.offsetY - lastY);
                lastX = e.offsetX;
                lastY = e.offsetY;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }
    
    clear() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.options.showGrid) {
            this.drawGrid();
        }
    }
    
    drawGrid() {
        const gridSize = 50 * this.scale;
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = this.offsetX % gridSize; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = this.offsetY % gridSize; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    zoom(factor, centerX, centerY) {
        const oldScale = this.scale;
        this.scale *= factor;
        
        this.offsetX = centerX - (centerX - this.offsetX) * (this.scale / oldScale);
        this.offsetY = centerY - (centerY - this.offsetY) * (this.scale / oldScale);
        
        this.redraw();
    }
    
    pan(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
        this.redraw();
    }
    
    redraw() {
        this.clear();
        this.objects.forEach(obj => obj.draw(this.ctx, this.scale, this.offsetX, this.offsetY));
    }
    
    // Drawing methods
    drawStar(x, y, magnitude = 1, color = null) {
        const screenX = x * this.scale + this.offsetX;
        const screenY = y * this.scale + this.offsetY;
        const radius = Math.max(1, 4 - magnitude) * this.scale;
        
        this.ctx.fillStyle = color || this.options.starColor;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow for bright stars
        if (magnitude < 2) {
            const gradient = this.ctx.createRadialGradient(
                screenX, screenY, radius,
                screenX, screenY, radius * 3
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawConstellation(points, color = '#AAAAAA') {
        if (points.length < 2) return;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5 * this.scale;
        this.ctx.beginPath();
        
        const startX = points[0].x * this.scale + this.offsetX;
        const startY = points[0].y * this.scale + this.offsetY;
        this.ctx.moveTo(startX, startY);
        
        for (let i = 1; i < points.length; i++) {
            const x = points[i].x * this.scale + this.offsetX;
            const y = points[i].y * this.scale + this.offsetY;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.stroke();
    }
    
    // Coordinate conversion utilities
    convertRaDecToXY(ra, dec) {
        // Convert RA (right ascension, in hours) and Dec (declination, in degrees) to canvas coordinates
        const raDeg = ra * 15; // Convert hours to degrees
        const x = Math.cos(dec * Math.PI/180) * Math.sin(raDeg * Math.PI/180);
        const y = Math.sin(dec * Math.PI/180);
        
        // Scale to canvas coordinates
        const canvasX = (x + 1) * this.width / 2;
        const canvasY = (1 - y) * this.height / 2;
        
        return { x: canvasX, y: canvasY };
    }
    
    // Add object to the scene
    addObject(object) {
        this.objects.push(object);
        this.redraw();
    }
}

// Export the module
window.AstroCanvas = AstroCanvas;