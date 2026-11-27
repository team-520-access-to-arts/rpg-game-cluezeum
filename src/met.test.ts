import { expect, it } from 'vitest';
import { createGame, transition, currentArtwork, branchOptions, getEnding } from './game';
import { missions, roleIds } from './content';
import { decodeProgress, encodeProgress } from './persistence';

it('Met routes visit seven distinct works, preserve progress at every stage, and produce role-specific endings', () => {
 const endings = new Set<string>();
 for(const role of roleIds) for(const picks of [[0,0],[0,1],[1,0],[1,1]]) {
  let s = createGame(role, 'met'), branch = 0;
  expect(currentArtwork(s)).toBe('met-dawn');
  for(let step=0; step<45; step++) {
   expect(decodeProgress(encodeProgress(s))).toEqual(s);
   expect(encodeProgress(s).length).toBeLessThan(3500);
   if(s.stage==='ending') break;
   const id=currentArtwork(s);
   expect(transition(s,{type:'tap',artwork:'starry'})).toEqual(s);
   if(s.stage==='find') s=transition(s,{type:'tap',artwork:id});
   else if(s.stage==='observe') s=transition(s,{type:'answer-mode'});
   else if(s.stage==='answer') {
    const correct=missions[role][id].correct;
    expect(transition(s,{type:'answer',index:(correct+1)%3})).toEqual(s);
    s=transition(s,{type:'answer',index:correct});
   } else if(s.stage==='feedback') s=transition(s,{type:'continue'});
   else {
    expect(branchOptions(s)).toHaveLength(2);
    expect(transition(s,{type:'choose',artwork:'olive'})).toEqual(s);
    s=transition(s,{type:'choose',artwork:branchOptions(s)[picks[branch++]]});
   }
  }
  expect(s.stage).toBe('ending');
  expect([...s.route].sort()).toEqual(['met-dawn','met-sunset','met-paris','met-sea','met-gouache','met-clouds','met-sketch'].sort());
  expect(s.answers).toHaveLength(7);
  expect(s.choices).toHaveLength(2);
  endings.add(getEnding(s).title);
 }
 expect(endings.size).toBe(8);
});
it('loads legacy Van Gogh saves but rejects unknown chapters and mixed chapter routes', () => {
 const old=createGame('detective');
 expect(decodeProgress(encodeProgress(old))).toEqual(old);
 for(const bad of [{...old,chapter:'unknown'},{...old,chapter:'met'},{...createGame('artist','met'),route:['starry']}]) {
  expect(decodeProgress(encodeURIComponent(JSON.stringify(bad)))).toBeNull();
 }
});
