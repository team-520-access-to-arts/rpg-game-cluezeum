import { Triangle, Circle, Square } from 'lucide-react';
import type { ReactNode } from 'react';
export interface Control {label:string; action:()=>void; disabled?:boolean}
const shapes = [Triangle,Circle,Square];
const names = ['Triangle','Circle','Square'];
export function Device({children,controls,heading='MUSEUM RPG',progress='FIELD UNIT 01',preview=false}:{children:ReactNode;controls:Control[];heading?:string;progress?:string;preview?:boolean}) {
 return <div className={`device ${preview?'preview-device':''}`}>
  <div className="device-top"><span className="led">CLUEZEUM / 01</span><span className="speaker" aria-hidden="true"><i/><i/><i/><i/><i/></span></div>
  <div className="screen"><div className="screen-top"><span>{heading}</span><span>{progress}</span></div>{children}</div>
  <div className="physical-controls">{controls.map((control,i)=>{const Shape=shapes[i];return <div key={i}><button className={`physical ${['red','yellow','blue'][i]}`} aria-label={`${names[i]}: ${control.label}`} title={`${names[i]} · ${control.label} · Key ${i+1}`} disabled={control.disabled} onClick={control.action}><Shape aria-hidden="true"/></button><span className="button-label">{control.label}</span></div>})}</div>
  <div className="device-brand">LOOK UP. LOOK CLOSER.</div>
 </div>;
}
