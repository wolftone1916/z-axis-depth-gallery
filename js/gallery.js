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
                // Initial cards positioned in foreground, ready to drag
                const positions = [
                    { x: centerX - cardWidth - 100, y: centerY - cardHeight / 2 }, // Hero - Left
                    { x: centerX - cardWidth / 2, y: centerY - cardHeight / 2 - 80 }, // About - Center/Top
                    { x: centerX + 100, y: centerY - cardHeight / 2 } // Contact - Right
                ];
                
                const pos = positions[index] || positions[0];

                gsap.set(card, {
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    z: 1000 - index * 10,
                    scale: 1,
                    opacity: 1,
                    rotationX: 0,
                    rotationY: 0,
                    rotationZ: 0,
                    filter: 'blur(0px)'
                });
            } else {
                // Background cards - slightly blurred, ready to come forward
                const angle = ((index - 3) / (this.cards.length - 3)) * Math.PI * 2;
                const radius = 400;
                const offsetX = Math.cos(angle) * radius;
                const offsetY = Math.sin(angle) * radius * 0.2;

                const startX = centerX - 350 / 2 + offsetX;
                const startY = centerY - 450 / 2 + offsetY;

                gsap.set(card, {
                    position: 'absolute',
                    left: startX,
                    top: startY,
                    z: -3000 - (index - 3) * 500,
                    scale: 0.7 + (index - 3) * 0.03,
                    opacity: 0.6,
                    rotationX: Math.random() * 10 - 5,
                    rotationY: Math.random() * 10 - 5,
                    rotationZ: Math.random() * 5 - 2.5,
                    filter: 'blur(8px)'
                });
            }
        });
    }

    updateCardAnimation() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        this.scrollProgress = scrollProgress;

        this.cards.forEach((card, index) => {
            const isInitial = card.dataset.isInitial === 'true';

            if (isInitial) {
                // Initial cards move away as user scrolls
                const moveDistance = scrollProgress * 800;
                const directions = [
                    { x: -400, y: -200 }, // Hero moves left and up
                    { x: 0, y: -400 }, // About moves straight up
                    { x: 400, y: -200 } // Contact moves right and up
                ];
                const dir = directions[index] || directions[0];

                const opacityValue = Math.max(0, 1 - scrollProgress * 1.5);

                gsap.set(card, {
                    x: dir.x * scrollProgress,
                    y: dir.y * scrollProgress,
                    z: 1000 - index * 10 - scrollProgress * 2000,
                    opacity: opacityValue,
                    scale: 1 - scrollProgress * 0.3
                });
            } else {
                // Background cards animate toward foreground
                const cardIndex = index - 3;
                const cardStartScroll = cardIndex * 0.15;
                const cardEndScroll = cardStartScroll + 0.35;

                let cardProgress = 0;
                if (scrollProgress >= cardStartScroll && scrollProgress <= cardEndScroll) {
                    cardProgress = (scrollProgress - cardStartScroll) / (cardEndScroll - cardStartScroll);
                } else if (scrollProgress > cardEndScroll) {
                    cardProgress = 1;
                }

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const initialZ = -3000 - cardIndex * 500;
                const finalZ = 800;
                const zValue = initialZ + cardProgress * (finalZ - initialZ);

                const initialScale = 0.7 + cardIndex * 0.03;
                const finalScale = 1;
                const scaleValue = initialScale + cardProgress * (finalScale - initialScale);

                const initialOpacity = 0.6;
                const finalOpacity = 1;
                const opacityValue = initialOpacity + cardProgress * (finalOpacity - initialOpacity);

                const blurValue = 8 - cardProgress * 8;

                gsap.set(card, {
                    z: zValue,
                    scale: scaleValue,
                    opacity: opacityValue,
                    filter: `blur(${Math.max(0, blurValue)}px)`
                });
            }
        });
    }

    setupScrollAnimation() {
        const animate = () => {
            this.updateCardAnimation();
            requestAnimationFrame(animate);
        };
        animate();
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
