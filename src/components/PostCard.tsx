import type { Post } from "../types/post";

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export default function PostCard({
  post,
  onDelete,
  isDeleting = false,
}: PostCardProps) {
  // Ambil nama penulis jika tersedia (mendukung format Modul 4 atau string)
  const authorName =
    typeof post.author === "object" && post.author !== null
      ? post.author.name
      : typeof post.author === "string"
        ? post.author
        : null;

  return (
    <article className="note-card post-card">
      <div className="note-header">
        <h3>{post.title}</h3>
        {authorName && <span className="category">Penulis: {authorName}</span>}
      </div>

      <p>{post.content ?? post.body ?? "(Tidak ada konten)"}</p>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(post.id)}
        disabled={isDeleting}
      >
        {isDeleting ? "Menghapus..." : "Hapus Post"}
      </button>
    </article>
  );
}
