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
                tags: ['Photography', 'Web Design', 'Creative']
            },
            {
                id: 'about',
                type: 'about',
                title: 'About Me',
                emoji: '👨‍💼',
                content: 'I\'m a passionate photographer and web designer with years of experience in both fields. I bring creativity and technical expertise to every project.',
                tags: ['Experience', 'Innovation', 'Excellence']
            },
            {
                id: 'contact',
                type: 'contact',
                title: 'Get In Touch',
                emoji: '📧',
                content: 'Let\'s collaborate and create something amazing together.',
                tags: ['Contact', 'Collaborate'],
                buttons: true
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
        card.dataset.id = data.id;
        card.dataset.index = index;

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
            // Distribute cards at different positions and depths
            const angle = (index / this.cards.length) * Math.PI * 2;
            const radius = 200 + index * 50;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius * 0.3;

            const startX = centerX - cardWidth / 2 + offsetX;
            const startY = centerY - cardHeight / 2 + offsetY;

            gsap.set(card, {
                position: 'absolute',
                left: startX,
                top: startY,
                z: -4000 - index * 600,
                scale: 0.3 + index * 0.04,
                opacity: 0.4,
                rotationX: Math.random() * 15 - 7.5,
                rotationY: Math.random() * 15 - 7.5,
                rotationZ: Math.random() * 10 - 5
            });
        });
    }

    updateCardAnimation() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        this.scrollProgress = scrollProgress;

        this.cards.forEach((card, index) => {
            // Staggered animation
            const cardStartScroll = index * 0.12;
            const cardEndScroll = cardStartScroll + 0.28;

            let cardProgress = 0;
            if (scrollProgress >= cardStartScroll && scrollProgress <= cardEndScroll) {
                cardProgress = (scrollProgress - cardStartScroll) / (cardEndScroll - cardStartScroll);
            } else if (scrollProgress > cardEndScroll) {
                cardProgress = 1;
            }

            const initialZ = -4000 - index * 600;
            const finalZ = 3000;
            const zValue = initialZ + cardProgress * (finalZ - initialZ);

            const initialScale = 0.3 + index * 0.04;
            const finalScale = 1;
            const scaleValue = initialScale + cardProgress * (finalScale - initialScale);

            const initialOpacity = 0.4;
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
        const data = [...projectsData].find(p => p.id == card.dataset.id);
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
