import { expect, it } from 'vitest';
import { canNarrate } from './audio';
it('requires working speech methods and a constructor, not just property names', () => {
  expect(canNarrate({})).toBe(false);
  expect(canNarrate({speechSynthesis:undefined, SpeechSynthesisUtterance:undefined})).toBe(false);
  expect(canNarrate({speechSynthesis:{speak:()=>{},cancel:()=>{}},SpeechSynthesisUtterance:undefined})).toBe(false);
  expect(canNarrate({speechSynthesis:{speak:()=>{},cancel:()=>{}},SpeechSynthesisUtterance:class {}})).toBe(true);
});
