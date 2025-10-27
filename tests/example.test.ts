import { expect, test } from 'bun:test';
import { parse } from '../src/parser.ts';

test('parse center', () => {
  
  expect(parse`center`).toEqual({
    alignItems: 'center',
    justifyContent: 'center',
  });

});
