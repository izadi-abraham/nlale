<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <header v-if="route.name !== 'home' && !route.path.startsWith('/admin')" class="border-b border-stone-200 bg-stone-50">
    <div class="px-12 py-8 flex items-center justify-between">
      <RouterLink to="/">
        <img src="/logo-sig.png" alt="n.lale" style="height: 60px; width: auto; filter: invert(1) sepia(0.15) saturate(0.8);" />
      </RouterLink>
      <nav class="flex gap-6 text-sm text-stone-500">
        <RouterLink to="/work" class="hover:text-stone-800 transition-colors" active-class="text-stone-800 font-medium">Work</RouterLink>
        <RouterLink to="/about" class="hover:text-stone-800 transition-colors" active-class="text-stone-800 font-medium">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
