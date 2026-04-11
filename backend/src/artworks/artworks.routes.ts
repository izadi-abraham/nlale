import { Elysia, t } from "elysia";
import db from "../db";

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
  });
