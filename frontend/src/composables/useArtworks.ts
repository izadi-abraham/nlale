import { ref, computed } from "vue";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const API = API_URL;

export interface ArtworkImage {
  id: number;
  image_path: string;
  sort_order: number;
}

export interface Artwork {
  id: number;
  title: string;
  description: string;
  image_path: string;
  type: string;
  year: number;
  medium: string;
  collection: string;
  dimensions: string;
  created_at: string;
  images?: ArtworkImage[];
}

export interface Filters {
  types: string[];
  years: number[];
  mediums: string[];
  collections: string[];
}

export function useArtworks() {
  const artworks = ref<Artwork[]>([]);
  const filters = ref<Filters>({ types: [], years: [], mediums: [], collections: [] });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeFilters = ref<Record<string, string>>({});

  async function fetchFilters() {
    const res = await fetch(`${API}/api/filters`);
    filters.value = await res.json();
  }

  async function fetchArtworks() {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(activeFilters.value).filter(([, v]) => v))
      );
      const res = await fetch(`${API}/api/artworks?${params}`);
      artworks.value = await res.json();
    } catch (e) {
      error.value = "Could not load artworks.";
    } finally {
      loading.value = false;
    }
  }

  function setFilter(key: string, value: string) {
    if (value) activeFilters.value[key] = value;
    else delete activeFilters.value[key];
    fetchArtworks();
  }

  function clearFilters() {
    activeFilters.value = {};
    fetchArtworks();
  }

  return { artworks, filters, loading, error, activeFilters: computed(() => activeFilters.value), fetchFilters, fetchArtworks, setFilter, clearFilters };
}

export async function fetchArtwork(id: number): Promise<Artwork | null> {
  const res = await fetch(`${API}/api/artworks/${id}`);
  if (!res.ok) return null;
  return res.json();
}
