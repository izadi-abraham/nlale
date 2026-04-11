<script setup lang="ts">
import ArtworkCard from "./ArtworkCard.vue";
import type { Artwork } from "@/composables/useArtworks";

defineProps<{
  artworks: Artwork[];
  loading: boolean;
}>();
</script>

<template>
  <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="n in 6" :key="n" class="bg-stone-100 rounded-lg aspect-[4/3] animate-pulse" />
  </div>

  <p v-else-if="!artworks.length" class="text-stone-400 text-center py-20 text-lg">
    No artworks match your filters.
  </p>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ArtworkCard v-for="artwork in artworks" :key="artwork.id" :artwork="artwork" />
  </div>
</template>
