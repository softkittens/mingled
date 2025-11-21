# Mingled

<div align="center">
  <img src="https://em-content.zobj.net/source/apple/354/dna_1f9ec.png" width="64" height="64" alt="Mingled">
  <br><br>
</div>

<p align="center">
  A lightweight, standalone CSS runtime that embraces being mingled with your HTML
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mingled"><img src="https://img.shields.io/badge/npm-v0.3.0-blue" alt="npm package"></a>
  <a href="https://github.com/softkittens/mingled/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license"></a>
</p>

## ✨ Features

- 🤖 **A New CSS Language**: Not just utilities, but a concise syntax for expressing CSS directly
- 🧬 **Embrace the Mingle**: Designed to be comfortably mingled with your HTML markup
- ⚡️ **Zero Build Step**: Works directly in the browser with a simple script tag
- 🚀 **Runtime Performance**: Smart caching and batched DOM updates for optimal performance
- 🧩 **Intuitive Syntax**: Simple, memorable property-value pairs that mirror CSS
- 🎨 **Themeable**: Works with CSS variables for easy customization
- 📱 **Responsive**: Built-in breakpoint system with variants
- 🔌 **No Dependencies**: Pure JavaScript, no build tools or frameworks required
- 💾 **Smart Caching**: Automatic style caching with configurable limits

## 📦 Installation

### Via NPM

```bash
npm install mingled
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/mingled"></script>
```

## 🛠️ Setup

### Quick Start (Browser)

Simply include the script in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mingled"></script>
</head>
<body>
  <div class="p:16 bg:blue c:white r:8">
    Hello Mingled!
  </div>
</body>
</html>
```

That's it! Mingled will automatically scan your document and apply styles.

### Advanced Configuration

You can customize the runtime with options:

```html
<script src="mingled.js"></script>
<script>
  // Create a custom instance
  const myMingled = new MingledRuntime({
    prefix: '',              // Add a prefix to all classes
    enableCache: true,       // Enable style caching (default: true)
    autoInject: true,        // Auto-inject styles (default: true)
    maxCacheSize: 1000,      // Maximum cache entries (default: 1000)
    batchDOMUpdates: true,   // Batch DOM updates for performance (default: true)
    breakpoints: {           // Custom breakpoints
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    }
  });

  // Manually scan document
  myMingled.scanDocument();
</script>
```

### Module Usage

```javascript
import { MingledRuntime } from 'mingled';

const mingled = new MingledRuntime();
mingled.scanDocument();
```

## 🎯 Quick Start

Mingled is a CSS language that's meant to be mingled directly in your HTML. It uses an intuitive property:value syntax that closely mirrors CSS itself:

```html
<!-- A card component using Mingled -->
<div class="p:16 r:8 b:#eee bg:white shadow:2|2|10|0|(0,0,0,0.1)">
  <h3 class="f:18 fw:bold mb:8">Card Title</h3>
  <p class="f:14 c:#666 mb:16">This is a simple card built with Mingled.</p>
  <button class="bg:blue c:white p:8|16 r:4 pointer">Learn More</button>
