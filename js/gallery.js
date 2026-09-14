// Gallery Initialization
class Gallery {
    constructor() {
        this.viewport = document.querySelector('#galleryViewport');
        this.container = document.querySelector('.scroll-container');
        this.cards = [];
        this.scrollProgress = 0;
        this.init();
    }

    init() {
        this.createCards();
        this.setupCardPositioning();
        this.setupScrollAnimation();
        this.attachEventListeners();
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
        return card;
    }

    setupCardPositioning() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        this.cards.forEach((card, index) => {
            const cardWidth = 400;
            const cardHeight = 500;
            const startX = centerX - cardWidth / 2;
            const startY = centerY - cardHeight / 2;

            // Start cards deep in background
            gsap.set(card, {
                position: 'absolute',
                left: startX,
                top: startY,
                z: -5000 - index * 800,
                scale: 0.3 + index * 0.05,
                opacity: 0.3,
                rotationX: 0,
                rotationY: 0
            });
        });
    }

    updateCardAnimation() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        this.scrollProgress = scrollProgress;

        this.cards.forEach((card, index) => {
            // Each card moves forward at different scroll positions
            const cardStartScroll = index * 0.15;
            const cardEndScroll = cardStartScroll + 0.25;
            
            let cardProgress = 0;
            if (scrollProgress >= cardStartScroll && scrollProgress <= cardEndScroll) {
                cardProgress = (scrollProgress - cardStartScroll) / (cardEndScroll - cardStartScroll);
            } else if (scrollProgress > cardEndScroll) {
                cardProgress = 1;
            }

            // Animate from background to foreground
            const initialZ = -5000 - index * 800;
            const finalZ = 2000;
            const zValue = initialZ + cardProgress * (finalZ - initialZ);

            const initialScale = 0.3 + index * 0.05;
            const finalScale = 1;
            const scaleValue = initialScale + cardProgress * (finalScale - initialScale);

            const initialOpacity = 0.3;
            const finalOpacity = 1;
            const opacityValue = initialOpacity + cardProgress * (finalOpacity - initialOpacity);

            gsap.set(card, {
                z: zValue,
                scale: scaleValue,
                opacity: opacityValue
            });
        });
    }

    setupScrollAnimation() {
        const animate = () => {
            this.updateCardAnimation();
            requestAnimationFrame(animate);
        };
        animate();
    }

    attachEventListeners() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.selectCard(card, e));
            card.addEventListener('contextmenu', (e) => this.sendToBackground(card, e));
        });

        // Close buttons
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.querySelector('.info-panel').classList.remove('active');
        });

        document.querySelector('.close-instructions').addEventListener('click', () => {
            document.querySelector('.instructions-overlay').classList.add('hidden');
        });
    }

    selectCard(card, event) {
        if (event.target.closest('.control-btn')) {
            const btn = event.target.closest('.control-btn');
            if (btn.title === 'Info') {
                this.showInfo(card);
            } else if (btn.title === 'Delete') {
                this.deleteCard(card);
            }
            return;
        }

        card.classList.add('active');
        gsap.to(card, {
            z: 8000,
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
            }
        });
    }

    sendToBackground(card, event) {
        event.preventDefault();
        card.classList.remove('active');
        gsap.to(card, {
            z: -5000,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const gallery = new Gallery();
        window.gallery = gallery;
    }, 100);
});
