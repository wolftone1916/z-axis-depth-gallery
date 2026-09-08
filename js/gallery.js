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

        // Add event listeners
        card.addEventListener('click', (e) => this.selectCard(card, e));
        card.addEventListener('contextmenu', (e) => this.sendToBackground(card, e));

        return card;
    }

    setupCardPositioning() {
        // Position cards in a circular/spread pattern around the center
        const viewport = this.viewport;
        const viewportWidth = viewport.clientWidth || window.innerWidth;
        const viewportHeight = viewport.clientHeight || window.innerHeight;

        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        const radius = 300;

        this.cards.forEach((card, index) => {
            // Arrange cards in a circle pattern
            const angle = (index / this.cards.length) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius - 200; // 200 is half card width
            const y = centerY + Math.sin(angle) * radius - 250; // 250 is half card height

            gsap.set(card, {
                position: 'absolute',
                left: x,
                top: y,
                x: 0,
                y: 0,
                z: index * 50,
                rotationZ: angle * (180 / Math.PI),
                rotationX: 0,
                rotationY: 0,
                opacity: 1
            });

            // Store initial position for scroll animation
            card.dataset.initialZ = index * 50;
            card.dataset.angle = angle;
        });
    }

    setupScrollAnimation() {
        // Register ScrollTrigger with GSAP
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.gallery-section',
                start: 'top center',
                end: 'bottom center',
                scrub: 0.6,
                onUpdate: (self) => {
                    this.scrollProgress = self.getProgress();
                },
                markers: false
            }
        });

        // Animate all cards through Z-axis as user scrolls
        this.cards.forEach((card, index) => {
            const initialZ = parseInt(card.dataset.initialZ);
            const angle = parseFloat(card.dataset.angle);

            tl.to(card, {
                z: initialZ - 1000 - index * 100,
                rotationX: 0,
                rotationY: 0,
                opacity: 1,
                duration: 1,
                ease: 'none'
            }, 0);

            // Subtle scale effect
            tl.to(card, {
                scale: 1 - (index * 0.08),
                duration: 1,
                ease: 'none'
            }, 0);
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
        window.gallery = gallery; // Make globally accessible
    }, 100);
});