</div>
```

## 📚 Utility Reference

### Layout

#### Height and Width

- `h:{value}`, `w:{value}`: Set height or width
  - Values can be pixels (e.g., `h:200`), percentages (e.g., `w:50%`), or keywords (`full`, `screen`, `fit`)
- `min-h:{value}`, `min-w:{value}`: Set min-height or min-width
- `max-h:{value}`, `max-w:{value}`: Set max-height or max-width
- `size:{value}`: Set both width and height to the same value

Examples:

```html
<div class="h:200">Height 200px</div>
<div class="w:full">Width 100%</div>
<div class="min-h:screen">Minimum height 100vh</div>
<div class="max-w:fit">Maximum width fit-content</div>
<div class="size:50">50px × 50px square</div>
```

#### Flexbox

- `flex`: Set display to flex
- `flex-inline`: Set display to inline-flex
- `flex:{value}`, `flex-inline:{value}`, `flex-col:{value}`: Configure flex container
  - Single number for flex-grow: `flex:1`
  - `{justify}|{align}`: Set justify-content and align-items
    - Justify options: start, end, center, between, around, evenly
    - Align options: start, end, center, stretch, baseline
  - If only `center` is specified, both justify and align will be centered

Examples:

```html
<div class="flex:center">Horizontally and vertically centered</div>
<div class="flex:between|center">Space between, vertically centered</div>
<div class="flex-col:start|stretch">Column layout</div>
<div class="flex:1">Flex grow 1</div>
<div class="wrap gap:16">Wrapped flex with gap</div>
```

#### Positioning

- `relative`, `absolute`, `fixed`, `sticky`: Set position property
- `{side}:{value}`: Set top, right, bottom, or left offset (e.g., `top:10`, `left:50%`)
- `inset:{value}`: Set all four sides to the same value

Examples:

```html
<div class="relative">Relative positioning</div>
<div class="absolute top:0 left:0">Absolute top-left</div>
<div class="fixed bottom:20 right:20">Fixed bottom-right</div>
<div class="sticky top:0">Sticky header</div>
<div class="absolute inset:0">Full coverage</div>
```

### Spacing

#### Margin

- `m:{value}`: Set margin on all sides
- `mx:{value}`, `my:{value}`: Set horizontal or vertical margin
- `mt:{value}`, `mr:{value}`, `mb:{value}`, `ml:{value}`: Set margin on specific sides
- `m:{top}|{right}|{bottom}|{left}`: Set margin on all four sides individually

Examples:

```html
<div class="m:16">Margin 16px on all sides</div>
<div class="mx:auto">Horizontally centered</div>
<div class="my:20">Vertical margin 20px</div>
<div class="mt:10">Top margin 10px</div>
<div class="mb:8">Bottom margin 8px</div>
<div class="m:10|20|10|20">Custom margin on all sides</div>
<div class="m:0|auto">Top/bottom 0, left/right auto</div>
```

#### Padding

- `p:{value}`: Set padding on all sides
- `px:{value}`, `py:{value}`: Set horizontal or vertical padding
- `pt:{value}`, `pr:{value}`, `pb:{value}`, `pl:{value}`: Set padding on specific sides
- `p:{top}|{right}|{bottom}|{left}`: Set padding on all four sides individually

Examples:

```html
<div class="p:16">Padding 16px on all sides</div>
<div class="px:20">Horizontal padding 20px</div>
<div class="py:10">Vertical padding 10px</div>
<div class="pt:10">Top padding 10px</div>
<div class="pb:8">Bottom padding 8px</div>
<div class="p:10|20|10|20">Custom padding on all sides</div>
<div class="p:8|16">Vertical 8px, horizontal 16px</div>
```

### Typography

- `f:{size}`: Set font size (in pixels, converted to rem)
- `lh:{height}`: Set line height
- `fw:{weight}`: Set font weight
  - Named weights: `thin`, `xlight`, `light`, `normal`, `medium`, `semibold`, `bold`, `xbold`, `black`
  - Numeric weights: `fw:100`, `fw:400`, `fw:700`, etc.
- `light`, `normal`, `medium`, `semibold`, `bold`: Shorthand font weights
- `ff:{family}`: Set font family
- `nowrap`: Set white-space to nowrap

Examples:

```css
:root {
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'Courier New', monospace;
}
```

```html
<p class="f:16">Font size 16px (1rem)</p>
<p class="f:18 fw:bold lh:1.5">Bold text with custom line height</p>
```

### Colors

- `c:{color}`: Set text color
- `bg:{color}`: Set background color
- Color formats:
  - Hex: `c:#ff0000`, `bg:#00ff00`
  - CSS variables: `c:primary`, `bg:secondary` (uses `--color-{name}`)
  - With opacity: `c:blue/50`, `bg:#ff0000/80` (uses color-mix)

