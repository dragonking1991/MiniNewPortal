export const useApi = () => {
  return {
    async fetch<T = any>(url: string, options?: any): Promise<T> {
      try {
        return (await $fetch<T>(url, options)) as T;
      } catch (error: any) {
        const apiError = error?.data?.error;
        if (apiError) {
          throw {
            code: apiError.code,
            message: apiError.message,
            details: apiError.details,
            status: error?.status
          };
        }
        throw error;
      }
    }
  };
};
