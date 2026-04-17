<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "@/composables/useArtworks";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { authHeader } = useAuth();

const form = ref({ title: "", description: "", type: "painting", year: String(new Date().getFullYear()), medium: "", collection: "", dimensions: "" });
const file = ref<File | null>(null);
const error = ref("");
const loading = ref(false);

function onFile(e: Event) {
  file.value = (e.target as HTMLInputElement).files?.[0] ?? null;
}

async function submit() {
  if (!file.value) { error.value = "Please select an image."; return; }
  error.value = "";
  loading.value = true;

  const fd = new FormData();
  fd.append("file", file.value);
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, v));

  const res = await fetch(`${API_URL}/api/artworks`, {
    method: "POST",
    headers: authHeader(),
    body: fd,
  });

  loading.value = false;
  if (!res.ok) { error.value = "Upload failed. Check all fields."; return; }
  router.push("/admin");
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
      <h1 class="text-sm uppercase tracking-widest text-stone-600 mb-8">Add Artwork</h1>

      <form @submit.prevent="submit" class="space-y-5">
        <div class="grid grid-cols-2 gap-5">
          <div class="col-span-2">
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Title *</label>
            <input v-model="form.title" type="text" required class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Type *</label>
            <select v-model="form.type" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400">
              <option value="painting">Painting</option>
              <option value="sculpture">Sculpture</option>
            </select>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Year *</label>
            <input v-model="form.year" type="number" required class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Medium *</label>
            <input v-model="form.medium" type="text" required placeholder="e.g. Oil on canvas" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Dimensions</label>
            <input v-model="form.dimensions" type="text" placeholder="e.g. 60 × 80 cm" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div class="col-span-2">
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Collection</label>
            <input v-model="form.collection" type="text" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div class="col-span-2">
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none" />
          </div>

          <div class="col-span-2">
            <label class="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Image *</label>
            <input type="file" accept="image/*" @change="onFile" required class="text-sm text-stone-500 file:mr-3 file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-widest file:text-stone-600 hover:file:bg-stone-200" />
          </div>
        </div>

        <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="bg-stone-800 text-white text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >{{ loading ? "Uploading..." : "Save" }}</button>
      </form>
    </main>
  </div>
</template>
