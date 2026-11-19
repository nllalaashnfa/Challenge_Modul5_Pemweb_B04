import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client";

const rawUrl = process.env.DATABASE_URL || "";
// Bersihkan channel_binding jika ada karena adapter neon serverless tidak memerlukannya
const connectionString = rawUrl
  .replace("&channel_binding=require", "")
  .replace("?channel_binding=require&", "?")
  .replace("?channel_binding=require", "");

const adapter = new PrismaNeon({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});
