    makeCardsDraggable() {
        this.cards.forEach((card, cardIndex) => {
            let isDragStart = true;

            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: () => {
                    isDragStart = true;
                    card.classList.add('dragging');
                    
                    // Bring to front immediately when drag starts
                    let maxZ = 9999;
                    this.cards.forEach(c => {
                        const z = parseInt(window.getComputedStyle(c).zIndex) || 0;
                        if (z > maxZ) maxZ = z;
                    });

                    gsap.set(card, {
                        zIndex: maxZ + 1,
                        opacity: 1,
                        filter: 'blur(0px)',
                        scale: 1
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
