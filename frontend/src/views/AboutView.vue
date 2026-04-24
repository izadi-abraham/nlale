<script setup lang="ts">
import { ref, onMounted } from "vue";

const visible = ref(false);
onMounted(() => { visible.value = true; });
</script>

<template>
  <main class="max-w-4xl mx-auto px-6 py-8 md:py-24">
    <div
      class="grid md:grid-cols-2 gap-8 md:gap-16 items-start transition-all duration-500 ease-out"
      :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
    >
      <!-- Photo -->
      <div>
        <img
          src="/profile.jpg"
          alt="Negin Lale"
          class="w-full object-cover grayscale"
        />
      </div>

      <!-- Text -->
      <div class="space-y-6">

        <div class="space-y-5 text-stone-600 leading-relaxed text-sm">
          <p>
            I started painting as a child, encouraged by my mother, and joined art classes from an early age.
            Growing up in Iran, I was surrounded by the beautiful patterns, colors, and details of Persian carpets.
            These early memories had a strong influence on the way I see art and inspired me to study Carpet Design
            at university, where I learned more about Persian traditions, balance, and design.
          </p>
          <p>
            After finishing my studies, I felt a strong desire to return to painting. I continued my education
            at a private academy in Tehran, focusing on drawing, painting, and working from observation.
          </p>
          <p>
            A few years later, I moved to the Netherlands and started a new chapter in my life and artistic journey.
            There, I began studying sculpture at the Figura Academy in Amsterdam. Learning sculpture helped me better
            understand the human body, form, and space — and it continues to support my painting practice.
          </p>
          <p>
            Today, my work brings together memories of Iranian culture and a contemporary figurative style, shaped
            by both my education and my experience of living between two cultures.
          </p>
        </div>

        <div class="pt-4">
          <h2 class="text-xs uppercase tracking-widest text-stone-400 mb-3">Contact</h2>
          <div class="space-y-1 text-sm">
            <a href="mailto:hello@nlale.nl" class="block text-stone-500 hover:text-stone-800 transition-colors">hello@nlale.nl</a>
            <a href="https://www.instagram.com/negin.lale" target="_blank" class="block text-stone-500 hover:text-stone-800 transition-colors">Instagram</a>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>
