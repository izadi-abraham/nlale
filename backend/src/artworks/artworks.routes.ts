import { Elysia, t } from "elysia";
import { join } from "path";
import { unlinkSync, existsSync } from "fs";
import db from "../db";
import { authGuard } from "../admin/admin.routes";

const uploadsDir = process.env.UPLOADS_DIR ?? join(import.meta.dir, "../../uploads");

const ArtworkQuery = t.Object({
  type:       t.Optional(t.String()),
  year:       t.Optional(t.String()),
  medium:     t.Optional(t.String()),
  collection: t.Optional(t.String()),
});

function deleteFile(imagePath: string) {
  const fullPath = join(uploadsDir, imagePath.replace(/^uploads\//, ""));
  if (existsSync(fullPath)) {
    try { unlinkSync(fullPath); } catch (_) {}
  }
}

export const artworksRoutes = new Elysia({ prefix: "/api" })

  // ── Public read endpoints ──────────────────────────────────────────────────

  .get("/artworks", ({ query }) => {
    const { type, year, medium, collection } = query;
    const conditions: string[] = [];
    const params: Record<string, string | number> = {};

    if (type)       { conditions.push("type = $type");             params.$type = type; }
    if (year)       { conditions.push("year = $year");             params.$year = Number(year); }
    if (medium)     { conditions.push("medium = $medium");         params.$medium = medium; }
    if (collection) { conditions.push("collection = $collection"); params.$collection = collection; }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    return db.query(`SELECT * FROM artworks ${where} ORDER BY year DESC, id DESC`).all(params);
  }, { query: ArtworkQuery })

  .get("/artworks/:id", ({ params: { id }, set }) => {
    const artwork = db
      .query("SELECT * FROM artworks WHERE id = $id")
      .get({ $id: Number(id) }) as any;

    if (!artwork) { set.status = 404; return { message: "Artwork not found" }; }

    const images = db
      .query("SELECT id, image_path, sort_order FROM artwork_images WHERE artwork_id = $id ORDER BY sort_order ASC, id ASC")
      .all({ $id: Number(id) });

    return { ...artwork, images };
  })

  .get("/filters", () => {
    const types       = db.query("SELECT DISTINCT type       FROM artworks ORDER BY type").all()       .map((r: any) => r.type);
    const years       = db.query("SELECT DISTINCT year       FROM artworks ORDER BY year DESC").all()  .map((r: any) => r.year);
    const mediums     = db.query("SELECT DISTINCT medium     FROM artworks ORDER BY medium").all()     .map((r: any) => r.medium);
    const collections = db.query("SELECT DISTINCT collection FROM artworks ORDER BY collection").all() .map((r: any) => r.collection);
    return { types, years, mediums, collections };
  })

  // ── Protected write endpoints ──────────────────────────────────────────────

  .use(authGuard)

  .post("/artworks", async ({ body }) => {
    const { file, title, description, type, year, medium, collection, dimensions } = body;

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const filename = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}.${ext}`;
    await Bun.write(join(uploadsDir, filename), await file.arrayBuffer());

    const imagePath = `uploads/${filename}`;

    const result = db.prepare(`
      INSERT INTO artworks (title, description, image_path, type, year, medium, collection, dimensions)
      VALUES ($title, $description, $image_path, $type, $year, $medium, $collection, $dimensions)
    `).run({
      $title: title, $description: description ?? "",
      $image_path: imagePath, $type: type, $year: Number(year),
      $medium: medium, $collection: collection ?? "", $dimensions: dimensions ?? "",
    });

    const artworkId = result.lastInsertRowid;
    db.prepare("INSERT INTO artwork_images (artwork_id, image_path, sort_order) VALUES ($artwork_id, $image_path, 0)")
      .run({ $artwork_id: artworkId, $image_path: imagePath });

    return { id: artworkId };
  }, {
    body: t.Object({
      file:        t.File({ type: "image/*" }),
      title:       t.String({ minLength: 1 }),
      description: t.Optional(t.String()),
      type:        t.Union([t.Literal("painting"), t.Literal("sculpture")]),
      year:        t.String(),
      medium:      t.String({ minLength: 1 }),
      collection:  t.Optional(t.String()),
      dimensions:  t.Optional(t.String()),
    }),
  })

  .put("/artworks/:id", ({ params: { id }, body, set }) => {
    const artwork = db.query("SELECT id FROM artworks WHERE id = $id").get({ $id: Number(id) });
    if (!artwork) { set.status = 404; return { message: "Artwork not found" }; }

    db.prepare(`
      UPDATE artworks SET title=$title, description=$description, type=$type,
        year=$year, medium=$medium, collection=$collection, dimensions=$dimensions
      WHERE id=$id
    `).run({
      $id: Number(id),
      $title: body.title, $description: body.description ?? "",
      $type: body.type, $year: Number(body.year),
      $medium: body.medium, $collection: body.collection ?? "",
      $dimensions: body.dimensions ?? "",
    });

    return { ok: true };
  }, {
    body: t.Object({
      title:       t.String({ minLength: 1 }),
      description: t.Optional(t.String()),
      type:        t.Union([t.Literal("painting"), t.Literal("sculpture")]),
      year:        t.String(),
      medium:      t.String({ minLength: 1 }),
      collection:  t.Optional(t.String()),
      dimensions:  t.Optional(t.String()),
    }),
  })

  .delete("/artworks/:id", ({ params: { id }, set }) => {
    const artwork = db.query("SELECT image_path FROM artworks WHERE id = $id").get({ $id: Number(id) }) as any;
    if (!artwork) { set.status = 404; return { message: "Artwork not found" }; }

    const images = db.query("SELECT image_path FROM artwork_images WHERE artwork_id = $id").all({ $id: Number(id) }) as any[];
    images.forEach(img => deleteFile(img.image_path));

    db.prepare("DELETE FROM artworks WHERE id = $id").run({ $id: Number(id) });
    return { ok: true };
  })

  .post("/artworks/:id/images", async ({ params: { id }, body, set }) => {
    const artwork = db.query("SELECT id FROM artworks WHERE id = $id").get({ $id: Number(id) });
    if (!artwork) { set.status = 404; return { message: "Artwork not found" }; }

    const { file } = body;
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const filename = `${Date.now()}-${id}-extra.${ext}`;
    await Bun.write(join(uploadsDir, filename), await file.arrayBuffer());

    const imagePath = `uploads/${filename}`;
    const maxOrder = (db.query("SELECT COALESCE(MAX(sort_order), -1) as m FROM artwork_images WHERE artwork_id = $id")
      .get({ $id: Number(id) }) as any).m;

    const result = db.prepare("INSERT INTO artwork_images (artwork_id, image_path, sort_order) VALUES ($artwork_id, $image_path, $sort_order)")
      .run({ $artwork_id: Number(id), $image_path: imagePath, $sort_order: maxOrder + 1 });

    return { id: result.lastInsertRowid, image_path: imagePath };
  }, {
    body: t.Object({ file: t.File({ type: "image/*" }) }),
  })

  .delete("/artworks/:id/images/:imageId", ({ params: { id, imageId }, set }) => {
    const image = db.query("SELECT * FROM artwork_images WHERE id = $imageId AND artwork_id = $artworkId")
      .get({ $imageId: Number(imageId), $artworkId: Number(id) }) as any;
    if (!image) { set.status = 404; return { message: "Image not found" }; }

    deleteFile(image.image_path);
    db.prepare("DELETE FROM artwork_images WHERE id = $id").run({ $id: Number(imageId) });
    return { ok: true };
  });
