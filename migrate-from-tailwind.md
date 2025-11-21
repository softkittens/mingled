# Migrating from Tailwind CSS to Mingled

This guide will help you migrate your existing Tailwind CSS classes to Mingled's concise syntax. Mingled provides a more readable, CSS-like syntax while maintaining the utility-first approach you're familiar with.

## Quick Comparison

| Tailwind | Mingled | CSS Equivalent |
|----------|---------|----------------|
| `p-4` | `p:16` | `padding: 1rem` |
| `px-6 py-4` | `p:16|24` | `padding: 1rem 1.5rem` |
| `text-blue-500` | `c:blue` | `color: var(--color-blue)` |
| `bg-red-500` | `bg:red` | `background-color: var(--color-red)` |
| `rounded-lg` | `r:8` | `border-radius: 8px` |
| `flex items-center justify-between` | `flex:between|center` | `display: flex; justify-content: space-between; align-items: center` |
| `w-full h-screen` | `w:full h:screen` | `width: 100%; height: 100vh` |
| `border border-gray-300` | `b:#ddd` | `border: 1px solid #ddd` |
| `shadow-md` | `shadow:0|2|4|0|#00000026` | `box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15)` |
| `hover:bg-blue-600` | `hover:bg:darkblue` | `:hover { background-color: darkblue }` |

## Installation

### Remove Tailwind
```bash
npm uninstall tailwindcss @tailwindcss/typography autoprefixer postcss
```

### Add Mingled
```bash
npm install mingled
```

Or use CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/mingled"></script>
```

## Setup Changes

### Replace Tailwind Configuration

**Before (Tailwind):**
```html
<!-- In your HTML head -->
<script src="https://cdn.tailwindcss.com"></script>
```

**After (Mingled):**
```html
<!-- In your HTML head -->
<script src="https://cdn.jsdelivr.net/npm/mingled"></script>
```

### CSS Reset

Both Tailwind and Mingled include a CSS reset for consistent cross-browser styling:

- **Tailwind**: Uses Preflight (based on modern-normalize)
- **Mingled**: Includes a similar reset based on Tailwind Preflight

The reset is **enabled by default** in Mingled but can be disabled if needed:

```javascript
const myMingled = new MingledRuntime({
  enableReset: false  // Disable CSS reset
});
```

**What the reset does:**
- Sets `box-sizing: border-box` on all elements
- Removes default margins on common elements
- Removes list styles (bullets, padding)
- Resets button and form styles
- Makes images responsive by default
- Improves form element consistency

### Remove Build Process

If you were using Tailwind with a build process, you can remove:
- `tailwind.config.js`
- PostCSS configuration
- Build step for CSS compilation

Mingled works directly in the browser with no build step required.

## Class Migration Guide

### Spacing

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `p-1` to `p-8` | `p:4` to `p:32` | Values are in pixels (4px = 0.25rem) |
| `px-4` | `px:16` | Horizontal padding |
| `py-4` | `py:16` | Vertical padding |
| `pt-4` | `pt:16` | Top padding |
| `pr-4` | `pr:16` | Right padding |
| `pb-4` | `pb:16` | Bottom padding |
| `pl-4` | `pl:16` | Left padding |
| `m-4` | `m:16` | Margin |
| `mx-auto` | `mx:auto` | Horizontal auto margin |
| `space-x-4` | `gap:16` | Use gap with flex/grid |

**Multiple values:**
- `px-4 py-2` → `p:8|16`
- `p-2 px-4` → `p:8|16|8|16`

### Typography

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `text-xs` | `f:12` | Font size in pixels |
| `text-sm` | `f:14` | |
| `text-base` | `f:16` | |
| `text-lg` | `f:18` | |
| `text-xl` | `f:20` | |
| `text-2xl` | `f:24` | |
| `text-3xl` | `f:30` | |
| `font-thin` | `fw:thin` | Font weight |
| `font-light` | `fw:light` | |
| `font-normal` | `normal` | |
| `font-medium` | `medium` | |
| `font-semibold` | `semibold` | |
| `font-bold` | `bold` | |
| `leading-tight` | `lh:1.25` | Line height |
| `leading-normal` | `lh:1.5` | |
| `leading-relaxed` | `lh:1.625` | |
| `tracking-tight` | `ls:-0.5` | Letter spacing (negative) |
| `tracking-normal` | `ls:0` | Letter spacing (normal) |
| `tracking-wide` | `ls:1` | Letter spacing (positive) |
| `tracking-wider` | `ls:2` | |
| `tracking-widest` | `ls:4` | |
| `text-left` | `text-left` | Text alignment |
| `text-center` | `text-center` | |
| `text-right` | `text-right` | |
| `uppercase` | `uppercase` | Text transform |
| `lowercase` | `lowercase` | |
| `capitalize` | `capitalize` | |
| `underline` | `underline` | Text decoration |
| `line-through` | `line-through` | |

### Colors

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `text-blue-500` | `c:blue` | Uses `--color-blue` CSS variable |
| `text-red-500` | `c:red` | |
| `text-gray-500` | `c:#666` | Use hex values for grays |
| `bg-blue-500` | `bg:blue` | Uses `--color-blue` CSS variable |
| `bg-red-500` | `bg:red` | |
| `bg-gray-100` | `bg:#f5f5f5` | |
| `text-blue-500/50` | `c:blue/50` | 50% opacity |
| `bg-red-500/80` | `bg:red/80` | 80% opacity |

