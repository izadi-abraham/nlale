<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0" style="background-image: url('/painting-0.jpg'); background-size: cover; background-position: top center; background-repeat: no-repeat;" />

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
