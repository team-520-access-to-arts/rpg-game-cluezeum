import { expect, it } from 'vitest';
import { createGame, transition, currentArtwork, branchOptions, type GameState } from './game';
import { roleIds, missions } from './content';
import { encodeProgress, decodeProgress, saveProgress, loadProgress, clearProgress, COOKIE_NAME } from './persistence';

it('roundtrips every stage on every route within the cookie size limit', () => {
  for (const role of roleIds) for(const choices of [[0,0],[0,1],[1,0],[1,1]]) {
    let s = createGame(role), branch = 0;
    for(let step = 0; step < 35; step++) {
      s = {...s,audio:step % 2 === 0};
      const encoded = encodeProgress(s);
      expect(encoded.length).toBeLessThan(3000);
      expect(decodeProgress(encoded)).toEqual(s);
      const id = currentArtwork(s);
      if(s.stage === 'ending') break;
      if(s.stage === 'find') s = transition(s,{type:'tap',artwork:id});
      else if(s.stage === 'observe') s = transition(s,{type:'answer-mode'});
      else if(s.stage === 'answer') s = transition(s,{type:'answer',index:missions[s.role][id].correct});
      else if(s.stage === 'feedback') s = transition(s,{type:'continue'});
      else s = transition(s,{type:'choose',artwork:branchOptions(s)[choices[branch++]]});
    }
  }
});
it('rejects malformed and unreachable states', () => {
  const s = createGame('detective');
  for(const candidate of [null, [], {}, {...s,v:2}, {...s,role:'admin'}, {...s,stage:'ending'}, {...s,route:['gachet']}, {...s,answers:[99]}, {...s,choices:['starry']}, {...s,audio:'yes'}]) {
    expect(decodeProgress(encodeURIComponent(JSON.stringify(candidate)))).toBeNull();
  }
  expect(decodeProgress('%bad')).toBeNull();
  expect(decodeProgress('x'.repeat(4097))).toBeNull();
});
function jar() {
  let value = '';
  let last = '';
  return { get cookie(){return value;}, set cookie(v:string){last=v; value=v.includes('Max-Age=0;')?'':v.split(';')[0];}, get last(){return last;} };
}
it('saves with project path, lifetime and HTTPS flags and deletes on restart', () => {
  const doc = jar(), s = createGame('artist');
  expect(saveProgress(s,doc,'/rpg-game-cluezeum/',true)).toBe(true);
  expect(doc.last).toContain('Path=/rpg-game-cluezeum/;');
  expect(doc.last).toContain('Max-Age=2592000;');
  expect(doc.last).toContain('SameSite=Lax; Secure');
  expect(doc.cookie).toContain(COOKIE_NAME);
  expect(loadProgress(doc).state).toEqual(s);
  expect(clearProgress(doc,'/rpg-game-cluezeum/',true)).toBe(true);
  expect(doc.last).toContain('Max-Age=0;');
  expect(loadProgress(doc).state).toBeNull();
});
it('reports blocked saving and distinguishes invalid data from absent progress', () => {
  const blocked = {get cookie(){return '';},set cookie(_:string){}};
  expect(saveProgress(createGame('artist'),blocked,'/',false)).toBe(false);
  expect(loadProgress({cookie:`${COOKIE_NAME}=%bad`}).invalid).toBe(true);
  expect(loadProgress({cookie:''}).invalid).toBe(false);
  const throwing = {get cookie():string {throw new Error('blocked');},set cookie(_:string){throw new Error('blocked');}};
  expect(saveProgress(createGame('artist'),throwing,'/',false)).toBe(false);
  expect(loadProgress(throwing).state).toBeNull();
});
