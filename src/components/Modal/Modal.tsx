import { createPortal } from 'react-dom'
import css from './Modal.module.css'
//import NoteForm from '../NoteForm/NoteForm'
import { useEffect } from 'react';

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {

    useEffect(() => {

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);


    return createPortal(
   /*********************************************************** */   
<div
  className={css.backdrop}
  role="dialog"
            aria-modal="true"
            onClick={onClose}
>
  <div className={css.modal} onClick={(e) =>e.stopPropagation()}>
                {children}
                
  </div>
</div>,

    document.getElementById('modal-root') as HTMLDivElement,
  )
}