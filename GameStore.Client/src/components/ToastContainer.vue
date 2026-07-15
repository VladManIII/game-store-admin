<script setup lang="ts">
import { useToast } from "../composables/useToast.js";

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-lg ring-1"
      :class="{
        'bg-rose-50 text-rose-700 ring-rose-200': toast.variant === 'error',
        'bg-emerald-50 text-emerald-700 ring-emerald-200':
          toast.variant === 'success',
        'bg-white text-slate-700 ring-slate-200': toast.variant === 'info',
      }"
    >
      <p class="flex-1">{{ toast.message }}</p>

      <button
        type="button"
        class="text-slate-400 hover:text-slate-600"
        @click="removeToast(toast.id)"
      >
        ✕
      </button>
    </div>
  </div>
</template>
