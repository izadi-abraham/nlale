<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  const result = await login(password.value);
  loading.value = false;
  if (result.ok) router.push("/admin");
  else error.value = result.error ?? "Login failed";
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <img src="/logo-sig.png" alt="n.lale" class="h-12 mb-10" style="filter: invert(1) sepia(0.15) saturate(0.8);" />

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-xs uppercase tracking-widest text-stone-400 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400"
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

        <button
          type="submit"
          class="w-full bg-stone-800 text-white text-xs uppercase tracking-widest py-2.5 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
          :disabled="loading || !password"
        >{{ loading ? "..." : "Enter" }}</button>
      </form>
    </div>
  </div>
</template>
