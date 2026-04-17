<script setup lang="ts">
import ArtworkCard from "./ArtworkCard.vue";
import type { Artwork } from "@/composables/useArtworks";

defineProps<{
  artworks: Artwork[];
  loading: boolean;
}>();
</script>

<template>
  <div v-if="loading" class="columns-2 md:columns-3 gap-1">
    <div v-for="n in 6" :key="n" class="break-inside-avoid mb-1 aspect-[4/3] bg-stone-100 animate-pulse" />
  </div>

  <p v-else-if="!artworks.length" class="text-stone-400 text-center py-20 text-sm tracking-widest uppercase">
    No works found.
  </p>

  <div v-else class="columns-2 md:columns-3 gap-1">
    <div
      v-for="(artwork, i) in artworks"
      :key="artwork.id"
      class="break-inside-avoid mb-1 card-enter"
      :style="`animation-delay: ${i * 40}ms`"
    >
      <ArtworkCard :artwork="artwork" />
    </div>
  </div>
</template>

<style scoped>
.card-enter {
  animation: cardIn 0.4s ease both;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
