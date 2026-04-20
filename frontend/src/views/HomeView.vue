<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 home-bg" />

    <!-- Logo -->
    <img src="/logo-sig.png" alt="N.lale" class="absolute top-10 left-12 select-none" style="height: 60px; width: auto;" />

    <!-- Nav -->
    <nav class="absolute bottom-10 left-12 flex gap-8">
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

/*
  On portrait phones the painting's aspect ratio is close to the viewport's,
  so "cover" shows the full painting (armchair and all). Force the image
  taller than the viewport so only the upper lamp area is visible,
  matching the desktop crop.
*/
@media (max-width: 768px) and (orientation: portrait) {
  .home-bg {
    background-size: auto 220%;
    background-position: center top;
  }
}
</style>
