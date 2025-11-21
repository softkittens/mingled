/**
 * Mingled CSS Runtime - Standalone CSS-in-JS framework
 * Drop-in replacement for UnoCSS Mingled preset that works without UnoCSS
 */

// Constants
const PSEUDO_CLASSES = ['hover', 'focus', 'active', 'visited', 'disabled', 'focus-within'];
const ESCAPE_REGEX = /([^a-zA-Z0-9_-])/g;
const REM_BASE = 16;
const CACHE_CLEANUP_RATIO = 0.2;

const FONT_WEIGHTS = {
  thin: 100,
  xlight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  xbold: 800,
  black: 900,
};

const JUSTIFY_CONTENT_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const ALIGN_ITEMS_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  baseline: 'baseline',
};

class MingledRuntime {
  constructor(options = {}) {
    this.rules = [];
    this.variants = [];
    this.cache = new Map();
    this.injectedTokens = new Set();
    this.styleElement = null;
    this.options = {
      prefix: '',
      enableCache: true,
      autoInject: true,
      maxCacheSize: 1000,
      batchDOMUpdates: true,
      ...options
    };
    this.breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      ...(options.breakpoints || {}),
    };

    // Performance optimizations
    this.selectorCache = new Map();
    this.ruleLookup = new Map();
    this.pendingCSS = '';
    this.updateTimer = null;
    this.rafId = null;

