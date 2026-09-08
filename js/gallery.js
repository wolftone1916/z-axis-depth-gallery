// Gallery Initialization and Card Generation
class Gallery {
    constructor() {
        this.viewport = document.querySelector('.gallery-viewport');
        this.cards = [];
        this.activeCard = null;
        this.init();
    }

    init() {
        this.createCards();
        this.setupScrollAnimation();
        this.setupCardPositioning();
    }

    createCards() {
        projectsData.forEach((project, index) => {
            const card = this.createCardElement(project, index);
            this.viewport.appendChild(card);
            this.cards.push(card);
        });
    }

    createCardElement(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-header">
                <div class="card-number">${project.number}</div>
                <h2 class="card-title">${project.title}</h2>
            </div>
            <div class="card-image">${project.emoji}</div>
            <p class="card-description">${project.description}</p>
            <div class="card-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-controls">
                <button class="control-btn" title="Info">ℹ️</button>
                <button class="control-btn" title="Delete">✕</button>
            </div>
        `;

        // Add event listeners
        card.addEventListener('click', (e) => this.selectCard(card, e));
        card.addEventListener('contextmenu', (e) => this.sendToBackground(card, e));

        return card;
    }

    setupScrollAnimation() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.gallery-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                markers: false
            }
        });

        // Animate cards coming from center and moving back
        this.cards.forEach((card, index) => {
            tl.to(card, {
                z: -500 - index * 100,
                opacity: 1,
                duration: 1,
                ease: 'none'
            }, 0);

            // Scale animation
            tl.to(card, {
                scale: 1 - index * 0.05,
                duration: 1,
                ease: 'none'
            }, 0);
        });
    }

    setupCardPositioning() {
        // Position cards in a spread pattern across the screen
        const viewport = this.viewport;
        const viewportWidth = viewport.clientWidth || window.innerWidth;
        const viewportHeight = viewport.clientHeight || window.innerHeight;

        this.cards.forEach((card, index) => {
            // Spread cards across the viewport in a grid-like pattern
            const cols = 3;
            const rows = Math.ceil(this.cards.length / cols);
            
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            const cardWidth = 400;
            const cardHeight = 500;
            
            const startX = (viewportWidth / cols) * col + (viewportWidth / cols / 2) - cardWidth / 2;
            const startY = (viewportHeight / rows) * row + (viewportHeight / rows / 2) - cardHeight / 2;

            gsap.set(card, {
                position: 'absolute',
                left: startX,
                top: startY,
                x: 0,
                y: 0,
                z: 100 + index * 50,
                rotationZ: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        });
    }

    selectCard(card, event) {
        // Don't select if clicking a control button
        if (event.target.closest('.control-btn')) {
            const btn = event.target.closest('.control-btn');
            if (btn) {
                if (btn.title === 'Info') {
                    this.showInfo(card);
                } else if (btn.title === 'Delete') {
                    this.deleteCard(card);
                }
            }
            return;
        }

        this.activeCard = card;
        this.cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Bring card to front
        gsap.to(card, {
            z: 1000,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    showInfo(card) {
        const project = projectsData.find(p => p.id === parseInt(card.dataset.id));
        const panel = document.querySelector('.info-panel');
        const panelContent = document.querySelector('#element-info');

        if (panelContent && project) {
            panelContent.innerHTML = `
                <strong>${project.title}</strong><br><br>
                ${project.details}<br><br>
                <strong>Status:</strong> Active<br>
                <strong>ID:</strong> ${project.id}
            `;
        }

        if (panel) {
            panel.classList.add('active');
        }
    }

    deleteCard(card) {
        gsap.to(card, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: 'back.in',
            onComplete: () => {
                card.remove();
                const index = this.cards.indexOf(card);
                if (index > -1) {
                    this.cards.splice(index, 1);
                }
            }
        });
    }

    sendToBackground(card, event) {
        event.preventDefault();

        gsap.to(card, {
            z: -5000,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const gallery = new Gallery();
        window.gallery = gallery; // Make globally accessible
    }, 50);
});
