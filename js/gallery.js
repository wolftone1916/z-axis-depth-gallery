// Gallery with Iron Man Interface Style
class Gallery {
    constructor() {
        this.viewport = document.querySelector('#galleryViewport');
        this.cards = [];
        this.activeCard = null;
        this.scrollProgress = 0;
        this.isDragging = false;
        this.init();
    }

    init() {
        this.createAllCards();
        this.setupCardPositioning();
        this.setupScrollAnimation();
        this.attachEventListeners();
        this.makeCardsDraggable();
    }

    createAllCards() {
        // Create initial cards: Hero, About, Contact
        const initialCards = [
            {
                id: 'hero',
                type: 'hero',
                title: '📸 Joshua Lee',
                subtitle: 'Photography & Web Design',
                emoji: '📸',
                content: 'Creative visionary blending photography and web design',
                tags: ['Photography', 'Web Design', 'Creative'],
                isInitial: true
            },
            {
                id: 'about',
                type: 'about',
                title: 'About Me',
                emoji: '👨‍💼',
                content: 'I\'m a passionate photographer and web designer with years of experience in both fields. I bring creativity and technical expertise to every project.',
                tags: ['Experience', 'Innovation', 'Excellence'],
                isInitial: true
            },
            {
                id: 'contact',
                type: 'contact',
                title: 'Get In Touch',
                emoji: '📧',
                content: 'Let\'s collaborate and create something amazing together.',
                tags: ['Contact', 'Collaborate'],
                buttons: true,
                isInitial: true
            }
        ];

        // Combine with project data
        const allCards = [...initialCards, ...projectsData];

        allCards.forEach((cardData, index) => {
            const card = this.createCardElement(cardData, index);
            this.viewport.appendChild(card);
            this.cards.push(card);
        });
    }

