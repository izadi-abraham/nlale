<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 home-bg" />

    <!-- Logo -->
    <img
      src="/logo-sig.png"
      alt="N.lale"
      class="absolute top-3 left-2 md:top-10 md:left-10 h-10 md:h-[60px] w-auto select-none"
    />

    <!-- Nav -->
    <nav class="absolute bottom-8 left-6 md:bottom-10 md:left-12 flex gap-8">
      <RouterLink
        to="/work"
        class="text-sm tracking-[0.25em] uppercase select-none hover:underline underline-offset-4 transition-opacity"
        style="color: #e8dfd4;"
      >Work</RouterLink>
      <RouterLink
        to="/about"
        class="text-sm tracking-[0.25em] uppercase select-none hover:underline underline-offset-4 transition-opacity"
        style="color: #e8dfd4;"
      >About</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home-bg {
  background-image: url('/painting-0.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}

@media (max-width: 768px) and (orientation: portrait) {
  .home-bg {
    background-size: auto 105%;
    background-position: 40% top;
  }
}
</style>
