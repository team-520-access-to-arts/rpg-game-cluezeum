import { artworks, type ArtworkId } from '../content';
export function ArtworkIntroduction({id}:{id:ArtworkId}) {
 const art=artworks[id];
 return <div className="art-introduction"><div className="eyebrow">ARTWORK INTRODUCTION · MUSEUM SOURCE</div><p>{art.detail}</p><a href={art.source} target="_blank" rel="noreferrer">Source: {art.museum??'MoMA'} collection record</a><p className="small">{art.status}<br/>Checked {art.checked??'November 13, 2026'}.</p></div>;
}
