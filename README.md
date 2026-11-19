# Dokumentasi Project - Challenge Praktikum Modul 5 (React + TypeScript + Vite + Express Neon)

Dokumentasi ini mencakup cara kerja project, implementasi **Challenge Praktikum Tahap 2 (Nomor 2 sampai 4)**, pembuatan backend **Express + Prisma + Neon PostgreSQL**, keterkaitan langsung dengan materi di **Modul.md**, serta panduan testing beserta alur eksekusi kodenya secara ringkas dan to the point.

---

## 1. Gambaran & Cara Kerja Project

Project ini telah dikonfigurasi menjadi **Full-Stack Monorepo Sederhana** di dalam satu repository tanpa folder terpisah di luar, sehingga seluruh anggota kelompok dapat langsung menjalankannya tanpa kebingungan:
1. **Frontend (Root `src/`)**: Aplikasi React 19 + TypeScript + Vite.
   - **Tahap 1**: Papan Catatan Lokal (`NoteForm`, `NoteCard`, filter pencarian, dan sinkronisasi `localStorage`).
   - **Tahap 2**: Integrasi REST API (`PostForm`, `PostCard`, `PostList` dengan loading, error handling, tambah post `POST`, hapus post `DELETE`, dan pencarian `?search=...`).
2. **Backend (`server/`)**: Server REST API Express + TypeScript + Prisma ORM yang terhubung langsung ke cloud database **Neon PostgreSQL** di port `3000`.

### Struktur Folder Lengkap
Sesuai rekomendasi **Modul.md Bagian 10 & Bagian 12**:
```text
Challenge_Modul5_Pemweb_B04/
├── server/                     # Backend Express + Prisma (Modul 4)
│   ├── prisma/
│   │   └── schema.prisma       # Model tabel 'posts' di database Neon
│   └── src/
│       ├── controllers/
│       │   └── postController.ts # Logic CRUD & Search ?search=...
│       ├── routes/
│       │   └── postRoutes.ts   # Route GET, POST, DELETE /api/posts
│       ├── utils/
│       │   └── response.ts     # Helper sendSuccess & sendError (format Modul 4)
│       ├── prisma.ts           # Inisialisasi PrismaClient + Neon Adapter
│       └── index.ts            # Entry point Express, CORS origin 5173, port 3000
├── src/                        # Frontend React Vite (Modul 5)
│   ├── components/
│   │   ├── NoteCard.tsx        # Kartu catatan lokal (Tahap 1)
│   │   ├── NoteForm.tsx        # Form catatan lokal (Tahap 1)
│   │   ├── PostCard.tsx        # Kartu post API + tombol hapus (Tahap 2 No 3)
│   │   ├── PostForm.tsx        # Form tambah post API (Tahap 2 No 3)
│   │   └── PostList.tsx        # State management Post, Loading, Error, Search (Tahap 2 No 2-4)
│   ├── types/
│   │   ├── note.ts             # Interface Note lokal
│   │   └── post.ts             # Interface Post & Payload input
│   ├── App.css
│   ├── index.css               # Styling global & tema warna
│   ├── App.tsx                 # Root komponen
│   └── main.tsx                # Entry point React
├── prisma.config.ts            # Konfigurasi Prisma 7 (Neon direct unpooled URL)
├── package.json                # Dependencies gabungan frontend & backend
└── README.md
```

---

## 2. Langkah Manual yang Harus Dijalankan Pengguna (Wajib Diketahui)

Untuk menjalankan aplikasi secara penuh, Anda hanya perlu membuka **dua tab terminal**:

### 🔹 Terminal 1: Jalankan Backend Express (Port 3000)
```bash
npm run server
```
*Tampilan di terminal:*
```text
===============================================
🚀 Server Express Modul 4 Berjalan!
🌐 URL: http://localhost:3000
📡 CORS Origin: http://localhost:5173
===============================================
```
> [!NOTE]
> Database Neon dan tabel `posts` sudah otomatis tersinkronisasi (`prisma db push` sudah sukses dijalankan). Jika di kemudian hari ada perubahan model, cukup jalankan `npm run prisma:push`.

### 🔹 Terminal 2: Jalankan Frontend Vite (Port 5173)
```bash
npm run dev
```
Buka browser pada alamat `http://localhost:5173`.

