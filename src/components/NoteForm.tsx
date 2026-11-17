
import { useState } from "react";
import type { FormEvent } from "react";

interface NoteFormProps {
  onAdd: (
    title: string,
    content: string,
    category: string
  ) => void;
}

export default function NoteForm({ onAdd }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Kuliah");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    onAdd(title.trim(), content.trim(), category);

    setTitle("");
    setContent("");
    setCategory("Kuliah");
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>Tambah Catatan</h2>

      <label htmlFor="title">Judul Catatan</label>
      <input
        id="title"
        type="text"
        placeholder="Masukkan judul catatan..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="content">Isi Catatan</label>
      <textarea
        id="content"
        placeholder="Tulis isi catatan..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <label htmlFor="category">Kategori</label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Kuliah">Kuliah</option>
        <option value="Pribadi">Pribadi</option>
        <option value="Lainnya">Lainnya</option>
      </select>

      <button type="submit">Tambah Catatan</button>
    </form>
  );
}
