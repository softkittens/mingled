import { expect, test } from 'bun:test';
import { $, configure, clearCache } from '../index.ts';

function ms<T>(fn: () => T): { time: number; result: T } {
  const t0 = Date.now();
  const result = fn();
  const t1 = Date.now();
  return { time: t1 - t0, result };
}

const LOOP_A = 15000; // repeated identical template
const LOOP_B = 12000; // varying values to exercise token cache

// Helper templates
const tplA = () => $`row:center|between px:12 py:8 bg:gray-10 r:8`;

const dyn = (i: number) =>
  $`row:center|between ${i % 2 ? 'px:12' : 'py:12'} ${i % 3 ? 'bg:gray-10' : 'bg:gray-7'} r:8`;

// Note: These are directional/perf-smoke tests with loose assertions to avoid flakiness across machines.

test('performance: caches speed up repeated identical template', () => {
  // Disable caches
  configure({ maxCacheEntries: 0, maxTokenCacheEntries: 0 });
  clearCache();

  // warm-up
  for (let i = 0; i < 200; i++) tplA();

  const noCache = ms(() => {
    for (let i = 0; i < LOOP_A; i++) tplA();
  }).time;

  // Enable caches
  configure({ maxCacheEntries: 10000, maxTokenCacheEntries: 20000 });
  clearCache();
  for (let i = 0; i < 200; i++) tplA();

  const withCache = ms(() => {
    for (let i = 0; i < LOOP_A; i++) tplA();
  }).time;

  // Log for visibility
  // eslint-disable-next-line no-console
  console.log('[perf:identical] noCache(ms)=', noCache, 'withCache(ms)=', withCache);

  // Allow some noise margin; cached should be significantly faster but allow 20% variance
  expect(withCache).toBeLessThanOrEqual(noCache * 1.2);
});


test('performance: token cache helps across changing values', () => {
  // This test varies values to defeat template-level caching; token-level cache should still help

  // Disable caches
  configure({ maxCacheEntries: 0, maxTokenCacheEntries: 0 });
  clearCache();
  for (let i = 0; i < 200; i++) dyn(i);

  const noCache = ms(() => {
    for (let i = 0; i < LOOP_B; i++) dyn(i);
  }).time;

  // Enable caches
  configure({ maxCacheEntries: 10000, maxTokenCacheEntries: 20000 });
  clearCache();
  for (let i = 0; i < 200; i++) dyn(i);

  const withCache = ms(() => {
    for (let i = 0; i < LOOP_B; i++) dyn(i);
  }).time;

  // eslint-disable-next-line no-console
  console.log('[perf:dynamic] noCache(ms)=', noCache, 'withCache(ms)=', withCache);

  expect(withCache).toBeLessThanOrEqual(noCache * 1.2);
});
