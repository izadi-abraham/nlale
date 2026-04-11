<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="border-b border-stone-100 bg-white">
    <div class="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
      <RouterLink to="/" class="text-xl font-semibold tracking-tight text-stone-800">n.lale</RouterLink>
      <nav class="flex gap-6 text-sm text-stone-500">
        <RouterLink to="/" class="hover:text-stone-800 transition-colors" active-class="text-stone-800 font-medium">Gallery</RouterLink>
        <RouterLink to="/about" class="hover:text-stone-800 transition-colors" active-class="text-stone-800 font-medium">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
