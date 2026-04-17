import { ref, computed } from "vue";
import { API_URL } from "./useArtworks";

const TOKEN_KEY = "nlale_admin_token";

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  async function login(password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return { ok: false, error: "Invalid password" };
      const data = await res.json();
      token.value = data.token;
      localStorage.setItem(TOKEN_KEY, data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach server" };
    }
  }

  function logout() {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  function authHeader(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return { isAuthenticated, login, logout, authHeader };
}
