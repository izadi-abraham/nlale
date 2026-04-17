<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <header v-if="route.name !== 'home'" class="border-b border-stone-100 bg-white">
    <div class="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
      <RouterLink to="/work" class="text-stone-800 tracking-tight" style="font-family: 'Caveat', cursive; font-size: 1.3rem;">n.lale</RouterLink>
      <nav class="flex gap-6 text-sm text-stone-500">
        <RouterLink to="/work" class="hover:text-stone-800 transition-colors" active-class="text-stone-800 font-medium">Work</RouterLink>
        <RouterLink to="/about" class="hover:text-stone-800 transition-colors" active-class="text-stone-800 font-medium">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
