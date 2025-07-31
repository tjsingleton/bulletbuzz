# UI Features

This document describes the various UI elements and features in the BulletBuzz game.

## Game Canvas

The main game canvas is the primary display area where all game elements are rendered.

### Responsive Design
- **Desktop**: Canvas adapts to container size with reasonable maximum dimensions
- **Tablet**: Uses 98% viewport width and 75% viewport height
- **Mobile**: Uses 95% viewport width and 70% viewport height
- **Auto-resize**: Canvas automatically resizes on window resize and orientation change

### Background Grid
- Dynamic grid pattern that extends to canvas boundaries
- Recreated when canvas dimensions change
- Provides visual reference for movement and positioning

## Controls Panel

### Game Speed Slider
- **Range**: 0.1x to 20.0x
- **Default**: 1.0x
- **URL Parameter**: Can be set via `?speed=10` in URL
- **Real-time**: Changes take effect immediately

### Auto-Pathing Toggle
- **Default**: Enabled
- **Function**: Enables/disables AI-controlled player movement
- **URL Parameter**: Can be set via `?autoPath=false` in URL

### Auto-Shop Toggle
- **Default**: Enabled
- **Function**: Enables/disables automatic shop option selection
- **URL Parameter**: Can be set via `?autoShop=false` in URL

### Action Buttons
- **Pause/Resume**: Toggle game pause state (keyboard shortcut: P)
- **Reset Game**: Restart the game (keyboard shortcut: R)
- **Print Game State**: Output current game state to console
- **Full Screen**: Toggle immersive full screen mode (keyboard shortcut: F)

## Full Screen Mode

### Desktop Controls
- **Button**: "🖥️ Full Screen (F)" in controls panel
- **Keyboard Shortcut**: Press `F` key
- **Visual Feedback**: Button changes to "❌ Exit Full Screen (F)" when active

### Mobile Controls
- **Button**: "🖥️" icon in mobile action buttons
- **Position**: Fixed to bottom-right corner in full screen mode
- **Touch-friendly**: Larger button size for easy tapping

### Full Screen Features
- **Immersive Experience**: Game takes up entire viewport
- **Hidden UI**: Controls, instructions, and stats are hidden
- **Canvas Optimization**: Canvas automatically resizes to fill available space
- **Mobile Controls**: Joystick and action buttons remain accessible
- **Exit Options**: Button click or F key to exit full screen

### CSS Implementation
```css
.fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
```

## Mobile Controls

### Virtual Joystick
- **Appearance**: Only on touch devices
- **Function**: Controls player movement
- **Position**: Bottom-left of screen
- **Sensitivity**: Configurable via `joystickMaxDistance`

### Action Buttons
- **Pause**: ⏸️ button for pausing/resuming
- **Reset**: 🔄 button for restarting game
- **Full Screen**: 🖥️ button for full screen mode
- **Position**: Bottom-right of screen
- **Touch-friendly**: Large buttons with clear labels

### Responsive Behavior
- **Desktop**: Mobile controls hidden
- **Touch Devices**: Mobile controls automatically shown
- **Full Screen**: Controls repositioned for optimal access

## Statistics Display

### Player Stats
- **Level**: Current player level
- **HP**: Current and maximum health points
- **Speed**: Current movement speed
- **Pickup Range**: XP and heart collection range
- **Attack Range**: Axe throwing distance
- **Axes**: Number of active axes

### Enemy Stats
- **Count**: Number of active enemies
- **Type**: Enemy type (🐝 for bees)
- **HP**: Enemy health points
- **Speed**: Enemy movement speed
- **APS**: Attacks per second

### Display Logic
- Stats update in real-time during gameplay
- Cleaned up display (removed redundant info shown on canvas)
- Responsive layout for different screen sizes

## Manual Start Overlay

### Appearance
- **Trigger**: When `manualStart=true` URL parameter is set
- **Design**: Semi-transparent overlay with centered content
- **Animation**: Pulsing effect for attention

### Content
- **Title**: "🎮 Tap to Start"
- **Description**: Explains manual control mode
- **Status Display**: Shows auto-feature states
  - 🚫 Auto-Pathing: OFF
  - 🚫 Auto-Shop: OFF
  - 👆 Manual Control: ON

### Functionality
- **Tap to Start**: Any click/tap begins the game
- **Auto-pause**: Game starts in paused state
- **Visual Feedback**: Clear indication of manual mode

## Startup Logo

### Design
- **Full Screen**: Covers entire viewport
- **Background**: Gradient matching game theme
- **Logo**: Centered with pulse animation
- **Duration**: 2 seconds with fade-out transition

### Animation
```css
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
```

### Implementation
- **Auto-hide**: Automatically fades out after 2 seconds
- **Responsive**: Logo scales appropriately for different screen sizes
- **Asset Path**: Loaded from `assets/logo.png`

## Keyboard Shortcuts

| Key | Function |
|-----|----------|
| `W/A/S/D` | Player movement |
| `Arrow Keys` | Player movement |
| `P` | Pause/Resume |
| `R` | Reset Game |
| `F` | Toggle Full Screen |
| `1-5` | Shop option selection |

## URL Parameters

### Game Configuration
- `?speed=10` - Set game speed to 10x
- `?autoPath=false` - Disable auto-pathing
- `?autoShop=false` - Disable auto-shop
- `?manualStart=true` - Enable manual start mode

### Example URLs
- **Normal Mode**: `https://tjsingleton.github.io/bulletbuzz/`
- **Manual Mode**: `https://tjsingleton.github.io/bulletbuzz/?autoPath=false&autoShop=false&manualStart=true`
- **Fast Mode**: `https://tjsingleton.github.io/bulletbuzz/?speed=5`

## Accessibility Features

### Keyboard Navigation
- All game functions accessible via keyboard
- Clear visual feedback for button states
- Logical tab order for form elements

### Screen Reader Support
- Semantic HTML structure
- Alt text for images
- ARIA labels for interactive elements

### Color Contrast
- High contrast color scheme
- Clear distinction between UI elements
- Consistent visual hierarchy

## Performance Considerations

### Canvas Optimization
- Efficient rendering with requestAnimationFrame
- Background canvas for static elements
- Proper cleanup of event listeners

### Mobile Performance
- Touch event optimization
- Reduced animation complexity on mobile
- Efficient joystick calculations

### Memory Management
- Automatic cleanup of game objects
- Event listener management
- Canvas context preservation 