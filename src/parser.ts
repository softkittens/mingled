import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type AnyStyle = ViewStyle & TextStyle & ImageStyle;

const cache = new Map<string, AnyStyle>();
const tokenCache = new Map<string, AnyStyle>();
let maxCacheEntries = 1000;
let maxTokenCacheEntries = 2000;
let cacheVersion = 0; // bump to invalidate cache when palette changes
const templateIds = new WeakMap<TemplateStringsArray, number>();
let nextTemplateId = 1;

export function clearCache(): void {
  cache.clear();
  tokenCache.clear();
}

export function configure(opts: { maxCacheEntries?: number; maxTokenCacheEntries?: number } = {}): void {
  if (typeof opts.maxCacheEntries === 'number') maxCacheEntries = Math.max(0, opts.maxCacheEntries);
  if (typeof opts.maxTokenCacheEntries === 'number')
    maxTokenCacheEntries = Math.max(0, opts.maxTokenCacheEntries);
  clearCache();
}

function parseMaybeNumber(v: string): string | number {
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

export function parse(styles: TemplateStringsArray, ...values: (string | number)[]): AnyStyle {
  // Fast cache key path: template identity + value list
  let tid = templateIds.get(styles);
  if (!tid) {
    tid = nextTemplateId++;
    templateIds.set(styles, tid);
  }
  const valuesKey = values.length ? values.join('\u001F') : '';
  const key = `${cacheVersion}:${tid}:${valuesKey}`;
  const cached = cache.get(key);
  if (cached) return cached;

  // Cache miss: build input and parse
  const input = styles.map((s, i) => `${s}${values[i] ?? ''}`).join('');
  const stylesArr = input.trim().split(/\s+/);
  const result: AnyStyle = {} as AnyStyle;
  for (const s of stylesArr) {
    const [rest/*, mediaQ*/] = s.split('@');
    const [attribute, valuesStr] = rest.split(':');
    const tokenKey = `${cacheVersion}|${rest}`;

    // if (!isRightMedia(mediaQ)) continue;

    const cachedToken = tokenCache.get(tokenKey);
    if (cachedToken) {
      Object.assign(result, cachedToken);
    } else {
      const vs = valuesStr ? valuesStr.split('|').map((v) => parseMaybeNumber(v as string)) : [];
      const method = shortMethods[attribute as keyof typeof shortMethods] as (...args: any[]) => AnyStyle;
      if (method) {
        const chunk = method(...(vs as any[]));
        Object.assign(result, chunk);
        // cache token result (freeze in dev only)
        const entry = isDev() ? (Object.freeze({ ...(chunk as any) }) as AnyStyle) : (chunk as AnyStyle);
        tokenCache.set(tokenKey, entry);
        if (tokenCache.size > maxTokenCacheEntries) {
          const fk = tokenCache.keys().next().value as string | undefined;
          if (fk) tokenCache.delete(fk);
        }
      } else if (attribute) {
        warnUnknownToken(attribute);
      }
    }
  }
  cache.set(key, result);
  if (cache.size > maxCacheEntries) {
    const firstKey = cache.keys().next().value as string | undefined;
    if (firstKey) cache.delete(firstKey);
  }
  return result;
}

export const colors: Record<string, string> = {
  primary: '#405de6',
  black: '#0F0F0F',
  red: '#DD5D49',
  blue: '#1289F8',
  'indigo-5': '#F9FAFC',
  'indigo-50': '#8D9EB3',
  'indigo-60': '#63728B',
  'gray-5': '#FAFAFA',
  'gray-7': '#F7F7F7',
  'gray-10': '#F5F5F5',
  'gray-15': '#efeff0',
  'gray-20': '#E3E5E5',
  'gray-30': '#D8D8D8',
  'gray-40': '#B0B0B0',
  'gray-50': '#999999',
  'gray-60': '#666666',
  'gray-90': '#323232',
};

export function setColors(palette: Record<string, string>, options: { replace?: boolean } = {}): void {
  const { replace = false } = options;
  if (!palette || typeof palette !== 'object') return;
  if (replace) {
    for (const key of Object.keys(colors)) delete colors[key];
  }
  for (const [key, value] of Object.entries(palette)) {
    colors[key] = value;
  }
  cache.clear();
  tokenCache.clear();
  cacheVersion++;
}

const shortMethods: Record<string, (...args: any[]) => AnyStyle> = {
  p: (val: number, ...vs: number[]) => {
    if (!vs.length) return { padding: val } as AnyStyle;
    if (vs.length === 1) {
      return {
        paddingVertical: val || 0,
        paddingHorizontal: vs[0],
      } as AnyStyle;
    }
    if (vs.length === 2) {
      return {
        paddingTop: val,
        paddingRight: vs[0],
        paddingBottom: vs[1],
        paddingLeft: vs[0],
      } as AnyStyle;
    }
    if (vs.length === 3) {
      return {
        paddingTop: val,
        paddingRight: vs[0],
        paddingBottom: vs[1],
        paddingLeft: vs[2],
      } as AnyStyle;
    }
    return {} as AnyStyle;
  },
  pt: (val: number) => ({ paddingTop: val } as AnyStyle),
  pr: (val: number) => ({ paddingRight: val } as AnyStyle),
  pb: (val: number) => ({ paddingBottom: val } as AnyStyle),
  pl: (val: number) => ({ paddingLeft: val } as AnyStyle),
  px: (val: number) => ({ paddingHorizontal: val } as AnyStyle),
  py: (val: number) => ({ paddingVertical: val } as AnyStyle),
  m: (val: number, ...vs: number[]) => {
    if (!vs.length) return { margin: val } as AnyStyle;
    if (vs.length === 1) {
      return {
        marginVertical: val || 0,
        marginHorizontal: vs[0],
      } as AnyStyle;
    }
    if (vs.length === 2) {
      return {
        marginTop: val,
        marginRight: vs[0],
        marginBottom: vs[1],
        marginLeft: vs[0],
      } as AnyStyle;
    }
    if (vs.length === 3) {
      return {
        marginTop: val,
        marginRight: vs[0],
        marginBottom: vs[1],
        marginLeft: vs[2],
      } as AnyStyle;
    }
    return {} as AnyStyle;
  },
  mt: (val: number) => ({ marginTop: val } as AnyStyle),
  ml: (val: number) => ({ marginLeft: val } as AnyStyle),
  mb: (val: number) => ({ marginBottom: val } as AnyStyle),
  mr: (val: number) => ({ marginRight: val } as AnyStyle),
  mx: (val: number) => ({ marginHorizontal: val } as AnyStyle),
  my: (val: number) => ({ marginVertical: val } as AnyStyle),
  flex: (val: number) => ({ flex: val } as AnyStyle),
  row: (...values: (string | undefined)[]) => {
    if (!values.length) return { flexDirection: 'row' } as AnyStyle;
    if (values.length === 1) {
      return { flexDirection: 'row', alignItems: values[0] } as AnyStyle;
    }
    if (values.length === 2) {
      return {
        flexDirection: 'row',
        alignItems: (values[0] as string) || 'stretch',
        justifyContent: shortenJustify(values[1] as string),
      } as AnyStyle;
    }
    return {} as AnyStyle;
  },
  gap: (val: number) => ({ gap: val } as AnyStyle),
  ar: (val: number) => ({ aspectRatio: val } as AnyStyle),
  jc: (val: string) => ({ justifyContent: shortenJustify(val) } as AnyStyle),
  ai: (val: string) => ({ alignItems: val } as AnyStyle),
  self: (val: string) => ({ alignSelf: val } as AnyStyle),
  center: () => ({ alignItems: 'center', justifyContent: 'center' } as AnyStyle),
  wrap: () => ({ flexWrap: 'wrap' } as AnyStyle),
  w: (val: number | string) => ({ width: val } as AnyStyle),
  'max-w': (val: number | string) => ({ maxWidth: val } as AnyStyle),
  'min-w': (val: number | string) => ({ minWidth: val } as AnyStyle),
  'max-h': (val: number | string) => ({ maxHeight: val } as AnyStyle),
  'min-h': (val: number | string) => ({ minHeight: val } as AnyStyle),
  h: (val: number | string) => ({ height: val } as AnyStyle),
  b: (color: string, size: number = 1, style: string = 'solid') => ({
    borderWidth: size,
    borderColor: colors[color] || (color as string),
    borderStyle: style as any,
  } as AnyStyle),
  bb: (color: string, size: number = 1, style: string = 'solid') => ({
    borderBottomWidth: size,
    borderBottomColor: colors[color] || (color as string),
    borderStyle: style as any,
  } as AnyStyle),
  bt: (color: string, size: number = 1, style: string = 'solid') => ({
    borderTopWidth: size,
    borderTopColor: colors[color] || (color as string),
    borderStyle: style as any,
  } as AnyStyle),
  bl: (color: string, size: number = 1, style: string = 'solid') => ({
    borderLeftWidth: size,
    borderLeftColor: colors[color] || (color as string),
    borderStyle: style as any,
  } as AnyStyle),
  br: (color: string, size: number = 1, style: string = 'solid') => ({
    borderRightWidth: size,
    borderRightColor: colors[color] || (color as string),
    borderStyle: style as any,
  } as AnyStyle),
  r: (val: number) => ({ borderRadius: val } as AnyStyle),
  tr: (val: number) => ({ borderTopRightRadius: val, borderTopLeftRadius: val } as AnyStyle),
  c: (val: string) => ({ color: colors[val] || val } as AnyStyle),
  f: (val: number, ...v: string[]) => {
    if (!v.length) return { fontSize: val } as AnyStyle;
    if (v.length === 1) {
      return {
        fontSize: val,
        color: colors[v[0]] || v[0],
      } as AnyStyle;
    }
    return {} as AnyStyle;
  },
  t: (val: string) => ({ textAlign: val } as AnyStyle),
  ls: (val: number) => ({ letterSpacing: val } as AnyStyle),
  uc: () => ({ textTransform: 'uppercase' } as AnyStyle),
  u: () => ({ textDecorationLine: 'underline' } as AnyStyle),
  underline: () => ({ textDecorationLine: 'underline' } as AnyStyle),
  lh: (val: number) => ({ lineHeight: val } as AnyStyle),
  semi: () => ({ fontWeight: '600' } as AnyStyle),
  bold: () => ({ fontWeight: 'bold' } as AnyStyle),
  fw: (val: TextStyle['fontWeight']) => ({ fontWeight: val } as AnyStyle),
  bg: (val: string) => ({ backgroundColor: colors[val] || val } as AnyStyle),
  clear: () => ({ backgroundColor: 'transparent' } as AnyStyle),
  of: (val: ViewStyle['overflow']) => ({ overflow: val } as AnyStyle),
  ofh: () => ({ overflow: 'hidden' } as AnyStyle),
  o: (val: number) => ({ opacity: val / 100 } as AnyStyle),
  opacity: (val: number) => ({ opacity: val / 100 } as AnyStyle),
  abs: (...vs: (number | undefined)[]) => {
    const out: AnyStyle = { position: 'absolute' } as AnyStyle;
    if (vs[0] !== undefined) (out as any).top = vs[0];
    if (vs[1] !== undefined) (out as any).right = vs[1];
    if (vs[2] !== undefined) (out as any).bottom = vs[2];
    if (vs[3] !== undefined) (out as any).left = vs[3];
    return out;
  },
  bottom: (val: number) => ({ bottom: val } as AnyStyle),
  top: (val: number) => ({ top: val } as AnyStyle),
  left: (val: number) => ({ left: val } as AnyStyle),
  right: (val: number) => ({ right: val } as AnyStyle),
};

function shortenJustify(val: string): ViewStyle['justifyContent'] {
  if (val === 'between') return 'space-between';
  if (val === 'around') return 'space-around';
  return val as ViewStyle['justifyContent'];
}

// Dev-only warnings
declare const __DEV__: boolean | undefined;
function isDev(): boolean {
  // RN provides __DEV__
  if (typeof __DEV__ !== 'undefined') return !!__DEV__;
  // Fallback for tests/node
  const g: any = (globalThis as any);
  const env = g && g.process && g.process.env && g.process.env.NODE_ENV;
  return env !== 'production';
}

const warned = new Set<string>();
function warnUnknownToken(token: string) {
  if (!isDev()) return;
  if (warned.has(token)) return;
  warned.add(token);
  // eslint-disable-next-line no-console
  console.warn(`[mingled] Unknown token '${token}' was ignored.`);
}

// function isRightMedia(val) {
//   if (!val) return true;
//   if (val === 'ios' && Platform.OS === 'ios') return true;
//   if (val === 'android' && Platform.OS === 'android') return true;
//   if (val === 'droid' && Platform.OS === 'android') return true;
// }
//todo: shadows
//merge styles
//conditional styles
//colors/variables
