    makeCardsDraggable() {
        this.cards.forEach(card => {
            Draggable.create(card, {
                type: 'x,y',
                edgeResistance: 0.65,
                onDragStart: () => {
                    this.isDragging = true;
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
                onDragEnd: () => {
                    this.isDragging = false;
                    card.classList.remove('dragging');
                }
            });
        });
    }