    createCardElement(data, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (data.isInitial) {
            card.classList.add('initial-card');
        }
        card.dataset.id = data.id;
        card.dataset.index = index;
        card.dataset.isInitial = data.isInitial ? 'true' : 'false';

        let content = `
            <div class="card-header">
                <div class="card-emoji">${data.emoji}</div>
                <h2 class="card-title">${data.title}</h2>
                ${data.subtitle ? `<p class="card-subtitle">${data.subtitle}</p>` : ''}
            </div>
            <p class="card-description">${data.content || data.description}</p>
            <div class="card-tags">
                ${(data.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        if (data.buttons) {
            content += `
                <div class="card-buttons">
                    <a href="mailto:joshualee_photos@yahoo.com" class="card-btn">Email</a>
                    <a href="#" class="card-btn">Portfolio</a>
                    <a href="#" class="card-btn">Social</a>
                </div>
            `;
        }

        content += `
            <div class="card-controls">
                <button class="control-btn" title="Info">ℹ️</button>
                <button class="control-btn" title="Delete">✕</button>
            </div>
        `;

        card.innerHTML = content;
        return card;
    }

    setupCardPositioning() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const cardWidth = 350;
        const cardHeight = 450;

        this.cards.forEach((card, index) => {
            const isInitial = card.dataset.isInitial === 'true';

            if (isInitial) {
                // Initial 3 cards positioned on screen, centered
                const positions = [
                    { x: centerX - cardWidth - 150, y: centerY - cardHeight / 2 - 50 }, // Hero - Left
                    { x: centerX - cardWidth / 2, y: centerY - cardHeight / 2 - 100 }, // About - Center
                    { x: centerX + 150, y: centerY - cardHeight / 2 - 50 } // Contact - Right
                ];
                
                const pos = positions[index] || positions[0];

                gsap.set(card, {
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    z: 1000,
                    scale: 1,
                    opacity: 1,
                    rotationX: 0,
                    rotationY: 0,
                    rotationZ: 0,
                    filter: 'blur(0px)',
                    x: 0,
                    y: 0
                });
            } else {
                // Background cards - blurred and positioned behind
                const backgroundIndex = index - 3;
                const angle = (backgroundIndex / Math.max(1, this.cards.length - 3)) * Math.PI * 2;
                const radius = 600;
                const offsetX = Math.cos(angle) * radius;
                const offsetY = Math.sin(angle) * radius * 0.15;

                const centerOffsetX = centerX - 350 / 2 + offsetX;
                const centerOffsetY = centerY - 450 / 2 + offsetY;

                gsap.set(card, {
                    position: 'absolute',
                    left: centerOffsetX,
                    top: centerOffsetY,
                    z: -2000,
                    scale: 0.8,
                    opacity: 0.5,
                    rotationX: Math.random() * 8 - 4,
                    rotationY: Math.random() * 8 - 4,
                    rotationZ: Math.random() * 4 - 2,
                    filter: 'blur(10px)',
                    x: 0,
                    y: 0
                });
            }
        });
    }

    updateCardAnimation() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        this.scrollProgress = scrollProgress;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const cardWidth = 350;
        const cardHeight = 450;

        this.cards.forEach((card, index) => {
            const isInitial = card.dataset.isInitial === 'true';

            if (isInitial) {
                // Initial cards move up and fade as user scrolls
                const moveAwayDistance = scrollProgress * 500;

                // Different directions for each card
                const directions = [
                    { x: -300, y: -300 }, // Hero moves left and up
                    { x: 0, y: -400 }, // About moves straight up
                    { x: 300, y: -300 } // Contact moves right and up
                ];
                const dir = directions[index] || directions[0];

                const opacityValue = Math.max(0, 1 - scrollProgress * 1.2);
                const scaleValue = Math.max(0.3, 1 - scrollProgress * 0.4);

                gsap.set(card, {
                    x: dir.x * scrollProgress,
                    y: dir.y * scrollProgress,
                    z: 1000 - scrollProgress * 3000,
                    opacity: opacityValue,
                    scale: scaleValue,
                    filter: 'blur(0px)'
                });
            } else {
                // Background cards animate toward foreground
                const backgroundIndex = index - 3;
                const cardStartScroll = 0.1 + backgroundIndex * 0.18;
                const cardEndScroll = cardStartScroll + 0.22;

                let cardProgress = 0;
                if (scrollProgress >= cardStartScroll && scrollProgress <= cardEndScroll) {
                    cardProgress = (scrollProgress - cardStartScroll) / (cardEndScroll - cardStartScroll);
                } else if (scrollProgress > cardEndScroll) {
                    cardProgress = 1;
                }

                // Target positions (where they should land)
                const positions = [
                    { x: centerX - cardWidth - 150, y: centerY - cardHeight / 2 - 50 },
                    { x: centerX - cardWidth / 2, y: centerY - cardHeight / 2 - 100 },
                    { x: centerX + 150, y: centerY - cardHeight / 2 - 50 }
                ];

                const targetPos = positions[backgroundIndex % 3];

                // Starting positions (where they are behind)
                const angle = (backgroundIndex / Math.max(1, this.cards.length - 3)) * Math.PI * 2;
                const radius = 600;
                const startOffsetX = Math.cos(angle) * radius;
                const startOffsetY = Math.sin(angle) * radius * 0.15;

                const startX = centerX - 350 / 2 + startOffsetX;
                const startY = centerY - 450 / 2 + startOffsetY;

                // Interpolate position
                const interpolatedX = startX + (targetPos.x - startX) * cardProgress;
                const interpolatedY = startY + (targetPos.y - startY) * cardProgress;

                // Z depth animation
                const initialZ = -2000;
                const finalZ = 900;
                const zValue = initialZ + cardProgress * (finalZ - initialZ);

                // Scale and opacity
                const scaleValue = 0.8 + cardProgress * 0.2;
                const opacityValue = 0.5 + cardProgress * 0.5;
                const blurValue = 10 - cardProgress * 10;

                gsap.set(card, {
                    left: interpolatedX,
                    top: interpolatedY,
                    z: zValue,
                    scale: scaleValue,
                    opacity: opacityValue,
                    filter: `blur(${Math.max(0, blurValue)}px)`,
                    x: 0,
                    y: 0
                });
            }
        });
    }

    setupScrollAnimation() {
        window.addEventListener('scroll', () => {
            this.updateCardAnimation();
        });
        
        // Initial call
        this.updateCardAnimation();
    }

    makeCardsDraggable() {
        this.cards.forEach(card => {
            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: () => {
                    this.isDragging = true;
                    card.classList.add('dragging');
                },
                onDragEnd: () => {
                    this.isDragging = false;
                    card.classList.remove('dragging');
                }
            });
        });
    }

    attachEventListeners() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.selectCard(card, e));
            card.addEventListener('contextmenu', (e) => this.sendToBackground(card, e));
        });

        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.querySelector('.info-panel').classList.remove('active');
            });
        }

        const closeInstructions = document.querySelector('.close-instructions');
        if (closeInstructions) {
            closeInstructions.addEventListener('click', () => {
                document.querySelector('.instructions-overlay').classList.add('hidden');
            });
        }
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

        this.cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        gsap.to(card, {
            z: 8000,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    showInfo(card) {
        const panel = document.querySelector('.info-panel');
        const panelContent = document.querySelector('#element-info');

        if (panelContent) {
            const title = card.querySelector('.card-title')?.textContent || '';
            const desc = card.querySelector('.card-description')?.textContent || '';
            panelContent.innerHTML = `
                <strong>${title}</strong><br><br>
                ${desc}<br><br>
                <strong>Status:</strong> Active
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
            z: -6000,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const gallery = new Gallery();
        window.gallery = gallery;
    }, 100);
});
