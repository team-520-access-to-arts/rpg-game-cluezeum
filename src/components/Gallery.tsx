import { Maximize2, Radio, ArrowRight } from 'lucide-react';
import { artworks, artworkIds, imageUrl, type ArtworkId } from '../content';
export function Gallery({selected,onSelect,onEnlarge,onTap,completed,stage}:{selected:ArtworkId;onSelect:(id:ArtworkId)=>void;onEnlarge:(id:ArtworkId)=>void;onTap:(id:ArtworkId)=>void;completed:ArtworkId[];stage:string}) {
 const art=artworks[selected];
 return <section className="gallery-panel" aria-label="Virtual exhibition artwork">
  <div className="gallery-art"><img src={imageUrl(selected)} alt={art.alt}/><button className="enlarge-button" onClick={()=>onEnlarge(selected)} aria-label={`Enlarge ${art.title}`}><Maximize2 size={17}/></button></div>
  <div className="art-caption"><div><h2>{art.title}</h2><p>Vincent van Gogh · {art.date} · {art.medium}</p></div><span className="caption-no">{String(artworkIds.indexOf(selected)+1).padStart(2,'0')} / 05</span></div>
  {stage==='find'&&<button className="tag-button" onClick={()=>onTap(selected)} aria-label={`Simulate tap: ${art.title}`}><Radio size={24}/><span className="tag-copy">Tap into this artwork<small>NFC simulation · virtual exhibition</small></span><ArrowRight size={18}/></button>}
  <div className="gallery-thumbnails" aria-label="Browse five artworks">{artworkIds.map(id=><button className={`gallery-thumb ${selected===id?'active':''}`} key={id} aria-label={`View ${artworks[id].title}`} aria-pressed={selected===id} onClick={()=>onSelect(id)}><img src={imageUrl(id)} alt=""/>{completed.includes(id)&&<span aria-label="Clue collected">✓</span>}</button>)}</div>
  <p className="gallery-help">A virtual exhibition of MoMA collection works. Select an image to look closer.</p>
 </section>;
}
