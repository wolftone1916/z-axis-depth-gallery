    setupScrollAnimation() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

            this.scrollProgress = scrollProgress;

            this.cards.forEach((card, index) => {
                // NEVER animate active or dragging cards - completely skip them
                if (card.classList.contains('dragging') || card.classList.contains('active')) {
                    return;
                }

                const initialState = this.cardStates[index];

                // Move cards toward camera and make them smaller/invisible
                const moveTowardZ = scrollProgress * 5000;
                const opacityFade = Math.max(0, 1 - scrollProgress * 1.5);
                const scaleShrink = Math.max(0.1, initialState.scale - scrollProgress * 0.5);
                const blurAmount = initialState.blur + scrollProgress * 10;

                gsap.set(card, {
                    zIndex: initialState.z + moveTowardZ,
                    opacity: opacityFade,
                    scale: scaleShrink,
                    filter: `blur(${Math.min(20, blurAmount)}px)`,
                    overwrite: false
                });
            });
        });
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

        // Remove active class from all cards
        this.cards.forEach(c => {
            c.classList.remove('active');
            // Reset to initial state
            const index = this.cards.indexOf(c);
            const initialState = this.cardStates[index];
            gsap.to(c, {
                zIndex: initialState.z,
                filter: `blur(${initialState.blur}px)`,
                opacity: initialState.opacity,
                duration: 0.2
            });
        });

        // Add active class to clicked card FIRST before animating
        card.classList.add('active');

        // Kill any running tweens on this card
        gsap.killTweensOf(card);

        // Find the highest current zIndex and add to it
        let maxZ = 9999;
        document.querySelectorAll('.project-card').forEach(c => {
            const z = parseInt(gsap.getProperty(c, 'zIndex')) || 0;
            if (z > maxZ) maxZ = z;
        });

        // Set blur to 0 with immediate application
        gsap.to(card, {
            zIndex: maxZ + 1,
            filter: 'blur(0px)',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }
