<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "./Button.vue";
import GameDialog from "./GameDialog.vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import { gamesGateway, type Game } from "../api/GamesGateway.js";
import { useToast } from "../composables/useToast.js";

const { addToast } = useToast();

const games = ref<Game[]>([]);
const loading = ref(true);
const dialogRef = ref<InstanceType<typeof GameDialog> | null>(null);
const confirmationDialogRef = ref<InstanceType<
  typeof ConfirmationDialog
> | null>(null);

async function loadGames() {
  loading.value = true;

  try {
    games.value = await gamesGateway.getGames();
  } catch (err) {
    addToast(
      `Failed to load games: ${err instanceof Error ? err.message : String(err)}`,
      "error",
    );
  } finally {
    loading.value = false;
  }
}

function addGame() {
  dialogRef.value?.open();
}

function editGame(gameId: number) {
  dialogRef.value?.open(gameId);
}

async function deleteGame(game: Game) {
  const confirmed = await confirmationDialogRef.value?.open(
    `Are you sure you want to delete "${game.name}"?`,
  );

  if (!confirmed) return;

  loading.value = true;

  try {
    await gamesGateway.deleteGame(game.id);
    await loadGames();
  } catch (err) {
    addToast(
      `Failed to delete "${game.name}": ${err instanceof Error ? err.message : String(err)}`,
      "error",
    );
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
    <Button variant="primary" :disabled="loading" @click="addGame">
      Add Game +
    </Button>
  </div>

  <GameDialog ref="dialogRef" @saved="loadGames" />
  <ConfirmationDialog ref="confirmationDialogRef" />

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
        <td colspan="5" class="px-4 py-6 text-center text-slate-500">
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
            @click="editGame(game.id)"
            class="me-1"
          >
            Edit ✎
          </Button>

          <Button
            variant="danger"
            :disabled="loading"
            @click="deleteGame(game)"
          >
            Delete 🗑
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
