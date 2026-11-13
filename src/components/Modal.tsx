import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}) {
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current!;const previous=document.activeElement as HTMLElement|null;el.showModal();return ()=>{el.close();previous?.focus();};},[]);
 return <dialog ref={ref} className={`modal ${wide?'art-modal':''}`} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}} aria-labelledby="dialog-title">
  <div className="modal-header"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20}/></button></div><div className="modal-body">{children}</div>
 </dialog>;
}
