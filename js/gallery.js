    makeCardsDraggable() {
        this.cards.forEach((card, cardIndex) => {
            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: function() {
                    card.classList.add('dragging');
                    
                    // Find the highest current zIndex and add to it
                    let maxZ = 9999;
                    document.querySelectorAll('.project-card').forEach(c => {
                        const z = parseInt(gsap.getProperty(c, 'zIndex')) || 0;
                        if (z > maxZ) maxZ = z;
                    });

                    // Bring dragging card to front and make it clear
                    gsap.to(card, { 
                        zIndex: maxZ + 1, 
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 0.2 
                    });
                },
                onDrag: function() {
                    const rect = card.getBoundingClientRect();
                    const cardWidth = rect.width;
                    const cardHeight = rect.height;
                    
                    // Center the card under the mouse cursor
                    const newLeft = this.pointerX - (cardWidth / 2);
                    const newTop = this.pointerY - (cardHeight / 2);
                    
                    // If dragged above 100px from top, start sending to background
                    const threshold = 100;
                    if (newTop < threshold) {
                        const distanceAboveThreshold = threshold - newTop;
                        const maxDistance = 300; // Full blur at 300px above threshold
                        const blurAmount = Math.min(20, (distanceAboveThreshold / maxDistance) * 20);
                        const opacityAmount = Math.max(0.3, 1 - (distanceAboveThreshold / maxDistance) * 0.7);
                        const zIndex = Math.max(-9999, 9999 - (distanceAboveThreshold / maxDistance) * 19998);

                        gsap.set(card, {
                            left: newLeft,
                            top: newTop,
                            filter: `blur(${blurAmount}px)`,
                            opacity: opacityAmount,
                            zIndex: zIndex
                        });
                    } else {
                        // Normal drag below threshold
                        gsap.set(card, {
                            left: newLeft,
                            top: newTop,
                            filter: 'blur(0px)',
                            opacity: 1
                        });
                    }
                },
                onDragEnd: (e) => {
                    const rect = card.getBoundingClientRect();
                    const threshold = 100;

                    if (rect.top < threshold) {
                        // Send to background with animation
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
                        // Card stays at its current position
                    }
                }
            });
        });
    }
