
import { useEffect, useState } from "react";
import type { Note } from "./types/note";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import PostList from "./components/PostList";

const STORAGE_KEY = "notes";

// Baca catatan tersimpan; data rusak/kosong dianggap daftar kosong
const loadNotes = (): Note[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [search, setSearch] = useState("");

  // Simpan ke localStorage setiap catatan berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Fungsi menambahkan catatan
  const addNote = (
    title: string,
    content: string,
    category: string
  ) => {
    const newNote: Note = {
      id: Date.now(),
      title: title,
      content: content,
      category: category,
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  // Fungsi menghapus catatan
  const deleteNote = (id: number) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );
  };

  // Filter catatan berdasarkan judul
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <main className="container">
      <header>
        <h1>My Notes</h1>
        <p>Aplikasi Papan Catatan Lokal</p>
      </header>

      <NoteForm onAdd={addNote} />

      <section className="notes-section">
        <h2>Daftar Catatan ({notes.length})</h2>

        <input
          type="text"
          className="search-input"
          placeholder="Cari catatan berdasarkan judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="notes-list">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
              />
            ))
          ) : (
            <p className="empty-message">
              {notes.length === 0
                ? "Belum ada catatan."
                : "Catatan tidak ditemukan."}
            </p>
          )}
        </div>
      </section>

      <PostList />
    </main>
  );
}
