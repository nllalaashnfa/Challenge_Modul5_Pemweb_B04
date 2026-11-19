import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import postRoutes from "./routes/postRoutes";

// Load .env dari root atau folder server
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Sesuai Modul 4 & Modul 5 Bagian 10: Izinkan origin Vite React (port 5173)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check endpoint
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server Express Modul 4 Aktif & Terhubung",
    endpoints: {
      getPosts: "GET /api/posts (?search=...)",
      createPost: "POST /api/posts",
      deletePost: "DELETE /api/posts/:id",
    },
  });
});

// REST API routes
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Server Express Modul 4 Berjalan!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📡 CORS Origin: http://localhost:5173`);
  console.log(`===============================================`);
});
