# Design Document

## Overview

This design document outlines the implementation approach for improving the NutriTrack landing page user interface. The improvements focus on three key areas: updating the hero section animation with a new nutrition-themed graphic, changing the footer color scheme to blue, and fixing the login button hover state accessibility issue.

## Architecture

The changes will be implemented entirely within the frontend React application, specifically targeting:

- **Component**: `frontend/src/pages/LandingPage.jsx` (minimal changes)
- **Styles**: `frontend/src/styles/landing.css` (primary changes)
- **Design System**: Leveraging existing CSS variables from `frontend/src/styles/app.css`

## Components and Interfaces

### Hero Section Animation Update

**Current Implementation:**
- Uses CSS-only animation with floating circles and a salad emoji
- Three overlapping circles with different sizes and animation delays
- Simple bounce animation for the nutrition icon

**New Design:**
- Replace the current graphic with a more sophisticated nutrition-themed animation
- Maintain the same container structure (`hero-graphic`, `hero-image`)
- Create a new animated graphic featuring multiple food items in a circular motion
- Use CSS animations for smooth, continuous movement
- Include diverse nutrition elements: fruits, vegetables, grains, proteins

**Animation Specifications:**
- **Container**: 300px x 300px (unchanged)
- **Animation Style**: Orbital rotation with floating food icons
- **Food Elements**: 6-8 different food icons positioned around a central circle
- **Animation Duration**: 8-12 seconds for full rotation
- **Performance**: Use `transform` properties for hardware acceleration
- **Responsiveness**: Scale appropriately on mobile devices

### Footer Color Scheme Update

**Current Implementation:**
- Background: `var(--dark-gray)` (#343a40)
- Text: `var(--white)` with opacity variations
- Brand accent: `#ffd700` (gold)

**New Design:**
- **Primary Background**: `var(--primary-color)` (#4a90e2) - main blue
- **Secondary Background**: `var(--primary-dark)` (#3a73b6) - darker blue for contrast areas
- **Text Colors**: Maintain white text with adjusted opacity for readability
- **Brand Accent**: Keep gold (#ffd700) for brand consistency
- **Accessibility**: Ensure WCAG AA contrast ratios are maintained

### Login Button Hover Fix

**Current Issue Analysis:**
- The login button likely inherits hover styles that change text color to blue
- When background is also blue/similar, text becomes invisible
- Missing explicit text color declaration in hover state

**Solution Design:**
- **Explicit Hover State**: Define specific hover styles for login button
- **Text Color**: Force `color: var(--white)` in hover state
- **Background Transition**: Smooth background color change
- **Accessibility**: Maintain 4.5:1 contrast ratio minimum
- **Visual Feedback**: Subtle transform or shadow effect for better UX

## Data Models

No data model changes required - this is purely a UI/styling update.

## Error Handling

### CSS Fallbacks
- Provide fallback colors for browsers that don't support CSS custom properties
- Graceful degradation for animation-disabled environments
- Fallback fonts for icon elements

### Animation Performance
- Use `will-change` property judiciously to optimize animations
- Implement `prefers-reduced-motion` media query support
- Ensure animations don't cause layout thrashing

### Browser Compatibility
- Test across modern browsers (Chrome, Firefox, Safari, Edge)
- Ensure mobile responsiveness is maintained
- Validate CSS syntax and property support

## Testing Strategy

### Visual Testing
1. **Cross-browser Testing**: Verify appearance in major browsers
2. **Responsive Testing**: Test on various screen sizes (mobile, tablet, desktop)
3. **Animation Performance**: Monitor frame rates and smoothness
4. **Accessibility Testing**: Verify color contrast ratios and keyboard navigation

### Functional Testing
1. **Button Interactions**: Test all button hover states and click functionality
2. **Animation Behavior**: Verify animations start/stop appropriately
3. **Layout Integrity**: Ensure no layout shifts or overflow issues
4. **Performance Impact**: Monitor page load times and rendering performance

### Accessibility Testing
1. **Color Contrast**: Use tools like WebAIM to verify WCAG compliance
2. **Motion Sensitivity**: Test with `prefers-reduced-motion` enabled
3. **Screen Reader**: Ensure animations don't interfere with screen readers
4. **Keyboard Navigation**: Verify all interactive elements remain accessible

## Implementation Details

### Hero Animation Implementation
```css
.hero-graphic {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.food-orbit {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}

.food-item {
  position: absolute;
  font-size: 2rem;
  animation: counter-rotate 10s linear infinite;
}
```

### Footer Color Update
```css
.landing-footer {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: var(--white);
}
```

### Login Button Hover Fix
```css
.hero-actions .btn-primary:hover {
  background: var(--primary-light);
  color: var(--white) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

## Performance Considerations

- **Animation Optimization**: Use `transform` and `opacity` for animations to leverage GPU acceleration
- **CSS Efficiency**: Minimize repaints and reflows
- **File Size**: Keep CSS additions minimal and well-organized
- **Loading Impact**: Ensure changes don't affect initial page load performance