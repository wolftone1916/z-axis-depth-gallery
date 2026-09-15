    setupScrollAnimation() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

            this.scrollProgress = scrollProgress;

            this.cards.forEach((card, index) => {
                // Skip animation for dragged cards and active cards - let them stay blur-free
                if (card.classList.contains('dragging') || card.classList.contains('active')) {
                    return;
                }

                const initialState = this.cardStates[index];

                // Move cards toward camera and make them smaller/invisible
                const moveTowardZ = scrollProgress * 5000; // Move toward camera
                const opacityFade = Math.max(0, 1 - scrollProgress * 1.5);
                const scaleShrink = Math.max(0.1, initialState.scale - scrollProgress * 0.5);
                
                // Blur increases as they move away (backward in z)
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

        this.cards.forEach(c => {
            c.classList.remove('active');
            // When removing active, reset to initial state
            const index = this.cards.indexOf(c);
            const initialState = this.cardStates[index];
            gsap.set(c, {
                zIndex: initialState.z,
                filter: `blur(${initialState.blur}px)`,
                opacity: initialState.opacity
            });
        });
        card.classList.add('active');

        // Find the highest current zIndex and add to it
        let maxZ = 9999;
        document.querySelectorAll('.project-card').forEach(c => {
            const z = parseInt(gsap.getProperty(c, 'zIndex')) || 0;
            if (z > maxZ) maxZ = z;
        });

        gsap.to(card, {
            zIndex: maxZ + 1,
            filter: 'blur(0px)',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
