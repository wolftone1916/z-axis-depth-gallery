// Gallery with Iron Man Interface Style
class Gallery {
    constructor() {
        this.viewport = document.querySelector('#galleryViewport');
        this.cards = [];
        this.cardStates = [];
        this.activeCard = null;
        this.scrollProgress = 0;
        this.init();
    }

    init() {
        this.createAllCards();
        this.setupCardPositioning();
        this.attachEventListeners();
        this.makeCardsDraggable();
        this.setupScrollAnimation();
    }

    createAllCards() {
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

        const dashboardLayout = [
            { left: centerX - 600, top: centerY - 350, z: -1500, scale: 0.65, rotation: -12, opacity: 0.7, blur: 6 },
            { left: centerX + 350, top: centerY - 300, z: -1400, scale: 0.70, rotation: 8, opacity: 0.75, blur: 5 },
            { left: centerX - 150, top: centerY + 200, z: -1600, scale: 0.60, rotation: 10, opacity: 0.65, blur: 7 },
            { left: centerX - 400, top: centerY - 100, z: -800, scale: 0.80, rotation: -5, opacity: 0.85, blur: 3 },
            { left: centerX + 250, top: centerY + 150, z: -900, scale: 0.75, rotation: 6, opacity: 0.80, blur: 4 },
            { left: centerX + 50, top: centerY - 400, z: -1000, scale: 0.72, rotation: -8, opacity: 0.80, blur: 4 },
            { left: centerX - 200, top: centerY + 80, z: 400, scale: 1.0, rotation: 0, opacity: 1, blur: 0 },
            { left: centerX + 150, top: centerY - 150, z: 500, scale: 1.0, rotation: 2, opacity: 1, blur: 0 },
            { left: centerX - 500, top: centerY - 50, z: 300, scale: 0.95, rotation: -3, opacity: 0.95, blur: 0 }
        ];

        this.cards.forEach((card, index) => {
            const layout = dashboardLayout[index] || {
                left: centerX + (Math.random() - 0.5) * 1000,
                top: centerY + (Math.random() - 0.5) * 800,
                z: -2000 - index * 400,
                scale: 0.5,
                rotation: (Math.random() - 0.5) * 30,
                opacity: 0.5,
                blur: 8
            };

            this.cardStates[index] = { ...layout };

            gsap.set(card, {
                position: 'absolute',
                left: layout.left,
                top: layout.top,
                zIndex: layout.z,
                scale: layout.scale,
                opacity: layout.opacity,
                rotation: layout.rotation,
                filter: `blur(${layout.blur}px)`,
                transformOrigin: '50% 50%'
            });
        });
    }

    setupScrollAnimation() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

            this.scrollProgress = scrollProgress;

            this.cards.forEach((card, index) => {
                if (card.classList.contains('dragging') || card.classList.contains('active')) {
                    return;
                }

                const initialState = this.cardStates[index];
                const moveTowardZ = scrollProgress * 5000;
                const opacityFade = Math.max(0, 1 - scrollProgress * 1.5);
                const scaleShrink = Math.max(0.1, initialState.scale - scrollProgress * 0.5);
                const blurAmount = initialState.blur + scrollProgress * 10;

                gsap.set(card, {
                    zIndex: initialState.z + moveTowardZ,
                    opacity: opacityFade,
                    scale: scaleShrink,
                    filter: `blur(${Math.min(20, blurAmount)}px)`
                });
            });
        });
    }

    makeCardsDraggable() {
        this.cards.forEach((card, cardIndex) => {
            let isDragStart = true;

            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: () => {
                    isDragStart = true;
                    card.classList.add('dragging');
                    
                    let maxZ = 9999;
                    this.cards.forEach(c => {
                        const z = parseInt(window.getComputedStyle(c).zIndex) || 0;
                        if (z > maxZ) maxZ = z;
                    });

                    gsap.set(card, {
                        zIndex: maxZ + 1,
                        opacity: 1,
                        filter: 'blur(0px)'
                    });
                },
                onDrag: () => {
                    isDragStart = false;
                },
                onDragEnd: () => {
                    card.classList.remove('dragging');
                    
                    if (isDragStart) {
                        this.bringToFront(card);
                    }
                }
            });

            card.addEventListener('click', (e) => {
                if (!e.target.closest('.control-btn')) {
                    this.bringToFront(card);
                } else {
                    const btn = e.target.closest('.control-btn');
                    if (btn.title === 'Info') {
                        this.showInfo(card);
                    } else if (btn.title === 'Delete') {
                        this.deleteCard(card);
                    }
                }
            });

            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                gsap.to(card, {
                    zIndex: -9999,
                    opacity: 0.5,
                    filter: 'blur(4px)',
                    duration: 0.6
                });
            });
        });
    }

    bringToFront(card) {
        card.classList.add('active');
        
        let maxZ = 9999;
        this.cards.forEach(c => {
            if (c !== card) {
                c.classList.remove('active');
            }
            const z = parseInt(window.getComputedStyle(c).zIndex) || 0;
            if (z > maxZ) maxZ = z;
        });

        gsap.killTweensOf(card);
        gsap.set(card, {
            zIndex: maxZ + 1,
            opacity: 1,
            filter: 'blur(0px)'
        });
    }

    attachEventListeners() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    window.gallery = gallery;
});
