import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { join } from "path";
import { mkdirSync } from "fs";
import { artworksRoutes } from "./artworks/artworks.routes";

const uploadsDir = process.env.UPLOADS_DIR ?? join(import.meta.dir, "../uploads");
mkdirSync(uploadsDir, { recursive: true });

function log(level: "INFO" | "ERROR", method: string, path: string, status?: number, ms?: number) {
  const ts = new Date().toISOString();
  const duration = ms !== undefined ? ` ${ms}ms` : "";
  const statusStr = status !== undefined ? ` ${status}` : "";
  console.log(`[${ts}] ${level} ${method} ${path}${statusStr}${duration}`);
}

const app = new Elysia()
  .use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }))
  .use(staticPlugin({ assets: uploadsDir, prefix: "/uploads" }))
  .onRequest(({ request, store }) => {
    (store as any)._reqStart = Date.now();
  })
  .onAfterResponse(({ request, set, store }) => {
    const ms = Date.now() - ((store as any)._reqStart ?? Date.now());
    const path = new URL(request.url).pathname;
    log("INFO", request.method, path, set.status as number, ms);
  })
  .onError(({ request, error, set }) => {
    const path = new URL(request.url).pathname;
    log("ERROR", request.method, path, set.status as number);
    console.error(error);
  })
  .use(artworksRoutes)
  .listen(Number(process.env.PORT ?? 3000));

console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);
