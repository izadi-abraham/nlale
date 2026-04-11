<script setup lang="ts">
import { onMounted } from "vue";
import { useArtworks } from "@/composables/useArtworks";
import GalleryGrid from "@/components/GalleryGrid.vue";
import FilterBar from "@/components/FilterBar.vue";

const { artworks, filters, loading, activeFilters, fetchFilters, fetchArtworks, setFilter, clearFilters } = useArtworks();

onMounted(async () => {
  await fetchFilters();
  await fetchArtworks();
});
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-8">
      <FilterBar
        :filters="filters"
        :active="activeFilters"
        @change="setFilter"
        @clear="clearFilters"
      />
    </div>
    <GalleryGrid :artworks="artworks" :loading="loading" />
  </main>
</template>
