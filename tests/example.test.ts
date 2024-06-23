import { expect, test } from 'bun:test';
import { parse } from '../src/parser.ts';

test('2 + 2', () => {
  expect(2 + 2).toBe(4);
});

test('parse center', () => {
  
  expect(parse`center`).toEqual({
    alignItems: 'center',
    justifyContent: 'center',
  });

});
