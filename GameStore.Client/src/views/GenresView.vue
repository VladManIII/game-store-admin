<script setup lang="ts">
import { onMounted, ref } from "vue";
import { genreGateway, type Genre } from "../api/GenreGateway.js";
import { useToast } from "../composables/useToast.js";

const { addToast } = useToast();

const genres = ref<Genre[]>([]);
const loading = ref(true);

async function loadGenres() {
  loading.value = true;

  try {
    genres.value = await genreGateway.getGenres();
  } catch (err) {
    addToast(
      `Failed to load genres: ${err instanceof Error ? err.message : String(err)}`,
      "error",
    );
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadGenres();
});
</script>

<template>
  <table class="w-full table-auto border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-slate-200 text-slate-500">
        <th class="px-4 py-3 font-medium">Name</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-slate-100">
      <tr v-if="!loading && genres.length === 0">
        <td colspan="1" class="px-4 py-6 text-center text-slate-500">
          No genres found.
        </td>
      </tr>

      <tr v-for="genre in genres" :key="genre.id" class="hover:bg-slate-200">
        <td class="px-4 py-3 font-medium text-slate-900">{{ genre.name }}</td>
      </tr>
    </tbody>
  </table>
</template>
