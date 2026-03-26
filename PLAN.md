# n.lale — Painter Gallery Web App

## Naming
| Context | Value |
|---|---|
| Site display name (what visitors see) | **n.lale** (matches her painting signature) |
| GitHub repo | `nlale` |
| Domain (future) | `nlale.art` |

## Context
A simple, beautiful gallery web app to showcase the wife's paintings. No admin UI in v1 — paintings are managed by seeding a database manually. The app must support multiple organization dimensions (collection/series, medium, year) so visitors can filter any way. The architecture should make it easy to add an admin panel, online store, or auth later.

This is also a learning project: Bun is the central runtime the developer wants to explore.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | **Bun** | Learning goal; great DX, fast, built-in SQLite & test runner |
| Backend | **Elysia** | Bun-native framework (like Express but built for Bun); excellent TypeScript support |
| Database | **bun:sqlite** | Zero config, built into Bun, perfect scale for a gallery |
| Frontend | **Vue 3 + Vite** | Most familiar framework — no extra learning curve |
| Styling | **Tailwind CSS** | Utility-first, great for responsive gallery layouts |
| Images | Local `uploads/` directory | Served as static files; swap for S3/Cloudinary later |

> **About Zig:** Not suited for web development directly. A fun complementary side project: a small Zig CLI tool called via `bun:ffi` that resizes/optimizes uploaded images.

---

## Project Structure

```
nlale/
├── frontend/                  # Vue 3 + Vite (run with Bun)
│   ├── src/
│   │   ├── components/
│   │   │   ├── GalleryGrid.vue
│   │   │   ├── ArtworkCard.vue
│   │   │   └── FilterBar.vue
│   │   ├── views/
│   │   │   ├── GalleryView.vue
│   │   │   ├── ArtworkDetail.vue
│   │   │   └── AboutView.vue
│   │   ├── composables/
│   │   │   └── useArtworks.ts
│   │   └── router/index.ts
│   └── package.json
├── backend/                   # Elysia on Bun
│   ├── src/
│   │   ├── index.ts           # Elysia app entry point
│   │   ├── db.ts              # bun:sqlite schema + connection
│   │   ├── artworks/
│   │   │   └── artworks.routes.ts
│   │   └── seed.ts            # Run once to populate artworks
│   ├── uploads/               # Artwork image files
│   └── package.json
└── PLAN.md
```

---

## Data Model

```typescript
Artwork {
  id:          number       // auto-increment primary key
  title:       string
  description: string
  image_path:  string       // e.g. "uploads/blue-coast.jpg"
  type:        string       // "painting" | "sculpture"
  year:        number       // e.g. 2024
  medium:      string       // paintings: "oil", "watercolor" | sculptures: "clay", "bronze", "wood"
  collection:  string       // series name, e.g. "Seascapes"
  dimensions:  string       // paintings: "30×40 cm" | sculptures: "20×15×10 cm" (W×H×D)
  created_at:  string       // ISO timestamp
}
```

The `type` field allows filtering to paintings or sculptures only. The filter bar and API both support `?type=painting` or `?type=sculpture`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/artworks` | List all artworks; supports `?type=&year=&medium=&collection=` |
| GET | `/api/artworks/:id` | Single artwork detail |
| GET | `/api/filters` | Returns unique types, years, mediums, collections for the filter UI |
| GET | `/uploads/*` | Static image file serving |

---

## Seed Script

`backend/src/seed.ts` — edit to add or update artworks, then run:
```bash
bun run seed
```

---

## V1 Features

1. **Gallery grid** — responsive grid, each card shows image + title + medium
2. **Filter bar** — filter by type (painting/sculpture), year, medium, and/or collection simultaneously
3. **Artwork detail page** — full image, title, description, dimensions, year, medium, collection
4. **About page** — artist bio, contact info
5. **Responsive design** — mobile-first with Tailwind

---

## Development Setup

```bash
# Backend
cd backend && bun install && bun run dev    # Elysia on port 3000

# Frontend
cd frontend && bun install && bun run dev  # Vite on port 5173
```

CORS is configured in Elysia to allow the Vite dev origin.

---

## Low-Cost Hosting Strategy (for later)

| Layer | Service | Cost |
|---|---|---|
| Frontend | Cloudflare Pages | Free |
| Backend (Elysia + SQLite + images) | Fly.io (single small machine) | Free tier / ~$3/mo |
| Domain | Cloudflare Registrar — `nlale.art` | ~$10/year |
| Images (if collection grows large) | Cloudflare R2 | ~$0/mo for small use |

SQLite lives on the Fly.io machine alongside the backend — no separate DB cost. Total: **$0–$3/month** + domain.

---

## Future Milestones
- Admin panel (upload + manage artworks via UI)
- Online store (Stripe integration)
- Nuxt.js rewrite of frontend (learning milestone)
- Zig image optimizer via `bun:ffi`
