import { parse, setColors, colors, configure, clearCache } from './src/parser.js';

export function $(styles: TemplateStringsArray, ...values: (string | number)[]) {
  return parse(styles, ...values);
}

export { setColors, colors, configure, clearCache };
