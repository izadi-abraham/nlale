<script setup lang="ts">
import { RouterLink } from "vue-router";
import { API_URL, type Artwork } from "@/composables/useArtworks";

defineProps<{ artwork: Artwork }>();
</script>

<template>
  <RouterLink :to="`/artworks/${artwork.id}`" class="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="aspect-[4/3] bg-stone-100 overflow-hidden">
      <img
        :src="`${API_URL}/${artwork.image_path}`"
        :alt="artwork.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        @error="($event.target as HTMLImageElement).src = 'https://placehold.co/400x300/e7e5e4/a8a29e?text=No+Image'"
      />
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-stone-800 truncate">{{ artwork.title }}</h3>
      <p class="text-sm text-stone-500 mt-0.5 capitalize">{{ artwork.medium }} · {{ artwork.year }}</p>
    </div>
  </RouterLink>
</template>
