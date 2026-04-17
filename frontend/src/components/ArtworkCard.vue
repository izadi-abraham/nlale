<script setup lang="ts">
import { RouterLink } from "vue-router";
import { API_URL, type Artwork } from "@/composables/useArtworks";

defineProps<{ artwork: Artwork }>();
</script>

<template>
  <RouterLink :to="`/work/${artwork.id}`" class="group block relative overflow-hidden bg-stone-100">
    <img
      :src="`${API_URL}/${artwork.image_path}`"
      :alt="artwork.title"
      class="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      @error="($event.target as HTMLImageElement).src = 'https://placehold.co/400x300/e7e5e4/a8a29e?text=No+Image'"
    />
    <!-- Title overlay on hover -->
    <div class="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-300 flex items-end">
      <div class="p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p class="text-white text-sm font-medium leading-tight">{{ artwork.title }}</p>
        <p class="text-white/60 text-xs mt-0.5 capitalize">{{ artwork.medium }} · {{ artwork.year }}</p>
      </div>
    </div>
  </RouterLink>
</template>
