import { useState } from "react";
import type { FormEvent } from "react";

interface PostFormProps {
  onAddPost: (title: string, content: string) => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function PostForm({ onAddPost, isSubmitting = false }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || isSubmitting) {
      return;
    }

    const success = await onAddPost(title.trim(), content.trim());
    if (success) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <form className="note-form post-form" onSubmit={handleSubmit}>
      <h2>Tambah Post Baru (REST API)</h2>

      <label htmlFor="post-title">Judul Post</label>
      <input
        id="post-title"
        type="text"
        placeholder="Masukkan judul post..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <label htmlFor="post-content">Isi Post</label>
      <textarea
        id="post-content"
        placeholder="Tulis konten post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Mengirim Post..." : "Kirim Post (POST /api/posts)"}
      </button>
    </form>
  );
}
