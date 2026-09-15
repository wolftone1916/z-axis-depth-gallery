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

        // Find the highest current zIndex and add to it
        let maxZ = 9999;
        document.querySelectorAll('.project-card').forEach(c => {
            const z = parseInt(gsap.getProperty(c, 'zIndex')) || 0;
            if (z > maxZ) maxZ = z;
        });

        gsap.to(card, {
            zIndex: maxZ + 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
