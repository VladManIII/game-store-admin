<script setup lang="ts">
import { reactive, ref } from "vue";
import Button from "./Button.vue";
import { gamesGateway, type NewGame } from "../api/GamesGateway.js";
import { genreGateway, type Genre } from "../api/GenreGateway";

const emit = defineEmits<{ saved: [] }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const genres = ref<Genre[]>([]);
const editingId = ref<number | null>(null);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  name: "",
  genreId: 0,
  price: 0,
  releaseDate: "",
});

function resetForm() {
  form.name = "";
  form.genreId = genres.value[0]?.id ?? 0;
  form.price = 0;
  form.releaseDate = "";
  error.value = null;
}

async function loadGenres() {
  if (genres.value.length > 0) return;
  genres.value = await genreGateway.getGenres();
}

async function open(gameId?: number) {
  error.value = null;
  editingId.value = gameId ?? null;
  loading.value = true;

  try {
    await loadGenres();
    resetForm();

    if (gameId) {
      const game = await gamesGateway.getGame(gameId);
      form.name = game.name;
      form.genreId = game.genreId;
      form.price = game.price;
      form.releaseDate = game.releaseDate.slice(0, 10);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    loading.value = false;
  }

  dialogRef.value?.showModal();
}

function close() {
  dialogRef.value?.close();
}

async function save() {
  saving.value = true;
  error.value = null;

  const payload: NewGame = {
    name: form.name,
    genreId: form.genreId,
    price: form.price,
    releaseDate: form.releaseDate,
  };

  try {
    if (editingId.value) {
      await gamesGateway.updateGame(editingId.value, payload);
    } else {
      await gamesGateway.addGame(payload);
    }

    emit("saved");
    close();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    saving.value = false;
  }
}

defineExpose({ open });
</script>

<template>
  <dialog
    ref="dialogRef"
    class="m-auto w-full max-w-md rounded-lg shadow-xl backdrop:bg-slate-900/50"
    @cancel="close"
  >
    <form class="flex flex-col gap-4 p-6" @submit.prevent="save">
      <h2 class="text-lg font-semibold text-slate-900">
        {{ editingId ? "Edit game" : "Add game" }}
      </h2>

      <p
        v-if="error"
        class="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700"
      >
        {{ error }}
      </p>

      <label class="flex flex-col gap-1 text-sm text-slate-700">
        Name
        <input
          v-model="form.name"
          type="text"
          required
          :disabled="loading"
          class="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        />
      </label>

      <label class="flex flex-col gap-1 text-sm text-slate-700">
        Genre
        <select
          v-model.number="form.genreId"
          required
          :disabled="loading"
          class="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1 text-sm text-slate-700">
        Price
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          required
          :disabled="loading"
          class="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        />
      </label>

      <label class="flex flex-col gap-1 text-sm text-slate-700">
        Release date
        <input
          v-model="form.releaseDate"
          type="date"
          required
          :disabled="loading"
          class="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        />
      </label>

      <div class="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          :disabled="saving"
          @click="close"
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" :disabled="loading || saving">
          Save
        </Button>
      </div>
    </form>
  </dialog>
</template>
