import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const rawUrl = env("DATABASE_URL") || "";
// Prisma Migrate / DB Push membutuhkan unpooled URL (tanpa -pooler dan tanpa channel_binding)
const unpooledUrl = rawUrl
  .replace("-pooler", "")
  .replace("&channel_binding=require", "")
  .replace("?channel_binding=require&", "?")
  .replace("?channel_binding=require", "");

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: { path: "server/prisma/migrations" },
  datasource: { url: unpooledUrl || rawUrl },
});
