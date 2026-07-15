import { reactive } from "vue";

export type ToastVariant = "error" | "success" | "info";

export type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

const toasts = reactive<Toast[]>([]);
let nextId = 0;

function removeToast(id: number) {
  const index = toasts.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
  }
}

function addToast(
  message: string,
  variant: ToastVariant = "info",
  durationMs = 5000,
) {
  const id = nextId++;
  toasts.push({ id, message, variant });
  setTimeout(() => removeToast(id), durationMs);

  return id;
}

export function useToast() {
  return { toasts, addToast, removeToast };
}
