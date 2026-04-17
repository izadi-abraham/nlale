<script setup lang="ts">
import type { Filters } from "@/composables/useArtworks";

const props = defineProps<{
  filters: Filters;
  activeType: string;
  sort: "newest" | "oldest";
}>();

const emit = defineEmits<{
  setType: [value: string];
  setSort: [value: "newest" | "oldest"];
}>();
</script>

<template>
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <!-- Type pills -->
    <div class="flex gap-2 flex-wrap">
      <button
        @click="emit('setType', '')"
        class="px-4 py-1.5 text-xs tracking-widest uppercase rounded-full border transition-colors"
        :class="activeType === ''
          ? 'bg-stone-800 text-white border-stone-800'
          : 'text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-800'"
      >All</button>
      <button
        v-for="t in filters.types"
        :key="t"
        @click="emit('setType', t)"
        class="px-4 py-1.5 text-xs tracking-widest uppercase rounded-full border transition-colors capitalize"
        :class="activeType === t
          ? 'bg-stone-800 text-white border-stone-800'
          : 'text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-800'"
      >{{ t }}</button>
    </div>

    <!-- Sort toggle -->
    <button
      @click="emit('setSort', sort === 'newest' ? 'oldest' : 'newest')"
      class="text-xs text-stone-400 hover:text-stone-700 tracking-widest uppercase transition-colors"
    >{{ sort === 'newest' ? 'Newest ↓' : 'Oldest ↑' }}</button>
  </div>
</template>