Examples:

```html
<div class="c:#333">Dark text</div>
<div class="bg:#f0f0f0">Light background</div>
<div class="c:primary">Uses --color-primary</div>
<div class="bg:blue/50">50% opacity blue background</div>
<div class="c:#ff0000/80">80% opacity red text</div>
```

### Borders

- `b:{color}`: Set border with default 1px solid
- `b:{color}|{width}|{style}`: Set border with custom width and style
- `bt:{...}`, `br:{...}`, `bb:{...}`, `bl:{...}`: Set border on specific sides (top, right, bottom, left)
- `r:{value}`: Set border-radius
  - Single value: `r:8`
  - Per-corner: `r:{topLeft}|{topRight}|{bottomRight}|{bottomLeft}`
- `outline:{width}|{style}|{color}`: Set outline

Examples:

```html
<div class="b:#ddd">1px solid border</div>
<div class="b:#000|2|solid">2px solid black border</div>
<div class="bb:#ccc|1|dashed">Bottom dashed border</div>
<div class="br:#eee">Right border</div>
<div class="r:8">8px border radius</div>
<div class="r:4|8|12|16">Different radius per corner</div>
<div class="outline:2|solid|blue">Blue outline</div>
<div class="b:none">No border</div>
```

### Miscellaneous

- `pointer`: Set cursor to pointer
- `no-select`: Disable text selection
- `ellipsis`: Truncate text with ellipsis
- `o:{value}`: Set opacity (0-1, e.g., `o:0.5` for 50%)
- `z:{value}`: Set z-index
- `overflow:{value}`: Set overflow (`hidden`, `auto`, `scroll`, `visible`)
- `overflow-x:{value}`, `overflow-y:{value}`: Set overflow on specific axis
- `shadow:{offsetX}|{offsetY}|{blur}|{spread}|{color}`: Set box shadow
- `none`: Set appearance to none
- `hidden`: Set display to none

Examples:

```html
<button class="pointer">Clickable button</button>
<div class="no-select">Can't select this text</div>
<div class="ellipsis w:200">This text will be truncated...</div>
<div class="o:0.5">50% opacity</div>
<div class="o:0">Fully transparent</div>
<div class="o:1">Fully opaque</div>
<div class="z:10">Z-index 10</div>
<div class="overflow:hidden">Hidden overflow</div>
<div class="overflow-x:auto">Horizontal scroll</div>
<div class="shadow:0|2|4|0|#00000026">Subtle shadow</div>
```

### Text Decoration and Formatting

- `uppercase`, `lowercase`, `capitalize`, `normal-case`: Text transformation
- `underline`, `line-through`, `no-underline`, `overline`: Text decoration
- `text-left`: Text align left
- `code`: Monospace font with light background

Examples:

```html
<span class="uppercase">uppercase text</span>
<span class="capitalize">capitalized text</span>
<span class="underline">Underlined text</span>
<div class="text-left">Left aligned</div>
<div class="ellipsis w:200">Long text that gets truncated...</div>
<pre class="code">Code block</pre>
```

### Transform and Positioning

- `translate:{x}|{y}`: Translate element
- `transform:{value}`: Set custom transform

Examples:

```html
<div class="translate:10|20">Translated 10px right, 20px down</div>
<div class="transform:rotate(45deg)">Custom transform</div>
```

### SVG Utilities

- `stroke:{color}`: Set SVG stroke color
- `stroke-w:{width}`: Set SVG stroke width

Examples:

```html
<svg class="stroke:#000 stroke-w:2">
  <!-- SVG content -->
</svg>
<svg class="stroke:blue stroke-w:3">
  <!-- SVG content -->
</svg>
```

## Usage Tips

### Combining Utilities

```html
<div class="flex:center p:20 bg:#f5f5f5 r:8">
  <!-- Centered flex container with padding, background, and rounded corners -->
</div>
```

### Responsive Design

