<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div
    class="relative w-full h-screen flex items-center justify-center cursor-pointer overflow-hidden"
    @click="router.push('/work')"
  >
    <!-- Background -->
    <div class="absolute inset-0" style="background-image: url('/painting-0.jpg'); background-size: cover; background-position: top center; background-repeat: no-repeat; " />

    <!-- Logo -->
    <img src="/logo-sig.png" alt="N.lale" class="absolute top-10 left-12 select-none" style="height: 60px; width: auto;" />

    <!-- Enter -->
    <div class="absolute bottom-8 right-10 text-stone-200/60 text-xs tracking-[0.2em] uppercase select-none">enter →</div>
  </div>
</template>
