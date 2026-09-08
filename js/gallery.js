// Gallery Initialization and Card Generation
class Gallery {
    constructor() {
        this.viewport = document.querySelector('.gallery-viewport');
        this.cards = [];
        this.activeCard = null;
        this.scrollProgress = 0;
        this.init();
    }

    init() {
        this.createCards();
        this.setupCardPositioning();
        this.setupScrollAnimation();
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

        // Add event listeners BEFORE positioning
        card.addEventListener('click', (e) => this.selectCard(card, e));
        card.addEventListener('contextmenu', (e) => this.sendToBackground(card, e));

        return card;
    }

    setupCardPositioning() {
        // Position cards centered
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        this.cards.forEach((card, index) => {
            const cardWidth = 300;
            const cardHeight = 380;
            
            const startX = centerX - cardWidth / 2;
            const startY = centerY - cardHeight / 2;

            gsap.set(card, {
                position: 'absolute',
                left: startX,
                top: startY,
                x: 0,
                y: 0,
                z: -3000 - index * 500,
                rotationZ: 0,
                scale: 0.2 + index * 0.05,
                opacity: 0.5
            });

            card.dataset.cardIndex = index;
        });
    }

    setupScrollAnimation() {
        // Use direct scroll listener for Z-axis movement
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

            this.scrollProgress = scrollProgress;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const centerX = viewportWidth / 2;
            const centerY = viewportHeight / 2;

            this.cards.forEach((card, index) => {
                // Each card has its own scroll window - staggered appearance
                const cardStartScroll = index * (1 / this.cards.length);
                const cardScrollRange = 1 / this.cards.length;
                
                let cardProgress = 0;
                if (scrollProgress >= cardStartScroll) {
                    cardProgress = Math.min(1, (scrollProgress - cardStartScroll) / cardScrollRange);
                }

                // Card starts far away and small, scales up as it comes closer
                const initialZ = -3000 - index * 500;
                const zValue = initialZ + cardProgress * 4000;
                const scaleValue = 0.2 + index * 0.05 + cardProgress * 0.8;
                
                // Opacity: fade in, peak at middle, fade out
                let opacityValue = 0.5;
                if (cardProgress < 0.5) {
                    opacityValue = 0.5 + cardProgress;
                } else {
                    opacityValue = 1.5 - cardProgress;
                }

                gsap.set(card, {
                    z: zValue,
                    scale: scaleValue,
                    opacity: opacityValue
                });
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

        gsap.to(card, {
            z: 5000,
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
        window.gallery = gallery;
    }, 100);
});
