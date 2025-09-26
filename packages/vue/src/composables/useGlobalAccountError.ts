import { ref } from "vue";

const globalShowAccountError = ref(false);

export function useGlobalAccountError() {
  const checkForAccountError = (error: any) => {
    if (
      error?.response?.status === 404 &&
      error?.response?.data?.error?.message === "Account not found"
    ) {
      globalShowAccountError.value = true;
      return true;
    }
    return false;
  };

  const clearError = () => {
    globalShowAccountError.value = false;
  };

  return {
    showAccountError: globalShowAccountError,
    checkForAccountError,
    clearError,
  };
}
