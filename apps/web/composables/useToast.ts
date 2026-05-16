export const useToast = () => {
  const toasts = ref<Array<{ id: string; message: string; type: "error" | "success" | "info" }>>([]);

  const show = (message: string, type: "error" | "success" | "info" = "info") => {
    const id = Math.random().toString(36);
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3000);
  };

  return {
    toasts,
    show
  };
};
