import type { Request, Response } from "express";
import { prisma } from "../prisma";
import { sendError, sendSuccess } from "../utils/response";

export async function getPosts(req: Request, res: Response) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, posts, "Daftar post berhasil dimuat");
  } catch (error) {
    console.error("Error getPosts:", error);
    return sendError(res, "Gagal memuat post dari database Neon", 500);
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const { title, content, body, author } = req.body;
    const finalContent = (content || body || "").trim();

    if (!title || !title.trim()) {
      return sendError(res, "Judul post wajib diisi", 400);
    }
    if (!finalContent) {
      return sendError(res, "Konten post wajib diisi", 400);
    }

    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        content: finalContent,
        author: author || "Mahasiswa B04",
      },
    });

    return sendSuccess(res, newPost, "Post berhasil ditambahkan", 201);
  } catch (error) {
    console.error("Error createPost:", error);
    return sendError(res, "Gagal menambahkan post ke database Neon", 500);
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, "ID post tidak valid", 400);
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, `Post dengan ID #${id} tidak ditemukan`, 404);
    }

    await prisma.post.delete({ where: { id } });

    return sendSuccess(res, { id }, `Post #${id} berhasil dihapus`);
  } catch (error) {
    console.error("Error deletePost:", error);
    return sendError(res, "Gagal menghapus post dari database Neon", 500);
  }
}
