import { Database } from "bun:sqlite";
import { join } from "path";

const db = new Database(process.env.DB_PATH ?? join(import.meta.dir, "../../gallery.db"), {
  create: true,
});

db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");

db.run(`
  CREATE TABLE IF NOT EXISTS artworks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    image_path  TEXT    NOT NULL,
    type        TEXT    NOT NULL CHECK (type IN ('painting', 'drawing', 'sculpture')),
    year        INTEGER NOT NULL,
    medium      TEXT    NOT NULL,
    collection  TEXT    NOT NULL DEFAULT '',
    dimensions  TEXT    NOT NULL DEFAULT '',
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  )
`);

// Migrate: widen the type CHECK constraint to include 'drawing'
const artworksSchema = (db.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='artworks'").get() as any)?.sql ?? '';
if (!artworksSchema.includes("'drawing'")) {
  db.run("PRAGMA foreign_keys = OFF");
  db.run("PRAGMA legacy_alter_table = ON");
  db.run("ALTER TABLE artworks RENAME TO artworks_old");
  db.run(`
    CREATE TABLE artworks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    NOT NULL DEFAULT '',
      image_path  TEXT    NOT NULL,
      type        TEXT    NOT NULL CHECK (type IN ('painting', 'drawing', 'sculpture')),
      year        INTEGER NOT NULL,
      medium      TEXT    NOT NULL,
      collection  TEXT    NOT NULL DEFAULT '',
      dimensions  TEXT    NOT NULL DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )
  `);
  db.run("INSERT INTO artworks SELECT * FROM artworks_old");
  db.run("DROP TABLE artworks_old");
  db.run("PRAGMA legacy_alter_table = OFF");
  db.run("PRAGMA foreign_keys = ON");
}

db.run(`
  CREATE TABLE IF NOT EXISTS artwork_images (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    artwork_id INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    image_path TEXT    NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )
`);

// Fix artwork_images FK if it was corrupted by the previous migration
// (SQLite 3.26+ auto-updates FK references on rename, breaking the reference after drop)
const imagesSchema = (db.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='artwork_images'").get() as any)?.sql ?? '';
if (imagesSchema.includes('artworks_old')) {
  db.run("PRAGMA foreign_keys = OFF");
  db.run("PRAGMA legacy_alter_table = ON");
  db.run("ALTER TABLE artwork_images RENAME TO artwork_images_old");
  db.run(`
    CREATE TABLE artwork_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      artwork_id INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
      image_path TEXT    NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);
  db.run("INSERT INTO artwork_images SELECT * FROM artwork_images_old");
  db.run("DROP TABLE artwork_images_old");
  db.run("PRAGMA legacy_alter_table = OFF");
  db.run("PRAGMA foreign_keys = ON");
}

// Migrate existing artworks into artwork_images if the table is empty
const imageCount = (db.query("SELECT COUNT(*) as n FROM artwork_images").get() as any).n;
if (imageCount === 0) {
  const artworks = db.query("SELECT id, image_path FROM artworks").all() as any[];
  const insertImage = db.prepare(
    "INSERT INTO artwork_images (artwork_id, image_path, sort_order) VALUES ($artwork_id, $image_path, 0)"
  );
  for (const a of artworks) {
    insertImage.run({ $artwork_id: a.id, $image_path: a.image_path });
  }
}

export default db;
