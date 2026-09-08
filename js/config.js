// Configuration and Development Guide

/**
 * GSAP CONFIGURATION
 * ==================
 * Global GSAP settings for performance and behavior
 */
gsap.config({
    nullTargetAction: 'ignore',  // Ignore null targets
    autoSleep: 60,               // Auto-sleep after 60 seconds
    force3D: true,               // Force 3D transforms for performance
    lagSmoothing: false          // Disable lag smoothing for consistency
});

/**
 * ANIMATION CONFIGURATION
 * =======================
 * Centralized configuration for all animations
 */
const AnimationConfig = {
    // Depth scroll settings
    depth: {
        initialZ: 100,
        finalZ: -5000,
        scale: {
            initial: 1,
            final: 0.7
        }
    },

    // Card entrance animation
    entrance: {
        duration: 0.8,
        delay: 0.1,
        ease: 'back.out(1.7)',
        stagger: 0.1
    },

    // Hover effects
    hover: {
        glowDuration: 0.3,
        liftDuration: 0.3,
        liftAmount: -20,
        glowColor: '0 0 60px rgba(0, 229, 255, 0.8)',
        normalGlow: '0 0 30px rgba(0, 188, 212, 0.2)'
    },

    // Drag and drop
    drag: {
        snapGridSize: 50,
        snapDuration: 0.4,
        snapEase: 'elastic.out(1, 0.5)'
    },

    // Focus and unfocus
    focus: {
        duration: 0.4,
        ease: 'power2.out',
        glowIntensity: 'rgba(0, 229, 255, 1)',
        brightnessLevel: 1.2
    },

    // Card manipulation
    manipulation: {
        scaleFactor: 0.9,      // Scale down factor for wheel scroll
        maxScale: 3,            // Maximum scale allowed
        minScale: 0.5,          // Minimum scale allowed
        backgroundZ: -5000      // Z position when pushed to background
    }
};

/**
 * GALLERY CONFIGURATION
 * =====================
 * Settings for the gallery layout and behavior
 */
const GalleryConfig = {
    // Card positioning
    positioning: {
        radius: 300,           // Radius for circular arrangement
        centerOffset: 0        // Offset from center (0 for perfect center)
    },

    // Grid settings
    grid: {
        enabled: true,
        size: 50,              // Pixel grid size
        snap: true
    },

    // Viewport settings
    viewport: {
        perspective: '1200px',
        preserveZ: true
    }
};

/**
 * UI CONFIGURATION
 * ================
 * Settings for user interface elements
 */
const UIConfig = {
    // Info panel
    infoPanel: {
        width: '350px',
        slideInDuration: 0.4,
        slideOutDuration: 0.3,
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },

    // Instructions overlay
    instructions: {
        fadeDuration: 0.4,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },

    // Color scheme
    colors: {
        primary: '#00bcd4',      // Cyan
        secondary: '#00e5ff',    // Bright Cyan
        background: '#0f0f1e',   // Dark background
        text: '#e0e0e0',         // Light text
        accent: '#1e1e3f'        // Dark accent
    }
};

/**
 * INTERACTION CONFIGURATION
 * =========================
 * Keyboard and mouse interaction settings
 */
const InteractionConfig = {
    // Keyboard bindings
    keyboard: {
        escape: 'deselect',
        delete: 'remove-card',
        'ctrl+z': 'to-background',
        'ctrl+b': 'to-front',
        'ctrl+r': 'reset-position'
    },

    // Mouse events
    mouse: {
        dragThreshold: 5,        // Minimum pixels to trigger drag
        hoverDelay: 100,         // Delay before hover effect (ms)
        wheelSensitivity: 0.1    // Wheel scroll sensitivity
    },

    // Accessibility
    accessibility: {
        reducedMotion: true,     // Support prefers-reduced-motion
        highContrast: false      // High contrast mode
    }
};

/**
 * PERFORMANCE CONFIGURATION
 * =========================
 * Settings for optimization and performance tuning
 */
const PerformanceConfig = {
    // Animation performance
    animation: {
        maxConcurrent: 10,       // Max concurrent animations
        autoKillDelay: 5000,     // Kill tweens after 5s inactivity
        gpuAcceleration: true    // Enable GPU acceleration
    },

    // Rendering
    rendering: {
        fps: 60,
        backface: 'hidden',      // Hide backface for performance
        willChange: 'transform'
    },

    // Throttling
    throttle: {
        scroll: 16,              // Throttle scroll events (ms)
        resize: 250,             // Throttle resize events (ms)
        mousemove: 16            // Throttle mouse move (ms)
    }
};

/**
 * DEBUG CONFIGURATION
 * ===================
 * Enable/disable debug features
 */
const DebugConfig = {
    enabled: false,              // Master debug flag
    showGridlines: false,        // Show alignment grid
    showBoundingBoxes: false,    // Show card boundaries
    logAnimations: false,        // Log animation events
    logInteractions: false,      // Log interaction events
    showPerformanceMetrics: false, // Show FPS counter
    freezeTimeline: false        // Freeze timeline for debugging
};

/**
 * DEVELOPMENT HELPERS
 * ===================
 */

// Logger utility for debugging
class DebugLogger {
    static log(category, message, data = null) {
        if (!DebugConfig.enabled) return;

        const timestamp = new Date().toLocaleTimeString();
        const style = 'color: #00bcd4; font-weight: bold;';

        console.log(`%c[${timestamp}] ${category}:`, style, message, data || '');
    }

    static animation(message, data) {
        this.log('ANIMATION', message, data);
    }

    static interaction(message, data) {
        this.log('INTERACTION', message, data);
    }

    static performance(message, data) {
        this.log('PERFORMANCE', message, data);
    }
}

// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastTime = currentTime;

            if (DebugConfig.showPerformanceMetrics) {
                console.log(`FPS: ${this.fps}`);
            }
        }

        requestAnimationFrame(() => this.update());
    }

    start() {
        if (DebugConfig.showPerformanceMetrics) {
            this.update();
        }
    }
}

/**
 * APPLY CONFIGURATIONS ON LOAD
 * =============================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme colors
    const root = document.documentElement;
    root.style.setProperty('--primary-color', UIConfig.colors.primary);
    root.style.setProperty('--secondary-color', UIConfig.colors.secondary);
    root.style.setProperty('--accent-color', UIConfig.colors.accent);

    // Initialize performance monitor if debug enabled
    if (DebugConfig.showPerformanceMetrics) {
        const monitor = new PerformanceMonitor();
        monitor.start();
    }

    DebugLogger.log('CONFIG', 'Configuration loaded');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationConfig,
        GalleryConfig,
        UIConfig,
        InteractionConfig,
        PerformanceConfig,
        DebugConfig,
        DebugLogger,
        PerformanceMonitor
    };
}
