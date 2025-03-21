/**
 * animation.js
 * Animation utilities for Pyastrator
 */

const Animation = (function() {
    // Default animation settings
    const defaults = {
        duration: 1000,
        easing: 'ease',
        delay: 0
    };

    /**
     * Creates a star field animation
     * @param {string|Element} container - Container to place stars
     * @param {Object} options - Configuration options
     */
    function createStarField(container, options = {}) {
        const settings = {
            starCount: 100,
            minSize: 1,
            maxSize: 3,
            speed: 50,
            ...options
        };

        const containerEl = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        containerEl.style.position = 'relative';
        containerEl.style.overflow = 'hidden';
        
        // Create and add stars
        for (let i = 0; i < settings.starCount; i++) {
            const star = document.createElement('div');
            const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = Math.random() * 0.7 + 0.3;
            
            star.className = 'star';
            star.style.position = 'absolute';
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.borderRadius = '50%';
            star.style.backgroundColor = 'white';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.opacity = opacity;
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
            
            containerEl.appendChild(star);
        }
        
        // Add the twinkling animation if not present
        if (!document.querySelector('#star-animation')) {
            const style = document.createElement('style');
            style.id = 'star-animation';
            style.textContent = `
                @keyframes twinkle {
                    0% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Animates celestial object rotation
     * @param {string|Element} element - Element to animate
     * @param {Object} options - Animation options
     */
    function rotateCelestialObject(element, options = {}) {
        const settings = {
            duration: 20000,
            clockwise: true,
            ...options
        };

        const el = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        el.style.animation = `rotate ${settings.duration}ms linear infinite ${settings.clockwise ? 'normal' : 'reverse'}`;
        
        // Add the rotation animation if not present
        if (!document.querySelector('#rotation-animation')) {
            const style = document.createElement('style');
            style.id = 'rotation-animation';
            style.textContent = `
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Creates orbital motion animation
     * @param {string|Element} element - Element to orbit
     * @param {Object} options - Orbit options
     */
    function createOrbit(element, options = {}) {
        const settings = {
            radiusX: 100,
            radiusY: 50,
            duration: 10000,
            center: { x: 50, y: 50 },
            ...options
        };

        const el = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        el.style.position = 'absolute';
        el.style.animation = `orbit ${settings.duration}ms linear infinite`;
        
        // Create unique orbit animation
        const orbitId = `orbit-${Math.floor(Math.random() * 1000000)}`;
        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbit {
                0% {
                    transform: translate(
                        calc(${settings.center.x}% - 50% + ${settings.radiusX}px * cos(0deg)),
                        calc(${settings.center.y}% - 50% + ${settings.radiusY}px * sin(0deg))
                    );
                }
                100% {
                    transform: translate(
                        calc(${settings.center.x}% - 50% + ${settings.radiusX}px * cos(360deg)),
                        calc(${settings.center.y}% - 50% + ${settings.radiusY}px * sin(360deg))
                    );
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Simple fade in animation
     * @param {string|Element} element - Element to fade in
     * @param {Object} options - Animation options
     */
    function fadeIn(element, options = {}) {
        const settings = {...defaults, ...options};
        const el = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        el.style.opacity = '0';
        el.style.display = 'block';
        el.style.transition = `opacity ${settings.duration}ms ${settings.easing} ${settings.delay}ms`;
        
        setTimeout(() => {
            el.style.opacity = '1';
        }, 10);
    }

    /**
     * Simple fade out animation
     * @param {string|Element} element - Element to fade out
     * @param {Object} options - Animation options
     */
    function fadeOut(element, options = {}) {
        const settings = {...defaults, ...options};
        const el = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        el.style.opacity = '1';
        el.style.transition = `opacity ${settings.duration}ms ${settings.easing} ${settings.delay}ms`;
        
        el.style.opacity = '0';
        
        setTimeout(() => {
            el.style.display = 'none';
        }, settings.duration + settings.delay);
    }

    // Public API
    return {
        createStarField,
        rotateCelestialObject,
        createOrbit,
        fadeIn,
        fadeOut
    };
})();