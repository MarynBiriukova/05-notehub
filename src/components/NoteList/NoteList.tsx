import css from './NoteList.module.css'
import type { Note } from '../../types/note';

interface NoteListProps{
    notes: Note[];
    handleUpdate?: (note: Note) => void;
    handleDelete: (id: string) => void;
}
    
function NoteList({ notes,  handleDelete }: NoteListProps) {//handleUpdate,

    return (
        <ul className={css.list}>
            {/* Набір елементів списку нотаток */}
            {notes.map((note) => (
                <li className={css.listItem} key = {note.id}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button type='button' className={css.button} onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                </li>))}
  
        </ul>

    );
}

export default NoteList 
