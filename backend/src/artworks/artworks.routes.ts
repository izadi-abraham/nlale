import { Elysia, t } from "elysia";
import { join } from "path";
import db from "../db";

const uploadsDir = process.env.UPLOADS_DIR ?? join(import.meta.dir, "../../uploads");

const ArtworkQuery = t.Object({
  type:       t.Optional(t.String()),
  year:       t.Optional(t.String()),
  medium:     t.Optional(t.String()),
  collection: t.Optional(t.String()),
});

export const artworksRoutes = new Elysia({ prefix: "/api" })

  .get("/artworks", ({ query }) => {
    const { type, year, medium, collection } = query;

    const conditions: string[] = [];
    const params: Record<string, string | number> = {};

    if (type)       { conditions.push("type = $type");             params.$type = type; }
    if (year)       { conditions.push("year = $year");             params.$year = Number(year); }
    if (medium)     { conditions.push("medium = $medium");         params.$medium = medium; }
    if (collection) { conditions.push("collection = $collection"); params.$collection = collection; }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    return db
      .query(`SELECT * FROM artworks ${where} ORDER BY year DESC, id DESC`)
      .all(params);
  }, { query: ArtworkQuery })

  .get("/artworks/:id", ({ params: { id }, error }) => {
    const artwork = db
      .query("SELECT * FROM artworks WHERE id = $id")
      .get({ $id: Number(id) });

    if (!artwork) return error(404, { message: "Artwork not found" });
    return artwork;
  })

  .get("/filters", () => {
    const types       = db.query("SELECT DISTINCT type       FROM artworks ORDER BY type").all()       .map((r: any) => r.type);
    const years       = db.query("SELECT DISTINCT year       FROM artworks ORDER BY year DESC").all()  .map((r: any) => r.year);
    const mediums     = db.query("SELECT DISTINCT medium     FROM artworks ORDER BY medium").all()     .map((r: any) => r.medium);
    const collections = db.query("SELECT DISTINCT collection FROM artworks ORDER BY collection").all() .map((r: any) => r.collection);

    return { types, years, mediums, collections };
  })

  .post("/artworks", async ({ body }) => {
    const { file, title, description, type, year, medium, collection, dimensions } = body;

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const filename = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}.${ext}`;
    const filepath = join(uploadsDir, filename);

    await Bun.write(filepath, await file.arrayBuffer());

    const insert = db.prepare(`
      INSERT INTO artworks (title, description, image_path, type, year, medium, collection, dimensions)
      VALUES ($title, $description, $image_path, $type, $year, $medium, $collection, $dimensions)
    `);

    const result = insert.run({
      $title:       title,
      $description: description ?? "",
      $image_path:  `uploads/${filename}`,
      $type:        type,
      $year:        Number(year),
      $medium:      medium,
      $collection:  collection ?? "",
      $dimensions:  dimensions ?? "",
    });

    return { id: result.lastInsertRowid };
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
  });
