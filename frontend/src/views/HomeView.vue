<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden" @click="router.push('/work')">
    <img
      src="/painting-4.jpg"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-top select-none"
      draggable="false"
    />

    <div class="absolute top-16 left-24 select-none" style="font-family: 'Caveat', cursive; font-size: 4.5rem; font-weight: 700; line-height: 1; color: #1e2e1c; letter-spacing: 0.02em;">N.lale</div>

    <div class="absolute bottom-8 right-10">
      <span class="text-stone-500 text-xs tracking-[0.2em] uppercase select-none">enter →</span>
    </div>
  </div>
</template>
