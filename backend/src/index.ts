import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { join } from "path";
import { mkdirSync } from "fs";
import { artworksRoutes } from "./artworks/artworks.routes";

const uploadsDir = process.env.UPLOADS_DIR ?? join(import.meta.dir, "../uploads");
mkdirSync(uploadsDir, { recursive: true });

const app = new Elysia()
  .use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }))
  .use(
    staticPlugin({
      assets: uploadsDir,
      prefix: "/uploads",
    })
  )
  .use(artworksRoutes)
  .listen(Number(process.env.PORT ?? 3000));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
