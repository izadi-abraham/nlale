<script setup lang="ts">
import type { Filters } from "@/composables/useArtworks";

const props = defineProps<{
  filters: Filters;
  active: Record<string, string>;
}>();

const emit = defineEmits<{
  change: [key: string, value: string];
  clear: [];
}>();

const hasActive = computed(() => Object.values(props.active).some(Boolean));

import { computed } from "vue";
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <select
      class="text-sm bg-white border border-stone-200 rounded-md px-3 py-1.5 text-stone-700 cursor-pointer hover:border-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
      :value="active.type ?? ''"
      @change="emit('change', 'type', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">All types</option>
      <option v-for="t in filters.types" :key="t" :value="t" class="capitalize">{{ t }}</option>
    </select>

    <select
      class="text-sm bg-white border border-stone-200 rounded-md px-3 py-1.5 text-stone-700 cursor-pointer hover:border-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
      :value="active.medium ?? ''"
      @change="emit('change', 'medium', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">All mediums</option>
      <option v-for="m in filters.mediums" :key="m" :value="m" class="capitalize">{{ m }}</option>
    </select>

    <select
      class="text-sm bg-white border border-stone-200 rounded-md px-3 py-1.5 text-stone-700 cursor-pointer hover:border-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
      :value="active.year ?? ''"
      @change="emit('change', 'year', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">All years</option>
      <option v-for="y in filters.years" :key="y" :value="String(y)">{{ y }}</option>
    </select>

    <select
      class="text-sm bg-white border border-stone-200 rounded-md px-3 py-1.5 text-stone-700 cursor-pointer hover:border-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
      :value="active.collection ?? ''"
      @change="emit('change', 'collection', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">All collections</option>
      <option v-for="c in filters.collections" :key="c" :value="c">{{ c }}</option>
    </select>

    <button
      v-if="hasActive"
      class="text-sm text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors"
      @click="emit('clear')"
    >
      Clear filters
    </button>
  </div>
</template>

