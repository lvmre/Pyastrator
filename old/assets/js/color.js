/**
 * color.js - A utility library for color manipulation and conversion
 */

class Color {
    /**
     * Create a new Color instance
     * @param {number|string|object} r - Red component (0-255) or hex string or {r,g,b} object
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @param {number} a - Alpha component (0-1), defaults to 1
     */
    constructor(r, g, b, a = 1) {
        if (typeof r === 'string') {
            // Parse hex string
            const result = this.hexToRgb(r);
            this.r = result.r;
            this.g = result.g;
            this.b = result.b;
            this.a = typeof a === 'number' ? a : 1;
        } else if (typeof r === 'object') {
            // Object input {r, g, b, a?}
            this.r = r.r;
            this.g = r.g;
            this.b = r.b;
            this.a = r.a !== undefined ? r.a : 1;
        } else {
            // Individual components
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    /**
     * Convert hex string to RGB object
     * @param {string} hex - Color in hex format (with or without #)
     * @returns {object} RGB object with r, g, b properties
     */
    hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            throw new Error('Invalid hex format');
        }
        
        return { r, g, b };
    }

    /**
     * Convert RGB values to hex string
     * @returns {string} Color in hex format
     */
    toHex() {
        const componentToHex = (c) => {
            const hex = Math.round(c).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${componentToHex(this.r)}${componentToHex(this.g)}${componentToHex(this.b)}`;
    }

    /**
     * Convert RGB values to RGBA string
     * @returns {string} Color in rgba format
     */
    toRgba() {
        return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`;
    }

    /**
     * Convert RGB to HSL
     * @returns {object} HSL object with h, s, l properties
     */
    toHsl() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    /**
     * Lighten the color by a percentage
     * @param {number} amount - Amount to lighten (0-100)
     * @returns {Color} New Color instance
     */
    lighten(amount) {
        const hsl = this.toHsl();
        hsl.l = Math.min(100, hsl.l + amount);
        return Color.fromHsl(hsl.h, hsl.s, hsl.l, this.a);
    }

    /**
     * Darken the color by a percentage
     * @param {number} amount - Amount to darken (0-100)
     * @returns {Color} New Color instance
     */
    darken(amount) {
        const hsl = this.toHsl();
        hsl.l = Math.max(0, hsl.l - amount);
        return Color.fromHsl(hsl.h, hsl.s, hsl.l, this.a);
    }

    /**
     * Create a Color instance from HSL values
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @param {number} a - Alpha (0-1)
     * @returns {Color} New Color instance
     */
    static fromHsl(h, s, l, a = 1) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return new Color(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
            a
        );
    }
}

// Export the Color class
export default Color;