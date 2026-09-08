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
        if (!card || e.target.closest('.control-btn')) return;

        this.draggedCard = card;
        this.isDragging = true;

        this.startX = e.clientX;
        this.startY = e.clientY;

        // Get current transform values
        const transform = window.getComputedStyle(card).transform;
        const matrix = new DOMMatrix(transform);
        this.startZ = matrix.m43 || 0;

        this.offsetX = parseInt(card.style.left || 0);
        this.offsetY = parseInt(card.style.top || 0);

        card.classList.add('dragging');

        gsap.killTweensOf(card);
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.draggedCard) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        const newX = this.offsetX + deltaX;
        const newY = this.offsetY + deltaY;

        gsap.set(this.draggedCard, {
            x: newX,
            y: newY,
            duration: 0
        });

        // Update visual feedback
        this.updateDragIndicator(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        if (!this.draggedCard) return;

        this.draggedCard.classList.remove('dragging');

        // Snap to grid or boundary
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
            const currentScale = card.dataset.scale || 1;
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
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.querySelector('.info-panel').classList.remove('active');
        });

        // Close instructions
        document.querySelector('.close-instructions').addEventListener('click', () => {
            document.querySelector('.instructions-overlay').classList.add('hidden');
        });
    }

    snapToGrid(card) {
        const gridSize = 50;
        const rect = card.getBoundingClientRect();
        const x = Math.round((rect.left + rect.width / 2) / gridSize) * gridSize - rect.width / 2;
        const y = Math.round((rect.top + rect.height / 2) / gridSize) * gridSize - rect.height / 2;

        gsap.to(card, {
            x: x,
            y: y,
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)'
        });
    }

    updateDragIndicator(x, y) {
        // Could add visual feedback here (cursor change, etc.)
        // Currently using CSS cursor property
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
                document.querySelector('.info-panel').classList.remove('active');
                break;

            case 'Delete':
            case 'Backspace':
                if (activeCard && e.ctrlKey) {
                    window.gallery?.deleteCard(activeCard);
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
                        x: window.innerWidth / 2 - activeCard.offsetWidth / 2,
                        y: window.innerHeight / 2 - activeCard.offsetHeight / 2,
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
    const interactionManager = new InteractionManager();
    const keyboardManager = new KeyboardManager();

    window.interactionManager = interactionManager;
    window.keyboardManager = keyboardManager;
});