**CSS Variables Setup:**
```css
:root {
  --color-blue: #3b82f6;
  --color-red: #ef4444;
  --color-green: #10b981;
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

### Layout & Sizing

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `w-full` | `w:full` | 100% width |
| `w-screen` | `w:screen` | 100vw width |
| `w-auto` | `w:auto` | Auto width |
| `w-1/2` | `w:50%` | Percentage width |
| `w-64` | `w:256` | Pixel width |
| `h-full` | `h:full` | 100% height |
| `h-screen` | `h:screen` | 100vh height |
| `min-w-full` | `min-w:full` | |
| `max-w-md` | `max-w:448` | 28rem = 448px |
| `block` | `block` | Display |
| `inline-block` | `inline-block` | |
| `hidden` | `hidden` | `display: none` |

### Flexbox

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `flex` | `flex` | `display: flex` |
| `inline-flex` | `flex-inline` | |
| `flex-col` | `flex-col` | Column direction |
| `flex-row` | `flex` | Row direction (default) |
| `flex-wrap` | `wrap` | |
| `items-start` | `flex:start|*` | Align items start |
| `items-center` | `flex:center` | Align items center (shorthand) |
| `items-end` | `flex:end|*` | Align items end |
| `justify-start` | `flex:*|start` | Justify start |
| `justify-center` | `flex:center` | Justify center (shorthand) |
| `justify-between` | `flex:between|*` | Space between |
| `justify-around` | `flex:around|*` | Space around |
| `justify-between items-center` | `flex:between|center` | Combined |

**Note:** Use `*` as wildcard when you only need to set one of justify/align:
- `items-center` → `flex:*|center`
- `justify-between` → `flex:between|*`
- `flex:between|center` sets both

### Grid

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `grid` | `grid` | `display: grid` |
| `grid-cols-1` | `grid-cols:1` | |
| `grid-cols-2` | `grid-cols:2` | |
| `grid-cols-3` | `grid-cols:3` | |
| `gap-4` | `gap:16` | Gap in pixels |

### Borders & Rounded

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `border` | `b:#ddd` | Default border |
| `border-2` | `b:#000|2` | 2px border |
| `border-4` | `b:#000|4` | 4px border |
| `border-t` | `bt:#ddd` | Top border |
| `border-r` | `br:#ddd` | Right border |
| `border-b` | `bb:#ddd` | Bottom border |
| `border-l` | `bl:#ddd` | Left border |
| `border-blue-500` | `b:blue` | Colored border |
| `border-dashed` | `b:#ddd|1|dashed` | Dashed border |
| `rounded` | `r:4` | 4px radius |
| `rounded-sm` | `r:2` | |
| `rounded-md` | `r:6` | |
| `rounded-lg` | `r:8` | |
| `rounded-xl` | `r:12` | |
| `rounded-full` | `r:9999` | |

**Complex borders:**
- `border-2 border-blue-500 border-dashed` → `b:blue|2|dashed`

### Positioning

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `relative` | `relative` | |
| `absolute` | `absolute` | |
| `fixed` | `fixed` | |
| `sticky` | `sticky` | |
| `top-0` | `top:0` | |
| `top-4` | `top:16` | |
| `right-0` | `right:0` | |
| `bottom-0` | `bottom:0` | |
| `left-0` | `left:0` | |
| `inset-0` | `inset:0` | All sides |

### Shadows

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `shadow-sm` | `shadow:0|1|2|0|#0000000d` | |
| `shadow` | `shadow:0|1|3|0|#0000001a` | |
| `shadow-md` | `shadow:0|4|6|0|#0000001a` | |
| `shadow-lg` | `shadow:0|10|15|0|#0000001a` | |
| `shadow-xl` | `shadow:0|20|25|0|#0000001a` | |

Shadow format: `shadow:{offsetX}|{offsetY}|{blur}|{spread}|{color}`

### Interactivity

| Tailwind | Mingled | Notes |
|----------|---------|-------|
| `cursor-pointer` | `pointer` | |
| `select-none` | `no-select` | |
| `opacity-50` | `o:0.5` | Opacity 0-1 |
| `opacity-100` | `o:1` | |
| `z-10` | `z:10` | Z-index |
| `z-50` | `z:50` | |

## Responsive Design

### Breakpoint Changes

**Tailwind breakpoints:**
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px

**Mingled breakpoints (default):**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Responsive Syntax

**Tailwind:**
```html
<div class="p-4 md:p-6 lg:p-8">
```

**Mingled:**
```html
<div class="p:16 p:24@md p:32@lg">
```

