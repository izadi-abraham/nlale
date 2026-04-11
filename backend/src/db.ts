import { Database } from "bun:sqlite";
import { join } from "path";

const db = new Database(process.env.DB_PATH ?? join(import.meta.dir, "../../gallery.db"), {
  create: true,
});

db.run("PRAGMA journal_mode = WAL");

db.run(`
  CREATE TABLE IF NOT EXISTS artworks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    image_path  TEXT    NOT NULL,
    type        TEXT    NOT NULL CHECK (type IN ('painting', 'sculpture')),
    year        INTEGER NOT NULL,
    medium      TEXT    NOT NULL,
    collection  TEXT    NOT NULL DEFAULT '',
    dimensions  TEXT    NOT NULL DEFAULT '',
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  )
`);

export default db;
