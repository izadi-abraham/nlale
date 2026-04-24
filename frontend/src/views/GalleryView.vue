<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useArtworks } from "@/composables/useArtworks";
import GalleryGrid from "@/components/GalleryGrid.vue";
import FilterBar from "@/components/FilterBar.vue";

const route = useRoute();
const { artworks, filters, loading, fetchFilters, fetchArtworks, setFilter } = useArtworks();

const activeType = ref((route.query.type as string) || "");
const sort = ref<"newest" | "oldest">("newest");

const displayed = computed(() => {
  const list = [...artworks.value];
  return sort.value === "newest"
    ? list.sort((a, b) => b.year - a.year)
    : list.sort((a, b) => a.year - b.year);
});

function setType(value: string) {
  activeType.value = value;
  setFilter("type", value);
}

onMounted(async () => {
  await fetchFilters();
  if (activeType.value) {
    setFilter("type", activeType.value);
  } else {
    await fetchArtworks();
  }
});
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-8">
      <FilterBar
        :filters="filters"
        :active-type="activeType"
        :sort="sort"
        @set-type="setType"
        @set-sort="sort = $event"
      />
    </div>
    <GalleryGrid :artworks="displayed" :loading="loading" />
  </main>
</template>
