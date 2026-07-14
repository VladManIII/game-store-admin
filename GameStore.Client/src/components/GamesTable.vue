<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "./Button.vue";
import { gameStoreGateway, type Game } from "../api/GameStoreGateway";

const games = ref<Game[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadGames() {
  loading.value = true;
  error.value = null;

  try {
    games.value = await gameStoreGateway.getGames();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadGames();
});
</script>

<template>
  <div class="mb-2 ms-2">
    <Button variant="primary" :disabled="loading" @click="loadGames">
      Add Game +
    </Button>
  </div>

  <table class="w-full table-auto border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-slate-200 text-slate-500">
        <th class="px-4 py-3 font-medium">Name</th>
        <th class="px-4 py-3 font-medium">Genre</th>
        <th class="px-4 py-3 font-medium">Price</th>
        <th class="px-4 py-3 font-medium">Release date</th>
        <th class="px-4 py-3 font-medium">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100">
      <tr v-if="!loading && games.length === 0">
        <td colspan="4" class="px-4 py-6 text-center text-slate-500">
          No games found.
        </td>
      </tr>
      <tr v-for="game in games" :key="game.id" class="hover:bg-slate-200">
        <td class="px-4 py-3 font-medium text-slate-900">{{ game.name }}</td>
        <td class="px-4 py-3 text-slate-700">{{ game.genre }}</td>
        <td class="px-4 py-3 text-slate-700">${{ game.price.toFixed(2) }}</td>
        <td class="px-4 py-3 text-slate-700">
          {{ new Date(game.releaseDate).toLocaleDateString() }}
        </td>
        <td>
          <Button
            variant="secondary"
            :disabled="loading"
            @click="loadGames"
            class="me-1"
          >
            Edit ✎
          </Button>

          <Button variant="danger" :disabled="loading" @click="loadGames">
            Delete 🗑
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
