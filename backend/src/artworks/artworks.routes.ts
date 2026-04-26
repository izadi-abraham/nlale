import { Elysia, t } from "elysia";
import { join } from "path";
import { unlinkSync, existsSync } from "fs";
import sharp from "sharp";
import db from "../db";
import { authGuard } from "../admin/admin.routes";

const uploadsDir = process.env.UPLOADS_DIR ?? join(import.meta.dir, "../../uploads");

const ArtworkQuery = t.Object({
  type:       t.Optional(t.String()),
  year:       t.Optional(t.String()),
  medium:     t.Optional(t.String()),
  collection: t.Optional(t.String()),
});

async function processAndSave(file: File, basename: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const output = await sharp(buffer)
    .rotate()                                                    // auto-fix EXIF orientation
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const filename = `${basename}.webp`;
  await Bun.write(join(uploadsDir, filename), output);
  return `uploads/${filename}`;
}

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

    if (type)       { conditions.push("a.type = $type");             params.$type = type; }
    if (year)       { conditions.push("a.year = $year");             params.$year = Number(year); }
    if (medium)     { conditions.push("a.medium = $medium");         params.$medium = medium; }
    if (collection) { conditions.push("a.collection = $collection"); params.$collection = collection; }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT a.id, a.title, a.description, a.type, a.year, a.medium, a.collection, a.dimensions, a.created_at,
        COALESCE(
          (SELECT ai.image_path FROM artwork_images ai WHERE ai.artwork_id = a.id ORDER BY ai.sort_order ASC, ai.id ASC LIMIT 1),
          a.image_path
        ) as image_path
      FROM artworks a ${where} ORDER BY a.year DESC, a.id DESC
    `;
    return conditions.length ? db.query(sql).all(params) : db.query(sql).all();
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
    const { files, thumbnailIndex: thumbIdxStr, title, description, type, year, medium, collection, dimensions } = body;
    const filesArr: File[] = Array.isArray(files) ? files : [files as File];
    const thumbIdx = Math.min(Math.max(Number(thumbIdxStr ?? "0") || 0, 0), filesArr.length - 1);

    // Process and save all files (resize + convert to WebP)
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const savedPaths: string[] = [];
    for (let i = 0; i < filesArr.length; i++) {
      const path = await processAndSave(filesArr[i], `${Date.now()}-${i}-${slug}`);
      savedPaths.push(path);
    }

    // Thumbnail first, then the rest in original order
    const orderedPaths = [
      savedPaths[thumbIdx],
      ...savedPaths.filter((_, i) => i !== thumbIdx),
    ];

    const result = db.prepare(`
      INSERT INTO artworks (title, description, image_path, type, year, medium, collection, dimensions)
      VALUES ($title, $description, $image_path, $type, $year, $medium, $collection, $dimensions)
    `).run({
      $title: title, $description: description ?? "",
      $image_path: orderedPaths[0], $type: type, $year: Number(year),
      $medium: medium, $collection: collection ?? "", $dimensions: dimensions ?? "",
    });

    const artworkId = result.lastInsertRowid;
    const insertImg = db.prepare("INSERT INTO artwork_images (artwork_id, image_path, sort_order) VALUES ($artwork_id, $image_path, $sort_order)");
    orderedPaths.forEach((p, i) => insertImg.run({ $artwork_id: artworkId, $image_path: p, $sort_order: i }));

    return { id: artworkId };
  }, {
    body: t.Object({
      files:          t.Union([t.File({ type: "image/*" }), t.Files({ type: "image/*" })]),
      thumbnailIndex: t.Optional(t.String()),
      title:          t.String({ minLength: 1 }),
      description:    t.Optional(t.String()),
      type:           t.Union([t.Literal("painting"), t.Literal("drawing"), t.Literal("sculpture")]),
      year:           t.String(),
      medium:         t.String({ minLength: 1 }),
      collection:     t.Optional(t.String()),
      dimensions:     t.Optional(t.String()),
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
      type:        t.Union([t.Literal("painting"), t.Literal("drawing"), t.Literal("sculpture")]),
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
    const imagePath = await processAndSave(file, `${Date.now()}-${id}-extra`);
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
  })

  .put("/artworks/:id/images/:imageId/thumbnail", ({ params: { id, imageId }, set }) => {
    const image = db.query("SELECT * FROM artwork_images WHERE id = $imageId AND artwork_id = $artworkId")
      .get({ $imageId: Number(imageId), $artworkId: Number(id) }) as any;
    if (!image) { set.status = 404; return { message: "Image not found" }; }

    const allImages = db.query("SELECT * FROM artwork_images WHERE artwork_id = $id ORDER BY sort_order ASC, id ASC")
      .all({ $id: Number(id) }) as any[];

    // Chosen image first, rest in their existing order
    const reordered = [image, ...allImages.filter(img => img.id !== Number(imageId))];
    const updateOrder = db.prepare("UPDATE artwork_images SET sort_order = $sort_order WHERE id = $id");
    reordered.forEach((img, i) => updateOrder.run({ $sort_order: i, $id: img.id }));

    // Keep artworks.image_path in sync
    db.prepare("UPDATE artworks SET image_path = $image_path WHERE id = $artwork_id")
      .run({ $image_path: image.image_path, $artwork_id: Number(id) });

    return { ok: true };
  });
