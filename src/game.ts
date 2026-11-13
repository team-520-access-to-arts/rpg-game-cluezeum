import { artworkIds, artworks, missions, roles, type ArtworkId, type RoleId, type Theme } from './content';
export type Stage = 'find' | 'observe' | 'answer' | 'feedback' | 'branch' | 'ending';
export interface GameState { v: 1; role: RoleId; stage: Stage; route: ArtworkId[]; answers: number[]; choices: ArtworkId[]; audio: boolean }
export type Action = {type:'tap'; artwork:ArtworkId} | {type:'answer-mode'} | {type:'observe'} | {type:'answer'; index:number} | {type:'continue'} | {type:'choose'; artwork:ArtworkId} | {type:'audio'; enabled:boolean};
export function createGame(role: RoleId): GameState { return {v:1, role, stage:'find', route:['starry'], answers:[], choices:[], audio:false}; }
export function currentArtwork(s: GameState): ArtworkId { return s.route[s.route.length - 1]; }
export function branchOptions(s: GameState): ArtworkId[] {
  if(s.stage !== 'branch') return [];
  return s.route.length === 1 ? ['olive','roulin'] : artworkIds.filter(id => !s.route.includes(id));
}
export function transition(s: GameState, action: Action): GameState {
  if(action.type === 'audio') return {...s,audio:action.enabled};
  if(action.type === 'tap' && s.stage === 'find' && action.artwork === currentArtwork(s)) return {...s,stage:'observe'};
  if(action.type === 'answer-mode' && s.stage === 'observe') return {...s,stage:'answer'};
  if(action.type === 'observe' && s.stage === 'answer') return {...s,stage:'observe'};
  if(action.type === 'answer' && s.stage === 'answer' && action.index === missions[s.role][currentArtwork(s)].correct) return {...s,stage:'feedback',answers:[...s.answers,action.index]};
  if(action.type === 'continue' && s.stage === 'feedback') {
    const count = s.route.length;
    if(count === 5) return {...s,stage:'ending'};
    if(count === 1 || count === 3) return {...s,stage:'branch'};
    // The second stop leads to the complementary landscape/portrait; final stop is the remaining work.
    const next = count === 2 ? (currentArtwork(s) === 'olive' ? 'roulin' : 'olive') : artworkIds.find(id => !s.route.includes(id))!;
    return {...s,stage:'find',route:[...s.route,next]};
  }
  if(action.type === 'choose' && s.stage === 'branch' && branchOptions(s).includes(action.artwork)) return {...s,stage:'find',route:[...s.route,action.artwork],choices:[...s.choices,action.artwork]};
  return s;
}
export function getEnding(s: GameState) {
  const themes = s.choices.map(id => artworks[id].theme);
  const forms = themes.filter(t => t === 'form').length;
  const theme: Theme = forms > themes.length / 2 ? 'form' : forms < themes.length / 2 ? 'people' : themes.at(-1) ?? 'form';
  return {...roles[s.role].endings[theme], theme};
}
