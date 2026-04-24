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
    <nav class="absolute top-[62%] -translate-y-0 tracking-[0.20em] left-7 text-xs font-medium md:text-[15px] md:top-auto md:bottom-16 md:translate-y-0 md:left-1/2 md:-translate-x-1/2 flex flex-col items-start md:items-center gap-5 md:gap-6 font-bold">
      <RouterLink
        :to="{ name: 'gallery', query: { type: 'painting' } }"
        class="nav-link uppercase select-none hover:underline underline-offset-4 transition-opacity"
        style="color: #e8dfd4;"
      >Painting</RouterLink>
      <RouterLink
        :to="{ name: 'gallery', query: { type: 'drawing' } }"
        class="nav-link uppercase select-none hover:underline underline-offset-4 transition-opacity"
        style="color: #e8dfd4;"
      >Drawing</RouterLink>
      <RouterLink
        :to="{ name: 'gallery', query: { type: 'sculpture' } }"
        class="nav-link uppercase select-none hover:underline underline-offset-4 transition-opacity"
        style="color: #e8dfd4;"
      >Sculpture</RouterLink>
      <RouterLink
        to="/about"
        class="nav-link uppercase select-none hover:underline underline-offset-4 transition-opacity"
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

@media (min-width: 768px) {
  .home-bg {
    background-size: 104% auto;
    background-position: 0% top;
  }

  .nav-link {
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    color: #ffffff;
  }
}

@media (max-width: 768px) and (orientation: portrait) {
  .home-bg {
    background-size: auto 105%;
    background-position: 40% top;
  }
}
</style>
