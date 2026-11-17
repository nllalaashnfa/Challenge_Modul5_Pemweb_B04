
import type { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

export default function NoteCard({
  note,
  onDelete,
}: NoteCardProps) {
  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        <span className="category">{note.category}</span>
      </div>

      <p>{note.content}</p>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(note.id)}
      >
        Hapus
      </button>
    </div>
  );
}
