/**
 * shape.js - Shape classes for Pyastrator
 * This file contains base shape class and specific shape implementations
 */

// Base Shape class that all other shapes will inherit from
class Shape {
    constructor(x = 0, y = 0, options = {}) {
        this.x = x;
        this.y = y;
        this.fillColor = options.fillColor || 'rgba(255, 255, 255, 0.5)';
        this.strokeColor = options.strokeColor || 'rgba(255, 255, 255, 1)';
        this.lineWidth = options.lineWidth || 1;
        this.visible = options.visible !== undefined ? options.visible : true;
        this.selected = false;
        this.id = Shape.nextId++;
    }

    // Draw method to be overridden by subclasses
    draw(ctx) {
        if (!this.visible) return;
        // Each subclass should implement this
    }

    // Check if a point is inside the shape
    contains(x, y) {
        // Default implementation to be overridden
        return false;
    }

    // Move the shape
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // Set position
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // Apply common drawing settings
    applyStyle(ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
    }
}

// Static counter for generating unique IDs
Shape.nextId = 1;

// Circle shape
class Circle extends Shape {
    constructor(x, y, radius, options = {}) {
        super(x, y, options);
        this.radius = radius;
        this.type = 'circle';
    }

    draw(ctx) {
        if (!this.visible) return;
        
        this.applyStyle(ctx);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        if (this.selected) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 1)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    contains(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.radius;
    }
}

// Rectangle shape
class Rectangle extends Shape {
    constructor(x, y, width, height, options = {}) {
        super(x, y, options);
        this.width = width;
        this.height = height;
        this.type = 'rectangle';
    }

    draw(ctx) {
        if (!this.visible) return;
        
        this.applyStyle(ctx);
        ctx.beginPath();
        ctx.rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fill();
        ctx.stroke();
        
        if (this.selected) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 1)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.rect(this.x - this.width/2 - 5, this.y - this.height/2 - 5, 
                             this.width + 10, this.height + 10);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    contains(x, y) {
        return (
            x >= this.x - this.width/2 &&
            x <= this.x + this.width/2 &&
            y >= this.y - this.height/2 &&
            y <= this.y + this.height/2
        );
    }
}

// Star shape (useful for astronomy)
class Star extends Shape {
    constructor(x, y, outerRadius, innerRadius, points = 5, options = {}) {
        super(x, y, options);
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius || outerRadius / 2;
        this.points = points;
        this.type = 'star';
    }

    draw(ctx) {
        if (!this.visible) return;
        
        this.applyStyle(ctx);
        ctx.beginPath();
        
        const angle = Math.PI * 2 / (this.points * 2);
        
        for (let i = 0; i < this.points * 2; i++) {
            const radius = i % 2 === 0 ? this.outerRadius : this.innerRadius;
            const x = this.x + radius * Math.cos(i * angle - Math.PI/2);
            const y = this.y + radius * Math.sin(i * angle - Math.PI/2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        if (this.selected) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 1)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.outerRadius + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    contains(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.outerRadius;
    }
}

// Line shape
class Line extends Shape {
    constructor(x1, y1, x2, y2, options = {}) {
        super((x1 + x2) / 2, (y1 + y2) / 2, options);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = 'line';
    }

    draw(ctx) {
        if (!this.visible) return;
        
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        
        if (this.selected) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 1)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    move(dx, dy) {
        this.x1 += dx;
        this.y1 += dy;
        this.x2 += dx;
        this.y2 += dy;
        this.x = (this.x1 + this.x2) / 2;
        this.y = (this.y1 + this.y2) / 2;
    }

    contains(x, y) {
        // Distance from point to line formula
        const lineLength = Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2);
        const distance = Math.abs((this.y2 - this.y1) * x - (this.x2 - this.x1) * y + 
                                        this.x2 * this.y1 - this.y2 * this.x1) / lineLength;
        
        return distance < 5; // 5 pixels tolerance
    }
}

// Export classes
export { Shape, Circle, Rectangle, Star, Line };