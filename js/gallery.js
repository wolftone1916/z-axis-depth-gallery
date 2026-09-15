    setupScrollAnimation() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

            this.scrollProgress = scrollProgress;

            this.cards.forEach((card, index) => {
                // Skip animation for dragged cards and active cards - let them stay where dropped
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
