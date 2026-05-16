export const useInfiniteScroll = (callback: () => Promise<void>) => {
  const target = ref<HTMLElement | null>(null);
  const isLoading = ref(false);

  onMounted(() => {
    if (!target.value) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0]?.isIntersecting && !isLoading.value) {
          isLoading.value = true;
          try {
            await callback();
          } finally {
            isLoading.value = false;
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(target.value);

    onUnmounted(() => observer.disconnect());
  });

  return { target, isLoading };
};
