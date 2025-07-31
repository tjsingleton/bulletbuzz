# Mobile Controls

## 🎯 Overview

BulletBuzz features comprehensive mobile controls designed for touch devices, providing an intuitive gaming experience across all mobile screen sizes. The mobile controls system automatically detects touch devices and provides virtual joystick movement and action buttons.

## 🏗️ Architecture

### Core Components

```mermaid
graph TB
    subgraph "Mobile Controls System"
        TouchDetection[Touch Detection<br/>CSS Media Queries + JS]
        VirtualJoystick[Virtual Joystick<br/>Touch Movement]
        ActionButtons[Action Buttons<br/>Pause/Reset]
        ResponsiveDesign[Responsive Design<br/>Screen Size Adaptation]
    end
    
    subgraph "Game Integration"
        GameUI[game-ui.ts<br/>UI Management]
        PlayerMovement[Player Movement<br/>Touch Input]
        GameState[Game State<br/>Pause/Reset]
        Canvas[HTML5 Canvas<br/>Rendering]
    end
    
    subgraph "Device Detection"
        CSSMediaQuery[CSS Media Query<br/>@media (hover: none)]
        JavaScriptDetection[JavaScript Detection<br/>ontouchstart]
        ViewportDetection[Viewport Detection<br/>Screen Size]
    end
    
    %% Component relationships
    TouchDetection --> VirtualJoystick
    TouchDetection --> ActionButtons
    VirtualJoystick --> PlayerMovement
    ActionButtons --> GameState
    ResponsiveDesign --> Canvas
    
    %% Detection relationships
    CSSMediaQuery --> TouchDetection
    JavaScriptDetection --> TouchDetection
    ViewportDetection --> ResponsiveDesign
    
    %% Game integration
    GameUI --> TouchDetection
    GameUI --> VirtualJoystick
    GameUI --> ActionButtons
```

## 🚀 Quick Start

### Basic Usage

Mobile controls are automatically enabled on touch devices. No additional setup required:

```typescript
// Mobile controls are automatically initialized
setupMobileControls();

// Touch detection automatically shows controls
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Mobile controls displayed
}
```

### Manual Control

```typescript
// Force show mobile controls (for testing)
const mobileControls = document.querySelector('.mobile-controls') as HTMLElement;
if (mobileControls) {
    mobileControls.style.display = 'block';
}
```

## 📱 Virtual Joystick

### Implementation

The virtual joystick provides smooth movement control for the player character:

```typescript
// Joystick state management
let joystickActive: boolean = false;
let joystickCenter: { x: number; y: number } = { x: 0, y: 0 };
let joystickMaxDistance: number = 40;
let touchMovement: { x: number; y: number } = { x: 0, y: 0 };

// Touch event handlers
function handleJoystickStart(e: TouchEvent): void {
    e.preventDefault();
    joystickActive = true;
    updateJoystickPosition(e.touches[0]);
}

function handleJoystickMove(e: TouchEvent): void {
    e.preventDefault();
    if (joystickActive) {
        updateJoystickPosition(e.touches[0]);
    }
}

function handleJoystickEnd(e: TouchEvent): void {
    e.preventDefault();
    joystickActive = false;
    resetJoystick();
}
```

### Position Calculation

```typescript
function updateJoystickPosition(touch: Touch): void {
    const joystickThumb = document.getElementById("joystickThumb");
    if (!joystickThumb) return;
    
    // Calculate distance from center
    const dx = touch.clientX - joystickCenter.x;
    const dy = touch.clientY - joystickCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Limit to max distance
    const limitedDistance = Math.min(distance, joystickMaxDistance);
    const angle = Math.atan2(dy, dx);
    
    // Calculate new position
    const newX = joystickCenter.x + limitedDistance * Math.cos(angle);
    const newY = joystickCenter.y + limitedDistance * Math.sin(angle);
    
    // Update thumb position
    const thumbOffset = 70; // Half of thumb size + padding
    joystickThumb.style.left = `${newX - joystickCenter.x + thumbOffset}px`;
    joystickThumb.style.top = `${newY - joystickCenter.y + thumbOffset}px`;
    
    // Calculate normalized movement values (-1 to 1)
    if (distance > 0) {
        touchMovement.x = (dx / distance) * (limitedDistance / joystickMaxDistance);
        touchMovement.y = (dy / distance) * (limitedDistance / joystickMaxDistance);
    } else {
        touchMovement.x = 0;
        touchMovement.y = 0;
    }
}
```

### Integration with Player Movement