### 🔹 Opsi Fallback Tanpa Menyalakan Backend
Jika suatu saat Anda sedang offline atau belum menyalakan server backend di port 3000, Anda tetap dapat menguji aplikasi dengan memilih opsi **"Mock Publik JSONPlaceholder"** pada dropdown di header Post (*Rujukan: Modul.md Bagian 10 Catatan Baris 411*).

---

## 3. Dokumentasi Step Pengerjaan Challenge Tahap 2 (Nomor 2 s.d. 4)

| Challenge | File yang Dikerjakan | Kaitan Materi di `Modul.md` | Ringkasan Pekerjaan |
| :--- | :--- | :--- | :--- |
| **Nomor 2** | `src/types/post.ts`<br>`src/components/PostList.tsx`<br>`server/src/controllers/postController.ts` | **Bagian 6**: Conditional Rendering<br>**Bagian 9**: Side Effects & `useEffect`<br>**Bagian 10**: Fetch API & Pola 3 State | Frontend mengelola 3 state (`posts`, `isLoading`, `error`). Backend menyediakan `GET /api/posts` yang mengambil data dari database Neon. Menampilkan loading saat memuat, dan banner error jika backend mati/gagal. |
| **Nomor 3** | `src/components/PostForm.tsx`<br>`src/components/PostCard.tsx`<br>`src/components/PostList.tsx`<br>`server/src/controllers/postController.ts` | **Bagian 5**: Component & Props<br>**Bagian 7**: Immutability `useState`<br>**Bagian 8**: Controlled Form & Lifting State Up | Form terkontrol `PostForm` mengirim `POST /api/posts` (disimpan ke database Neon), lalu state di-update via spread operator `[newPost, ...prev]`. Tombol hapus di `PostCard` memicu `DELETE /api/posts/:id` (dihapus dari Neon), lalu disaring via `.filter()`. Tanpa reload browser! |
| **Nomor 4 (Bonus)** | `src/components/PostList.tsx`<br>`server/src/controllers/postController.ts` | **Bagian 8**: Form Input State<br>**Bagian 9**: `useEffect` Dependency Array<br>**Bagian 13**: Cleanup `AbortController` | Input search di frontend diikat ke `useEffect(..., [search])`. Setiap kata kunci berubah, query `?search=...` dikirim ke backend Express. Backend memfilter data di Prisma Neon secara case-insensitive (`contains`). Dilengkapi `AbortController` untuk membatalkan request lama. |

---

## 4. Rincian Implementasi Kode Per Nomor

