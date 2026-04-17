<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { fetchArtwork, API_URL, type Artwork } from "@/composables/useArtworks";

const route = useRoute();
const artwork = ref<Artwork | null>(null);
const loading = ref(true);
const notFound = ref(false);
const selectedIndex = ref(0);

onMounted(async () => {
  const result = await fetchArtwork(Number(route.params.id));
  if (!result) notFound.value = true;
  else artwork.value = result;
  loading.value = false;
});

function imageUrl(path: string) {
  return `${API_URL}/${path}`;
}
</script>

<template>
  <main class="max-w-5xl mx-auto px-4 py-10">
    <RouterLink to="/work" class="text-sm text-stone-400 hover:text-stone-700 transition-colors">
      ← Back
    </RouterLink>

    <div v-if="loading" class="mt-8 grid md:grid-cols-2 gap-10">
      <div class="aspect-[4/3] bg-stone-100 rounded-lg animate-pulse" />
      <div class="space-y-4">
        <div class="h-8 bg-stone-100 rounded animate-pulse w-3/4" />
        <div class="h-4 bg-stone-100 rounded animate-pulse w-1/2" />
        <div class="h-24 bg-stone-100 rounded animate-pulse" />
      </div>
    </div>

    <p v-else-if="notFound" class="mt-10 text-stone-400 text-center text-lg">
      Artwork not found.
    </p>

    <div v-else-if="artwork" class="mt-8 grid md:grid-cols-2 gap-10 items-start">
      <!-- Image column -->
      <div>
        <img
          :src="artwork.images?.[selectedIndex]
            ? imageUrl(artwork.images[selectedIndex].image_path)
            : imageUrl(artwork.image_path)"
          :alt="artwork.title"
          class="w-full object-contain"
          @error="($event.target as HTMLImageElement).src = 'https://placehold.co/600x450/e7e5e4/a8a29e?text=No+Image'"
        />

        <!-- Thumbnail strip (only if multiple images) -->
        <div v-if="artwork.images && artwork.images.length > 1" class="flex gap-2 mt-3 flex-wrap">
          <button
            v-for="(img, i) in artwork.images"
            :key="img.id"
            @click="selectedIndex = i"
            class="w-14 h-14 overflow-hidden flex-shrink-0 transition-opacity"
            :class="selectedIndex === i ? 'opacity-100 ring-1 ring-stone-800' : 'opacity-50 hover:opacity-80'"
          >
            <img
              :src="imageUrl(img.image_path)"
              class="w-full h-full object-cover"
              @error="($event.target as HTMLImageElement).src = 'https://placehold.co/56x56/e7e5e4/a8a29e?text=?'"
            />
          </button>
        </div>
      </div>

      <!-- Info column -->
      <div>
        <h1 class="text-3xl font-semibold text-stone-800">{{ artwork.title }}</h1>
        <p class="mt-1 text-stone-400 text-sm capitalize">{{ artwork.type }}</p>

        <p class="mt-6 text-stone-600 leading-relaxed">{{ artwork.description }}</p>

        <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt class="text-stone-400 uppercase tracking-wide text-xs">Medium</dt>
            <dd class="mt-1 text-stone-700 capitalize">{{ artwork.medium }}</dd>
          </div>
          <div>
            <dt class="text-stone-400 uppercase tracking-wide text-xs">Year</dt>
            <dd class="mt-1 text-stone-700">{{ artwork.year }}</dd>
          </div>
          <div>
            <dt class="text-stone-400 uppercase tracking-wide text-xs">Dimensions</dt>
            <dd class="mt-1 text-stone-700">{{ artwork.dimensions }}</dd>
          </div>
          <div v-if="artwork.collection">
            <dt class="text-stone-400 uppercase tracking-wide text-xs">Collection</dt>
            <dd class="mt-1 text-stone-700">{{ artwork.collection }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </main>
</template>
