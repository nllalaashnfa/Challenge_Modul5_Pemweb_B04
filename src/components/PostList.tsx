import { useEffect, useState } from "react";
import type { Post } from "../types/post";

const API_URL = "http://localhost:3000/api/posts";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        return res.json() as Promise<Post[]>;
      })
      .then(setPosts)
      .catch((err: Error) => {
        // abort saat unmount bukan error sungguhan
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="posts-section">
      <h2>Daftar Post ({posts.length})</h2>

      {isLoading && <p>Memuat post...</p>}
      {error && (
        <p className="empty-message">
          Gagal memuat post: {error}. Pastikan server berjalan di port 3000.
        </p>
      )}

      {posts.map((post) => (
        <div key={post.id} className="note-card">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </section>
  );
}