```typescript
function handlePlayerMovement(): void {
    if (!game || !gameState.player) return;
    
    // Combine keyboard and touch input
    let dx = 0;
    let dy = 0;
    
    // Keyboard input
    if (keys['w'] || keys['W'] || keys['ArrowUp']) dy -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) dy += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) dx -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) dx += 1;
    
    // Touch input (joystick)
    dx += touchMovement.x;
    dy += touchMovement.y;
    
    // Normalize movement
    if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;
        
        // Apply movement
        gameState.player.x += dx * gameState.player.speed;
        gameState.player.y += dy * gameState.player.speed;
    }
}
```

## 🎮 Action Buttons

### Implementation

Action buttons provide quick access to game controls:

```typescript
// Action button event handlers
pauseButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    togglePause();
});

resetButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    resetGame();
});

// Prevent default touch behaviors
pauseButton.addEventListener('touchstart', (e) => e.preventDefault());
resetButton.addEventListener('touchstart', (e) => e.preventDefault());
```

### Button Types

| Button | Function | Icon | Color |
|--------|----------|------|-------|
| **Pause** | Toggle game pause state | ⏸️ | Yellow |
| **Reset** | Restart the game | 🔄 | Red |

## 📐 Responsive Design

### CSS Media Queries

Mobile controls adapt to different screen sizes:

```css
/* Base mobile controls */
.mobile-controls {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    pointer-events: none;
}

/* Show on touch devices */
@media (hover: none) and (pointer: coarse) {
    .mobile-controls {
        display: block;
    }
}

/* Standard mobile (480px and below) */
@media (max-width: 480px) {
    .joystick-container {
        bottom: 60px;
        left: 20px;
        width: 120px;
        height: 120px;
    }
    
    .action-button {
        width: 60px;
        height: 60px;
        font-size: 24px;
    }
}

/* Small mobile (360px and below) */
@media (max-width: 360px) {
    .joystick-container {
        bottom: 50px;
        left: 15px;
        width: 100px;
        height: 100px;
    }
    
    .action-button {
        width: 55px;
        height: 55px;
        font-size: 22px;
    }
}
```

### Touch Target Sizing

Following Apple's Human Interface Guidelines:

- **Minimum touch target**: 44pt (approximately 44px)
- **Comfortable touch target**: 60-70px
- **Large touch target**: 70px+ for important actions

### Positioning Strategy

```css
/* Joystick positioning */
.joystick-container {
    position: absolute;
    bottom: 80px;  /* Away from stats area */
    left: 30px;    /* Comfortable margin */
    width: 140px;  /* Large touch target */
    height: 140px;
    pointer-events: auto;
}

/* Action buttons positioning */
.action-buttons {
    position: absolute;
    top: 30px;     /* Away from game area */
    right: 30px;   /* Comfortable margin */
    display: flex;
    gap: 20px;     /* Good spacing */
    pointer-events: auto;
}
```

## 🎨 Visual Design

### Joystick Styling

```css
.joystick-base {
    position: absolute;
    width: 140px;
    height: 140px;
    background: rgba(0, 0, 0, 0.4);
    border: 3px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: bold;
    text-align: center;
}

.joystick-base::before {
    content: "MOVE";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    user-select: none;
}

.joystick-thumb {
    position: absolute;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.9);
    border: 3px solid rgba(255, 255, 255, 1);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
```

### Action Button Styling

```css
.action-button {
    width: 70px;
    height: 70px;
    background: rgba(0, 0, 0, 0.4);
    border: 3px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    backdrop-filter: blur(15px);
    transition: all 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    position: relative;
}

.action-button::after {
    content: attr(data-label);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
}

.action-button:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.9);
}

.action-button.pause {
    background: rgba(255, 193, 7, 0.4);
    border-color: rgba(255, 193, 7, 0.8);
}

.action-button.reset {
    background: rgba(220, 53, 69, 0.4);
    border-color: rgba(220, 53, 69, 0.8);
}
```

## 🧪 Testing

### Automated Testing

```typescript
// Test mobile controls visibility
const mobileControls = await this.page.locator('.mobile-controls');
const controlsVisible = await mobileControls.isVisible();

if (controlsVisible) {
    console.log(`✅ Mobile controls visible on ${device.name}`);
} else {
    console.log(`⚠️ Mobile controls not visible on ${device.name}`);
}
```

### Manual Testing Checklist

- [ ] **Touch Detection**: Controls appear on real mobile devices
- [ ] **Joystick Movement**: Smooth movement in all directions
- [ ] **Button Responsiveness**: Buttons respond immediately to touch
- [ ] **Screen Orientation**: Controls work in portrait and landscape
- [ ] **Different Screen Sizes**: Controls scale appropriately
- [ ] **Visual Feedback**: Clear visual indicators for all controls
- [ ] **Performance**: Smooth 60fps performance
- [ ] **Accessibility**: Controls are usable by users with different abilities

