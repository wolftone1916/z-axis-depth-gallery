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

        // Layered dashboard layout - multiple cards visible at different depths
        const layoutPositions = [
            // Layer 1 - Background cards (smaller, more blurred)
            { x: centerX - 400, y: centerY - 300, z: -1500, scale: 0.6, rot: -15, opacity: 0.7 },
            { x: centerX + 200, y: centerY - 250, z: -1400, scale: 0.65, rot: 10, opacity: 0.75 },
            { x: centerX - 100, y: centerY + 150, z: -1600, scale: 0.55, rot: 8, opacity: 0.6 },
            
            // Layer 2 - Mid cards (medium size)
            { x: centerX - 250, y: centerY - 100, z: -800, scale: 0.8, rot: -8, opacity: 0.85 },
            { x: centerX + 350, y: centerY + 50, z: -900, scale: 0.75, rot: 12, opacity: 0.8 },
            { x: centerX + 50, y: centerY - 350, z: -1000, scale: 0.7, rot: -5, opacity: 0.8 },
            
            // Layer 3 - Front cards (full size, most visible)
            { x: centerX - 175, y: centerY + 100, z: 500, scale: 1, rot: -2, opacity: 1 },
            { x: centerX + 100, y: centerY - 200, z: 600, scale: 1, rot: 3, opacity: 1 },
            { x: centerX - 350, y: centerY - 50, z: 400, scale: 0.95, rot: 1, opacity: 0.95 }
        ];

        this.cards.forEach((card, index) => {
            const layout = layoutPositions[index] || {
                x: centerX + (Math.random() - 0.5) * 800,
                y: centerY + (Math.random() - 0.5) * 600,
                z: -2000 - index * 300,
                scale: 0.5 + Math.random() * 0.3,
                rot: (Math.random() - 0.5) * 20,
                opacity: 0.5
            };

            gsap.set(card, {
                position: 'absolute',
                left: layout.x,
                top: layout.y,
                z: layout.z,
                scale: layout.scale,
                opacity: layout.opacity,
                rotationZ: layout.rot,
                filter: layout.z < -1000 ? 'blur(5px)' : 'blur(0px)',
                x: 0,
                y: 0
            });
        });
    }

    updateCardAnimation() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        this.scrollProgress = scrollProgress;

        this.cards.forEach((card, index) => {
            // Get current position
            const gsapTarget = gsap.getProperty(card, 'left');
            const currentLeft = gsapTarget || 0;
            const currentTop = gsap.getProperty(card, 'top') || 0;
            const currentZ = gsap.getProperty(card, 'z') || 0;
            const currentScale = gsap.getProperty(card, 'scale') || 1;

            // Move toward camera (increase Z) and fade out
            const moveTowardCamera = scrollProgress * 4000;
            const opacityValue = Math.max(0, 1 - scrollProgress * 1.3);
            const scaleValue = Math.max(0.2, currentScale - scrollProgress * 0.4);

            // Slight outward movement for parallax effect
            const outwardX = (currentLeft - window.innerWidth / 2) * scrollProgress * 0.3;
            const outwardY = (currentTop - window.innerHeight / 2) * scrollProgress * 0.3;

            gsap.set(card, {
                z: currentZ + moveTowardCamera,
                opacity: opacityValue,
                scale: scaleValue,
                x: outwardX,
                y: outwardY
            });
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
                    gsap.to(card, { z: 2000, duration: 0.3 });
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
