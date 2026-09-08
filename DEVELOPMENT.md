# Development Guide

Complete guide for developing and extending the Z-Axis Depth Gallery project.

## Table of Contents

1. [Setup & Environment](#setup--environment)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Adding Features](#adding-features)
5. [Debugging](#debugging)
6. [Performance Tips](#performance-tips)
7. [Common Tasks](#common-tasks)

---

## Setup & Environment

### Prerequisites
- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- A code editor (VS Code recommended)
- Git for version control
- Optional: Python or Node.js for local server

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/wolftone1916/z-axis-depth-gallery.git
cd z-axis-depth-gallery
```

2. **Start a local server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# Or use VS Code's Live Server extension
```

3. **Open in browser**
Navigate to `http://localhost:8000`

---

## Project Architecture

### File Organization

```
z-axis-depth-gallery/
├── index.html              # Main entry point
├── styles.css              # All styling
├── js/
│   ├── config.js          # Configuration & constants
│   ├── data.js            # Project data
│   ├── gallery.js         # Gallery initialization
│   ├── interactions.js    # User interactions
│   └── animations.js      # GSAP animations
└── README.md              # User documentation
```

### Class Structure

#### Gallery Class (`gallery.js`)
Manages card creation, positioning, and layout.

**Key Methods:**
- `createCards()` - Generate cards from data
- `setupScrollAnimation()` - Setup depth scroll effect
- `setupCardPositioning()` - Arrange cards in viewport
- `selectCard(card, event)` - Handle card selection
- `deleteCard(card)` - Remove card with animation
- `sendToBackground(card, event)` - Push card to back

#### AnimationManager Class (`animations.js`)
Handles all GSAP animations and visual effects.

**Key Methods:**
- `setupParallaxEffect()` - Mouse-based parallax
- `setupHoverEffects()` - Hover animations
- `setupCardEntrance()` - Card entry animations
- `focusCard(card)` - Highlight selected card
- `pulseCard(card)` - Pulse effect
- `flipCard(card)` - Flip animation
- `shakeCard(card)` - Shake effect

#### InteractionManager Class (`interactions.js`)
Manages drag, scroll, and keyboard interactions.

**Key Methods:**
- `handleMouseDown(e)` - Start drag
- `handleMouseMove(e)` - Drag movement
- `handleMouseUp(e)` - End drag
- `setupWheelListeners()` - Scale on scroll
- `snapToGrid(card)` - Align to grid
- `updateDragIndicator()` - Visual feedback

#### KeyboardManager Class (`interactions.js`)
Handles keyboard shortcuts and commands.

**Supported Keys:**
- Escape - Deselect
- Delete/Backspace - Remove card
- Ctrl+Z - To background
- Ctrl+B - To front
- Ctrl+R - Reset position

---

## Development Workflow

### Making Changes

1. **Edit the appropriate file**
   - UI/Styling → `styles.css`
   - Interactions → `js/interactions.js`
   - Animations → `js/animations.js`
   - Data → `js/data.js`
   - Configuration → `js/config.js`

2. **Save and refresh browser** (Ctrl/Cmd + R)

3. **Test in multiple browsers**

4. **Commit changes**
```bash
git add .
git commit -m "Add feature: [description]"
git push origin main
```

### Live Editing Tips

- Use browser DevTools (F12)
- Edit CSS directly to preview changes
- Use console to test JavaScript
- Use Network tab to monitor load times
- Use Performance tab to profile animations

---

## Adding Features

### Adding a New Project Card

1. **Add data to `js/data.js`:**
```javascript
{
    id: 7,
    number: '007',
    title: 'New Project',
    emoji: '🚀',
    description: 'Description here',
    tags: ['Tag1', 'Tag2', 'Tag3'],
    details: 'More detailed information about the project'
}
```

2. **Cards are automatically generated** when page loads

### Adding a New Animation

1. **Add to AnimationManager class in `js/animations.js`:**
```javascript
static customAnimation(card) {
    gsap.to(card, {
        rotation: 360,
        duration: 1,
        ease: 'back.out(1.7)',
        overwrite: 'auto'
    });
}
```

2. **Call it from interaction:**
```javascript
const card = e.target.closest('.project-card');
if (card) {
    AnimationManager.customAnimation(card);
}
```

### Adding a New Keyboard Shortcut

1. **Add to KeyboardManager in `js/interactions.js`:**
```javascript
case 'x':
case 'X':
    if (e.ctrlKey && activeCard) {
        // Your action here
    }
    break;
```

### Adding a New CSS Style

1. **Edit `styles.css`**
```css
.your-new-class {
    property: value;
    transition: all 0.3s ease;
}
```

2. **Apply to HTML elements**
```html
<div class="your-new-class">Content</div>
```

### Creating a Custom Filter Effect

1. **Add animation in `js/animations.js`:**
```javascript
static glitchEffect(card) {
    gsap.to(card, {
        filter: 'hue-rotate(360deg)',
        duration: 0.5,
        repeat: 3,
        yoyo: true,
        ease: 'sine.inOut'
    });
}
```

---

## Debugging

### Enable Debug Mode

1. **In `js/config.js`, set:**
```javascript
const DebugConfig = {
    enabled: true,
    showGridlines: true,
    showBoundingBoxes: true,
    logAnimations: true,
    logInteractions: true,
    showPerformanceMetrics: true
};
```

2. **Open DevTools console** (F12) to see logs

### Common Issues & Solutions

#### Cards not appearing
```javascript
// Check if projectsData is loaded
console.log(projectsData);

// Check if gallery initialized
console.log(window.gallery);

// Verify viewport exists
console.log(document.querySelector('.gallery-viewport'));
```

#### Animations not working
```javascript
// Check GSAP is loaded
console.log(gsap);

// Check ScrollTrigger
console.log(ScrollTrigger);

// Kill all animations and restart
gsap.globalTimeline.clear();
```

#### Drag not working
```javascript
// Check if card is draggable
const card = document.querySelector('.project-card');
console.log(card.classList);
console.log(window.getComputedStyle(card).position);
```

### Using Browser DevTools

1. **Elements Inspector**
   - Inspect card structure
   - Check applied classes
   - View computed styles

2. **Console**
   - Run `window.gallery.cards` to see all cards
   - Use `DebugLogger.log()` for custom messages
   - Test animations manually

3. **Performance Tab**
   - Record performance profile
   - Check for jank/stuttering
   - Identify performance bottlenecks

4. **Network Tab**
   - Verify CDN libraries load
   - Check file sizes
   - Monitor load times

---

## Performance Tips

### Optimization Techniques

1. **Reduce Animation Count**
   - Limit concurrent animations
   - Simplify complex effects
   - Use `overwrite: 'auto'` to prevent conflicts

2. **Optimize Assets**
   - Minimize CSS/JavaScript
   - Use CDN for libraries
   - Lazy load heavy content

3. **Enable Hardware Acceleration**
   ```css
   .project-card {
       will-change: transform;
       transform: translateZ(0);
   }
   ```

4. **Throttle Events**
   ```javascript
   // In PerformanceConfig
   throttle: {
       scroll: 16,      // ~60fps
       resize: 250,
       mousemove: 16
   }
   ```

### Profiling Performance

1. **Use Performance API**
   ```javascript
   performance.mark('animation-start');
   // ... animation code ...
   performance.mark('animation-end');
   performance.measure('animation', 'animation-start', 'animation-end');
   ```

2. **Monitor FPS**
   - Enable `showPerformanceMetrics` in DebugConfig
   - Watch console for FPS updates
   - Aim for 60fps consistently

3. **Check Memory Usage**
   - Open DevTools Memory tab
   - Record heap snapshots
   - Look for memory leaks

---

## Common Tasks

### Task: Change Color Scheme

1. **In `js/config.js`, update UIConfig:**
```javascript
colors: {
    primary: '#YOUR_COLOR',      // Main color
    secondary: '#YOUR_COLOR',    // Bright variant
    background: '#YOUR_COLOR',   // Background
    text: '#YOUR_COLOR',         // Text color
    accent: '#YOUR_COLOR'        // Accent
}
```

2. **Or directly edit `styles.css`:**
```css
:root {
    --primary-color: #00bcd4;
    --secondary-color: #00e5ff;
}
```

### Task: Adjust Animation Speed

1. **In `js/config.js`, modify AnimationConfig:**
```javascript
entrance: {
    duration: 1.2,  // Slower entrance
    ease: 'back.out(1.7)'
}
```

2. **Or in `js/animations.js`:**
```javascript
gsap.to(card, {
    duration: 2.0  // Your custom speed
});
```

### Task: Change Card Size

1. **In `styles.css`, modify `.project-card`:**
```css
.project-card {
    width: 500px;   /* Change from 400px */
    height: 600px;  /* Change from 500px */
}
```

### Task: Add Touch Support

1. **In `js/interactions.js`, add touch listeners:**
```javascript
document.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.project-card');
    if (card) {
        this.handleMouseDown({
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            target: e.target
        });
    }
});
```

### Task: Export Card Data

1. **Add to Gallery class:**
```javascript
exportData() {
    const data = this.cards.map(card => ({
        id: card.dataset.id,
        x: card.style.left,
        y: card.style.top,
        z: card.style.transform,
        scale: card.dataset.scale
    }));
    return JSON.stringify(data);
}
```

### Task: Create a Theme Switcher

1. **Add to `js/gallery.js`:**
```javascript
static applyTheme(themeName) {
    const themes = {
        dark: { primary: '#00bcd4', bg: '#0f0f1e' },
        light: { primary: '#0288d1', bg: '#f5f5f5' },
        neon: { primary: '#ff00ff', bg: '#000000' }
    };
    
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--bg-color', theme.bg);
}
```

---

## Best Practices

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use const/let instead of var

### Performance
- Profile before optimizing
- Avoid unnecessary DOM queries
- Kill unused animations
- Use requestAnimationFrame

### Accessibility
- Support keyboard navigation
- Test with screen readers
- Respect prefers-reduced-motion
- Maintain high contrast

### Testing
- Test in multiple browsers
- Test on various screen sizes
- Test keyboard/mouse interactions
- Check console for errors

---

## Resources

- [GSAP Docs](https://greensock.com/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

---

## Support

For issues or questions:
1. Check this guide
2. Review code comments
3. Open a GitHub issue
4. Check console for errors

Happy developing! 🚀
