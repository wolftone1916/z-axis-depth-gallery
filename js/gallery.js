    makeCardsDraggable() {
        this.cards.forEach(card => {
            let startX, startY, startLeft, startTop;
            let isDragged = false;

            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: function() {
                    isDragged = false;
                    // Store initial position when drag starts
                    startLeft = parseFloat(gsap.getProperty(card, 'left'));
                    startTop = parseFloat(gsap.getProperty(card, 'top'));
                    startX = this.x;
                    startY = this.y;

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
                    // Mark as dragged if movement exceeds threshold
                    const deltaX = this.x - startX;
                    const deltaY = this.y - startY;
                    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                        isDragged = true;
                    }

                    // Current position
                    const currentTop = startTop + deltaY;
                    
                    // If dragged above 100px from top, start sending to background
                    const threshold = 100;
                    if (currentTop < threshold) {
                        const distanceAboveThreshold = threshold - currentTop;
                        const maxDistance = 300; // Full blur at 300px above threshold
                        const blurAmount = Math.min(20, (distanceAboveThreshold / maxDistance) * 20);
                        const opacityAmount = Math.max(0.3, 1 - (distanceAboveThreshold / maxDistance) * 0.7);
                        const zIndex = Math.max(-9999, 9999 - (distanceAboveThreshold / maxDistance) * 19998);

                        gsap.set(card, {
                            left: startLeft + deltaX,
                            top: currentTop,
                            filter: `blur(${blurAmount}px)`,
                            opacity: opacityAmount,
                            zIndex: zIndex
                        });
                    } else {
                        // Normal drag below threshold
                        gsap.set(card, {
                            left: startLeft + deltaX,
                            top: currentTop,
                            filter: 'blur(0px)',
                            opacity: 1
                        });
                    }
                },
                onDragEnd: (e) => {
                    if (!isDragged) {
                        // Just a click, not a drag - trigger click handler
                        card.classList.remove('dragging');
                        return;
                    }

                    const currentTop = parseFloat(gsap.getProperty(card, 'top'));
                    const threshold = 100;

                    if (currentTop < threshold) {
                        // Send to background with animation
                        gsap.to(card, {
                            top: startTop,
                            left: startLeft,
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

            // Only trigger click handler if not dragging
            card.addEventListener('click', (e) => {
                // Check if Draggable thinks it's being dragged
                const draggable = Draggable.get(card);
                if (draggable && !isDragged) {
                    this.selectCard(card, e);
                }
            });
        });
    }