Use breakpoint suffixes with `@` (`@sm`, `@md`, `@lg`, `@xl`):

```html
<div class="p:8 p:16@sm p:24@md p:32@lg">
  <!-- Padding increases on larger screens -->
</div>
```

### Pseudo-classes

Use pseudo-class prefixes or suffixes (hover, focus, active, visited, disabled, focus-within):

```html
<button class="bg:blue hover:bg:darkblue c:white p:8|16 r:4">
  Hover me
</button>
<button class="bg:blue bg:darkblue:hover c:white p:8|16 r:4">
  Alternative syntax
</button>
```

### Component Composition

```html
<header class="flex:between|center p:16 bg:white b:0|0|1|0|#eee">
  <logo class="f:20 fw:bold">Brand</logo>
  <nav class="flex gap:16">
    <a href="#" class="c:#666 hover:c:#000">Home</a>
    <a href="#" class="c:#666 hover:c:#000">About</a>
  </nav>
</header>
```

### Dynamic Styles

```html
<div id="dynamic" class="p:16">Content</div>

<script>
  // Apply new classes dynamically
  const el = document.getElementById('dynamic');
  el.className = 'p:32 bg:blue c:white';
  
  // Mingled will automatically detect and apply the new styles
  window.Mingled.apply(el);
</script>
```

### Custom CSS Variables

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
}
```

### Programmatic Usage

```javascript
// Generate stylesheet for specific classes
const css = window.Mingled.generateStylesheet(['p:16', 'bg:blue', 'c:white']);

// Apply styles to specific element
window.Mingled.apply(document.querySelector('.my-element'));

// Scan entire document for new classes
window.Mingled.scanDocument();

// Reset cache
window.Mingled.reset();
```

## Contributing

This is a very opinionated approach that is still in alpha. Please **open an issue first** to discuss any proposed changes before creating a pull request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Inspired by the elegance of utility-first CSS frameworks and the simplicity of inline styles.

## 💡 Why Mingled?

Traditional CSS frameworks force you to choose between:

1. **Utility classes** (Tailwind, UnoCSS): Great for speed, but verbose and hard to read
2. **Semantic CSS**: Clean HTML, but requires context switching and separate files
3. **Inline styles**: Fast to write, but limited and hard to maintain

Mingled offers a fourth option: **a concise CSS language designed to be mingled with HTML**. It combines:

- ✅ The speed of inline styles
- ✅ The power of a full CSS framework
- ✅ A readable, intuitive syntax
- ✅ No build step required
- ✅ Runtime performance optimizations

```html
<!-- Verbose utility classes -->
<div class="padding-4 background-blue text-white border-radius-2 margin-bottom-4"></div>

<!-- Mingled: concise and readable -->
<div class="p:16 bg:blue c:white r:8 mb:16"></div>
```

## 🔄 Migration from Tailwind

Mingled's syntax is more concise and closer to CSS itself:

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

## 🧪 Examples

### Responsive Layout

```html
<div class="flex-col flex@sm flex:between@lg p:16 p:24@sm p:32@lg gap:16">
  <div class="w:full w:50%@lg p:16 bg:#f5f5f5 r:8">
    <h2 class="f:24 fw:bold mb:8">Section 1</h2>
    <p class="f:16 c:#666">Responsive content that stacks on mobile.</p>
  </div>
  <div class="w:full w:50%@lg p:16 bg:#f5f5f5 r:8">
    <h2 class="f:24 fw:bold mb:8">Section 2</h2>
    <p class="f:16 c:#666">And sits side-by-side on desktop.</p>
  </div>
</div>
```

### Interactive Button

```html
<button class="
  p:12|24 
  bg:#3b82f6 
  hover:bg:#2563eb 
  active:bg:#1d4ed8
  c:white 
  r:8 
  b:none 
  pointer 
  f:16 
  fw:medium
  transition:all|0.2s
">
  Click Me
</button>
```

---

Made with 🧬 by developers who love clean, readable code.
