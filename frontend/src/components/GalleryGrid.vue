<script setup lang="ts">
import ArtworkCard from "./ArtworkCard.vue";
import type { Artwork } from "@/composables/useArtworks";

defineProps<{
  artworks: Artwork[];
  loading: boolean;
}>();

// Varied aspect ratios so the skeleton looks like a real masonry layout
const skeletonAspects = [
  "aspect-[3/4]", "aspect-[4/3]", "aspect-[2/3]",
  "aspect-[3/4]", "aspect-square", "aspect-[4/5]",
  "aspect-[3/4]", "aspect-[16/9]", "aspect-[2/3]",
];
</script>

<template>
  <!-- Skeleton -->
  <div v-if="loading" class="columns-2 md:columns-3 gap-1">
    <div
      v-for="(aspect, n) in skeletonAspects"
      :key="n"
      class="break-inside-avoid mb-1 bg-stone-100 animate-pulse"
      :class="aspect"
    />
  </div>

  <!-- Empty state -->
  <p v-else-if="!artworks.length" class="text-stone-400 text-center py-20 text-sm tracking-widest uppercase">
    No works found.
  </p>

  <!-- Grid -->
  <div v-else class="columns-2 md:columns-3 gap-1">
    <div
      v-for="(artwork, i) in artworks"
      :key="artwork.id"
      class="break-inside-avoid mb-1 opacity-0 animate-[cardIn_0.4s_ease_forwards]"
      :style="`animation-delay: ${i * 40}ms`"
    >
      <ArtworkCard :artwork="artwork" />
    </div>
  </div>
</template>

<style scoped>
@keyframes cardIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
