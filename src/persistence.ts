import { roleIds, missions } from './content';
import { createGame, transition, currentArtwork, branchOptions, type GameState } from './game';
export const COOKIE_NAME = 'cluezeum_progress_v1';
interface CookieDocument { cookie: string }
export function encodeProgress(s: GameState): string { return encodeURIComponent(JSON.stringify(s)); }
export function decodeProgress(value: string): GameState | null {
  if(value.length > 3500) return null;
  try {
    const raw = JSON.parse(decodeURIComponent(value));
    if(!raw || raw.v !== 1 || !roleIds.includes(raw.role) || typeof raw.audio !== 'boolean' || !Array.isArray(raw.route) || !Array.isArray(raw.answers) || !Array.isArray(raw.choices) || raw.route.length > 5 || raw.answers.length > 5 || raw.choices.length > 2) return null;
    // Replay a short, bounded path. Only states reachable through the actual game can load.
    let s = {...createGame(raw.role), audio:raw.audio};
    for(let step = 0; step < 32; step++) {
      if(s.stage === raw.stage && JSON.stringify(s.route) === JSON.stringify(raw.route) && JSON.stringify(s.answers) === JSON.stringify(raw.answers) && JSON.stringify(s.choices) === JSON.stringify(raw.choices)) return s;
      const id = currentArtwork(s);
      if(s.stage === 'ending') return null;
      if(s.stage === 'find') s = transition(s,{type:'tap',artwork:id});
      else if(s.stage === 'observe') s = transition(s,{type:'answer-mode'});
      else if(s.stage === 'answer') s = transition(s,{type:'answer',index:missions[s.role][id].correct});
      else if(s.stage === 'feedback') s = transition(s,{type:'continue'});
      else {
        const next = raw.choices[s.choices.length];
        if(!branchOptions(s).includes(next)) return null;
        s = transition(s,{type:'choose',artwork:next});
      }
    }
  } catch { /* Invalid cookies never prevent starting a new story. */ }
  return null;
}
function readCookie(doc: CookieDocument) {
  return doc.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length+1);
}
export function loadProgress(doc: CookieDocument = document): {state: GameState|null; invalid: boolean} {
  try {
    const value = readCookie(doc);
    const state = value ? decodeProgress(value) : null;
    return {state,invalid:value !== undefined && !state};
  } catch { return {state:null,invalid:false}; }
}
function suffix(path: string, secure: boolean, age: number) { return `; Path=${path}; Max-Age=${age}; SameSite=Lax${secure ? '; Secure' : ''}`; }
export function saveProgress(s: GameState, doc: CookieDocument = document, path = import.meta.env.BASE_URL, secure = location.protocol === 'https:'): boolean {
  try {
    const value = encodeProgress(s);
    if(value.length > 3500) return false;
    doc.cookie = `${COOKIE_NAME}=${value}${suffix(path,secure,2592000)}`;
    return readCookie(doc) === value;
  } catch { return false; }
}
export function clearProgress(doc: CookieDocument = document, path = import.meta.env.BASE_URL, secure = location.protocol === 'https:'): boolean {
  try {
    doc.cookie = `${COOKIE_NAME}=${suffix(path,secure,0)}`;
    return readCookie(doc) === undefined;
  } catch { return false; }
}
