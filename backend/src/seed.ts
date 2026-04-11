import db from "./db";

db.run("DELETE FROM artworks");

const insert = db.prepare(`
  INSERT INTO artworks (title, description, image_path, type, year, medium, collection, dimensions)
  VALUES ($title, $description, $image_path, $type, $year, $medium, $collection, $dimensions)
`);

const artworks = [
  {
    $title:       "Blue Coast",
    $description: "A serene view of the Aegean coast at dusk, painted en plein air.",
    $image_path:  "uploads/blue-coast.jpg",
    $type:        "painting",
    $year:        2023,
    $medium:      "oil",
    $collection:  "Seascapes",
    $dimensions:  "40×50 cm",
  },
  {
    $title:       "Morning Tide",
    $description: "Early morning light breaking over calm waters.",
    $image_path:  "uploads/morning-tide.jpg",
    $type:        "painting",
    $year:        2023,
    $medium:      "watercolor",
    $collection:  "Seascapes",
    $dimensions:  "30×40 cm",
  },
  {
    $title:       "Olive Grove",
    $description: "Ancient olive trees in the afternoon heat of a Greek summer.",
    $image_path:  "uploads/olive-grove.jpg",
    $type:        "painting",
    $year:        2022,
    $medium:      "oil",
    $collection:  "Landscapes",
    $dimensions:  "60×80 cm",
  },
  {
    $title:       "Silent Village",
    $description: "Whitewashed houses resting under a midday sun.",
    $image_path:  "uploads/silent-village.jpg",
    $type:        "painting",
    $year:        2022,
    $medium:      "acrylic",
    $collection:  "Landscapes",
    $dimensions:  "50×70 cm",
  },
  {
    $title:       "First Form",
    $description: "An abstract exploration of the human figure emerging from raw clay.",
    $image_path:  "uploads/first-form.jpg",
    $type:        "sculpture",
    $year:        2024,
    $medium:      "clay",
    $collection:  "Figures",
    $dimensions:  "15×30×12 cm",
  },
  {
    $title:       "Roots",
    $description: "A twisted wooden form evoking the resilience of ancient trees.",
    $image_path:  "uploads/roots.jpg",
    $type:        "sculpture",
    $year:        2023,
    $medium:      "wood",
    $collection:  "Nature",
    $dimensions:  "20×45×15 cm",
  },
];

for (const artwork of artworks) {
  insert.run(artwork);
}

console.log(`Seeded ${artworks.length} artworks.`);
