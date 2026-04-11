import { createRouter, createWebHistory } from "vue-router";
import GalleryView from "../views/GalleryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "gallery",
      component: GalleryView,
    },
    {
      path: "/artworks/:id",
      name: "artwork-detail",
      component: () => import("../views/ArtworkDetail.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
