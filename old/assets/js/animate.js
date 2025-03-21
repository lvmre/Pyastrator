/**
 * Pyastrator Animation Library
 * A simple utility for creating and managing web animations
 */

(function(window) {
    'use strict';

    // Animation class
    class Animator {
        constructor() {
            this.animations = {};
            this.requestId = null;
        }

        // Create a new animation
        create(id, element, properties, options = {}) {
            const defaultOptions = {
                duration: 1000,
                easing: 'linear',
                delay: 0,
                iterations: 1,
                onStart: null,
                onUpdate: null,
                onComplete: null
            };

            const config = { ...defaultOptions, ...options };
            
            this.animations[id] = {
                element: element,
                properties: properties,
                startTime: null,
                options: config,
                status: 'idle'
            };

            return this;
        }

        // Start an animation by id
        start(id) {
            if (!this.animations[id]) {
                console.error(`Animation with id "${id}" not found`);
                return this;
            }

            const animation = this.animations[id];
            animation.status = 'running';
            animation.startTime = performance.now() + animation.options.delay;
            
            if (animation.options.onStart) {
                animation.options.onStart(animation.element);
            }

            if (!this.requestId) {
                this.loop();
            }

            return this;
        }

        // Stop an animation by id
        stop(id) {
            if (!this.animations[id]) {
                console.error(`Animation with id "${id}" not found`);
                return this;
            }

            this.animations[id].status = 'stopped';
            return this;
        }

        // Animation loop
        loop() {
            const now = performance.now();
            let isActive = false;

            for (const id in this.animations) {
                const animation = this.animations[id];
                
                if (animation.status !== 'running') continue;
                
                if (now < animation.startTime) {
                    isActive = true;
                    continue;
                }

                const elapsed = now - animation.startTime;
                const duration = animation.options.duration;
                let progress = Math.min(elapsed / duration, 1);
                
                if (progress === 1) {
                    animation.status = 'completed';
                    
                    if (animation.options.onComplete) {
                        animation.options.onComplete(animation.element);
                    }
                    
                    if (animation.options.iterations !== 1) {
                        if (animation.options.iterations === 'infinite' || animation.options.iterations > 1) {
                            animation.startTime = now;
                            animation.status = 'running';
                            isActive = true;
                            
                            if (typeof animation.options.iterations === 'number') {
                                animation.options.iterations--;
                            }
                        }
                    }
                    
                    continue;
                }
                
                isActive = true;
                progress = this.easing(progress, animation.options.easing);
                
                this.applyAnimation(animation.element, animation.properties, progress);
                
                if (animation.options.onUpdate) {
                    animation.options.onUpdate(animation.element, progress);
                }
            }

            if (isActive) {
                this.requestId = requestAnimationFrame(() => this.loop());
            } else {
                this.requestId = null;
            }
        }

        // Apply animation changes to element
        applyAnimation(element, properties, progress) {
            for (const prop in properties) {
                const start = properties[prop].start;
                const end = properties[prop].end;
                const unit = properties[prop].unit || '';
                
                if (typeof start === 'number' && typeof end === 'number') {
                    const value = start + (end - start) * progress;
                    
                    if (prop === 'opacity') {
                        element.style[prop] = value;
                    } else {
                        element.style[prop] = `${value}${unit}`;
                    }
                } else if (typeof start === 'string' && typeof end === 'string') {
                    // Handle color transitions
                    if (start.indexOf('#') === 0 && end.indexOf('#') === 0) {
                        element.style[prop] = this.interpolateColor(start, end, progress);
                    }
                }
            }
        }

        // Easing functions
        easing(progress, type) {
            switch (type) {
                case 'linear':
                    return progress;
                case 'easeIn':
                    return progress * progress;
                case 'easeOut':
                    return progress * (2 - progress);
                case 'easeInOut':
                    return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                default:
                    return progress;
            }
        }

        // Color interpolation
        interpolateColor(startColor, endColor, progress) {
            const hexToRgb = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return [r, g, b];
            };

            const start = hexToRgb(startColor);
            const end = hexToRgb(endColor);
            
            const r = Math.round(start[0] + (end[0] - start[0]) * progress);
            const g = Math.round(start[1] + (end[1] - start[1]) * progress);
            const b = Math.round(start[2] + (end[2] - start[2]) * progress);
            
            return `rgb(${r}, ${g}, ${b})`;
        }
    }

    // Helper functions for common animations
    const animate = {
        // Create new animator instance
        create: function() {
            return new Animator();
        },
        
        // Fade element in
        fadeIn: function(element, duration = 1000, callback) {
            const animator = new Animator();
            const id = 'fade-in-' + Date.now();
            
            animator.create(id, element, {
                opacity: { start: 0, end: 1 }
            }, {
                duration: duration,
                onComplete: callback
            }).start(id);
            
            return animator;
        },
        
        // Fade element out
        fadeOut: function(element, duration = 1000, callback) {
            const animator = new Animator();
            const id = 'fade-out-' + Date.now();
            
            animator.create(id, element, {
                opacity: { start: 1, end: 0 }
            }, {
                duration: duration,
                onComplete: callback
            }).start(id);
            
            return animator;
        },
        
        // Slide element down
        slideDown: function(element, duration = 1000, callback) {
            const animator = new Animator();
            const id = 'slide-down-' + Date.now();
            
            element.style.overflow = 'hidden';
            element.style.height = '0px';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight;
            
            animator.create(id, element, {
                height: { start: 0, end: targetHeight, unit: 'px' }
            }, {
                duration: duration,
                onComplete: function(el) {
                    el.style.height = 'auto';
                    if (callback) callback(el);
                }
            }).start(id);
            
            return animator;
        },
        
        // Slide element up
        slideUp: function(element, duration = 1000, callback) {
            const animator = new Animator();
            const id = 'slide-up-' + Date.now();
            
            element.style.overflow = 'hidden';
            const startHeight = element.offsetHeight;
            
            animator.create(id, element, {
                height: { start: startHeight, end: 0, unit: 'px' }
            }, {
                duration: duration,
                onComplete: function(el) {
                    el.style.display = 'none';
                    if (callback) callback(el);
                }
            }).start(id);
            
            return animator;
        }
    };

    // Expose to window
    window.pyAnimator = animate;
    
})(window);