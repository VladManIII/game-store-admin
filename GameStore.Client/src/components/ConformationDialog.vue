<script setup lang="ts">
import { ref } from "vue";
import Button from "./Button.vue";

const dialogRef = ref<HTMLDialogElement | null>(null);
const message = ref("");
let resolvePromise: ((confirmed: boolean) => void) | null = null;

function open(text: string): Promise<boolean> {
  message.value = text;
  dialogRef.value?.showModal();

  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function confirm() {
  resolvePromise?.(true);
  resolvePromise = null;
  dialogRef.value?.close();
}

function cancel() {
  resolvePromise?.(false);
  resolvePromise = null;
  dialogRef.value?.close();
}

defineExpose({ open });
</script>

<template>
  <dialog
    ref="dialogRef"
    class="m-auto w-full max-w-sm rounded-lg shadow-xl backdrop:bg-slate-900/50"
    @cancel="cancel"
  >
    <div class="flex flex-col gap-4 p-6">
      <p class="text-sm text-slate-700">{{ message }}</p>

      <div class="flex justify-end gap-2">
        <Button type="button" variant="secondary" @click="cancel">
          Cancel
        </Button>
        <Button type="button" variant="danger" @click="confirm">
          Confirm
        </Button>
      </div>
    </div>
  </dialog>
</template>
