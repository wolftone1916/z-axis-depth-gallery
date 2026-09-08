// Advanced Animation Effects and Transitions
gsap.registerPlugin(ScrollTrigger);

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallaxEffect();
        this.setupHoverEffects();
        this.setupCardEntrance();
    }

    setupParallaxEffect() {
        // Add subtle parallax movement based on mouse position
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.project-card');
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            cards.forEach((card) => {
                if (document.querySelector('.instructions-overlay').classList.contains('hidden')) {
                    const moveX = (e.clientX - centerX) * 0.01;
                    const moveY = (e.clientY - centerY) * 0.01;

                    gsap.to(card, {
                        rotationY: moveX * 5,
                        rotationX: -moveY * 5,
                        duration: 0.5,
                        ease: 'power1.out',
                        overwrite: 'auto'
                    });
                }
            });
        });
    }

    setupHoverEffects() {
        document.addEventListener('mouseover', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            // Add glow effect
            gsap.to(card, {
                boxShadow: '0 0 60px rgba(0, 229, 255, 0.8)',
                duration: 0.3,
                ease: 'power2.out'
            });

            // Lift effect
            gsap.to(card, {
                y: -20,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        document.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            gsap.to(card, {
                boxShadow: '0 0 30px rgba(0, 188, 212, 0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });

            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
    }

    setupCardEntrance() {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                scale: 0,
                z: -1000,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.gallery-section',
                    start: 'top 80%'
                }
            });
        });
    }

    // Advanced focus effect when card is selected
    static focusCard(card) {
        const perspective = card.closest('.gallery-viewport');

        gsap.to(card, {
            boxShadow: '0 0 100px rgba(0, 229, 255, 1)',
            filter: 'brightness(1.2)',
            duration: 0.4,
            ease: 'power2.out'
        });
    }

    // Release focus effect
    static unfocusCard(card) {
        gsap.to(card, {
            boxShadow: '0 0 30px rgba(0, 188, 212, 0.2)',
            filter: 'brightness(1)',
            duration: 0.4,
            ease: 'power2.out'
        });
    }

    // Pulse effect for notifications
    static pulseCard(card) {
        gsap.to(card, {
            boxShadow: [
                '0 0 30px rgba(0, 188, 212, 0.2)',
                '0 0 60px rgba(0, 229, 255, 0.8)',
                '0 0 30px rgba(0, 188, 212, 0.2)'
            ],
            duration: 0.8,
            repeat: 2,
            ease: 'sine.inOut'
        });
    }

    // Flip effect
    static flipCard(card) {
        gsap.to(card, {
            rotationY: 360,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
    }

    // Shake effect for errors
    static shakeCard(card) {
        gsap.to(card, {
            x: '+=10',
            duration: 0.05,
            repeat: 6,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }
}

// Scroll trigger animations for text elements
class ScrollAnimations {
    static setupScrollText() {
        gsap.utils.toArray('.scroll-reveal').forEach((element) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }
}

// Performance optimizations
class PerformanceManager {
    static reduceMotionForAccessibility() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Disable complex animations
            gsap.globalTimeline.timeScale(0.1);
            document.body.style.setProperty('--animation-duration', '0.05s');
        }
    }

    static enableGPUAcceleration() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card) => {
            card.style.willChange = 'transform';
            card.style.transform = 'translateZ(0)';
        });
    }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    ScrollAnimations.setupScrollText();
    PerformanceManager.reduceMotionForAccessibility();
    PerformanceManager.enableGPUAcceleration();

    window.animationManager = animationManager;
});

// Update animations on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