    this.init();
  }

  init() {
    this.setupRules();
    this.setupVariants();
    this.buildRuleLookup();
    if (this.options.autoInject) {
      this.createStyleElement();
    }
  }

  buildRuleLookup() {
    const prefixes = ['h:', 'w:', 'm:', 'p:', 'c:', 'bg:', 'f:', 'fw:', 'ff:', 'b:', 'r:', 'flex', 'grid', 'translate:', 'transform:'];

    for (const prefix of prefixes) {
      const escaped = prefix.replace(ESCAPE_REGEX, '\\$&');
      const matchingRules = this.rules.filter(([pattern]) => {
        const src = pattern.source;

        // The pattern `source` might contain punctuation with or without escaping
        // depending on how the RegExp literal was authored. Accept both escaped
        // and unescaped prefix forms so we match reliably.
        return (
          src.startsWith('^' + escaped) ||
          src.startsWith('^' + prefix) ||
          src.startsWith('^(?:' + escaped) ||
          src.startsWith('^(?:' + prefix)
        );
      });
      if (matchingRules.length) {
        this.ruleLookup.set(prefix, matchingRules);
      }
    }
  }

  pxToRem(value) {
    if (isNaN(value)) return value;
    return `${value / REM_BASE}rem`;
  }

  handleColor(color) {
    if (color.includes('/')) {
      const [baseColor, opacity] = color.split('/');
      const opacityPercentage = parseInt(opacity);
      if (baseColor.startsWith('#')) {
        return `color-mix(in srgb, ${baseColor} ${opacityPercentage}%, transparent)`;
      }
      return `color-mix(in srgb, var(--color-${baseColor}, ${baseColor}) ${opacityPercentage}%, transparent)`;
    }
    if (color.startsWith('#')) return color;
    return `var(--color-${color}, ${color})`;
  }

  handleSpacing(value) {
    return value.split('|')
      .map(part => part === '' ? '0' : part)
      .map(part => this.pxToRem(part))
      .join(' ');
  }

  handleFontWeight(weight) {
    return FONT_WEIGHTS[weight] || weight;
  }

  handleFlex(value, type) {
    const direction = type === 'col' ? 'column' : 'row';
    const display = type === 'inline' ? 'inline-flex' : 'flex';
    const styles = { display, 'flex-direction': direction };

    if (!value) return styles;
    if (!isNaN(value)) return { flex: value.split('|').join(' ') };

    const [justify, align] = value.split('|');

    // Handle center shorthand
    if (justify === 'center' && !align) {
      styles['justify-content'] = 'center';
      styles['align-items'] = 'center';
      return styles;
    }

    if (JUSTIFY_CONTENT_MAP[justify]) {
      styles['justify-content'] = JUSTIFY_CONTENT_MAP[justify];
    }
    if (ALIGN_ITEMS_MAP[align]) {
      styles['align-items'] = ALIGN_ITEMS_MAP[align];
    }

    return styles;
  }

  handleBorder(value) {
    if (value === '0' || value === 'none') return 'none';
    const parts = value.split('|');

    // Support both "color" and "color|width|style" formats
    if (parts.length === 1) {
      return `1px solid ${this.handleColor(parts[0])}`;
    }

    const [color, width = '1', style = 'solid'] = parts;
    const widthVal = /^\d+$/.test(width) ? `${width}px` : width;
    return `${widthVal} ${style} ${this.handleColor(color)}`;
  }

  parseSidelength(value) {
    if (value === 'full') return '100%';
    if (value === 'screen') return '100vh';
    if (value === 'fit') return 'fit-content';
    return /^\d+$/.test(value) ? `${value}px` : value;
  }

  setupRules() {
    this.rules = [
      // Dimensions
      [/^h:(.+)$/, ([, s]) => ({ height: this.parseSidelength(s) })],
      [/^min-h:(.+)$/, ([, s]) => ({ 'min-height': this.parseSidelength(s) })],
      [/^max-h:(.+)$/, ([, s]) => ({ 'max-height': this.parseSidelength(s) })],
      [/^w:(.+)$/, ([, s]) => ({ width: this.parseSidelength(s) })],
      [/^min-w:(.+)$/, ([, s]) => ({ 'min-width': this.parseSidelength(s) })],
      [/^max-w:(.+)$/, ([, s]) => ({ 'max-width': this.parseSidelength(s) })],
      [/^size:(.+)$/, ([, s]) => ({
        width: this.parseSidelength(s),
        height: this.parseSidelength(s),
      })],

      // Colors
      [/^c:(.+)$/, ([, v]) => ({ color: this.handleColor(v) })],
      [/^bg:(.+)$/, ([, v]) => ({ 'background-color': this.handleColor(v) })],

      // Margin
      [/^m:(.+)$/, ([, s]) => ({ margin: this.handleSpacing(s) })],
      [/^mx:(.+)$/, ([, s]) => ({
        'margin-left': this.pxToRem(s),
        'margin-right': this.pxToRem(s),
      })],
      [/^my:(.+)$/, ([, s]) => ({
        'margin-top': this.pxToRem(s),
        'margin-bottom': this.pxToRem(s),
      })],
      [/^mt:(.+)$/, ([, s]) => ({ 'margin-top': this.pxToRem(s) })],
      [/^mr:(.+)$/, ([, s]) => ({ 'margin-right': this.pxToRem(s) })],
      [/^mb:(.+)$/, ([, s]) => ({ 'margin-bottom': this.pxToRem(s) })],
      [/^ml:(.+)$/, ([, s]) => ({ 'margin-left': this.pxToRem(s) })],

      // Padding
      [/^p:(.+)$/, ([, s]) => ({ padding: this.handleSpacing(s) })],
      [/^px:(.+)$/, ([, s]) => ({
        'padding-left': this.pxToRem(s),
        'padding-right': this.pxToRem(s),
      })],
      [/^py:(.+)$/, ([, s]) => ({
        'padding-top': this.pxToRem(s),
        'padding-bottom': this.pxToRem(s),
      })],
      [/^pt:(.+)$/, ([, s]) => ({ 'padding-top': this.pxToRem(s) })],
      [/^pr:(.+)$/, ([, s]) => ({ 'padding-right': this.pxToRem(s) })],
      [/^pb:(.+)$/, ([, s]) => ({ 'padding-bottom': this.pxToRem(s) })],
      [/^pl:(.+)$/, ([, s]) => ({ 'padding-left': this.pxToRem(s) })],

      // Typography
      [/^f:(\d+)$/, ([, s]) => ({ 'font-size': this.pxToRem(s) })],
      [/^lh:(\d+(?:\.\d+)?)$/, ([, value]) => ({
        'line-height': Number.isInteger(Number(value)) ? `${value}px` : value,
      })],
      [/^fw:(\w+|\d+)$/, ([, w]) => ({ 'font-weight': this.handleFontWeight(w) })],
      [/^bold$/, () => ({ 'font-weight': '700' })],
      [/^semi$/, () => ({ 'font-weight': '600' })],
      [/^regular$/, () => ({ 'font-weight': '400' })],
      [/^medium$/, () => ({ 'font-weight': '500' })],
      [/^ff:([\w-]+)$/, ([, v]) => ({
        'font-family': v === 'inherit' ? 'inherit' : `var(--font-${v}, ${v})`,
      })],

      // Flex & Layout
      [/^flex(?:-?(col|inline))?(?::(.+))?$/, ([, type, value]) => this.handleFlex(value, type)],
      [/^wrap$/, () => ({ 'flex-wrap': 'wrap' })],
      [/^gap:(\d+)$/, ([, s]) => ({ gap: `${s}px` })],
      [/^block$/, () => ({ display: 'block' })],
      [/^inline$/, () => ({ display: 'inline' })],
      [/^inline-block$/, () => ({ display: 'inline-block' })],
      [/^hidden$/, () => ({ display: 'none' })],

      // Grid
      [/^grid$/, () => ({ display: 'grid' })],
      [/^grid-cols:(\d+)$/, ([, n]) => ({ 'grid-template-columns': `repeat(${n}, minmax(0, 1fr))` })],

      // Text
      [/^upper(?:case)?$/, () => ({ 'text-transform': 'uppercase' })],
      [/^lower(?:case)?$/, () => ({ 'text-transform': 'lowercase' })],
      [/^capitalize$/, () => ({ 'text-transform': 'capitalize' })],
      [/^normal-case$/, () => ({ 'text-transform': 'none' })],
      [/^underline$/, () => ({ 'text-decoration': 'underline' })],
      [/^line-through$/, () => ({ 'text-decoration': 'line-through' })],
      [/^overline$/, () => ({ 'text-decoration': 'overline' })],
      [/^no-underline$/, () => ({ 'text-decoration': 'none' })],
      [/^text-left$/, () => ({ 'text-align': 'left' })],
      [/^text-center$/, () => ({ 'text-align': 'center' })],
      [/^text-right$/, () => ({ 'text-align': 'right' })],
      [/^ta:(left|center|right|justify)$/, ([, v]) => ({ 'text-align': v })],
      [/^nowrap$/, () => ({ 'white-space': 'nowrap' })],
      [/^pre-wrap$/, () => ({ 'white-space': 'pre-wrap' })],
      [/^ellipsis$/, () => ({
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap'
      })],
      [/^code$/, () => ({
        'font-family': 'monospace',
        'background-color': '#f5f5f5',
        padding: '2px 4px',
        'border-radius': '3px'
      })],

      // Cursor
      [/^pointer$/, () => ({ cursor: 'pointer' })],
      [/^no-select$/, () => ({ 'user-select': 'none' })],

      // Borders
      [/^b:(.+)$/, ([, v]) => ({ border: this.handleBorder(v) })],
      [/^bt:(.+)$/, ([, v]) => ({ 'border-top': this.handleBorder(v) })],
      [/^br:(.+)$/, ([, v]) => ({ 'border-right': this.handleBorder(v) })],
      [/^bb:(.+)$/, ([, v]) => ({ 'border-bottom': this.handleBorder(v) })],
      [/^bl:(.+)$/, ([, v]) => ({ 'border-left': this.handleBorder(v) })],
      [/^r:(\d+)(?:\|(\d+))?(?:\|(\d+))?(?:\|(\d+))?$/, ([, tl, tr, br, bl]) => {
        const topLeft = `${tl}px`;
        const topRight = tr ? `${tr}px` : topLeft;
        const bottomRight = br ? `${br}px` : topLeft;
        const bottomLeft = bl ? `${bl}px` : topRight;
        return { 'border-radius': `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}` };
      }],
      [/^outline:(.+)$/, ([, v]) => ({ outline: v })],

      // Visual
      [/^o:(\d+(?:\.\d+)?)$/, ([, s]) => ({ opacity: s })],
      [/^z:(-?\d+)$/, ([, s]) => ({ 'z-index': s })],
      [/^shadow:(-?\d+)\|(-?\d+)\|(-?\d+)\|(-?\d+)\|(.+)$/, ([, x, y, blur, spread, color]) => {
        const colorValue = color.startsWith('(') && color.endsWith(')')
          ? `rgba(${color.slice(1, -1)})`
          : color.startsWith('#') ? color : this.handleColor(color);
        return { 'box-shadow': `${x}px ${y}px ${blur}px ${spread}px ${colorValue}` };
      }],

      // Overflow
      [/^overflow:(\w+)$/, ([, v]) => ({ overflow: v })],
      [/^overflow-x:(\w+)$/, ([, v]) => ({ 'overflow-x': v })],
      [/^overflow-y:(\w+)$/, ([, v]) => ({ 'overflow-y': v })],
      [/^scroll:hide$/, () => ({
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      })],

      // Position
      [/^relative$/, () => ({ position: 'relative' })],
      [/^absolute$/, () => ({ position: 'absolute' })],
      [/^fixed$/, () => ({ position: 'fixed' })],
      [/^sticky$/, () => ({ position: 'sticky' })],
      [/^top:(-?\d+%?)$/, ([, s]) => ({ top: s.includes('%') ? s : `${s}px` })],
      [/^right:(-?\d+%?)$/, ([, s]) => ({ right: s.includes('%') ? s : `${s}px` })],
      [/^bottom:(-?\d+%?)$/, ([, s]) => ({ bottom: s.includes('%') ? s : `${s}px` })],
      [/^left:(-?\d+%?)$/, ([, s]) => ({ left: s.includes('%') ? s : `${s}px` })],
      [/^inset:(-?\d+%?)$/, ([, s]) => {
        const value = s.includes('%') ? s : `${s}px`;
        return { top: value, right: value, bottom: value, left: value };
      }],

      // Transform
      [/^translate:(-?\d+(?:\.\d+)?%?)(?:\|(-?\d+(?:\.\d+)?%?))?$/, ([, x, y]) => {
        const formatValue = (val) => val ? (val.includes('%') ? val : `${val}px`) : '0';
        return { transform: `translate(${formatValue(x)}, ${formatValue(y || '0')})` };
      }],
      [/^transform:(.+)$/, ([, v]) => ({ transform: v })],

      // SVG
      [/^stroke:(.+)$/, ([, c]) => ({ stroke: this.handleColor(c) })],
      [/^stroke-w:(\d+)$/, ([, w]) => ({ 'stroke-width': `${w}px` })],

      // Misc
      [/^none$/, () => ({ appearance: 'none' })],
    ];
  }

  setupVariants() {
    this.variants = [
      // Pseudo-class variant (suffix only: bg:blue:hover)
      (matcher) => {
        for (const pseudo of PSEUDO_CLASSES) {
          if (matcher.endsWith(`:${pseudo}`)) {
            return {
              matcher: matcher.slice(0, -(pseudo.length + 1)),
              pseudoClass: pseudo,
            };
          }
        }
        return matcher;
      },

      // Important variant
      (matcher) => {
        if (matcher.endsWith('!')) {
          return {
            matcher: matcher.slice(0, -1),
            body: (body) => {
              const addImportant = (val) => {
                if (typeof val === 'string') return `${val} !important`;
                if (Array.isArray(val)) return val.map(([k, v]) => [k, addImportant(v)]);
                if (val && typeof val === 'object') {
                  const out = {};
                  for (const [k, v] of Object.entries(val)) out[k] = addImportant(v);
                  return out;
                }
                return val;
              };
              return addImportant(body);
            },
          };
        }
      },

      // Media query variant
      (matcher) => {
        const match = matcher.match(/^(.+)@(sm|md|lg|xl)$/);
        if (match) {
          const [, className, breakpoint] = match;
          const bp = this.breakpoints[breakpoint];
          if (!bp) return matcher;
          return {
            matcher: className,
            media: `@media (min-width: ${bp})`,
          };
        }
      },
    ];
  }

  createStyleElement() {
    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mingled', 'true');
    document.head.appendChild(this.styleElement);
  }

  processClass(className) {
    if (this.options.enableCache && this.cache.has(className)) {
      return this.cache.get(className);
    }

    const processedClass = {
      selector: null,
      styles: {},
      media: null,
      pseudoClass: null,
      bodyProcessor: null
    };

    // Apply variants
    let matcher = className;
    for (const variant of this.variants) {
      const result = variant(matcher);
      if (typeof result === 'object' && result !== matcher) {
        matcher = result.matcher;
        if (result.body) processedClass.bodyProcessor = result.body;
        if (result.media) processedClass.media = result.media;
        if (result.pseudoClass) processedClass.pseudoClass = result.pseudoClass;
      }
    }

    // Build selector from original className to match DOM class attribute
    // For "bg:blue:hover": className is "bg:blue:hover", selector is ".bg\:blue\:hover"
    // Then we add the pseudo-class ":hover" in generateCSS -> ".bg\:blue\:hover:hover"
    const baseSelector = `.${this.escapeSelector(className)}`;
    processedClass.selector = baseSelector;

    // Match rule
    const matched = this.matchRule(matcher);
    if (matched) {
      processedClass.styles = matched;

      // Apply body processor (for important, etc.)
      if (processedClass.bodyProcessor) {
        processedClass.styles = processedClass.bodyProcessor(processedClass.styles);
      }
    }

    if (this.options.enableCache) {
      this.limitCacheSize();
      this.cache.set(className, processedClass);
    }

    return processedClass;
  }

  matchRule(matcher) {
    // Fast path: try prefix-based lookup first
    for (const [prefix, rules] of this.ruleLookup) {
      if (matcher.startsWith(prefix)) {
        for (const [pattern, handler] of rules) {
          const match = matcher.match(pattern);
          if (match) {
            const styles = handler(match);
            if (styles) return styles;
          }
        }
        return null;
      }
    }

    // Fallback to full scan
    for (const [pattern, handler] of this.rules) {
      const match = matcher.match(pattern);
      if (match) {
        const styles = handler(match);
        if (styles) return styles;
      }
    }
    return null;
  }

  limitCacheSize() {
    if (this.cache.size >= this.options.maxCacheSize) {
      const entriesToDelete = Math.floor(this.options.maxCacheSize * CACHE_CLEANUP_RATIO);
      const keysToDelete = Array.from(this.cache.keys()).slice(0, entriesToDelete);
      keysToDelete.forEach(key => this.cache.delete(key));
    }
  }

  escapeSelector(selector) {
    if (this.selectorCache.has(selector)) {
      return this.selectorCache.get(selector);
    }
    const escaped = selector.replace(ESCAPE_REGEX, '\\$1');
    this.selectorCache.set(selector, escaped);
    return escaped;
  }

  generateCSS(classes) {
    const classArray = Array.isArray(classes) ? classes : classes.split(/\s+/).filter(Boolean);
    const cssRules = [];

    for (const className of classArray) {
      const processed = this.processClass(className);
      if (Object.keys(processed.styles).length === 0) continue;

      const selector = processed.pseudoClass 
        ? `${processed.selector}:${processed.pseudoClass}` 
        : processed.selector;
      const decls = [];
      const nested = [];

      for (const [prop, value] of Object.entries(processed.styles)) {
        if (prop.startsWith('&') && value && typeof value === 'object') {
          nested.push([prop.slice(1), value]);
        } else if (value != null && typeof value !== 'object') {
          decls.push(`${prop}: ${value}`);
        }
      }

      const wrapMedia = (rule) => {
        return processed.media ? `${processed.media} { ${rule} }` : rule;
      };

      if (decls.length) {
        cssRules.push(wrapMedia(`${selector} { ${decls.join('; ')} }`));
      }

      for (const [suffix, obj] of nested) {
        const nestedDecls = Object.entries(obj)
          .filter(([, v]) => v != null && typeof v !== 'object')
          .map(([k, v]) => `${k}: ${v}`);
        if (nestedDecls.length) {
          cssRules.push(wrapMedia(`${selector}${suffix} { ${nestedDecls.join('; ')} }`));
        }
      }
    }

    return cssRules.join('\n');
  }

  injectCSS(classes) {
    const tokens = Array.isArray(classes) ? classes : classes.split(/\s+/).filter(Boolean);
    const newTokens = tokens.filter(t => !this.injectedTokens.has(t));
    if (!newTokens.length) return;

    const css = this.generateCSS(newTokens);
    if (!css) return;

    if (this.options.batchDOMUpdates) {
      this.batchCSSUpdate(css);
    } else {
      this.appendCSS(css);
    }

    newTokens.forEach(t => this.injectedTokens.add(t));
  }

  batchCSSUpdate(css) {
    this.pendingCSS += css + '\n';

    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      if (this.rafId != null) cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame(() => {
        this.appendCSS(this.pendingCSS);
        this.pendingCSS = '';
        this.rafId = null;
      });
      return;
    }

    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      this.appendCSS(this.pendingCSS);
      this.pendingCSS = '';
      this.updateTimer = null;
    }, 0);
  }

  appendCSS(css) {
    if (!this.styleElement || !css) return;

    const sheet = this.styleElement.sheet;
    if (sheet) {
      const rules = css.split(/\n+/).filter(Boolean);
      for (const rule of rules) {
        try {
          sheet.insertRule(rule.trim(), sheet.cssRules.length);
        } catch (e) {
          // Fallback to textContent for complex rules
          this.styleElement.textContent += rule + '\n';
        }
      }
    } else {
      this.styleElement.textContent += css + '\n';
    }
  }

  // Public API
  apply(element, classes) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return;

    const classArray = Array.isArray(classes) ? classes : classes.split(/\s+/).filter(Boolean);
    this.injectCSS(classArray);
    element.classList.add(...classArray);
  }

  generateStylesheet(classes) {
    return this.generateCSS(classes);
  }

  scanDocument() {
    const elements = document.querySelectorAll('[class]');
    const allClasses = new Set();

    for (const element of elements) {
      for (const className of element.classList) {
        if (className && !this.injectedTokens.has(className)) {
          // Validate via processClass to correctly respect variants (prefix OR suffix),
          // important (!) and media (@) wrappers. This ensures classes like `hover:bg:blue`
          // and `bg:blue:hover` are detected during the initial document scan.
          const processed = this.processClass(className);
          if (processed && Object.keys(processed.styles).length > 0) {
            allClasses.add(className);
          }
        }
      }
    }

    if (allClasses.size) {
      this.injectCSS(Array.from(allClasses));
    }
  }

  reset() {
    this.cache.clear();
    this.injectedTokens.clear();
    this.selectorCache.clear();
    if (this.styleElement) {
      this.styleElement.textContent = '';
    }
  }
}

// Auto-initialize global instance
if (typeof window !== 'undefined') {
  window.Mingled = new MingledRuntime();

  // Auto-scan document when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.Mingled.scanDocument();
    });
  } else {
    window.Mingled.scanDocument();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MingledRuntime, Mingled: typeof window !== 'undefined' ? window.Mingled : null };
}
