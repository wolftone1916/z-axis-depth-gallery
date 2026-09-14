    makeCardsDraggable() {
        this.cards.forEach(card => {
            let startX, startY, startLeft, startTop;

            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: function() {
                    // Store initial position when drag starts
                    startLeft = parseFloat(gsap.getProperty(card, 'left'));
                    startTop = parseFloat(gsap.getProperty(card, 'top'));
                    startX = this.x;
                    startY = this.y;

                    card.classList.add('dragging');
                    
                    // Find the highest current zIndex and add to it
                    let maxZ = 9999;
                    this.cards = this.cards || [];
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
                    // Calculate how far we've dragged
                    const deltaX = this.x - startX;
                    const deltaY = this.y - startY;

                    // Update the card's absolute position
                    gsap.set(card, {
                        left: startLeft + deltaX,
                        top: startTop + deltaY
                    });
                },
                onDragEnd: () => {
                    card.classList.remove('dragging');
                    // Card stays at its current position
                }
            });
        });
    }
