    makeCardsDraggable() {
        this.cards.forEach((card, cardIndex) => {
            let startY = 0;

            const dragInstance = Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: () => {
                    card.classList.add('dragging');
                    startY = dragInstance[0].y;
                    
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
                    const deltaY = dragInstance[0].y - startY;
                    const threshold = -100;

                    if (deltaY < threshold) {
                        const distanceBelowThreshold = Math.abs(deltaY) - Math.abs(threshold);
                        const maxDistance = 300;
                        const blurAmount = Math.min(20, (distanceBelowThreshold / maxDistance) * 20);
                        const opacityAmount = Math.max(0.3, 1 - (distanceBelowThreshold / maxDistance) * 0.7);

                        gsap.set(card, {
                            filter: `blur(${blurAmount}px)`,
                            opacity: opacityAmount
                        });
                    } else {
                        gsap.set(card, {
                            filter: 'blur(0px)',
                            opacity: 1
                        });
                    }
                },
                onDragEnd: () => {
                    const deltaY = dragInstance[0].y - startY;
                    const threshold = -100;

                    if (deltaY < threshold) {
                        const initialState = this.cardStates[cardIndex];
                        gsap.to(card, {
                            top: initialState.top,
                            left: initialState.left,
                            opacity: 0.5,
                            filter: 'blur(4px)',
                            zIndex: -9999,
                            duration: 0.6,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                card.classList.remove('dragging');
                            }
                        });
                    } else {
                        card.classList.remove('dragging');
                    }
                }
            })[0];

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
