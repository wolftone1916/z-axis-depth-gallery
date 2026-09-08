# Quick Reference Guide

## 📋 Command Reference

### File Structure
```
index.html          - Main page
styles.css          - All CSS styling
js/config.js        - Configuration constants
js/data.js          - Project data array
js/gallery.js       - Gallery class
js/interactions.js  - Interaction handlers
js/animations.js    - Animation effects
```

## 🎮 User Controls Quick Reference

| Action | Input | Result |
|--------|-------|--------|
| Navigate | Scroll | Move through Z-depth |
| Select | Click Card | Highlight & show info |
| Move | Drag Card | Reposition on screen |
| Resize | Scroll Wheel (on card) | Scale up/down |
| Send Back | Right-Click | Push to background |
| Info | Click Info Button | Open panel |
| Close Panel | Click X Button | Close info panel |

## ⌨️ Keyboard Shortcuts

```
ESC         → Deselect / Close panel
CTRL+DEL    → Delete selected card
CTRL+Z      → Send to background
CTRL+B      → Bring to front
CTRL+R      → Reset position & rotation
```

## 🛠️ Configuration Quick Edit

### Change Primary Color
**File:** `js/config.js`
```javascript
colors: {
    primary: '#00bcd4',      // Change this
    secondary: '#00e5ff',
}
```

### Adjust Animation Speed
**File:** `js/config.js`
```javascript
entrance: {
    duration: 0.8,  // Faster = lower number
}
```

### Modify Card Size
**File:** `styles.css`
```css
.project-card {
    width: 400px;   /* Adjust here */
    height: 500px;  /* And here */
}
```

## 📝 Adding a New Project

**File:** `js/data.js`
```javascript
{
    id: 7,
    number: '007',
    title: 'My Project',
    emoji: '🎨',
    description: 'Description',
    tags: ['Tag1', 'Tag2'],
    details: 'Full details'
}
```

## 🎬 Common Animation Patterns

### Bounce Effect
```javascript
gsap.to(card, {
    y: -30,
    duration: 0.5,
    ease: 'back.out(1.7)'
});
```

### Fade & Scale
```javascript
gsap.to(card, {
    opacity: 0,
    scale: 0.5,
    duration: 0.5
});
```

### Rotate
```javascript
gsap.to(card, {
    rotation: 360,
    duration: 1,
    ease: 'power2.inOut'
});
```

### 3D Flip
```javascript
gsap.to(card, {
    rotationY: 180,
    duration: 0.8
});
```

## 🐛 Quick Debug Checklist

- [ ] Cards appear on page?
- [ ] Scroll works smoothly?
- [ ] Drag/drop functions?
- [ ] Info panel opens?
- [ ] Right-click sends to back?
- [ ] Keyboard shortcuts work?
- [ ] Hover effects visible?
- [ ] No console errors?

## 🚀 Quick Start Commands

```bash
# Start local server (Python 3)
python -m http.server 8000

# Start local server (Node.js)
npx http-server

# Open in browser
http://localhost:8000
```

## 📊 CSS Quick Reference

### Useful Classes
```css
.project-card          - Main card element
.project-card.active   - Selected card
.project-card.dragging - Currently dragging
.info-panel            - Info panel container
.info-panel.active     - Panel is visible
.instructions-overlay  - Instructions modal
.hero                  - Hero section
.gallery-viewport      - 3D viewport
```

### Common CSS Properties
```css
transform: translateZ(100px);  /* Depth */
transform: scale(1.5);         /* Size */
transform: rotateY(180deg);    /* 3D rotate */
filter: brightness(1.2);       /* Brightness */
box-shadow: 0 0 30px color;    /* Glow */
transition: all 0.3s ease;     /* Smooth change */
```

## 🎨 Color Palette

```
Primary Cyan:     #00bcd4
Bright Cyan:      #00e5ff
Dark Background:  #0f0f1e
Card Background:  #1e1e3f
Light Text:       #e0e0e0
Muted Text:       #b0b0b0
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
    .project-card { width: 300px; }
    .hero h1 { font-size: 2.5rem; }
}

/* Tablet */
@media (max-width: 1024px) {
    /* Tablet specific styles */
}

/* Desktop */
@media (min-width: 1025px) {
    .project-card { width: 400px; }
}
```

## 🔍 Debugging Commands (Console)

```javascript
// Check gallery
window.gallery

// Get all cards
window.gallery.cards

// Get specific card
window.gallery.cards[0]

// Check active card
window.gallery.activeCard

// Check configuration
window.AnimationConfig

// Enable debug mode
DebugConfig.enabled = true
DebugLogger.log('TEST', 'Message')

// Kill all animations
gsap.globalTimeline.clear()

// Get performance monitor
window.performanceMonitor
```

## 🎯 Performance Targets

- Page Load: < 1 second
- Interaction Latency: < 16ms (60fps)
- Animation Smoothness: 60fps consistent
- Bundle Size: ~15KB (excluding CDN)

## 📚 GSAP Quick Ref

```javascript
// Basic animation
gsap.to(element, { duration: 1, property: value })

// From state
gsap.from(element, { duration: 1, property: value })

// From-To
gsap.fromTo(element, 
    { start: value }, 
    { end: value }
)

// Timeline
const tl = gsap.timeline()
tl.to(el1, {...})
   .to(el2, {...}, 0)  // Same time as el1

// Kill animations
gsap.killTweensOf(element)
gsap.globalTimeline.clear()
```

## 🔗 External Resources

- **GSAP Docs:** https://greensock.com/docs/
- **MDN CSS 3D:** https://developer.mozilla.org/en-US/docs/Web/CSS/transform
- **JavaScript Info:** https://javascript.info/
- **CSS Tricks:** https://css-tricks.com/

## 📞 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Cards not showing | Check `projectsData` in js/data.js |
| Animations stuttering | Close browser tabs, check GPU |
| Drag not working | Ensure `.project-card` exists in DOM |
| GSAP not loading | Check CDN link in index.html |
| Styles not applying | Clear browser cache (Ctrl+Shift+Del) |
| Scrolling not smooth | Update browser to latest version |

## 🎓 Learning Path

1. **Basics** - Read README.md
2. **Structure** - Review DEVELOPMENT.md
3. **Code** - Examine js/gallery.js
4. **Customize** - Modify js/data.js
5. **Style** - Edit styles.css
6. **Animate** - Enhance js/animations.js
7. **Advanced** - Create custom effects

## 💡 Pro Tips

- Use Chrome DevTools for live CSS editing
- Test animations at 0.25x speed first
- Use `ease-out` for entrances, `ease-in` for exits
- Add `overwrite: 'auto'` to prevent animation conflicts
- Profile with Performance tab to find bottlenecks
- Use keyboard shortcuts for faster testing
- Keep DebugConfig enabled during development

## 🎬 Animation Easing Functions

```
ease: 'power1.out'      → Smooth exit
ease: 'power2.out'      → More dramatic exit
ease: 'back.out(1.7)'   → Bouncy exit
ease: 'elastic.out'     → Elastic exit
ease: 'sine.inOut'      → Smooth both ways
ease: 'none'            → Linear
```

---

**Last Updated:** 2026-09-08
**Version:** 1.0
**Status:** Ready for Development