### Testing Limitations

**Note**: Automated tests with Playwright don't fully replicate real mobile behavior:
- Touch detection may not work in simulated environments
- Viewport simulation differs from real device viewports
- Performance characteristics may differ

**Solution**: Combine automated testing with manual testing on real devices.

## 🔧 Configuration

### Touch Detection

```typescript
// Multiple detection methods for reliability
const isTouchDevice = 
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (isTouchDevice) {
    const mobileControls = document.querySelector('.mobile-controls') as HTMLElement;
    if (mobileControls) {
        mobileControls.style.display = 'block';
        console.log('📱 Mobile controls enabled');
    }
}
```

### Responsive Breakpoints

```css
/* Large screens (tablets) */
@media (min-width: 768px) {
    .joystick-container {
        width: 160px;
        height: 160px;
    }
    
    .action-button {
        width: 80px;
        height: 80px;
        font-size: 32px;
    }
}

/* Medium screens (large phones) */
@media (max-width: 480px) {
    .joystick-container {
        width: 120px;
        height: 120px;
    }
    
    .action-button {
        width: 60px;
        height: 60px;
        font-size: 24px;
    }
}

/* Small screens (small phones) */
@media (max-width: 360px) {
    .joystick-container {
        width: 100px;
        height: 100px;
    }
    
    .action-button {
        width: 55px;
        height: 55px;
        font-size: 22px;
    }
}
```

## 🚀 Performance Considerations

### Optimization Strategies

1. **Efficient Touch Handling**
   ```typescript
   // Use passive listeners where possible
   element.addEventListener('touchstart', handler, { passive: false });
   ```

2. **Minimal DOM Updates**
   ```typescript
   // Batch DOM updates
   requestAnimationFrame(() => {
       updateJoystickPosition(touch);
   });
   ```

3. **Efficient CSS**
   ```css
   /* Use transform instead of position changes */
   .joystick-thumb {
       transform: translate(-50%, -50%);
       transition: transform 0.1s ease;
   }
   ```

### Performance Monitoring

```typescript
// Monitor touch event performance
let touchEventCount = 0;
const touchHandler = (e: TouchEvent) => {
    touchEventCount++;
    if (touchEventCount % 60 === 0) {
        console.log(`Touch events per second: ${touchEventCount}`);
        touchEventCount = 0;
    }
    // ... rest of handler
};
```

## 🐛 Troubleshooting

### Common Issues

#### **Controls Not Visible**
```typescript
// Check touch detection
console.log('ontouchstart:', 'ontouchstart' in window);
console.log('maxTouchPoints:', navigator.maxTouchPoints);
console.log('CSS media query:', window.matchMedia('(hover: none) and (pointer: coarse)').matches);
```

#### **Joystick Not Responding**
```typescript
// Check event listeners
const joystick = document.getElementById('joystickBase');
if (joystick) {
    console.log('Joystick found:', joystick);
    console.log('Event listeners:', joystick.on);
}
```

#### **Performance Issues**
```typescript
// Monitor frame rate
let frameCount = 0;
const gameLoop = () => {
    frameCount++;
    if (frameCount % 60 === 0) {
        console.log('FPS:', frameCount);
        frameCount = 0;
    }
    requestAnimationFrame(gameLoop);
};
```

### Debug Mode

```typescript
// Enable debug mode for mobile controls
const DEBUG_MOBILE = true;

if (DEBUG_MOBILE) {
    console.log('Mobile controls debug enabled');
    // Add debug logging
    const originalUpdateJoystick = updateJoystickPosition;
    updateJoystickPosition = (touch: Touch) => {
        console.log('Joystick update:', { x: touch.clientX, y: touch.clientY });
        originalUpdateJoystick(touch);
    };
}
```

## 📚 Related Documentation

- [Event System](../features/event-system.md) - Event-driven architecture
- [Testing Guide](../../testing/comprehensive-testing.md) - Testing strategies
- [Performance Guide](../../development/performance.md) - Optimization techniques

## 🎯 Future Enhancements

### Planned Features

- [ ] **Haptic Feedback** - Vibration on touch interactions
- [ ] **Gesture Controls** - Swipe gestures for actions
- [ ] **Customizable Layout** - User-configurable control positions
- [ ] **Accessibility Improvements** - Better support for assistive technologies
- [ ] **Performance Monitoring** - Real-time performance metrics
- [ ] **Analytics Integration** - Track mobile usage patterns

### Technical Debt

- [ ] **TypeScript Types** - Better type definitions for mobile controls
- [ ] **Unit Tests** - Comprehensive test coverage for mobile features
- [ ] **Documentation** - API reference for mobile control functions
- [ ] **Examples** - Code examples for common mobile control patterns 