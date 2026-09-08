// Interactive Drag and Manipulation System (Iron Man Style)
class InteractionManager {
    constructor() {
        this.draggedCard = null;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.startZ = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.init();
    }

    init() {
        this.setupDragListeners();
        this.setupWheelListeners();
        this.setupUIListeners();
    }

    setupDragListeners() {
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(e) {
        const card = e.target.closest('.project-card');
        if (!card) return;

        // Don't drag if clicking a control button
        if (e.target.closest('.control-btn')) return;

        this.draggedCard = card;
        this.isDragging = true;

        this.startX = e.clientX;
        this.startY = e.clientY;

        // Get current position from the card's style
        const rect = card.getBoundingClientRect();
        this.offsetX = rect.left;
        this.offsetY = rect.top;

        card.classList.add('dragging');
        card.style.cursor = 'grabbing';

        // Kill any existing tweens on this card
        gsap.killTweensOf(card);

        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.draggedCard) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        const newX = this.offsetX + deltaX;
        const newY = this.offsetY + deltaY;

        // Use left/top positioning instead of transform
        this.draggedCard.style.position = 'absolute';
        this.draggedCard.style.left = newX + 'px';
        this.draggedCard.style.top = newY + 'px';
    }

    handleMouseUp(e) {
        if (!this.draggedCard) return;

        this.draggedCard.classList.remove('dragging');
        this.draggedCard.style.cursor = 'grab';

        // Snap to grid
        this.snapToGrid(this.draggedCard);

        this.isDragging = false;
        this.draggedCard = null;
    }

    setupWheelListeners() {
        document.addEventListener('wheel', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            e.preventDefault();

            const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
            const currentScale = parseFloat(card.dataset.scale) || 1;
            const newScale = Math.max(0.5, Math.min(3, currentScale * scaleAmount));

            card.dataset.scale = newScale;

            gsap.to(card, {
                scale: newScale,
                duration: 0.3,
                ease: 'power2.out'
            });
        }, { passive: false });
    }

    setupUIListeners() {
        // Close info panel
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.querySelector('.info-panel').classList.remove('active');
            });
        }

        // Close instructions
        const closeInstructions = document.querySelector('.close-instructions');
        if (closeInstructions) {
            closeInstructions.addEventListener('click', () => {
                document.querySelector('.instructions-overlay').classList.add('hidden');
            });
        }
    }

    snapToGrid(card) {
        const gridSize = 50;
        const rect = card.getBoundingClientRect();
        
        const x = Math.round(rect.left / gridSize) * gridSize;
        const y = Math.round(rect.top / gridSize) * gridSize;

        gsap.to(card, {
            left: x + 'px',
            top: y + 'px',
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)'
        });
    }
}

// Keyboard shortcuts
class KeyboardManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleKeydown(e) {
        const activeCard = document.querySelector('.project-card.active');

        switch (e.key) {
            case 'Escape':
                if (activeCard) {
                    activeCard.classList.remove('active');
                }
                const infoPanel = document.querySelector('.info-panel');
                if (infoPanel) {
                    infoPanel.classList.remove('active');
                }
                break;

            case 'Delete':
            case 'Backspace':
                if (activeCard && e.ctrlKey) {
                    if (window.gallery) {
                        window.gallery.deleteCard(activeCard);
                    }
                }
                break;

            case 'z':
            case 'Z':
                if (e.ctrlKey && activeCard) {
                    // Send to background
                    gsap.to(activeCard, {
                        z: -5000,
                        duration: 0.8,
                        ease: 'power2.inOut'
                    });
                }
                break;

            case 'b':
            case 'B':
                if (e.ctrlKey && activeCard) {
                    // Bring to front
                    gsap.to(activeCard, {
                        z: 1000,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                break;

            case 'r':
            case 'R':
                if (e.ctrlKey && activeCard) {
                    // Reset position and rotation
                    gsap.to(activeCard, {
                        left: window.innerWidth / 2 - activeCard.offsetWidth / 2 + 'px',
                        top: window.innerHeight / 2 - activeCard.offsetHeight / 2 + 'px',
                        rotationZ: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    });
                }
                break;
        }
    }
}

// Initialize interaction managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for gallery to initialize
    setTimeout(() => {
        const interactionManager = new InteractionManager();
        const keyboardManager = new KeyboardManager();

        window.interactionManager = interactionManager;
        window.keyboardManager = keyboardManager;
    }, 100);
});
