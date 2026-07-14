<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    disabled: false,
  },
);
</script>

<template>
  <button
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-slate-900 text-white hover:bg-slate-700 focus-visible:ring-slate-900':
        variant === 'primary',
      'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900':
        variant === 'secondary',
      'bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600':
        variant === 'danger',
    }"
  >
    <slot />
  </button>
</template>
