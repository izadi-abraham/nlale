<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "@/composables/useArtworks";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { logout, authHeader } = useAuth();

interface ArtworkRow {
  id: number;
  title: string;
  type: string;
  medium: string;
  year: number;
}

const artworks = ref<ArtworkRow[]>([]);
const loading = ref(true);
const deleting = ref<number | null>(null);

async function fetchAll() {
  loading.value = true;
  const res = await fetch(`${API_URL}/api/artworks`);
  artworks.value = await res.json();
  loading.value = false;
}

async function remove(id: number, title: string) {
  if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  deleting.value = id;
  await fetch(`${API_URL}/api/artworks/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  artworks.value = artworks.value.filter(a => a.id !== id);
  deleting.value = null;
}

function doLogout() {
  logout();
  router.push("/admin/login");
}

onMounted(fetchAll);
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <!-- Admin header -->
    <header class="border-b border-stone-200 bg-white px-12 py-5 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img src="/logo-sig.png" alt="n.lale" class="h-8" style="filter: invert(1) sepia(0.15) saturate(0.8);" />
        <span class="text-xs uppercase tracking-widest text-stone-400">Admin</span>
      </div>
      <button @click="doLogout" class="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors">Logout</button>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-10">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-sm uppercase tracking-widest text-stone-600">Artworks</h1>
        <button
          @click="router.push('/admin/artworks/new')"
          class="bg-stone-800 text-white text-xs uppercase tracking-widest px-4 py-2 hover:bg-stone-700 transition-colors"
        >+ Add</button>
      </div>

      <div v-if="loading" class="space-y-2">
        <div v-for="n in 5" :key="n" class="h-12 bg-stone-100 animate-pulse rounded" />
      </div>

      <div v-else-if="!artworks.length" class="text-stone-400 text-sm text-center py-16">No artworks yet.</div>

      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-stone-200 text-left">
            <th class="pb-3 text-xs uppercase tracking-widest text-stone-400 font-normal">Title</th>
            <th class="pb-3 text-xs uppercase tracking-widest text-stone-400 font-normal">Type</th>
            <th class="pb-3 text-xs uppercase tracking-widest text-stone-400 font-normal">Medium</th>
            <th class="pb-3 text-xs uppercase tracking-widest text-stone-400 font-normal">Year</th>
            <th class="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="artwork in artworks"
            :key="artwork.id"
            class="border-b border-stone-100 hover:bg-white transition-colors"
          >
            <td class="py-3 text-stone-800">{{ artwork.title }}</td>
            <td class="py-3 text-stone-500 capitalize">{{ artwork.type }}</td>
            <td class="py-3 text-stone-500 capitalize">{{ artwork.medium }}</td>
            <td class="py-3 text-stone-500">{{ artwork.year }}</td>
            <td class="py-3 text-right space-x-4">
              <button
                @click="router.push(`/admin/artworks/${artwork.id}/edit`)"
                class="text-xs text-stone-400 hover:text-stone-700 transition-colors uppercase tracking-wider"
              >Edit</button>
              <button
                @click="remove(artwork.id, artwork.title)"
                class="text-xs text-red-300 hover:text-red-500 transition-colors uppercase tracking-wider"
                :disabled="deleting === artwork.id"
              >{{ deleting === artwork.id ? '...' : 'Delete' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>
