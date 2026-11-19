import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

const EXPRESS_API_URL = "http://localhost:3000/api/posts";
const MOCK_API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [endpoint, setEndpoint] = useState(EXPRESS_API_URL);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Challenge Tahap 2 No 2 & No 4:
  // Mengambil daftar post dari backend dengan loading & error handling.
  // Dependency array [search, endpoint]: otomatis fetch ulang saat kata kunci pencarian berubah (query ?search=...)
  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const query = search.trim();
        let targetUrl = endpoint;

        if (query) {
          // Jika menggunakan mock JSONPlaceholder gunakan parameter q, jika Express gunakan search
          const paramName = endpoint.includes("jsonplaceholder") ? "q" : "search";
          targetUrl = `${endpoint}?${paramName}=${encodeURIComponent(query)}`;
        } else if (endpoint.includes("jsonplaceholder")) {
          targetUrl = `${endpoint}?_limit=6`;
        }

        const res = await fetch(targetUrl, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Status ${res.status} (${res.statusText || "Server Error"})`);
        }

        const json = await res.json();
        // Menangani format sendSuccess() Modul 4 ({ status, data }) maupun array biasa
        const data: Post[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];

        setPosts(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Gagal terhubung ke server backend."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      controller.abort();
    };
  }, [search, endpoint]);

  // Challenge Tahap 2 No 3:
  // Mengirim post baru ke POST /api/posts dan update state tanpa refresh halaman
  const handleAddPost = async (title: string, content: string): Promise<boolean> => {
    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          body: content,
        }),
      });

      if (!res.ok) {
        throw new Error(`Gagal mengirim post (Status: ${res.status})`);
      }

      const json = await res.json();
      const createdItem: Post = json?.data ?? json;

      const newPost: Post = {
        id: createdItem.id && !posts.some((p) => p.id === createdItem.id)
          ? createdItem.id
          : Date.now(),
        title: createdItem.title || title,
        content: createdItem.content || content,
        body: createdItem.body || content,
        author: createdItem.author ?? "Saya",
      };

      // Update state secara immutable
      setPosts((prev) => [newPost, ...prev]);
      setActionMessage({
        type: "success",
        text: `Post "${newPost.title}" berhasil ditambahkan!`,
      });
      return true;
    } catch (err: unknown) {
      setActionMessage({
        type: "error",
        text:
          err instanceof Error
            ? `Gagal kirim post: ${err.message}`
            : "Terjadi kesalahan saat mengirim post.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Challenge Tahap 2 No 3:
  // Menghapus post via DELETE /api/posts/:id dan update state tanpa refresh halaman
  const handleDeletePost = async (id: number) => {
    if (!window.confirm(`Hapus post dengan ID #${id}?`)) {
      return;
    }

    setDeletingId(id);
    setActionMessage(null);

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 404) {
        throw new Error(`Gagal menghapus di server (Status: ${res.status})`);
      }

      // Update state secara immutable dengan .filter()
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setActionMessage({
        type: "success",
        text: `Post #${id} berhasil dihapus!`,
      });
    } catch (err: unknown) {
      setActionMessage({
        type: "error",
        text:
          err instanceof Error
            ? `Gagal menghapus: ${err.message}`
            : "Terjadi kesalahan saat menghapus post.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="notes-section posts-section">
      <div className="section-header">
        <div>
          <h2>Integrasi REST API Modul 4 (Tahap 2)</h2>
          <p className="subtitle">
            Endpoint aktif: <code>{endpoint}</code>
          </p>
        </div>

        {/* Pilihan endpoint untuk memudahkan pengujian lokal vs mock */}
        <div className="endpoint-selector">
          <label htmlFor="endpoint-select">Pilih Sumber API: </label>
          <select
            id="endpoint-select"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          >
            <option value={EXPRESS_API_URL}>
              Backend Express Modul 4 (localhost:3000)
            </option>
            <option value={MOCK_API_URL}>
              Mock Publik JSONPlaceholder
            </option>
          </select>
        </div>
      </div>

      {actionMessage && (
        <div className={`alert-box ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      {/* Challenge Tahap 2 No 3: Form kirim post baru */}
      <PostForm onAddPost={handleAddPost} isSubmitting={isSubmitting} />

      {/* Challenge Tahap 2 No 4: Input pencarian yang mengirim query ?search=... */}
      <div className="search-box">
        <label htmlFor="search-post">
          Cari Post ke Backend (Query <code>?search=...</code>):
        </label>
        <input
          id="search-post"
          type="text"
          className="search-input"
          placeholder="Ketik kata kunci untuk filter langsung ke backend..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h3>Daftar Post ({posts.length})</h3>

      {/* Challenge Tahap 2 No 2: Loading State */}
      {isLoading && <p className="status-message">Sedang memuat post dari backend...</p>}

      {/* Challenge Tahap 2 No 2: Error State jika server mati / fetch gagal */}
      {error && (
        <div className="error-box">
          <p>
            <strong>Gagal Memuat Post:</strong> {error}
          </p>
          <p className="error-hint">
            Pastikan server Express Modul 4 berjalan di <code>http://localhost:3000</code> dan
            CORS sudah diaktifkan (<code>origin: &quot;http://localhost:5173&quot;</code>). Jika
            belum menyalakan server, Anda dapat memilih <strong>Mock Publik JSONPlaceholder</strong> pada
            pilihan sumber API di atas untuk menguji fitur.
          </p>
        </div>
      )}

      {/* Daftar Kartu Post */}
      {!isLoading && !error && (
        <div className="notes-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                isDeleting={deletingId === post.id}
              />
            ))
          ) : (
            <p className="empty-message">
              Tidak ada post yang ditemukan. Coba kata kunci lain atau tambahkan post baru!
            </p>
          )}
        </div>
      )}
    </section>
  );
}
