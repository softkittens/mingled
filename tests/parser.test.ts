import { expect, test } from 'bun:test';
import { parse } from '../src/parser.ts';

test('parse center', () => {
  
  expect(parse`center`).toEqual({
    alignItems: 'center',
    justifyContent: 'center',
  });

});

import { $, setColors, colors } from '../index.ts';

test('spacing shorthands: p, px/py, m variants', () => {
  expect(parse`p:16`).toEqual({ padding: 16 });
  expect(parse`p:12|16`).toEqual({ paddingVertical: 12, paddingHorizontal: 16 });
  expect(parse`p:1|2|3|4`).toEqual({ paddingTop: 1, paddingRight: 2, paddingBottom: 3, paddingLeft: 4 });
  expect(parse`mx:8 my:4`).toEqual({ marginHorizontal: 8, marginVertical: 4 });
});

test('layout: row, row:center|between, wrap, gap, jc/ai/self', () => {
  expect(parse`row`).toEqual({ flexDirection: 'row' });
  expect(parse`row:center|between`).toEqual({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' });
  expect(parse`wrap`).toEqual({ flexWrap: 'wrap' });
  expect(parse`gap:8`).toEqual({ gap: 8 });
  expect(parse`jc:around`).toEqual({ justifyContent: 'space-around' });
  expect(parse`ai:center`).toEqual({ alignItems: 'center' });
  expect(parse`self:flex-start`).toEqual({ alignSelf: 'flex-start' });
});

test('sizing: w/h and min/max', () => {
  expect(parse`w:100 h:50`).toEqual({ width: 100, height: 50 });
  expect(parse`min-w:10 max-h:20`).toEqual({ minWidth: 10, maxHeight: 20 });
});

test('borders: b, bb/bt/bl/br, radius', () => {
  const base = parse`b:gray-20|2|dashed`;
  expect(base).toEqual({ borderWidth: 2, borderColor: colors['gray-20'], borderStyle: 'dashed' });
  expect(parse`bb:#ff0000|3`).toEqual({ borderBottomWidth: 3, borderBottomColor: '#ff0000', borderStyle: 'solid' });
  expect(parse`bt:blue|1|dotted`).toEqual({ borderTopWidth: 1, borderTopColor: colors['blue'], borderStyle: 'dotted' });
  expect(parse`bl:gray-40|2`).toEqual({ borderLeftWidth: 2, borderLeftColor: colors['gray-40'], borderStyle: 'solid' });
  expect(parse`br:gray-50|2`).toEqual({ borderRightWidth: 2, borderRightColor: colors['gray-50'], borderStyle: 'solid' });
  expect(parse`r:8`).toEqual({ borderRadius: 8 });
  expect(parse`tr:8`).toEqual({ borderTopRightRadius: 8, borderTopLeftRadius: 8 });
});

test('typography: font size/color, weights, spacing, transform', () => {
  expect(parse`f:18`).toEqual({ fontSize: 18 });
  expect(parse`f:18|gray-60`).toEqual({ fontSize: 18, color: colors['gray-60'] });
  expect(parse`t:center`).toEqual({ textAlign: 'center' });
  expect(parse`ls:1`).toEqual({ letterSpacing: 1 });
  expect(parse`lh:24`).toEqual({ lineHeight: 24 });
  expect(parse`semi`).toEqual({ fontWeight: '600' });
  expect(parse`bold`).toEqual({ fontWeight: 'bold' });
  expect(parse`fw:700`).toEqual({ fontWeight: 700 });
  expect(parse`uc`).toEqual({ textTransform: 'uppercase' });
  expect(parse`u`).toEqual({ textDecorationLine: 'underline' });
  expect(parse`underline`).toEqual({ textDecorationLine: 'underline' });
});

test('colors: background and text resolve tokens and hex', () => {
  expect(parse`bg:gray-10`).toEqual({ backgroundColor: colors['gray-10'] });
  expect(parse`c:#333333`).toEqual({ color: '#333333' });
});

test('overflow and opacity', () => {
  expect(parse`of:hidden`).toEqual({ overflow: 'hidden' });
  expect(parse`ofh`).toEqual({ overflow: 'hidden' });
  expect(parse`o:50`).toEqual({ opacity: 0.5 });
  expect(parse`opacity:25`).toEqual({ opacity: 0.25 });
});

test('positioning: abs variants and side props', () => {
  expect(parse`abs`).toEqual({ position: 'absolute' });
  expect(parse`abs:10`).toEqual({ position: 'absolute', top: 10 });
  expect(parse`abs:10|20`).toEqual({ position: 'absolute', top: 10, right: 20 });
  expect(parse`abs:10|20|30`).toEqual({ position: 'absolute', top: 10, right: 20, bottom: 30 });
  expect(parse`abs:1|2|3|4`).toEqual({ position: 'absolute', top: 1, right: 2, bottom: 3, left: 4 });
  const one = parse`abs:10|20` as any;
  expect(Object.prototype.hasOwnProperty.call(one, 'left')).toBe(false);
});

test('numeric parsing accepts decimals and negatives', () => {
  expect(parse`ls:0.5`).toEqual({ letterSpacing: 0.5 });
  const op = parse`o:33.3` as any;
  expect(op.opacity).toBeCloseTo(0.333, 3);
  expect(parse`m:-4`).toEqual({ margin: -4 });
});

test('whitespace normalization across spaces and newlines', () => {
  expect(parse`  p:8   bg:gray-10  `).toEqual({ padding: 8, backgroundColor: colors['gray-10'] });
  expect(parse`p:8\n bg:gray-10`).toEqual({ padding: 8, backgroundColor: colors['gray-10'] });
});

test('$ returns plain style object consistent with parse', () => {
  const a = parse`p:8 bg:gray-10`;
  const b = $`p:8 bg:gray-10`;
  expect(b).toEqual(a);
});

test('setColors merge and replace', () => {
  const original = { ...colors };
  setColors({ brand: '#FF00FF', primary: '#000000' });
  expect(parse`bg:brand`).toEqual({ backgroundColor: '#FF00FF' });
  expect(parse`c:primary`).toEqual({ color: '#000000' });
  setColors(original, { replace: true });
  expect(parse`bg:gray-10`).toEqual({ backgroundColor: original['gray-10'] });
});
