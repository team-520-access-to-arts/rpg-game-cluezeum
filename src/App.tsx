import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, Clock3, Eye, Fingerprint, Frame, Headphones, Mail, MapPin, Maximize2, Pause, PenTool, Radio, Search, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { artworks, artworkIds, imageUrl, missions, roles, roleIds, type ArtworkId, type RoleId } from './content';
import { createGame, transition, currentArtwork, branchOptions, getEnding, type Action, type GameState } from './game';
import { canNarrate } from './audio';
import { clearProgress, loadProgress, saveProgress } from './persistence';
import { Device, type Control } from './components/Device';
import { Gallery } from './components/Gallery';
import { Modal } from './components/Modal';
const roleIcons = {detective:Search,collector:Frame,artist:PenTool,roulin:Mail};
type Dialog = 'about'|'journal'|'restart'|'audio'|ArtworkId|null;
type Page = 'home'|'roles'|'play';
export default function App() {
 const [loaded] = useState(()=>loadProgress());
 const [game,setGame] = useState<GameState|null>(loaded.state);
 const [page,setPage] = useState<Page>('home');
 const [roleIndex,setRoleIndex] = useState(0);
 const [dialog,setDialog] = useState<Dialog>(null);
 const [selected,setSelected] = useState<ArtworkId>('starry');
 const [hint,setHint] = useState(false);
 const [message,setMessage] = useState('');
 const [saved,setSaved] = useState(true);
 const [audio,setAudio] = useState(loaded.state?.audio??false);
 const [audioMessage,setAudioMessage] = useState('');
 const [zoom,setZoom] = useState(false);
 const titleRef = useRef<HTMLHeadingElement>(null);
 const speechAvailable = typeof window !== 'undefined' && canNarrate(window);
 const active = page==='play' && game;
 const id = game?currentArtwork(game):'starry';
 const mission = game?missions[game.role][id]:missions.detective.starry;
 const role = roleIds[roleIndex];
 const speak = (text:string) => {
   if(!speechAvailable){setAudioMessage('Audio is unavailable in this browser. Every mission and hint is also written on screen.');return;}
   window.speechSynthesis.cancel();
   const utterance=new SpeechSynthesisUtterance(text); utterance.rate=.9;
   utterance.onerror=(e)=>{if(e.error!=='canceled'&&e.error!=='interrupted')setAudioMessage('Narration could not play. You can continue with the text on screen.');};
   window.speechSynthesis.speak(utterance);
 };
 const stopAudio=()=>{if(speechAvailable)window.speechSynthesis.cancel();};
 const narration = game?.stage==='find'?`Find ${artworks[id].title}. Activate the simulated tag when you are ready.`:game?.stage==='feedback'?mission.explanation:game?.stage==='ending'&&game?getEnding(game).text:`${mission.title}. ${mission.prompt} ${mission.question}`;
 useEffect(()=>{if(active&&game)setSaved(saveProgress(game));},[game,page]);
 useEffect(()=>{setSelected(id);setHint(false);setMessage('');},[id]);
 useEffect(()=>{setHint(false);setMessage('');titleRef.current?.focus({preventScroll:true});},[page,game?.stage,id]);
 useEffect(()=>{if(active&&audio){speak(narration);}return stopAudio;},[page,game?.stage,id,audio]);
 useEffect(()=>{setZoom(false);},[dialog]);
 const dispatch=(action:Action)=>setGame(s=>s?transition(s,action):s);
 const begin=()=>{stopAudio();if(game){setDialog('restart');}else setPage('roles');};
 const resume=()=>{setPage('play');setSelected(id);};
 const start=()=>{if(game){setDialog('restart');return;}setGame({...createGame(role),audio});setPage('play');setSelected('starry');window.scrollTo({top:0});};
 const openArt=(art:ArtworkId)=>setDialog(art);
 const showHint=()=>{setHint(v=>!v);if(audio&&!hint)speak(mission.hint);};
 const answer=(index:number)=>{if(index!==mission.correct){setMessage('Take another look. There’s no penalty—follow the detail and try again.');return;}setMessage('');dispatch({type:'answer',index});};
 const tap=(art:ArtworkId)=>{if(art!==id){setMessage(`Your current lead is ${artworks[id].title}. Find its image, then tap its tag.`);return;}dispatch({type:'tap',artwork:art});};
 const viewQuest=()=>{setSelected(id);openArt(id);};
 const choices=game?branchOptions(game).sort((a,b)=>artworks[a].theme==='form'?-1:artworks[b].theme==='form'?1:0):[];
 const choiceLabel=(art:ArtworkId)=>art==='olive'?'Follow the landscape':art==='roulin'?'Follow the person':art==='gachet'?'Follow the line':'Follow the gathering';
 let controls:Control[] = [{label:'Observe',action:()=>openArt('starry')},{label:'Hint',action:()=>setDialog('about')},{label:game?'Resume':'Begin',action:game?resume:begin}];
 if(page==='roles')controls=[{label:'Previous',action:()=>setRoleIndex(v=>(v+3)%4)},{label:'Next role',action:()=>setRoleIndex(v=>(v+1)%4)},{label:'Choose role',action:start}];
 if(active&&game){
  if(game.stage==='find')controls=[{label:'Observe',action:viewQuest},{label:'Hint',action:showHint},{label:'Tap artwork',action:()=>tap(id)}];
  if(game.stage==='observe')controls=[{label:'Observe',action:viewQuest},{label:'Hint',action:showHint},{label:'Answer',action:()=>dispatch({type:'answer-mode'})}];
  if(game.stage==='answer')controls=mission.options.map((label,index)=>({label,action:()=>answer(index)}));
  if(game.stage==='feedback')controls=[{label:'Look again',action:viewQuest},{label:'Journal',action:()=>setDialog('journal')},{label:'Continue',action:()=>dispatch({type:'continue'})}];
  if(game.stage==='branch')controls=[...choices.map(art=>({label:choiceLabel(art),action:()=>dispatch({type:'choose',artwork:art})})),{label:'Journal',action:()=>setDialog('journal')}];
 }
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(dialog||e.repeat||e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)||game?.stage==='ending'&&page==='play')return;const n=Number(e.key)-1;if(n>=0&&n<3){e.preventDefault();controls[n]?.action();}};window.addEventListener('keydown',onKey);return ()=>window.removeEventListener('keydown',onKey);});
 const reset=()=>{stopAudio();const cleared=clearProgress();setGame(null);setAudio(false);setPage('roles');setDialog(null);setSaved(cleared);setMessage(cleared?'':'Your browser could not clear the save. Clear this site’s cookies to remove it.');window.scrollTo({top:0});};
 const enableAudio=()=>{setAudio(true);if(game)dispatch({type:'audio',enabled:true});setDialog(null);speak(active?narration:'Audio is on. Take your time, and look closely.');};
 const toggleAudio=()=>{if(audio){stopAudio();setAudio(false);if(game)dispatch({type:'audio',enabled:false});}else setDialog('audio');};
 const completed=game?game.route.slice(0,game.answers.length):[];
 const ending=game?getEnding(game):null;
 return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header"><button className="brand" aria-label="Cluezeum home" onClick={()=>{stopAudio();setPage('home');}}><span className="brand-symbols" aria-hidden="true"><i/><i/><i/></span>cluezeum</button><div className="header-right"><span className="header-note">A little device. A bigger adventure.</span><nav className="header-buttons" aria-label="Main navigation"><button className="text-button" onClick={()=>setDialog('about')} aria-label="About this exhibition"><BookOpen size={15}/>The exhibition</button>{game&&<button className="text-button" onClick={()=>setDialog('journal')} aria-label="Open journal"><Frame size={15}/>Your journal</button>}<button className="text-button" onClick={toggleAudio} aria-label={audio?'Turn audio off':'Enable audio'}>{audio?<Volume2 size={16}/>:<Headphones size={16}/>}<span>{audio?'Audio on':'Audio off'}</span></button></nav></div></header>
  <main id="main" className="page-wrap">
  {page==='home'&&<>
   {loaded.invalid&&!game&&<p className="notice">Your previous save could not be read. You can start a fresh story below.</p>}
   <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="dot"/>THE VAN GOGH CHAPTER · A MUSEUM RPG</div><h1 ref={titleRef} tabIndex={-1} className="page-title">A little curiosity.<br/>A whole new<br/><em>way to see.</em></h1><p>Step into the art. Follow a clue. Make the story your own. An adventure for those who look a little closer.</p><button className="primary" onClick={game?resume:begin}>{game?'Resume your story':'Begin your story'}<ArrowRight size={18}/></button><div className="hero-meta"><span><Frame size={13}/>5 artworks</span><span><Clock3 size={13}/>10–15 minutes</span><span>No account needed</span></div></div>
   <div className="hero-stage"><span className="orbit-word">LESS SCROLLING.<br/>MORE WONDER.</span><Device controls={controls} progress="QUEST 01" preview><img className="preview-art" src={imageUrl('starry')} alt="Monochrome preview of The Starry Night"/><h2>The cypress clue</h2><p>Find the tall, dark tree.<br/>Where does it lead your eye?</p><div className="screen-legend"><span>△ OBSERVE</span><span>○ HINT</span><span>□ BEGIN</span></div></Device><span className="star-doodle" aria-hidden="true">✳</span></div></section>
   <section className="how-it-works" aria-label="How to play">{[['01','Pick your perspective','A detective, a collector, an artist, a messenger. Every role sees a different story.'],['02','Let the art lead you','Find details in real artworks. Three simple buttons help you follow the clues.'],['03','Leave with your own story','Choose your path. Collect connections. Discover an ending shaped by you.']].map(([n,title,copy])=><div className="how-step" key={n}><span className="step-num">{n}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</section>
   <section className="collection-strip"><div className="section-line"><h2>Five works. Countless things to notice.</h2><span className="mono">VINCENT VAN GOGH<br/>THE MoMA COLLECTION</span></div><div className="collection-items">{artworkIds.map(art=><button className="art-card" key={art} onClick={()=>openArt(art)} aria-label={`Explore ${artworks[art].title}`}><img src={imageUrl(art)} alt={artworks[art].alt}/><span className="art-title">{artworks[art].title}</span><span className="art-year">{artworks[art].date} ↗</span></button>)}</div></section>
  </>}
  {page==='roles'&&<>
   <div className="section-heading"><div><div className="eyebrow"><span className="dot"/>01 / CHOOSE YOUR PERSPECTIVE</div><h1 ref={titleRef} tabIndex={-1} className="page-title">Who will you become?</h1><p>The same five artworks. Four different ways to see them.</p></div></div>
   {message&&<p className="notice" role="status">{message}</p>}
   <div className="role-grid">{roleIds.map((r,i)=>{const Icon=roleIcons[r];return <button key={r} className={`role-card ${roleIndex===i?'selected':''}`} aria-label={`Choose ${roles[r].label}`} aria-pressed={roleIndex===i} onClick={()=>setRoleIndex(i)}><span className="role-icon"><Icon size={23}/></span>{roleIndex===i&&<Check size={17} className="selected-tick"/>}<h2>{roles[r].name}</h2><p>{roles[r].subtitle}</p></button>})}</div>
   <div className="role-bottom"><div className="role-story"><div className="eyebrow">YOUR STORY BEGINS HERE</div><h2>{role==='roulin'?'An imagined postcard trail':'The thread between things'}</h2><p>{roles[role].story}</p><button className="primary" onClick={start}>Start adventure<ArrowRight size={18}/></button><p className="gallery-help">Fictional adventures. Real artworks. No specialist knowledge needed.</p></div><Device controls={controls} heading="CHOOSE A ROLE" progress={`${roleIndex+1} / 4`}><h2>{roles[role].name}</h2><p>{roles[role].subtitle}</p><div className="screen-legend"><span>△ PREVIOUS</span><span>○ NEXT</span><span>□ CHOOSE</span></div></Device></div>
  </>}
  {active&&game&&game.stage!=='ending'&&<>
   <div className="play-heading"><div className="eyebrow"><span className="dot"/>{roles[game.role].name} · THE VAN GOGH CHAPTER</div><div className="progress-dots" aria-label={`${game.answers.length} of 5 clues collected`}><span>{game.answers.length} / 5 CLUES</span>{artworkIds.map((a,i)=><i key={a} className={i<game.answers.length?'done':''}/>)}</div></div>
   <div className="play-layout"><Gallery selected={selected} onSelect={setSelected} onEnlarge={openArt} onTap={tap} completed={completed} stage={game.stage}/><section className="play-device" aria-label="Museum handheld">
    <Device controls={controls} heading="MUSEUM RPG" progress={`QUEST ${String(game.route.length).padStart(2,'0')}`}>
     {game.stage==='find'&&<><Radio className="screen-icon" size={30}/><div className="screen-kicker">YOUR NEXT LEAD</div><h2 ref={titleRef} tabIndex={-1}>Find {artworks[id].title}</h2><p>{game.route.length===1?'Every story starts with a closer look.':`You collected “${missions[game.role][game.route[game.route.length-2]].clue}.” Now follow its connection to a new work.`}</p><p className="small">Select its image, then tap the artwork tag to begin.</p>{hint&&<p className="hint">Look for “{artworks[id].title}” in the five artwork thumbnails. This is a virtual visit; the tap is simulated.</p>}</>}
     {game.stage==='observe'&&<><div className="screen-kicker">LOOK FIRST. TAKE YOUR TIME.</div><h2 ref={titleRef} tabIndex={-1}>{mission.title}</h2><p className="mission-copy">{mission.prompt}</p><p className="question">{mission.question}</p>{hint&&<p className="hint"><strong>A little nudge: </strong>{mission.hint}</p>}</>}
     {game.stage==='answer'&&<><div className="screen-kicker">WHAT DID YOU NOTICE?</div><h2 ref={titleRef} tabIndex={-1}>{mission.title}</h2><p>{mission.question}</p><ul className="answer-options">{mission.options.map((o,i)=><li key={o}><span aria-hidden="true">{['△','○','□'][i]}</span>{o}</li>)}</ul></>}
     {game.stage==='feedback'&&<><Check className="screen-icon" size={31}/><h2 ref={titleRef} tabIndex={-1}>Clue collected</h2><div className="clue-chip"><Fingerprint size={20}/>{mission.clue}</div><p>{mission.explanation}</p><p className="small">Added to your journal. What will you connect it to?</p></>}
     {game.stage==='branch'&&<><div className="screen-kicker">YOUR PATH, YOUR STORY</div><h2 ref={titleRef} tabIndex={-1}>Which thread will you follow?</h2><p>{game.route.length===1?'Does your curiosity lead toward the movement of a place, or the story of a person?':'You have noticed both people and places. For your next lead, choose a way of looking.'}</p><ul className="answer-options">{choices.map((art,i)=><li key={art}><span aria-hidden="true">{['△','○'][i]}</span><div><strong>{choiceLabel(art)}</strong><br/>{artworks[art].title}<br/><small>{artworks[art].theme==='form'?'Explore shapes and marks.':'Explore a human connection.'}</small></div></li>)}</ul><p className="small">No wrong choice. Your next stop and ending follow your curiosity.</p></>}
     <div aria-live="polite">{message&&<p className="feedback-error">{message}</p>}</div>
    </Device>
    <div className="device-caption"><Eye size={13}/>The best part of the game is outside the screen.</div>
    <div className="device-tools">{game.stage==='answer'&&<button className="text-button" onClick={()=>dispatch({type:'observe'})}><Eye size={13}/>Look again / hint</button>}{audio&&<><button className="text-button" onClick={()=>speak(narration)}><Volume2 size={13}/>Replay</button><button className="text-button" onClick={stopAudio}><Pause size={13}/>Stop</button></>}<button className="text-button" onClick={()=>setDialog('restart')}>Restart</button></div>
    <p className={`save-status ${saved?'':'failed'}`} role="status">{saved?'Progress saved in this browser · Keys 1, 2, 3 also work':'Cookies unavailable. You can play, but progress will be lost on reload.'}</p>
    {audioMessage&&<p className="notice" role="status">{audioMessage}</p>}
   </section></div>
  </>}
  {active&&game&&game.stage==='ending'&&ending&&<section className="ending"><div className="eyebrow">FIVE WORKS. ONE STORY THAT IS YOURS.</div><div className="ending-medal"><Sparkles size={38} strokeWidth={1}/></div><h1 ref={titleRef} tabIndex={-1}>{ending.title}</h1><p>{ending.text}</p><div className="ending-path">{game.route.map((art,i)=><div key={art}><img src={imageUrl(art)} alt={artworks[art].title}/><span>CLUE 0{i+1}</span></div>)}</div><div className="ending-actions"><button className="primary" onClick={()=>setDialog('journal')}><BookOpen size={17}/>Read your journal</button><button className="secondary" onClick={()=>setDialog('restart')}>Start a new story<ArrowRight size={16}/></button></div><p className="look-away">Before you leave, look at your favorite work one more time.<br/>What do you see now that you didn’t see before?</p><p className={`save-status ${saved?'':'failed'}`}>{saved?'Your ending is saved in this browser for 30 days.':'Cookies unavailable. This ending will not survive a reload.'}</p></section>}
  </main>
  <footer className="footer"><p>An independent museum experience prototype. A virtual exhibition of MoMA collection works.</p><span>MADE FOR LOOKING, NOT SCROLLING.</span></footer>
  {dialog==='about'&&<Modal title="A few things to know" onClose={()=>setDialog(null)}><p>This is a <strong>virtual exhibition</strong> of five works by Vincent van Gogh in MoMA’s collection. It is an independent educational prototype, not an official MoMA experience.</p><p>Only <em>The Starry Night</em> and <em>The Olive Trees</em> were listed as on view when checked on November 13, 2026. Display status can change. The other three stops are virtual.</p><ul className="source-list">{artworkIds.map(art=><li key={art}><a href={artworks[art].source} target="_blank" rel="noreferrer">{artworks[art].title} <ArrowUpRight size={12}/></a><small>{artworks[art].date} · {artworks[art].medium}<br/>{artworks[art].status}<br/>{artworks[art].credit}</small></li>)}</ul><h3>Real art. Invented adventures.</h3><p>The stories and missions are original fiction. Artwork details are checked against MoMA’s records and images. The historical role is an imagined perspective inspired by Joseph Roulin, not a historical quotation or reenactment.</p><h3>Your handheld, in a browser</h3><p>Use the red triangle, yellow circle, and blue square—or keys 1, 2, and 3. The artwork tap simulates an NFC tag. Narration uses your browser’s voice; headphones are recommended. All prompts are readable without sound.</p><h3>Saved only here</h3><p>A small cookie saves your adventure for 30 days in this browser. No account or database is used. Clearing cookies removes your progress. Restarting deletes the current save.</p></Modal>}
  {dialog==='journal'&&<Modal title="Your field journal" onClose={()=>setDialog(null)}>{game?<><p>{roles[game.role].name} · {game.answers.length} of 5 clues collected</p>{completed.length===0?<p>Your journal is waiting for its first clue. Look closely at the first artwork to begin.</p>:<ol className="journal-list">{completed.map((art,i)=><li key={art}><img src={imageUrl(art)} alt=""/><div><div className="mono">CLUE 0{i+1} · {artworks[art].title}</div><h3>{missions[game.role][art].clue}</h3><p>{missions[game.role][art].explanation}</p></div></li>)}</ol>}{game.choices.length>0&&<><h3>The threads you followed</h3><p>{game.choices.map(art=>`${choiceLabel(art)} → ${artworks[art].title}`).join(' · ')}</p></>}</>:<p>Choose a role to start collecting your observations.</p>}</Modal>}
  {dialog==='restart'&&<Modal title="Begin another adventure?" onClose={()=>setDialog(null)}><p>This clears the current cookie save and journal. Choose another role to discover a different story.</p><div className="ending-actions"><button className="primary" onClick={reset}>Restart adventure</button><button className="secondary" onClick={()=>setDialog(null)}>Keep this story</button></div></Modal>}
  {dialog==='audio'&&<Modal title="A story in your ear" onClose={()=>setDialog(null)}><Headphones size={36} strokeWidth={1.3}/><p>Put on headphones before enabling narration in a museum. Your browser will read the missions and hints aloud. You can stop or replay at any time.</p><p>Every audio prompt also appears as text. This prototype cannot detect whether earphones are connected.</p>{speechAvailable?<button className="primary" onClick={enableAudio}>Enable narration<Volume2 size={16}/></button>:<p className="notice">Audio is unavailable in this browser. You can play the complete adventure using the text.</p>}</Modal>}
  {dialog&&artworkIds.includes(dialog as ArtworkId)&&(()=>{const art=dialog as ArtworkId;return <Modal title={artworks[art].title} onClose={()=>setDialog(null)} wide><div className={`image-zoom ${zoom?'zoomed':''}`} tabIndex={0} aria-label="Artwork image, scroll to inspect when enlarged"><img className="full-art" src={imageUrl(art)} alt={artworks[art].alt}/></div><div className="zoom-tools"><button className="text-button" onClick={()=>setZoom(v=>!v)}><Maximize2 size={15}/>{zoom?'Fit full artwork':'Enlarge details'}</button><p>Vincent van Gogh · {artworks[art].date}<br/>{artworks[art].medium}</p></div><p>{artworks[art].detail}</p><p className="small">{artworks[art].status} (checked November 13, 2026).<br/><a href={artworks[art].source} target="_blank" rel="noreferrer">View MoMA collection record ↗</a></p></Modal>})()}
 </>;
}
