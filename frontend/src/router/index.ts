import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuth } from "@/composables/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/work", name: "gallery", component: () => import("../views/GalleryView.vue") },
    { path: "/work/:id", name: "artwork-detail", component: () => import("../views/ArtworkDetail.vue") },
    { path: "/about", name: "about", component: () => import("../views/AboutView.vue") },

    // Admin
    { path: "/admin/login", name: "admin-login", component: () => import("../views/admin/AdminLogin.vue") },
    { path: "/admin", name: "admin", component: () => import("../views/admin/AdminDashboard.vue"), meta: { requiresAuth: true } },
    { path: "/admin/artworks/new", name: "admin-artwork-new", component: () => import("../views/admin/AdminArtworkNew.vue"), meta: { requiresAuth: true } },
    { path: "/admin/artworks/:id/edit", name: "admin-artwork-edit", component: () => import("../views/admin/AdminArtworkEdit.vue"), meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated.value) return { name: "admin-login" };
  }
});

export default router;
