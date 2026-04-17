<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_URL, type Artwork } from "@/composables/useArtworks";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { authHeader } = useAuth();
const id = Number(route.params.id);

const artwork = ref<Artwork | null>(null);
const form = ref({ title: "", description: "", type: "painting", year: "", medium: "", collection: "", dimensions: "" });
const loading = ref(true);
const saving = ref(false);
const saveError = ref("");
const addingImage = ref(false);
const deletingImageId = ref<number | null>(null);

onMounted(async () => {
  const res = await fetch(`${API_URL}/api/artworks/${id}`);
  const data: Artwork = await res.json();
  artwork.value = data;
  form.value = {
    title: data.title, description: data.description,
    type: data.type, year: String(data.year),
    medium: data.medium, collection: data.collection, dimensions: data.dimensions,
  };
  loading.value = false;
});

async function save() {
  saveError.value = "";
  saving.value = true;
  const res = await fetch(`${API_URL}/api/artworks/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ ...form.value }),
  });
  saving.value = false;
  if (!res.ok) { saveError.value = "Save failed."; return; }
  router.push("/admin");
}

async function addImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !artwork.value) return;
  addingImage.value = true;
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_URL}/api/artworks/${id}/images`, {
    method: "POST", headers: authHeader(), body: fd,
  });
  if (res.ok) {
    const newImg = await res.json();
    artwork.value.images = [...(artwork.value.images ?? []), { id: newImg.id, image_path: newImg.image_path, sort_order: 99 }];
  }
  addingImage.value = false;
  (e.target as HTMLInputElement).value = "";
}

async function deleteImage(imageId: number) {
  if (!confirm("Remove this image?")) return;
  deletingImageId.value = imageId;
  await fetch(`${API_URL}/api/artworks/${id}/images/${imageId}`, {
    method: "DELETE", headers: authHeader(),
  });
  if (artwork.value) {
    artwork.value.images = artwork.value.images?.filter(i => i.id !== imageId);
  }
  deletingImageId.value = null;
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <header class="border-b border-stone-200 bg-white px-12 py-5 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img src="/logo-sig.png" alt="n.lale" class="h-8" style="filter: invert(1) sepia(0.15) saturate(0.8);" />
        <span class="text-xs uppercase tracking-widest text-stone-400">Admin</span>
      </div>
      <button @click="router.push('/admin')" class="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors">← Back</button>
    </header>

    <main class="max-w-2xl mx-auto px-6 py-10">
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 6" :key="n" class="h-10 bg-stone-100 animate-pulse rounded" />
      </div>

      <template v-else-if="artwork">
        <h1 class="text-sm uppercase tracking-widest text-stone-600 mb-8">Edit Artwork</h1>

        <!-- Metadata form -->
        <form @submit.prevent="save" class="space-y-5 mb-12">
          <div class="grid grid-cols-2 gap-5">
            <div class="col-span-2">
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Title</label>
              <input v-model="form.title" type="text" required class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Type</label>
              <select v-model="form.type" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400">
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
              </select>
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Year</label>
              <input v-model="form.year" type="number" required class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Medium</label>
              <input v-model="form.medium" type="text" required class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Dimensions</label>
              <input v-model="form.dimensions" type="text" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div class="col-span-2">
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Collection</label>
              <input v-model="form.collection" type="text" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div class="col-span-2">
              <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none" />
            </div>
          </div>

          <p v-if="saveError" class="text-red-400 text-xs">{{ saveError }}</p>

          <button type="submit" :disabled="saving" class="bg-stone-800 text-white text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-stone-700 transition-colors disabled:opacity-50">
            {{ saving ? "Saving..." : "Save changes" }}
          </button>
        </form>

        <!-- Images -->
        <div>
          <h2 class="text-xs uppercase tracking-widest text-stone-400 mb-4">Images</h2>
          <div class="grid grid-cols-4 gap-2 mb-4">
            <div v-for="img in artwork.images" :key="img.id" class="relative group aspect-square bg-stone-100 overflow-hidden">
              <img :src="`${API_URL}/${img.image_path}`" class="w-full h-full object-cover" />
              <button
                @click="deleteImage(img.id)"
                :disabled="deletingImageId === img.id"
                class="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs uppercase tracking-widest"
              >{{ deletingImageId === img.id ? '...' : 'Remove' }}</button>
            </div>
          </div>

          <label class="inline-block cursor-pointer">
            <span class="border border-stone-300 text-xs uppercase tracking-widest text-stone-500 px-4 py-2 hover:border-stone-500 hover:text-stone-700 transition-colors">
              {{ addingImage ? "Uploading..." : "+ Add image" }}
            </span>
            <input type="file" accept="image/*" class="hidden" @change="addImage" :disabled="addingImage" />
          </label>
        </div>
      </template>
    </main>
  </div>
</template>
