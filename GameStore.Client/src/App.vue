<script setup lang="ts">
import ToastContainer from "./components/ToastContainer.vue";
</script>

<template>
  <h1 class="text-4xl text-center mt-20 mb-8">
    Welcome to VladMan GameShop admin
  </h1>

  <nav class="mb-6 flex justify-center gap-4 text-sm font-medium">
    <RouterLink
      to="/games"
      class="text-slate-700 hover:text-slate-900"
      active-class="text-slate-900 underline"
    >
      Games
    </RouterLink>

    <RouterLink
      to="/genres"
      class="text-slate-700 hover:text-slate-900"
      active-class="text-slate-900 underline"
    >
      Genres
    </RouterLink>
  </nav>

  <div class="ms-2 me-2">
    <RouterView />
  </div>

  <ToastContainer />
</template>
