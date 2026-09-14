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
                    // Bring dragging card to front and make it clear
                    gsap.to(card, { 
                        zIndex: 9999, 
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