**Migration examples:**
- `p-4 sm:p-6 md:p-8 lg:p-10` → `p:16 p:24@sm p:32@md p:40@lg`
- `w-full sm:w-1/2 md:w-1/3` → `w:full w:50%@sm w:33%@md`
- `hidden sm:block` → `hidden block@sm`

## Hover, Focus & States

### State Syntax

**Tailwind:**
```html
<button class="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700">
```

**Mingled:**
```html
<button class="bg:blue hover:bg:darkblue focus:bg:darkerblue">
```

**Alternative syntax (suffix):**
```html
<button class="bg:blue bg:darkblue:hover bg:darkerblue:focus">
```

### State Migration Examples

| Tailwind | Mingled |
|----------|---------|
| `hover:bg-blue-600` | `hover:bg:darkblue` |
| `focus:outline-none` | `focus:outline:none` |
| `active:scale-95` | `active:transform:scale(0.95)` |
| `disabled:opacity-50` | `disabled:o:0.5` |
| `hover:text-blue-600` | `hover:c:darkblue` |
| `focus:ring-2` | `focus:outline:2|solid|blue` |

## Common Component Migrations

### Button

**Tailwind:**
```html
<button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
  Click me
</button>
```

**Mingled:**
```html
<button class="bg:blue hover:bg:darkblue c:white semibold p:8|16 r:4">
  Click me
</button>
```

### Card

**Tailwind:**
```html
<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-bold mb-4">Card Title</h3>
  <p class="text-gray-600">Card content goes here.</p>
</div>
```

**Mingled:**
```html
<div class="bg:white r:8 shadow:0|4|6|0|#0000001a p:24">
  <h3 class="f:20 bold mb:16">Card Title</h3>
  <p class="c:#666">Card content goes here.</p>
</div>
```

### Navigation

**Tailwind:**
```html
<nav class="flex items-center justify-between p-4 bg-white shadow">
  <div class="text-xl font-bold">Brand</div>
  <div class="flex space-x-4">
    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
  </div>
</nav>
```

**Mingled:**
```html
<nav class="flex:between|center p:16 bg:white shadow:0|1|3|0|#0000001a">
  <div class="f:20 bold">Brand</div>
  <div class="flex gap:16">
    <a href="#" class="c:#666 hover:c:#000">Home</a>
    <a href="#" class="c:#666 hover:c:#000">About</a>
  </div>
</nav>
```

### Form Input

**Tailwind:**
```html
<input class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" 
       type="text" 
       placeholder="Enter text">
```

**Mingled:**
```html
<input class="b:#ddd r:4 p:12|8 focus:outline:none focus:b:blue" 
       type="text" 
       placeholder="Enter text">
```

## Advanced Features

### Custom Configuration

**Tailwind config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  }
}
```

**Mingled equivalent:**
```css
:root {
  --color-primary: #3b82f6;
}
```

```javascript
// Custom Mingled instance
const myMingled = new MingledRuntime({
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
});
```

### Dynamic Classes

**Tailwind (with build step):**
```html
<div class="${isActive ? 'bg-blue-500' : 'bg-gray-500'}">
```

**Mingled (runtime):**
```html
<div id="dynamic" class="p:16">Content</div>

<script>
  const el = document.getElementById('dynamic');
  el.className = isActive ? 'p:16 bg:blue' : 'p:16 bg:gray';
  window.Mingled.apply(el); // Apply new styles
</script>
```

## Migration Strategy

### 1. Gradual Migration
1. Install Mingled alongside Tailwind
2. Migrate component by component
3. Remove Tailwind when migration is complete

### 2. Complete Migration
1. Remove Tailwind dependencies
2. Add Mingled script
3. Update all class names using this guide
4. Test thoroughly

### 3. Automated Migration
Consider creating a script to automatically convert Tailwind classes to Mingled syntax using the mapping tables above.

## Tips & Best Practices

1. **Use CSS variables** for colors to maintain consistency
2. **Start with spacing** - it's the most common migration area
3. **Test responsive breakpoints** - ensure they match your design
4. **Use the browser dev tools** to verify styles are applied correctly
5. **Leverage the runtime** - Mingled can apply styles dynamically

## Troubleshooting

### Styles Not Applying
- Ensure Mingled script is loaded before your HTML
- Check class name syntax (use `:` not `-`)
- Verify CSS variables are defined for colors

### Responsive Issues
- Check breakpoint values match your expectations
- Use `@` suffix for responsive variants
- Test at different viewport sizes

### Performance
- Mingled automatically caches styles
- Use `maxCacheSize` option if needed
- Enable `batchDOMUpdates` for better performance

## Conclusion

Mingled provides a more concise and readable alternative to Tailwind while maintaining the utility-first approach. The migration is straightforward, and you'll benefit from:

- ✅ No build step required
- ✅ More readable class names
- ✅ CSS-like syntax
- ✅ Smaller bundle size
- ✅ Runtime flexibility

Welcome to a cleaner, more intuitive way to style your applications!
