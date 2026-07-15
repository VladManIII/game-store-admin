import { createRouter, createWebHistory } from "vue-router";
import GamesView from "../views/GamesView.vue";
import GenresView from "../views/GenresView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/games" },
    { path: "/games", name: "games", component: GamesView },
    { path: "/genres", name: "genres", component: GenresView },
  ],
});
