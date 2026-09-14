                onDragEnd: (e) => {
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
