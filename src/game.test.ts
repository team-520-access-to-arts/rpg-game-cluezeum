import { describe, it, expect } from 'vitest';
import { createGame, transition, branchOptions, currentArtwork, getEnding } from './game';
import { roles, missions, artworkIds } from './content';

describe('five-stop stories', () => {
  const endings = new Set<string>();
  for (const role of ['detective', 'collector', 'artist', 'roulin'] as const) {
    for (const choices of [[0,0],[0,1],[1,0],[1,1]]) {
      it(`${role} completes route ${choices}`, () => {
        let s = createGame(role);
        let branch = 0;
        for (let stop = 0; stop < 5; stop++) {
          const id = currentArtwork(s);
          expect(s.stage).toBe('find');
          expect(transition(s, {type:'tap', artwork: id === 'starry' ? 'olive' : 'starry'})).toEqual(s);
          s = transition(s, {type:'tap', artwork:id});
          s = transition(s, {type:'answer-mode'});
          const correct = missions[role][id].correct;
          const wrong = transition(s, {type:'answer', index:(correct + 1) % 3});
          expect(wrong.stage).toBe('answer');
          expect(wrong.answers).toHaveLength(stop);
          s = transition(wrong, {type:'answer', index:correct});
          expect(s.stage).toBe('feedback');
          expect(transition(s, {type:'answer', index:correct})).toEqual(s);
          s = transition(s, {type:'continue'});
          if (s.stage === 'branch') {
            const options = branchOptions(s);
            expect(options).toHaveLength(2);
            s = transition(s, {type:'choose', artwork:options[choices[branch++]]});
          }
        }
        expect(s.stage).toBe('ending');
        expect(new Set(s.route).size).toBe(5);
        expect([...s.route].sort()).toEqual([...artworkIds].sort());
        expect(s.answers).toHaveLength(5);
        expect(s.choices).toHaveLength(2);
        endings.add(getEnding(s).title);
      });
    }
  }
  it('offers eight different conclusions', () => expect(endings.size).toBe(8));
  it('has distinct mission copy for all twenty role/work pairs', () => {
    expect(Object.keys(roles)).toHaveLength(4);
    expect(new Set(Object.values(missions).flatMap(m => Object.values(m).map(q => q.prompt))).size).toBe(20);
  });
  it('ignores input in the wrong stage', () => {
    const s = createGame('detective');
    expect(transition(s, {type:'continue'})).toEqual(s);
    expect(transition(s, {type:'answer', index:0})).toEqual(s);
    expect(transition(s, {type:'choose', artwork:'gachet'})).toEqual(s);
  });
});