### Nomor 2: Tampilkan Post dengan Loading & Error State
- **Frontend ([PostList.tsx](file:///d:/AAA_Kuliah/Pemweb/Challenge_Modul5_Pemweb_B04/src/components/PostList.tsx))**:
  - Menginisialisasi `const [posts, setPosts] = useState<Post[]>([])`, `const [isLoading, setIsLoading] = useState(true)`, `const [error, setError] = useState<string | null>(null)`.
  - Conditional rendering:
    - `{isLoading && <p className="status-message">Sedang memuat post...</p>}`
    - `{error && <div className="error-box"><p>Gagal Memuat Post: {error}</p>...</div>}`
    - `{!isLoading && !error && posts.map(post => <PostCard key={post.id} ... />)}`
- **Backend ([postController.ts](file:///d:/AAA_Kuliah/Pemweb/Challenge_Modul5_Pemweb_B04/server/src/controllers/postController.ts))**:
  - Fungsi `getPosts` memanggil `prisma.post.findMany({ orderBy: { createdAt: "desc" } })`.
  - Mengembalikan format respon standar Modul 4 via `sendSuccess(res, posts, "Daftar post berhasil dimuat")`.

### Nomor 3: Form Kirim Post Baru (`POST`) & Hapus (`DELETE`) Tanpa Refresh
- **Frontend**:
  - [PostForm.tsx](file:///d:/AAA_Kuliah/Pemweb/Challenge_Modul5_Pemweb_B04/src/components/PostForm.tsx): Controlled form dengan state lokal `title` dan `content`. Pada `handleSubmit`, memanggil `e.preventDefault()` lalu mengirimkan data ke parent via callback `onAddPost` (*Lifting State Up*).
  - [PostCard.tsx](file:///d:/AAA_Kuliah/Pemweb/Challenge_Modul5_Pemweb_B04/src/components/PostCard.tsx): Menerima props `post` dan fungsi callback `onDelete(post.id)`.
  - [PostList.tsx](file:///d:/AAA_Kuliah/Pemweb/Challenge_Modul5_Pemweb_B04/src/components/PostList.tsx):
    - `handleAddPost`: Mengirim HTTP `POST` ke backend. Setelah sukses, memperbarui state secara immutable:
      ```typescript
      setPosts((prev) => [newPost, ...prev]);
      ```
    - `handleDeletePost`: Mengirim HTTP `DELETE` ke backend. Setelah sukses, memperbarui state secara immutable:
      ```typescript
      setPosts((prev) => prev.filter((p) => p.id !== id));
      ```
- **Backend**:
  - `POST /api/posts`: Menerima body `{ title, content, author }`, memvalidasi input, lalu menjalankan `prisma.post.create(...)` ke Neon.
  - `DELETE /api/posts/:id`: Memverifikasi keberadaan ID, lalu menjalankan `prisma.post.delete(...)` di Neon.

### Nomor 4: Pencarian Dinamis dengan Query `?search=...`
- **Frontend**:
  - State `search` didaftarkan ke dependency array `useEffect`:
    ```typescript
    useEffect(() => {
      const controller = new AbortController();
      const targetUrl = search.trim()
        ? `${endpoint}?search=${encodeURIComponent(search.trim())}`
        : endpoint;

      fetch(targetUrl, { signal: controller.signal })
        .then(res => res.json())
        .then(json => setPosts(json.data ?? json))
        .catch(...)
        .finally(...);

      return () => controller.abort(); // cleanup request lama
    }, [search, endpoint]);
    ```
- **Backend**:
  - Controller membaca `req.query.search`. Jika ada, menyusun query Prisma:
    ```typescript
    const where = search ? {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    } : {};
    const posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" } });
    ```

---

## 5. Langkah Testing & Alur Eksekusi Kode (Trace Full-Stack)

### Test 1: Pengujian Nomor 2 (Loading & Error Handling)

#### Skenario 1A: Backend Belum Dinyalakan (Error State)
1. **Langkah Uji**: Matikan Terminal Backend. Buka browser `http://localhost:5173`.
2. **Hasil**: Muncul teks loading sesaat, lalu muncul kotak error merah dengan detail pesan error server.
3. **Alur Eksekusi Kode**:
   `PostList.tsx` mount $\rightarrow$ `useEffect` memanggil `setIsLoading(true)` $\rightarrow$ `fetch("http://localhost:3000/api/posts")` gagal koneksi $\rightarrow$ masuk ke blok `catch` $\rightarrow$ `setError(err.message)` $\rightarrow$ `finally` memanggil `setIsLoading(false)` $\rightarrow$ React re-render: kotak error tampil.

#### Skenario 1B: Backend Dinyalakan (`npm run server`)
1. **Langkah Uji**: Jalankan `npm run server` di Terminal 1. Refresh halaman browser.
2. **Hasil**: Status loading muncul sekejap, lalu daftar post dari database Neon langsung muncul.
3. **Alur Eksekusi Kode**:
   `PostList.tsx` $\rightarrow$ HTTP `GET /api/posts` $\rightarrow$ `server/src/index.ts` $\rightarrow$ `postController.ts: getPosts` $\rightarrow$ `prisma.post.findMany()` ke database Neon $\rightarrow$ `sendSuccess()` kembalikan JSON `{ status: "success", data: [...] }` $\rightarrow$ Frontend menerima dan memanggil `setPosts(json.data)` $\rightarrow$ React me-render kartu `<PostCard />`.

---

### Test 2: Pengujian Nomor 3 (Kirim Post & Hapus Post Tanpa Refresh)

#### Skenario 2A: Menambah Post Baru
1. **Langkah Uji**:
   - Pada form **"Tambah Post Baru (REST API)"**, masukkan Judul: `Pengujian Modul 5` dan Isi: `Data ini tersimpan langsung di Neon PostgreSQL`.
   - Klik **"Kirim Post (POST /api/posts)"**.
2. **Hasil**:
   - Notifikasi sukses hijau muncul.
   - Kartu post baru langsung muncul di posisi teratas daftar tanpa refresh halaman.
   - Jika Anda me-refresh browser, data tetap ada karena tersimpan permanen di cloud Neon!
3. **Alur Eksekusi Kode**:
   ```text
   PostForm.tsx (Ketik judul & konten)
     ├─► [onChange] Update state title & content lokal
     └─► [onSubmit] handleSubmit memanggil e.preventDefault()
           │
           ▼ (Lifting State Up)
   PostList.tsx (handleAddPost)
     │
     ├─► Mengirim HTTP POST http://localhost:3000/api/posts dengan body JSON
     │     │
     │     ▼ (Server Express)
     │   postController.ts: createPost -> prisma.post.create() ke Neon DB
     │   Server merespons: sendSuccess(res, newPost, ..., 201)
     │     │
     │     ▼
     ├─► Frontend menerima data post baru dari server
     ├─► setPosts((prev) => [newPost, ...prev])  <-- Aturan Immutability
     └─► virtual DOM React re-render otomatis menampilkan kartu baru
   ```

#### Skenario 2B: Menghapus Post
1. **Langkah Uji**:
   - Klik tombol **"Hapus Post"** pada kartu post yang baru dibuat.
   - Klik **OK** pada dialog konfirmasi browser.
2. **Hasil**: Post seketika hilang dari daftar UI tanpa reload halaman, dan terhapus dari database Neon.
3. **Alur Eksekusi Kode**:
   ```text
   PostCard.tsx (Klik "Hapus Post")
     └─► [onClick] memanggil onDelete(post.id)
           │
           ▼
   PostList.tsx (handleDeletePost)
     │
     ├─► Konfirmasi dialog window.confirm()
     ├─► Mengirim HTTP DELETE http://localhost:3000/api/posts/:id
     │     │
     │     ▼ (Server Express)
     │   postController.ts: deletePost -> prisma.post.delete() dari Neon DB
     │   Server merespons: sendSuccess(res, { id }, ...)
     │     │
     │     ▼
     ├─► Frontend memanggil setPosts((prev) => prev.filter(p => p.id !== id))
     └─► React menyingkirkan elemen kartu dari tampilan secara instan
   ```

---

### Test 3: Pengujian Nomor 4 (Pencarian Dinamis Query `?search=...`)

1. **Langkah Uji**:
   - Buka DevTools Browser (F12) $\rightarrow$ Tab **Network** $\rightarrow$ Filter **Fetch/XHR**.
   - Ketik kata kunci pada kotak input pencarian post (misalnya kata dari judul post di atas).
2. **Hasil**:
   - Di tab Network terlihat request terkirim ke `http://localhost:3000/api/posts?search=<kata_kunci>`.
   - Daftar post di layar terfilter secara live langsung oleh database Neon sesuai kata kunci yang diketik.
3. **Alur Eksekusi Kode**:
   ```text
   PostList.tsx (Input Search)
     ├─► [onChange] -> setSearch(e.target.value)
     │
     ▼ (Dependency Array [search] Berubah)
   useEffect Terpicu
     ├─► controller.abort() membatalkan request lama yang masih berjalan
     ├─► fetch("http://localhost:3000/api/posts?search=...")
     │     │
     │     ▼ (Server Express)
     │   postController.ts membaca req.query.search
     │   prisma.post.findMany({ where: { OR: [ { title: { contains: search, mode: "insensitive" } } ] } })
     │   Server merespons data yang cocok
     │     │
     │     ▼
     └─► setPosts(data) -> UI menampilkan hasil filter database
   ```

---

## 6. Verifikasi & Kualitas Kode

- **Frontend Build**: `npm run build` $\rightarrow$ Sukses (0 error).
- **Linter (Oxlint)**: `npm run lint` $\rightarrow$ 0 warning, 0 error pada seluruh file (25 files).
- **Prisma & Database**: `prisma db push` $\rightarrow$ Tersinkronisasi penuh dengan database Neon PostgreSQL.
